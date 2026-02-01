import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "~/lib/firebase";
import { deleteProfile } from "~/components/features/Profile/api/profileApi";
import { deleteScore } from "~/components/features/Score/api/scoresApi";

/**
 * Google ログイン（ポップアップ）。
 * 状態更新は onAuthStateChanged に任せる。
 */
export async function loginWithGoogle(): Promise<void> {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
}

/**
 * ログアウト。
 * 状態更新は onAuthStateChanged に任せる。
 */
export async function logout(): Promise<void> {
  await signOut(auth);
}

/**
 * 退会。プロフィール・スコアを削除してランキングから外し、ログアウトする。
 * 呼び出し元で本人の uid を渡すこと。Firestore ルールで本人のみ削除可能にすること。
 */
export async function withdraw(uid: string): Promise<void> {
  await deleteProfile(uid);
  await deleteScore(uid);
  await signOut(auth);
}
