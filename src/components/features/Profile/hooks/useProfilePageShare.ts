import { useCallback, useEffect, useState } from "react";
import { requestOgpProfileImage, type OgpPayload } from "../api/ogpApi";

const TOAST_DURATION_MS = 2500;

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
        if (ogpPayload) requestOgpProfileImage(ogpPayload);
      })
      .catch(() => setCopyMessage("fail"));
  }, [ogpPayload]);

  return { handleShare, copyMessage };
}
