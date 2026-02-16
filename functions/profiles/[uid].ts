/**
 * Cloudflare Pages Function: /profiles/:uid への GET 時に OGP メタを差し込んだ HTML を返す。
 * クローラー（SNS 等）が JS を実行しないため、サーバー側でメタを注入する必要がある。
 *
 * 環境変数:
 *   OGP_META_API_BASE - OGP メタ取得 API のベース URL（例: https://ogp-api.example.com）
 *   ※ GET {OGP_META_API_BASE}/ogp/profiles/{uid}/meta が
 *      JSON で { ogTitle, ogDescription, ogImageUrl, ogUrl } を返すこと
 *   未設定の場合はフォールバックメタを差し込む。
 */

const FALLBACK_TITLE = "プロフィール - 広告運用ゲーム";
const FALLBACK_DESCRIPTION = "広告運用ゲームのプロフィールページです。";
const FALLBACK_APP_ORIGIN = "https://adgame-web.skikatte.com";
const FALLBACK_OGP_IMAGE_URL = `${FALLBACK_APP_ORIGIN}/ogp/adgame_ogp_main.png`;

type OgpMetaKey = "ogTitle" | "ogDescription" | "ogImageUrl" | "ogUrl";
type OgpMetaJson = Partial<Record<OgpMetaKey, string>>;

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
  const imageUrl = meta.ogImageUrl ?? FALLBACK_OGP_IMAGE_URL;
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

function pickNonEmpty(primary: string | undefined, fallback: string): string {
  if (typeof primary !== "string") return fallback;
  const value = primary.trim();
  return value.length > 0 ? value : fallback;
}

export async function onRequestGet(context: {
  env: PagesFunctionEnv;
  params: Record<string, string | undefined>;
  next: () => Promise<Response>;
}): Promise<Response> {
  const { env, params, next } = context;
  const uid = params?.uid as string | undefined;
  const safeUid = encodeURIComponent(uid ?? "");
  const fallbackMeta: OgpMetaJson = {
    ogTitle: FALLBACK_TITLE,
    ogDescription: FALLBACK_DESCRIPTION,
    ogImageUrl: FALLBACK_OGP_IMAGE_URL,
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
          ogTitle: pickNonEmpty(json.ogTitle, fallbackMeta.ogTitle!),
          ogDescription: pickNonEmpty(
            json.ogDescription,
            fallbackMeta.ogDescription!
          ),
          ogImageUrl: pickNonEmpty(json.ogImageUrl, fallbackMeta.ogImageUrl!),
          ogUrl: pickNonEmpty(json.ogUrl, fallbackMeta.ogUrl!),
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
