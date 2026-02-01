import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { db } from "~/lib/firebase";

export type ProfileData = {
  nickname?: string;
  bio?: string;
  snsUrl?: string;
  photoURL?: string | null;
  bestScore?: number | null;
  rank?: number | null;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export type ProfileWriteData = {
  nickname: string;
  bio?: string;
  snsUrl?: string;
};

/**
 * profiles/{uid} を1件取得。存在しなければ null。
 */
export async function getProfile(uid: string): Promise<ProfileData | null> {
  const ref = doc(db, "profiles", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    nickname: data.nickname,
    bio: data.bio,
    snsUrl: data.snsUrl,
    photoURL: data.photoURL ?? null,
    bestScore: data.bestScore ?? null,
    rank: data.rank ?? null,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

/**
 * profiles/{uid} を作成または更新。
 * 既存 doc が無い場合は createdAt を付与し、常に updatedAt を付与する。
 */
export async function upsertProfile(
  uid: string,
  payload: ProfileWriteData
): Promise<void> {
  const ref = doc(db, "profiles", uid);
  const existing = await getDoc(ref);
  const now = serverTimestamp();
  const data = existing.exists()
    ? {
        nickname: payload.nickname,
        ...(payload.bio !== undefined && { bio: payload.bio }),
        ...(payload.snsUrl !== undefined && { snsUrl: payload.snsUrl }),
        updatedAt: now,
      }
    : {
        nickname: payload.nickname,
        ...(payload.bio !== undefined && { bio: payload.bio }),
        ...(payload.snsUrl !== undefined && { snsUrl: payload.snsUrl }),
        createdAt: now,
        updatedAt: now,
      };
  await setDoc(ref, data, { merge: true });
}

/**
 * profiles/{uid} の photoURL のみ更新（画像アップロード完了時に使用）。
 */
export async function updatePhotoURL(
  uid: string,
  photoURL: string
): Promise<void> {
  const ref = doc(db, "profiles", uid);
  await setDoc(
    ref,
    { photoURL, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

/**
 * profiles/{uid} の photoURL を削除（プロフィール編集で画像を外すとき）。
 */
export async function clearPhotoURL(uid: string): Promise<void> {
  const ref = doc(db, "profiles", uid);
  await setDoc(
    ref,
    { photoURL: null, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

/**
 * profiles/{uid} の bestScore のみ更新（スコア保存時に scores と同期する用）。
 */
export async function updateBestScore(
  uid: string,
  bestScore: number
): Promise<void> {
  const ref = doc(db, "profiles", uid);
  await setDoc(
    ref,
    { bestScore, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

/**
 * profiles/{uid} を削除（退会時）。本人のみ削除可能とする想定。
 */
export async function deleteProfile(uid: string): Promise<void> {
  const ref = doc(db, "profiles", uid);
  await deleteDoc(ref);
}
