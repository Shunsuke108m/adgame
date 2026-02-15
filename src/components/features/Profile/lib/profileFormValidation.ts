export const NICKNAME_MIN = 1;
export const NICKNAME_MAX = 20;
export const BIO_MAX = 140;
export const SNS_URL_MAX = 200;

/** SNS URLで許可するドメイン（X, Facebook, Instagram, LinkedIn）。javascript: 等の悪意あるURLを防ぐ */
const ALLOWED_SNS_BASE_HOSTS = new Set([
  "x.com",
  "twitter.com",
  "facebook.com",
  "fb.com",
  "fb.me",
  "instagram.com",
  "linkedin.com",
]);

export function trim(s: string): string {
  return s.trim();
}

function isAllowedSnsHost(host: string): boolean {
  const normalized = host.toLowerCase().replace(/^www\./, "");
  if (ALLOWED_SNS_BASE_HOSTS.has(normalized)) return true;
  if (normalized === "m.facebook.com") return true;
  return false;
}

export function validateNickname(value: string): string | null {
  const t = trim(value);
  if (t.length < NICKNAME_MIN) return "表示名は1文字以上入力してください";
  if (t.length > NICKNAME_MAX) return `表示名は${NICKNAME_MAX}文字以内で入力してください`;
  return null;
}

export function validateBio(value: string): string | null {
  const t = trim(value);
  if (t.length > BIO_MAX) return `自己紹介は${BIO_MAX}文字以内で入力してください`;
  return null;
}

export const SNS_ALLOWED_LABEL = "X, Facebook, Instagram, LinkedIn";

export function validateSnsUrl(value: string): string | null {
  const t = trim(value);
  if (t.length === 0) return null;
  if (t.length > SNS_URL_MAX) return `SNS URLは${SNS_URL_MAX}文字以内で入力してください`;
  try {
    const url = new URL(t);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return `SNS URLは${SNS_ALLOWED_LABEL}のいずれかのURLを入力してください`;
    }
    if (!isAllowedSnsHost(url.hostname)) {
      return `SNS URLは${SNS_ALLOWED_LABEL}のいずれかのURLを入力してください`;
    }
  } catch {
    return "有効なURLを入力してください";
  }
  return null;
}
