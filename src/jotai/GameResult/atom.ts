import { atom } from "jotai";

/** ゲーム結果モーダルの開閉状態 */
export const gameResultModalOpenAtom = atom<boolean>(false);

/** ゲーム結果モーダルに表示するスコア・順位 */
export type GameResult = {
  score: number;
  bestScore?: number;
  rank?: number;
};

export const gameResultAtom = atom<GameResult>({
  score: 0,
  bestScore: 0,
});

/**
 * ゲーム結果モーダル内で表示するログイン状態。
 * Auth 連携時は別ロジックでこの atom を更新する想定。
 */
export type GameResultModalAuthUser = { uid: string; displayName?: string } | null;

export const gameResultModalAuthUserAtom = atom<GameResultModalAuthUser>(null);
