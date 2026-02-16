import { useCallback, useEffect, useState } from "react";
import { requestOgpProfileImage, type OgpPayload } from "../api/ogpApi";

const TOAST_DURATION_MS = 2500;
const OGP_SHARE_FP_KEY_PREFIX = "ogpProfileLastRequested:";

function getOgpFingerprint(payload: OgpPayload): string {
  return `${payload.bestScore}|${payload.rankDisplay}`;
}

function getStorageKey(uid: string): string {
  return `${OGP_SHARE_FP_KEY_PREFIX}${uid}`;
}

function getLastRequestedFingerprint(uid: string): string | null {
  try {
    return window.localStorage.getItem(getStorageKey(uid));
  } catch {
    return null;
  }
}

function setLastRequestedFingerprint(uid: string, fingerprint: string): void {
  try {
    window.localStorage.setItem(getStorageKey(uid), fingerprint);
  } catch {
    // localStorage が使えない環境では重複抑止なしで続行する
  }
}

/**
 * プロフィールページの「このカードを共有」用。
 * URL をクリップボードにコピーし、結果トーストの状態を返す。
 * ogpPayload が渡された場合はコピー後に POST /ogp/profiles を fire-and-forget で呼ぶ。
 */
export function useProfilePageShare(ogpPayload?: OgpPayload): {
  handleShare: () => void;
  copyMessage: "success" | "fail" | null;
} {
  const [copyMessage, setCopyMessage] = useState<"success" | "fail" | null>(
    null
  );

  useEffect(() => {
    if (copyMessage == null) return;
    const t = setTimeout(() => setCopyMessage(null), TOAST_DURATION_MS);
    return () => clearTimeout(t);
  }, [copyMessage]);

  const handleShare = useCallback(() => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopyMessage("success");
        if (!ogpPayload) return;

        const fingerprint = getOgpFingerprint(ogpPayload);
        const lastFingerprint = getLastRequestedFingerprint(ogpPayload.uid);
        if (lastFingerprint === fingerprint) return;

        requestOgpProfileImage(ogpPayload);
        setLastRequestedFingerprint(ogpPayload.uid, fingerprint);
      })
      .catch(() => setCopyMessage("fail"));
  }, [ogpPayload]);

  return { handleShare, copyMessage };
}
