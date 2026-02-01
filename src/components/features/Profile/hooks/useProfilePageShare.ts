import { useCallback, useEffect, useState } from "react";

const TOAST_DURATION_MS = 2500;

/**
 * プロフィールページの「このカードを共有」用。
 * URL をクリップボードにコピーし、結果トーストの状態を返す。
 */
export function useProfilePageShare(): {
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
      .then(() => setCopyMessage("success"))
      .catch(() => setCopyMessage("fail"));
  }, []);

  return { handleShare, copyMessage };
}
