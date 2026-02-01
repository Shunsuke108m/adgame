export const NICKNAME_MIN = 1;
export const NICKNAME_MAX = 20;
export const BIO_MAX = 140;
export const SNS_URL_MAX = 200;

export function trim(s: string): string {
  return s.trim();
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

export function validateSnsUrl(value: string): string | null {
  const t = trim(value);
  if (t.length > SNS_URL_MAX) return `SNS URLは${SNS_URL_MAX}文字以内で入力してください`;
  return null;
}
