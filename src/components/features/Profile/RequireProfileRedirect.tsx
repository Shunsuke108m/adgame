import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthUser } from "~/components/features/AuthUser/hooks/useAuthUser";
import { useProfile } from "~/components/features/Profile/hooks/useProfile";

/**
 * ログイン済みかつプロフィール未作成の場合、誘導画面（/profiles/:uid）へリダイレクトする。
 * レイアウトで1箇所だけ使う想定。既にプロフィールページ or 編集ページにいる場合は何もしない。
 */
export const RequireProfileRedirect: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, authReady } = useAuthUser();
  const { data: profile, isLoading: profileLoading } = useProfile(user?.uid);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authReady || !user || profileLoading) return;
    if (profile != null) return;

    const profilePath = `/profiles/${user.uid}`;
    const editPath = `/profiles/${user.uid}/edit`;
    const path = location.pathname;
    if (path === profilePath || path === editPath) return;

    navigate(profilePath, { replace: true });
  }, [authReady, user, profile, profileLoading, location.pathname, navigate]);

  return <>{children}</>;
};
