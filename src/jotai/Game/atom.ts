import { atom } from "jotai";
import type { GameRow } from "../../types/GameRow";
import { buildGameRow } from "~/lib/gameRow";

/** 1週目の4指標（実態の持ち方）。これらから IMP, CV, CPA は導出される */
const INITIAL_COST = 5_000_000;
const INITIAL_CPM = 6_000;
const INITIAL_CTR = 0.32;
const INITIAL_CVR = 1.25;

export const INITIAL_ROW: GameRow = buildGameRow(
  1,
  INITIAL_COST,
  INITIAL_CPM,
  INITIAL_CTR,
  INITIAL_CVR
);

/** プレイ中の状態: ターン履歴(rows), 選択中アクション(active), ベストスコア */
export type GamePlayState = {
  rows: GameRow[];
  activeActions: string[];
  bestScore: number;
};

const parseCv = (cvStr: string) => parseInt(cvStr.replace(/\D/g, ""), 10) || 0;

export const INITIAL_BEST_SCORE = parseCv(INITIAL_ROW.cv);

export const gamePlayStateAtom = atom<GamePlayState>({
  rows: [INITIAL_ROW],
  activeActions: [],
  bestScore: INITIAL_BEST_SCORE,
});

export const INITIAL_GAME_PLAY_STATE: GamePlayState = {
  rows: [INITIAL_ROW],
  activeActions: [],
  bestScore: INITIAL_BEST_SCORE,
};
