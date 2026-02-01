# プロフィール画像アップロード時の CORS エラー対処

## エラー内容

```
Access to fetch at 'https://api.adgame-web.skikatte.com/profile-images/upload-url'
from origin 'http://localhost:5174' has been blocked by CORS policy:
Response to preflight request doesn't pass access control check:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

= **プリフライト（OPTIONS）のレスポンスに `Access-Control-Allow-Origin` が含まれていない**状態です。

## 想定される原因

1. **OPTIONS が Worker に届いていない**  
   Cloudflare のルートや設定で、OPTIONS が別処理（キャッシュ・WAF・デフォルト応答）されており、Worker の CORS ヘッダが付与されていない。
2. **Worker は動いているが CORS ヘッダが付与されていない**  
   `Origin` が期待値と一致していない、またはヘッダの組み立て不備（まれ）。

## 確認・対処チェックリスト

### 1. Cloudflare で OPTIONS が Worker に届くか確認

- **Workers & Pages** → 対象 Worker → **Settings** → **Triggers**（ルート）
- ルート例: `api.adgame-web.skikatte.com/profile-images/*` または `*api.adgame-web.skikatte.com*`
- **メソッド制限で OPTIONS が除外されていないか**確認する（多くの場合「すべてのメソッド」で問題なし）。
- **Configuration Rules** や **Page Rules** で「Cache」や「Redirect」が OPTIONS に適用されていないか確認する。

### 2. WAF / ファイアウォール

- **Security** → **WAF** や **API Shield** で、OPTIONS がブロックされていないか確認する。
- 必要なら OPTIONS を許可するルールを追加する。

### 3. Worker 側の改善（プリフライト応答を明確にする）

- OPTIONS のレスポンスで **`Headers` オブジェクトを明示的に組み立てる**。
- プリフライトのキャッシュで古いレスポンスが返らないよう、**`Cache-Control: no-store`** を付ける（下記サンプル参照）。

### 4. デバッグ（任意）

Worker の先頭で `Origin` とメソッドをログ出力し、OPTIONS が届いているか確認する。

```js
// fetch 内の先頭で
const origin = req.headers.get("Origin");
console.log(req.method, origin);
```

Cloudflare の **Workers** → **Logs**（リアルタイムログ）で、OPTIONS 時に上記が出力されるか見る。

## Worker の OPTIONS まわり改善例

以下は「OPTIONS が Worker に届く」前提で、プリフライトのレスポンスをはっきりさせる例です。

- 204 のボディは `null` のまま。
- `corsHeaders(req)` で返すオブジェクトをそのまま `new Response(..., { headers })` に渡している場合、**キーが小文字で統一されているか**確認する（`Access-Control-Allow-Origin` などはこのままで問題ありません）。
- プリフライト用に **`Cache-Control: no-store`** を追加する。

```js
// OPTIONS 用のヘッダを明示（プリフライトのキャッシュを防ぐ）
function preflightHeaders(req) {
  const origin = req.headers.get("Origin") || "";
  const allowOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "";
  const h = new Headers({
    "Access-Control-Allow-Methods": "POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, x-upload-token",
    "Access-Control-Max-Age": "86400",
    "Cache-Control": "no-store",
    Vary: "Origin",
  });
  if (allowOrigin) h.set("Access-Control-Allow-Origin", allowOrigin);
  return h;
}

// fetch 内の OPTIONS 処理
if (req.method === "OPTIONS") {
  return new Response(null, { status: 204, headers: preflightHeaders(req) });
}
```

既存の `corsHeaders(req)` をそのまま使い、OPTIONS 時だけ `Cache-Control: no-store` を足すのでも構いません。

## まとめ

- **まず Cloudflare のルート・WAF を確認し、「OPTIONS が Worker に届いているか」をログで確認する。**
- 届いていない場合は、ルートや WAF の設定を変えて OPTIONS を Worker に届ける。
- 届いているのに CORS エラーが残る場合は、上記のように OPTIONS 用ヘッダを明示し、`Cache-Control: no-store` でプリフライトのキャッシュを避ける。
