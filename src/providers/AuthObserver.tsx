import React, { useEffect } from "react";
import { useSetAtom } from "jotai";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "~/lib/firebase";
import { authUserAtom, authReadyAtom } from "~/jotai/Auth/atoms";
import { gameResultModalAuthUserAtom } from "~/jotai/GameResult/atom";

/**
 * アプリ全体で onAuthStateChanged を1回だけ購読し、
 * 認証状態を jotai に反映する。初回判定完了まで authReadyAtom は false。
 */
export const AuthObserver: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const setAuthUser = useSetAtom(authUserAtom);
  const setAuthReady = useSetAtom(authReadyAtom);
  const setGameResultModalAuthUser = useSetAtom(
    gameResultModalAuthUserAtom
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setGameResultModalAuthUser(
        user
          ? {
              uid: user.uid,
              displayName: user.displayName ?? undefined,
            }
          : null
      );
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, [setAuthUser, setAuthReady, setGameResultModalAuthUser]);

  return <>{children}</>;
};
