# プロフィールURL共有時のOGP（カードプレビュー）について

## やりたいこと

`/profiles/:uid` のURLをSNSやLINEで共有したとき、**その名刺カードがプレビュー画像・タイトルとして表示される**ようにしたい。

## なぜそのままでは出ないか

- Facebook・Twitter・LINEなどのクローラーは、共有URLにアクセスして **HTMLの `<meta>` タグだけを読む** ことが多いです。
- このアプリは **SPA（クライアント側で描画）** なので、最初に返るHTMLはほぼ空の `index.html` です。
- クローラーは **JavaScriptを実行しない**（または限定的）ため、`profiles/xxx` 用の `og:title` や `og:image` が動的に出てきません。
- そのため「URLごとに違うOGP」を出すには、**サーバー（またはEdge）側で、そのURL用のメタタグを埋めたHTMLを返す**必要があります。

## 実現方法（2パターン）

### 1) サーバー／EdgeでHTMLにメタを差し込む（推奨）

**流れ:**

1. ユーザーが `https://example.com/profiles/abc123` を共有する。
2. クローラーがそのURLにアクセスする。
3. **サーバーまたはEdge（Cloudflare Worker / Vercel Edge など）** が `/profiles/:uid` のリクエストを受け取る。
4. そのパスに合わせて **プロフィール情報を取得**（Firestore や既存APIから）。
5. **`index.html` の `<head>` に、そのプロフィール用の `og:title` / `og:description` / `og:image` を差し込んだHTML** を返す。
6. クローラーはそのメタタグを読んで、カードプレビューを表示する。
7. 通常のユーザーが開いた場合は、同じHTMLを読んだあとSPAが起動して通常の画面になる。

**必要なもの:**

- デプロイ先が **Cloudflare Pages** の場合: **Pages Functions** または **Worker** で、`/profiles/*` を捕捉し、プロフィール取得 → HTML書き換え（またはテンプレート出力）を実装。
- **Vercel** の場合: **Middleware** や **Edge Function** で同様に、パスに応じてメタを差し込んだHTMLを返す。

**メタの例:**

```html
<meta property="og:title" content="表示名 - 広告運用ゲーム" />
<meta property="og:description" content="自己紹介の先頭数十文字..." />
<meta property="og:image" content="https://example.com/api/og/profiles/abc123" />
<meta property="og:url" content="https://example.com/profiles/abc123" />
<meta name="twitter:card" content="summary_large_image" />
```

- `og:image` は **2) の画像URL** を指定すると、名刺そのものがプレビューになります。

---

### 2) 名刺カードを画像として返す（og:image 用）

**流れ:**

1. 上記のメタで `og:image` に **「名刺を描いた画像のURL」** を指定する。
2. そのURL（例: `https://example.com/api/og/profiles/abc123`）にアクセスすると、**サーバー／Edge がプロフィールを取得し、名刺レイアウトで画像を生成して返す**。
3. SNSはその画像をプレビューに使う。

**必要なもの:**

- **画像生成**  
  - [Vercel OG](https://vercel.com/docs/functions/edge-functions/og-image-generation)（`@vercel/og`）  
  - または [Satori](https://github.com/vercel/satori) + 画像レンダリング  
  - などで「表示名・アイコン・自己紹介・スコア・順位」を並べた **横長の名刺画像** を生成するAPI/Edgeを1本用意する。
- **ルーティング**  
  - 例: `GET /api/og/profiles/:uid` → プロフィール取得 → 名刺画像生成 → `Content-Type: image/png` で返す。
- **キャッシュ**  
  - 同じURLは同じ画像でよいので、CDNやWorkerでキャッシュすると負荷とコストを抑えられる。

---

## まとめ

| 目的 | やること |
|------|----------|
| 「このURLを共有したときにカードが出る」 | **1) サーバー／Edge で `/profiles/:uid` 用の `og:*` メタを埋めたHTMLを返す** |
| 「プレビュー画像が名刺そのもの」 | **2) 名刺を描いた画像を返すエンドポイントを用意し、そのURLを `og:image` に指定する** |

どちらも **「そのURLにアクセスしたときに、サーバー／Edgeがプロフィールに応じた内容を返す」** 必要があります。SPAだけではクローラーにメタが渡らないため、**Cloudflare Pages Functions / Worker や Vercel Edge など、軽いサーバー側処理の導入**が前提になります。

デプロイ先（Cloudflare / Vercel など）が決まっていれば、その環境用の具体的なコード例（Worker の例や Edge Function の例）も追記できます。
