# OGP 実装サマリと Firebase / Cloudflare で実行する手順

プロフィール共有時の OGP 画像表示を実現するための、**実装内容**と**Firebase・Cloudflare で行う具体的な手順**をまとめています。

---

## 1. 実装サマリ（このリポジトリで済んでいること）

### フロントエンド

| 役割 | 場所 | 内容 |
|------|------|------|
| 共有ボタン | `ProfileActionBar` + `useProfilePageShare` | クリックで「現在のプロフィール URL をコピー」→ **POST /ogp/profiles** を fire-and-forget で送信 |
| OGP 画像生成リクエスト | `ogpApi.ts` | `VITE_OPG_IMAGE_API_BASE` が設定されていれば `POST {base}/ogp/profiles` に `{ uid, nickname, photoURL?, bestScore, rankDisplay }` を送る |
| クライアント側 OGP meta | `useProfilePageOgpMeta` | プロフィールページ表示時に `og:title` / `og:image` / `og:url` / `twitter:card` 等を `document.head` に設定（JS 実行するクローラー向けの補助） |
| プロフィール型 | `profileApi.ts` の `ProfileData` | `ogpProfileImageUrl`, `ogpProfileGeneratedAt` を定義し、Firestore から読み取り |

### Cloudflare Pages（このリポジトリ）

| 役割 | 場所 | 内容 |
|------|------|------|
| メタ注入 | `functions/profiles/[uid].ts` | `/profiles/:uid` への GET 時に **GET {OGP_META_API_BASE}/ogp/profiles/:uid/meta** を呼び、返却された `ogTitle` / `ogImageUrl` / `ogUrl` で HTML の `<head>` にメタタグを差し込む |

### まだ外でやること

- **POST /ogp/profiles** … 受け取った payload で OGP 画像（SVG→PNG 等）を生成し、保存・配信する。
- **GET /ogp/profiles/:uid/meta** … クローラー用にメタ情報（`ogTitle`, `ogImageUrl`, `ogUrl`）を JSON で返す。
- **OGP 画像の配信** … `og:image` の URL に GET したときに画像を返す（R2 公開 or Worker で返す）。

---

## 2. Firestore に OGP の URL を持つ必要はあるか？

**結論: なくても実現できます。**  
`og:image` を **固定パターン** にすれば、Firestore に `ogpProfileImageUrl` を保存する必要はありません。

### 固定 URL 方式（Firestore に URL を保存しない）

- **ルール**: そのユーザーの OGP 画像は常に  
  `https://adgame-web.skikatte.com/ogp/{userId}.png`  
  のように **uid だけから決まる URL** にする。
- **流れ**
  1. 共有ボタン押下 → **POST /ogp/profiles** で Worker が画像を生成し、R2 に `ogp/{uid}.png` として保存（または Worker がそのパスで画像を返す）。
  2. クローラーが `/profiles/:uid` にアクセス → Pages Function がメタを注入するとき、**Firestore を読まずに** `ogImageUrl: "https://adgame-web.skikatte.com/ogp/{uid}.png"` を返す（または Pages Function 内でこの URL を組み立てる）。
  3. クローラーがその URL に GET → Worker または R2 が `ogp/{uid}.png` を返す。

この方式なら:

- Firestore に **`ogpProfileImageUrl` を保存しない** でよい。
- **GET /ogp/profiles/:uid/meta** は「Firestore から nickname を読んで ogTitle を組み立てる」だけにして、**ogImageUrl は固定パターン** `https://.../ogp/{uid}.png` で返す。
- OGP の仕組み的にも問題ありません。クローラーは `og:image` の URL に GET するだけなので、URL が Firestore 由来か固定パターンかは関係ありません。

### Firestore に URL を保存する方式（従来案）

- Worker が画像生成後に **R2 の実際の URL**（例: R2 のパブリック URL + オブジェクトキー）を Firestore の `profiles/{uid}.ogpProfileImageUrl` に書き込む。
- **GET /ogp/profiles/:uid/meta** で Firestore から `ogpProfileImageUrl` を読んで `ogImageUrl` に含める。
- メリット: URL を変えたいとき（別ドメイン・CDN など）に柔軟。  
- デメリット: Worker が Firebase Admin で Firestore に書き込む必要があり、コスト・実装が増える。

