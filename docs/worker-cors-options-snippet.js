// ============================================================
// Worker の CORS まわり改善スニペット（OPTIONS 用）
// 既存の corsHeaders の代わりに preflightHeaders を使うか、
// OPTIONS 時だけ Cache-Control を足す場合の例。
// ============================================================

// 既存の ALLOWED_ORIGINS はそのまま使用

/**
 * プリフライト（OPTIONS）専用ヘッダ。
 * Headers オブジェクトで明示的に組み立て、Cache-Control でキャッシュ事故を防ぐ。
 * @param {Request} req
 */
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
  if (allowOrigin) {
    h.set("Access-Control-Allow-Origin", allowOrigin);
  }
  return h;
}

// ----------------------------------------
// fetch 内の OPTIONS 処理を以下に差し替え
// ----------------------------------------

// 変更前:
//   if (req.method === "OPTIONS") {
//     return new Response(null, { status: 204, headers: corsHeaders(req) });
//   }

// 変更後:
//   if (req.method === "OPTIONS") {
//     return new Response(null, { status: 204, headers: preflightHeaders(req) });
//   }
