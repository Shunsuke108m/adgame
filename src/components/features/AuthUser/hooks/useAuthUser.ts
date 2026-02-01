import { useAtomValue } from "jotai";
import { authReadyAtom, authUserAtom } from "~/jotai/Auth/atoms";
import type { User } from "firebase/auth";

/**
 * 認証状態を参照する薄い hook。
 * authReady が false の間は認証判定中。
 */
export function useAuthUser(): {
  user: User | null;
  authReady: boolean;
  isMine: (uid: string | undefined) => boolean;
} {
  const user = useAtomValue(authUserAtom);
  const authReady = useAtomValue(authReadyAtom);
  const isMine = (uid: string | undefined) =>
    !!uid && user != null && user.uid === uid;
  return { user, authReady, isMine };
}
