import { atom } from "jotai";
import type { User } from "firebase/auth";

/** Firebase Auth の現在ユーザー（未ログイン時は null） */
export const authUserAtom = atom<User | null>(null);

/** Firebase Auth の初回判定が完了したかどうか（チラつき防止用） */
export const authReadyAtom = atom<boolean>(false);
