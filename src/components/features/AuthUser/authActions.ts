import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "~/lib/firebase";

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
