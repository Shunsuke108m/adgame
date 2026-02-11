/**
 * Cloudflare Pages Function: /profiles/:uid への GET 時に OGP メタを差し込んだ HTML を返す。
 * クローラー（SNS 等）が JS を実行しないため、サーバー側でメタを注入する必要がある。
 *
 * 環境変数:
 *   OGP_META_API_BASE - OGP メタ取得 API のベース URL（例: https://ogp-api.example.com）
 *   ※ GET {OGP_META_API_BASE}/ogp/profiles/{uid}/meta が
 *      JSON で { ogTitle, ogDescription, ogImageUrl, ogUrl } を返すこと
 *   未設定の場合はメタ注入を行わず、通常の index.html を返す。
 */

const FALLBACK_TITLE = "プロフィール - 広告運用ゲーム";
const FALLBACK_DESCRIPTION = "広告運用ゲームのプロフィールページです。";
const FALLBACK_APP_ORIGIN = "https://adgame-web.skikatte.com";
const FALLBACK_OGP_ORIGIN = "https://ogp-api.adgame-web.skikatte.com";

const META_KEYS = ["ogTitle", "ogDescription", "ogImageUrl", "ogUrl"] as const;
type OgpMetaJson = Partial<Record<(typeof META_KEYS)[number], string>>;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildMetaTags(meta: OgpMetaJson): string {
  const title = meta.ogTitle ?? FALLBACK_TITLE;
  const description = meta.ogDescription ?? FALLBACK_DESCRIPTION;
  const imageUrl = meta.ogImageUrl ?? "";
  const url = meta.ogUrl ?? FALLBACK_APP_ORIGIN;
  return [
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:image" content="${escapeHtml(imageUrl)}" />`,
    `<meta property="og:type" content="profile" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(imageUrl)}" />`,
  ].join("\n    ");
}

type PagesFunctionEnv = {
  OGP_META_API_BASE?: string;
};

export async function onRequestGet(context: {
  env: PagesFunctionEnv;
  params: Record<string, string | undefined>;
  request: Request;
  next: () => Promise<Response>;
}): Promise<Response> {
  const { env, params, request, next } = context;
  const uid = params?.uid as string | undefined;
  const safeUid = encodeURIComponent(uid ?? "");
  const fallbackMeta: OgpMetaJson = {
    ogTitle: FALLBACK_TITLE,
    ogDescription: FALLBACK_DESCRIPTION,
    ogImageUrl: `${FALLBACK_OGP_ORIGIN}/ogp/${safeUid}.png`,
    ogUrl: `${FALLBACK_APP_ORIGIN}/profiles/${safeUid}`,
  };

  const base = (env.OGP_META_API_BASE as string | undefined)?.trim();
  let meta: OgpMetaJson = { ...fallbackMeta };
  if (base && uid) {
    const metaUrl = base.endsWith("/")
      ? `${base.replace(/\/$/, "")}/ogp/profiles/${safeUid}/meta`
      : `${base}/ogp/profiles/${safeUid}/meta`;
    try {
      const res = await fetch(metaUrl, { method: "GET" });
      if (res.ok) {
        const json = (await res.json()) as OgpMetaJson;
        meta = {
          ogTitle: json.ogTitle ?? fallbackMeta.ogTitle,
          ogDescription: json.ogDescription ?? fallbackMeta.ogDescription,
          ogImageUrl: json.ogImageUrl ?? fallbackMeta.ogImageUrl,
          ogUrl: json.ogUrl ?? fallbackMeta.ogUrl,
        };
      }
    } catch {
      // メタ取得失敗時はそのまま差し込まずにフォールスルー
    }
  }

  const assetRes = await next();
  const contentType = assetRes.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) {
    return assetRes;
  }

  const html = await assetRes.text();
  if (!uid) {
    return new Response(html, {
      status: assetRes.status,
      headers: new Headers(assetRes.headers),
    });
  }
  const metaTags = buildMetaTags(meta);
  const injected = html.replace(
    "</head>",
    `\n    ${metaTags}\n  </head>`
  );

  const headers = new Headers(assetRes.headers);
  headers.set("Content-Type", "text/html; charset=utf-8");

  return new Response(injected, {
    status: assetRes.status,
    headers,
  });
}
