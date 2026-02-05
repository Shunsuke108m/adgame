/**
 * Cloudflare Pages Function: /profiles/:uid への GET 時に OGP メタを差し込んだ HTML を返す。
 * クローラー（SNS 等）が JS を実行しないため、サーバー側でメタを注入する必要がある。
 *
 * 環境変数:
 *   OGP_META_API_BASE - OGP メタ取得 API のベース URL（例: https://ogp-api.example.com）
 *   ※ GET {OGP_META_API_BASE}/ogp/profiles/{uid}/meta が JSON で { ogTitle, ogImageUrl, ogUrl } を返すこと
 *   未設定の場合はメタ注入を行わず、通常の index.html を返す。
 */

const META_KEYS = ["ogTitle", "ogImageUrl", "ogUrl"] as const;
type OgpMetaJson = Partial<Record<(typeof META_KEYS)[number], string>>;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildMetaTags(meta: OgpMetaJson, pageUrl: string): string {
  const title = meta.ogTitle ?? "プロフィール - 広告運用ゲーム";
  const imageUrl = meta.ogImageUrl ?? "";
  const url = meta.ogUrl ?? pageUrl;
  if (!imageUrl) {
    return [
      `<meta property="og:title" content="${escapeHtml(title)}" />`,
      `<meta property="og:url" content="${escapeHtml(url)}" />`,
      `<meta property="og:type" content="profile" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    ].join("\n    ");
  }
  return [
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:image" content="${escapeHtml(imageUrl)}" />`,
    `<meta property="og:type" content="profile" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(imageUrl)}" />`,
  ].join("\n    ");
}

type PagesFunctionEnv = {
  ASSETS: { fetch(request: Request): Promise<Response> };
  OGP_META_API_BASE?: string;
};

export async function onRequestGet(context: {
  env: PagesFunctionEnv;
  params: Record<string, string | undefined>;
  request: Request;
}): Promise<Response> {
  const { env, params, request } = context;
  const uid = params?.uid as string | undefined;
  if (!uid) {
    return env.ASSETS.fetch(request);
  }

  const base = (env.OGP_META_API_BASE as string | undefined)?.trim();
  let meta: OgpMetaJson = {};
  if (base) {
    const metaUrl = base.endsWith("/")
      ? `${base.replace(/\/$/, "")}/ogp/profiles/${encodeURIComponent(uid)}/meta`
      : `${base}/ogp/profiles/${encodeURIComponent(uid)}/meta`;
    try {
      const res = await fetch(metaUrl, { method: "GET" });
      if (res.ok) {
        const json = (await res.json()) as OgpMetaJson;
        meta = json;
      }
    } catch {
      // メタ取得失敗時はそのまま差し込まずにフォールスルー
    }
  }

  const assetRes = await env.ASSETS.fetch(request);
  const contentType = assetRes.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) {
    return assetRes;
  }

  const html = await assetRes.text();
  const pageUrl = new URL(request.url).href;
  const metaTags = buildMetaTags(meta, pageUrl);
  const injected = html.replace(
    "</head>",
    `\n    ${metaTags}\n  </head>`
  );

  return new Response(injected, {
    status: assetRes.status,
    headers: new Headers(assetRes.headers),
  });
}
