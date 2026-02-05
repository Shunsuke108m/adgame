# プロフィールURL共有時のOGP（カードプレビュー）について

## やりたいこと

`/profiles/:uid` のURLをSNSやLINEで共有したとき、**その名刺カードがプレビュー画像・タイトルとして表示される**ようにしたい。

## なぜそのままでは出ないか

- Facebook・Twitter・LINEなどのクローラーは、共有URLにアクセスして **HTMLの `<meta>` タグだけを読む** ことが多いです。
- このアプリは **SPA（クライアント側で描画）** なので、最初に返るHTMLはほぼ空の `index.html` です。
- クローラーは **JavaScriptを実行しない**（または限定的）ため、`profiles/xxx` 用の `og:title` や `og:image` が動的に出てきません。
- そのため「URLごとに違うOGP」を出すには、**サーバー（またはEdge）側で、そのURL用のメタタグを埋めたHTMLを返す**必要があります。

---

## 本リポジトリでの実装状況

### フロント（このリポジトリ）

| 役割 | 実装 |
|------|------|
| 共有ボタン | 「このカードを共有」押下で **現在のプロフィールURLをコピー** → **POST /ogp/profiles** を fire-and-forget で呼ぶ（`ogpApi.ts`, `useProfilePageShare.ts`） |
| クライアント側 OGP meta | プロフィールページ表示時に `useProfilePageOgpMeta` で `og:title` / `og:image` / `og:url` / `twitter:card` 等を `document.head` に設定。JS を実行するクローラー向けの補助。 |
| プロフィール型 | `ProfileData` に `ogpProfileImageUrl`, `ogpProfileGeneratedAt` を追加。Firestore から読み取り。 |

### Cloudflare Pages（このリポジトリ）

- **`functions/profiles/[uid].ts`**  
  `/profiles/:uid` への **GET** 時に、OGP メタを差し込んだ HTML を返す。
- **環境変数**  
  Pages の設定で **`OGP_META_API_BASE`** を設定する（後述の「OGP メタ取得 API」のベース URL）。
- 未設定の場合はメタ注入を行わず、通常の `index.html` をそのまま返す。

### バックエンド（別リポジトリ／別サービス）に必要なもの

1. **POST /ogp/profiles**（既存想定）  
   - リクエスト body: `{ uid, nickname, photoURL?, bestScore, rankDisplay }`  
   - やること: プロフィール用 OGP 画像を生成し、保存用 URL を取得。**Firestore の `profiles/{uid}` に `ogpProfileImageUrl` と `ogpProfileGeneratedAt` を書き込む。**

2. **GET /ogp/profiles/:uid/meta**（**要実装**）  
   - Pages Function がメタ注入時にここを呼ぶ。
   - レスポンス: **JSON** で次のいずれかを含める。
     - `ogTitle` … 例: `"表示名 - 広告運用ゲーム"`
     - `ogImageUrl` … 生成済み OGP 画像の絶対 URL（未生成の場合は省略または空）
     - `ogUrl` … 例: `"https://example.com/profiles/abc123"`
   - 実装例: Firestore の `profiles/{uid}` を読み、`nickname` と `ogpProfileImageUrl` から上記を組み立てて返す。

3. **OGP 画像の配信**  
   - `ogImageUrl` に含める URL に GET でアクセスしたときに、その uid 用の OGP 画像（PNG 等）を返すエンドポイント。

---

## フローまとめ

1. ユーザーがプロフィールで「このカードを共有」を押す。
2. 現在のプロフィール URL がクリップボードにコピーされ、**POST /ogp/profiles** が fire-and-forget で呼ばれる。
3. バックエンドが OGP 画像を生成し、`profiles/{uid}` に `ogpProfileImageUrl`・`ogpProfileGeneratedAt` を保存。
4. 誰かがその URL を SNS に貼る → クローラーが **GET /profiles/:uid** にアクセス。
5. **Cloudflare Pages Function** が **GET /ogp/profiles/:uid/meta** を呼び、取得したメタで HTML の `<head>` を書き換えて返す。
6. クローラーが `og:image` 等を読んでカードプレビューを表示。

---

## デプロイ・設定

**Cloudflare と Firebase で行う具体的な手順**は **[ogp-setup-cloudflare-firebase.md](./ogp-setup-cloudflare-firebase.md)** にまとめています。

### 環境変数（フロント / Vite）

- **`VITE_OPG_IMAGE_API_BASE`**  
  OGP 画像生成 API のベース URL（例: `https://ogp-api.example.com`）。  
  未設定なら「このカードを共有」時に POST は送らない。

### 環境変数（Cloudflare Pages）

- **`OGP_META_API_BASE`**  
  メタ取得 API のベース URL（例: `https://ogp-api.example.com`）。  
  `GET {OGP_META_API_BASE}/ogp/profiles/{uid}/meta` が呼ばれる。  
  未設定ならメタ注入は行わず、通常の HTML を返す。

### Firestore

- `profiles/{uid}` に **`ogpProfileImageUrl`**（string）と **`ogpProfileGeneratedAt`**（Timestamp）を保存する。  
  これらは **OGP 生成 API（バックエンド）が書き込む**想定。クライアントのルールで read は既に許可されていればよい（`allow read: if true` 等）。

---

## 参考: メタの例

```html
<meta property="og:title" content="表示名 - 広告運用ゲーム" />
<meta property="og:url" content="https://example.com/profiles/abc123" />
<meta property="og:image" content="https://cdn.example.com/ogp/profiles/abc123.png" />
<meta property="og:type" content="profile" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="表示名 - 広告運用ゲーム" />
<meta name="twitter:image" content="https://cdn.example.com/ogp/profiles/abc123.png" />
```

- `og:image` に、名刺カード画像を返す URL を指定すると、プレビューが名刺そのものになる。
