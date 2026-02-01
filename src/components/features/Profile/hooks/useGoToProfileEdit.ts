import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

/**
 * プロフィール編集ページへ遷移する処理を返す。
 * 入力誘導ボタンなど、複数箇所で同じ遷移を使う場合に利用する。
 */
export function useGoToProfileEdit(uid: string | undefined): {
  goToEdit: () => void;
} {
  const navigate = useNavigate();
  const goToEdit = useCallback(() => {
    if (uid) navigate(`/profiles/${uid}/edit`);
  }, [uid, navigate]);
  return { goToEdit };
}
