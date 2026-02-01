import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import { db, auth } from "~/lib/firebase";
import { getProfile } from "~/components/features/Profile/api/profileApi";
import { updateBestScore } from "~/components/features/Profile/api/profileApi";

export type ScoreDoc = {
  uid?: string;
  bestScore: number;
  updatedAt?: ReturnType<typeof serverTimestamp>;
};

export type RankEntry = {
  uid: string;
  bestScore: number;
  rank: number;
  nickname?: string;
  photoURL?: string | null;
  /** 自己紹介（表示用。省略は画面幅に応じて CSS で行う）。無い場合は undefined */
  bioPreview?: string;
};

const BIO_MAX_DISPLAY = 140;

/**
 * 自己紹介がある場合、trim して最大 BIO_MAX_DISPLAY 文字まで返す。
 * 省略の長さは UI 側で画面幅に応じて CSS ellipsis で決める（文字数で切らない）。
 */
export function toBioPreview(bio: string | undefined | null): string | undefined {
  const t = bio?.trim();
  if (!t) return undefined;
  return t.length <= BIO_MAX_DISPLAY ? t : t.slice(0, BIO_MAX_DISPLAY);
}

/**
 * ログインユーザーのスコアを保存（ベストのみ更新）。
 * 未ログインなら何もしない。scores/{uid} と profiles/{uid}.bestScore を更新。
 */
export async function submitScore(score: number): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const uid = currentUser.uid;
  const scoreRef = doc(db, "scores", uid);
  const snap = await getDoc(scoreRef);
  const current = snap.data() as ScoreDoc | undefined;
  const best = current?.bestScore ?? -1;

  if (score <= best) return;

  await setDoc(
    scoreRef,
    { bestScore: score, updatedAt: serverTimestamp() },
    { merge: true }
  );
  await updateBestScore(uid, score);
}

/**
 * scores を bestScore 降順で上限件取得（生データ）。
 * limit: 20（初期表示） or 100。
 */
export async function getRankingRaw(
  limitCount: number
): Promise<{ uid: string; bestScore: number }[]> {
  const col = collection(db, "scores");
  const q = query(
    col,
    orderBy("bestScore", "desc"),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    uid: d.id,
    bestScore: (d.data() as ScoreDoc).bestScore,
  }));
}

/**
 * ランキング取得 + profiles を結合して1箇所で返す。
 * rank は配列 index + 1。
 */
export async function getRankingWithProfiles(
  limitCount: number
): Promise<RankEntry[]> {
  const raw = await getRankingRaw(limitCount);
  const entries: RankEntry[] = [];

  for (let i = 0; i < raw.length; i++) {
    const { uid, bestScore } = raw[i];
    const profile = await getProfile(uid);
    entries.push({
      uid,
      bestScore,
      rank: i + 1,
      nickname: profile?.nickname,
      photoURL: profile?.photoURL ?? null,
      bioPreview: toBioPreview(profile?.bio),
    });
  }

  return entries;
}
