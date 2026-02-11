/**
 * プロフィール画像アップロード用 API（Cloudflare Worker + R2）。
 * 変換済み Blob で POST → uploadUrl 取得 → PUT → Firestore 更新まで呼び出し側で行う。
 *
 * トークン: .env の VITE_UPLOAD_TOKEN をリクエストヘッダ "x-upload-token" で送る。
 * Worker 側の UPLOAD_TOKEN と一致させること。
 */

const IMAGE_API_BASE = import.meta.env.VITE_IMAGE_API_BASE as string | undefined;
const UPLOAD_TOKEN = import.meta.env.VITE_UPLOAD_TOKEN as string | undefined;

export type UploadUrlResponse = {
  uploadUrl: string;
  publicUrl: string;
  key: string;
};

function getUploadToken(): string {
  const token = UPLOAD_TOKEN?.trim();
  if (!token) {
    throw new Error("画像アップロードの設定がありません（VITE_UPLOAD_TOKEN）");
  }
  return token;
}

/**
 * POST /profile-images/upload-url を呼び、uploadUrl と publicUrl を取得する。
 * key は profiles/${uid}/avatar.png で固定（毎回上書き）。PNG で OGP・Slack 等の互換性を確保。
 */
export async function getProfileImageUploadUrl(
  uid: string,
  contentType: string
): Promise<UploadUrlResponse> {
  const base = IMAGE_API_BASE?.trim();
  if (!base) {
    throw new Error("画像アップロードの設定がありません（VITE_IMAGE_API_BASE）");
  }
  const token = getUploadToken();
  const res = await fetch(`${base}/profile-images/upload-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-upload-token": token,
    },
    body: JSON.stringify({
      key: `profiles/${uid}/avatar.png`,
      contentType,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("[getProfileImageUploadUrl]", res.status, text);
    throw new Error(text || `アップロードURLの取得に失敗しました（${res.status}）`);
  }
  return res.json() as Promise<UploadUrlResponse>;
}

/**
 * PUT uploadUrl に対して、変換済み画像 Blob をアップロードする。
 * x-upload-token を付与する。
 */
export async function putProfileImage(
  uploadUrl: string,
  blob: Blob,
  contentType: string
): Promise<void> {
  const token = getUploadToken();
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
      "x-upload-token": token,
    },
    body: blob,
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("[putProfileImage]", res.status, text);
    throw new Error(text || `画像のアップロードに失敗しました（${res.status}）`);
  }
}
