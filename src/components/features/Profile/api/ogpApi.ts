/**
 * プロフィール用 OGP 画像生成 API（Cloudflare Worker 側で画像生成）。
 * POST /ogp/profiles を fire-and-forget で呼ぶ。VITE_OPG_IMAGE_API_BASE が未設定の場合は何もしない。
 */

const VITE_OPG_IMAGE_API_BASE = import.meta.env.VITE_OPG_IMAGE_API_BASE as string | undefined;

export type OgpPayload = {
  uid: string;
  nickname: string;
  photoURL?: string;
  bestScore: number;
  rankDisplay: string;
};

/**
 * POST /ogp/profiles を呼び、OGP 画像生成を依頼する。
 * 完了を待たずに呼び出し元は即座に戻る（fire-and-forget）。
 * VITE_OPG_IMAGE_API_BASE が未設定の場合は何もしない。
 */
export function requestOgpProfileImage(payload: OgpPayload): void {
  const base = VITE_OPG_IMAGE_API_BASE?.trim();
  if (!base) return;

  const url = base.endsWith("/") ? `${base.replace(/\/$/, "")}/ogp/profiles` : `${base}/ogp/profiles`;
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    // 成功/失敗の UI 表示は不要（UX 優先）
  });
}
