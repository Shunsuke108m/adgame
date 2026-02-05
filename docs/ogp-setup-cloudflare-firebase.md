# OGP 用：Cloudflare と Firebase でやること

プロフィール OGP を動かすために、**Cloudflare** と **Firebase（Firestore）** で行う設定を手順でまとめています。

---

## 1. Cloudflare でやること

### 1-1. このアプリを Cloudflare Pages にデプロイする

- まだ Pages にデプロイしていない場合、**Cloudflare Dashboard** → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** でこのリポジトリを接続する。
- ビルド設定例：
  - **Framework preset**: Vite
  - **Build command**: `npm run build`
  - **Build output directory**: `dist`
- デプロイすると、**`functions/` ディレクトリも一緒にデプロイ**され、`/profiles/:uid` への GET で OGP メタが差し込まれる。

### 1-2. 環境変数を 1 つ追加する

1. **Cloudflare Dashboard** → **Workers & Pages** → 対象の **Pages プロジェクト** を開く。
2. **Settings** → **Environment variables** を開く。
3. **Add variable** で次を追加する。

| 変数名 | 値 | 備考 |
|--------|-----|------|
| `OGP_META_API_BASE` | OGP メタ取得 API のベース URL | 例: `https://your-ogp-api.example.com`（末尾の `/` は不要でよい） |

- **重要**: この URL に **`GET {OGP_META_API_BASE}/ogp/profiles/{uid}/meta`** でアクセスすると、JSON（`ogTitle`, `ogImageUrl`, `ogUrl`）が返るように、別サービス（Worker 等）で実装する必要があります。
- 値を入れない・間違った URL のままにすると、メタ注入は行われず、通常の HTML が返ります（プレビューは出ません）。

### 1-3. 環境変数を反映させる

- 環境変数を追加・変更したあと、**再デプロイ**（Deployments → 最新のデプロイの **Retry deployment** や、Git に push しての新規デプロイ）を行う。
- 既存デプロイには自動では反映されません。

---

## 2. Firebase（Firestore）でやること

### 2-1. ルールの確認（読み取り）

- **Firebase Console** → **Firestore Database** → **ルール** を開く。
- **`profiles/{uid}` の read が誰でもできる**ことを確認する。

例（すでにこうなっていれば変更不要）:

```javascript
match /profiles/{uid} {
  allow read: if true;
  allow write: if request.auth != null && request.auth.uid == uid;
}
```

- `allow read: if true` のままにしておけば、フロントと「GET /ogp/profiles/:uid/meta」を実装したバックエンドの両方が、`ogpProfileImageUrl` などを読めます。

### 2-2. ルールの変更は不要（OGP 用の書き込みについて）

- **`ogpProfileImageUrl`** と **`ogpProfileGeneratedAt`** は、**OGP 画像生成 API（バックエンド）** が **Firebase Admin SDK** で `profiles/{uid}` に書き込む想定です。
- Admin SDK は **セキュリティルールを通過しない** ため、**Firestore のルールに OGP 用の特別な allow を足す必要はありません**。
- バックエンド側で、サービスアカウント（または Admin 用の認証）で Firestore に書き込む実装にしておけば十分です。

### 2-3. インデックス・スキーマ

- Firestore はスキーマなしなので、**新規フィールド用のマイグレーションは不要**です。
- `ogpProfileImageUrl` や `ogpProfileGeneratedAt` で **複合クエリやソートをしていない** ため、**追加のインデックスも不要**です。

---

## 3. まとめチェックリスト

| どこ | やること | やったか |
|------|----------|----------|
| **Cloudflare** | このリポジトリを Pages にデプロイ（`functions/` 含む） | ☐ |
| **Cloudflare** | 環境変数 `OGP_META_API_BASE` を追加し、再デプロイ | ☐ |
| **Firebase** | `profiles/{uid}` の read が許可されていることを確認 | ☐ |
| **バックエンド** | GET /ogp/profiles/:uid/meta を実装（Firestore から nickname, ogpProfileImageUrl を読んで JSON 返却） | ☐ |
| **バックエンド** | POST /ogp/profiles で画像生成後、Firestore に ogpProfileImageUrl・ogpProfileGeneratedAt を書き込む（Admin SDK 推奨） | ☐ |

---

## 4. 動作確認の目安

1. **「このカードを共有」** → URL コピー → **POST /ogp/profiles** がバックエンドに飛んでいること（ネットワークタブで確認）。
2. 共有した **プロフィール URL** を、Twitter の投稿欄や Slack などに貼り、**プレビューにタイトルと画像が出る**こと。
3. 出ない場合は、**OGP_META_API_BASE** の URL が正しいか、**GET …/ogp/profiles/{uid}/meta** が 200 で JSON を返しているかを確認する。