**コストを抑えたい場合は固定 URL 方式を推奨します。**

---

## 3. Firebase で実行する手順

### 3-1. Firestore ルールの確認

- **Firebase Console** → **Firestore Database** → **ルール**
- `profiles/{uid}` の **read が誰でも可** であることを確認（メタ取得 API やフロントがプロフィールを読むため）。

例（変更不要でよい場合）:

```javascript
match /profiles/{uid} {
  allow read: if true;
  allow write: if request.auth != null && request.auth.uid == uid;
}
```

- **固定 URL 方式** を採用する場合: `ogpProfileImageUrl` / `ogpProfileGeneratedAt` は **Worker が書き込まない** ので、Firestore にこれらのフィールドは存在しなくてよい。既存の read/write ルールのままでよい。
- **Firestore に URL を保存する方式** の場合: これらは **Admin SDK（サーバー側）** で書き込む想定のため、**ルールに OGP 用の allow を追加する必要はありません**。サービスアカウントで書き込む。

### 3-2. インデックス・スキーマ

- Firestore はスキーマなしのため、新規フィールド用のマイグレーションは不要。
- `ogpProfileImageUrl` 等で複合クエリ・ソートをしていないため、**追加のインデックスも不要**。

### 3-3. 固定 URL 方式を採用する場合の Firestore 対応

- **何もしなくてよい**（OGP 画像 URL を Firestore に保存しない）。
- 既に `ProfileData` に `ogpProfileImageUrl` を持っている場合は、フロントで「固定 URL を優先する」実装にすれば、Firestore にそのフィールドがなくても動作します（後述のフロント修正参照）。

---

## 4. Cloudflare で実行する手順

### 4-1. OGP 用 Worker（既に作成済みの想定）

次の 2 つを実装・確認します。

#### A. POST /ogp/profiles（画像生成）

1. リクエスト body: `{ uid, nickname, photoURL?, bestScore, rankDisplay }` を受け取る。
2. この情報で **SVG を組み立て**、必要なら **PNG に変換**（例: Wasm や外部 API 利用）。
3. **R2 に保存**: バケット内のオブジェクトキーを **`ogp/{uid}.png`** にする（固定 URL 方式の場合）。
4. **固定 URL 方式** の場合: Firestore には書き込まない。  
   **Firestore に URL を保存する方式** の場合: Firebase Admin SDK で `profiles/{uid}` に `ogpProfileImageUrl`（R2 の公開 URL）と `ogpProfileGeneratedAt` を書き込む。
5. CORS: フロントのオリジン（例: `https://adgame-web.skikatte.com`）から POST できるように `Access-Control-Allow-Origin` を返す。

#### B. GET /ogp/profiles/:uid/meta（メタ取得）

1. **固定 URL 方式**:  
   - `ogImageUrl` は **Firestore を見ずに**  
     `https://adgame-web.skikatte.com/ogp/{uid}.png`  
     のように **固定パターン** で組み立てる。  
   - `ogTitle` だけ Firestore（または既存 API）から `profiles/{uid}` の `nickname` を読んで組み立てるか、あるいはメタ API を「画像 URL だけ返す」役に絞り、title は Pages Function 側で組み立てることも可。
2. **Firestore に URL を保存する方式**:  
   - Firestore の `profiles/{uid}` から `nickname`, `ogpProfileImageUrl` を読み、`ogTitle` と `ogImageUrl`, `ogUrl` を JSON で返す。
3. レスポンス例:  
   `{ "ogTitle": "表示名 - 広告運用ゲーム", "ogImageUrl": "https://.../ogp/xxx.png", "ogUrl": "https://.../profiles/xxx" }`

#### C. OGP 画像の配信（固定 URL 方式）

- **パターン**: `https://adgame-web.skikatte.com/ogp/{uid}.png` で配信する場合、  
  - 同じ Worker で `GET /ogp/:uid.png` を受け、R2 の `ogp/{uid}.png` を返す、  
  または  
  - R2 を **パブリックアクセス**（またはカスタムドメイン）で `https://adgame-web.skikatte.com/ogp/` にマッピングし、R2 が直接画像を返すようにする。
