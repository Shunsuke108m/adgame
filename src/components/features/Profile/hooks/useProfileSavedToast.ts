import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TOAST_DURATION_MS = 2500;

/**
 * 編集保存後の「保存しました」トースト表示と location.state のクリア。
 */
export function useProfileSavedToast(): { showSavedToast: boolean } {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSavedToast, setShowSavedToast] = useState(
    (location.state as { profileSaved?: boolean } | null)?.profileSaved ?? false
  );

  useEffect(() => {
    if (showSavedToast) {
      const t = setTimeout(() => setShowSavedToast(false), TOAST_DURATION_MS);
      return () => clearTimeout(t);
    }
  }, [showSavedToast]);

  useEffect(() => {
    if ((location.state as { profileSaved?: boolean } | null)?.profileSaved) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  return { showSavedToast };
}
