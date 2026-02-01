# 「画像アップロードの設定がありません（VITE_IMAGE_API_BASE）」が出る場合

## 原因

**Firebase ではなく、Vite の環境変数がデプロイ先で読まれていない**ことが原因です。

- プロフィール画像アップロードは **Cloudflare Worker + R2** 用の API（`VITE_IMAGE_API_BASE`）を使います。
- `VITE_IMAGE_API_BASE` と `VITE_UPLOAD_TOKEN` は **`.env.local`** に書く想定です。
- **`.env.local` は `.gitignore` に入っているため、リポジトリに含まれずデプロイ先には存在しません。**
- Vite では `VITE_*` は **ビルド時** に `import.meta.env` に埋め込まれるため、**デプロイ先のビルド時にこれらの変数が未設定だと `undefined` になり**、画像保存時に「画像アップロードの設定がありません（VITE_IMAGE_API_BASE）」になります。

## 対処（デプロイ先で環境変数を設定する）

**デプロイしている環境**（Cloudflare Pages / Vercel / Netlify など）の **プロジェクト設定で環境変数を追加**し、**ビルドし直す**必要があります。

### 必要な変数

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `VITE_IMAGE_API_BASE` | 画像アップロード API のベース URL | `https://api.adgame-web.skikatte.com` |
| `VITE_UPLOAD_TOKEN` | Worker 側の `UPLOAD_TOKEN` と一致させるトークン | （.env.local と同じ値） |

### 設定例（Cloudflare Pages）

1. **Cloudflare Dashboard** → **Workers & Pages** → 対象の Pages プロジェクト
2. **Settings** → **Environment variables**
3. **Production**（および必要なら Preview）に次を追加:
   - `VITE_IMAGE_API_BASE` = `https://api.adgame-web.skikatte.com`
   - `VITE_UPLOAD_TOKEN` = （ローカルの .env.local と同じトークン値）
4. **Save** 後、**Deployments** から **Retry deployment** または新規デプロイでビルドし直す。

### 設定例（Vercel / Netlify など）

- プロジェクトの **Environment Variables**（または **Build environment variables**）に上記 2 つを追加し、**Redeploy** する。

## ローカルでは出ない理由

- ローカルでは **`.env.local`** が読み込まれるため、`VITE_IMAGE_API_BASE` と `VITE_UPLOAD_TOKEN` が設定されていれば画像保存は動きます。
- デプロイ先では `.env.local` が存在しないため、**必ずデプロイ先の環境変数で同じ値を設定**する必要があります。

## まとめ

- **Firebase の設定は関係ありません。** 画像アップロードは別 API（Worker）用の環境変数です。
- **デプロイ先のビルド環境に `VITE_IMAGE_API_BASE` と `VITE_UPLOAD_TOKEN` を設定し、ビルドし直す**と解消します。