- R2 にオブジェクトがまだ無い場合（共有ボタンが押されていない）は、**404** または **デフォルト画像**（例: サービスロゴ）を返すとよいです。

### 4-2. R2（OGP 保存用・既に作成済みの想定）

- バケットを作成し、Worker から **オブジェクトキー `ogp/{uid}.png`** で PUT/保存する。
- 固定 URL 方式で **同一ドメインで配信** する場合は、R2 の **パブリックバケット** または **カスタムドメイン**（例: `adgame-web.skikatte.com` の `/ogp/*`）を設定する。  
  別ドメインで配信する場合は、そのドメインで R2 を公開するか、Worker でプロキシして返す。

### 4-3. Cloudflare Pages（このリポジトリのデプロイ先）

1. **Workers & Pages** でこのリポジトリを **Pages** にデプロイする（ビルド: Vite、出力: `dist`）。  
   `functions/` も一緒にデプロイされ、`/profiles/:uid` でメタ注入が動く。
2. **Settings** → **Environment variables** に次を追加する。

   | 変数名 | 値 | 備考 |
   |--------|-----|------|
   | `OGP_META_API_BASE` | メタ取得 API のベース URL | 例: `https://ogp-api.adgame-web.skikatte.com`（末尾 `/` なし）。ここに **GET .../ogp/profiles/:uid/meta** が実装されていること。 |

3. 環境変数追加・変更後は **再デプロイ** しないと反映されないので、**Retry deployment** または Git push で再デプロイする。

---

## 5. 固定 URL 方式を採用するときのフロント修正（任意）

`og:image` を「Firestore の `ogpProfileImageUrl` が無ければ固定パターンを使う」にすると、Firestore に URL を保存しなくてもプレビューが出ます。

- **useProfilePageOgpMeta** で、`profile.ogpProfileImageUrl` が無い場合に  
  `imageUrl = ${origin}/ogp/${uid}.png`  
  のようにする（origin は本番ドメイン。開発時は `import.meta.env.VITE_OPG_IMAGE_API_BASE` や別のベース URL を使ってもよい）。
- これにより、**共有ボタン押下前に** 誰かがプロフィール URL を貼った場合でも、「画像がまだ無ければ 404 またはデフォルト」で扱え、**画像生成済みなら** 同じ固定 URL で表示されます。

必要なら、この方針に合わせて `useProfilePageOgpMeta.ts` の `imageUrl` 算出部分を変更する実装例を追加できます。

---

## 6. チェックリスト（実行すべきことの一覧）

| どこ | やること | やったか |
|------|----------|----------|
| **Firebase** | Firestore の `profiles/{uid}` で read が許可されていることを確認 | ☐ |
| **Cloudflare Worker** | POST /ogp/profiles で payload を受け取り、画像を生成して R2 の `ogp/{uid}.png` に保存 | ☐ |
| **Cloudflare Worker** | GET /ogp/profiles/:uid/meta で `ogTitle`, `ogImageUrl`（固定なら `.../ogp/{uid}.png`）, `ogUrl` を JSON で返す | ☐ |
| **Cloudflare Worker / R2** | GET .../ogp/{uid}.png で画像を返す（Worker で R2 を読むか、R2 を公開） | ☐ |
| **Cloudflare Pages** | 環境変数 `OGP_META_API_BASE` を設定し、再デプロイ | ☐ |
| **フロント** | `.env` 等で `VITE_OPG_IMAGE_API_BASE` を設定（POST 先。既に設定済みなら不要） | ☐ |

---

## 7. 動作確認の目安

1. プロフィールで「このカードを共有」を押す → ネットワークタブで **POST /ogp/profiles** が呼ばれていること。
2. 同じプロフィールの URL を Twitter や Slack の投稿欄に貼る → **プレビューにタイトルと画像が出ること**。
3. 出ない場合: **OGP_META_API_BASE** の値と、**GET .../ogp/profiles/{uid}/meta** が 200 で JSON を返しているかを確認する。

以上で、実装内容と Firebase・Cloudflare で実行すべき具体手順を一通り揃えています。固定 URL 方式にすれば、Firestore に OGP の URL を持たせずに、コストを抑えた構成にできます。
