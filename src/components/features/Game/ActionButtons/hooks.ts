import { useQueryClient } from "@tanstack/react-query";
import { useAtom, useSetAtom } from "jotai";
import { useCallback } from "react";
import { gamePlayStateAtom, type GamePlayState } from "~/jotai/Game/atom";
import { type GameResult, gameResultModalOpenAtom, gameResultAtom } from "~/jotai/GameResult/atom";
import { TARGET_CPA } from "~/lib/gameConfig";
import { buildGameRow } from "~/lib/gameRow";
import { getMyBestScore, submitScore } from "~/components/features/Score/api/scoresApi";

const parseNum = (str: string) => parseFloat(str.replace(/[^\d.]/g, "")) || 0;
const parseCv = (cvStr: string) => parseInt(cvStr.replace(/\D/g, ""), 10) || 0;
const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

/**
 * 1ターン分のゲームロジック（純粋関数）。
 * 現在の状態と選択中アクションから次の状態を返す。
 */
function computeNextState(prev: GamePlayState): GamePlayState {
  const row = prev.rows[0];
  const active = prev.activeActions;

  const weekNum =
    parseInt(row.week.replace(/\D/g, ""), 10) + 1;
  let cost = parseNum(row.cost);
  let cpm = parseNum(row.cpm);
  let ctr = parseNum(row.ctr);
  let cvr = parseNum(row.cvr);

  // 何も施策を打たない週は、媒体学習による微増のみ発生させる（施策の約1/3以下の上げ幅）。
  if (active.length === 0) {
    cpm *= randomInRange(1.01, 1.04);
    ctr *= randomInRange(1.01, 1.15);
    cvr *= randomInRange(1.01, 1.15);
  }

  if (active.includes("CPNBtn")) {
    cpm =
      cpm >= 6000
        ? cpm * (Math.random() * 0.3 + 0.5)
        : cpm >= 3000
          ? cpm * (Math.random() * 0.75 + 0.5)
          : cpm >= 2000
            ? cpm * (Math.random() * 0.75 + 0.75)
            : cpm * (Math.random() * 1.0 + 1.0);
  }
  if (active.includes("CRBtn")) {
    ctr =
      ctr >= 1.2
        ? ctr * (Math.random() * 0.75 + 0.5)
        : ctr >= 0.6
          ? ctr * (Math.random() * 0.75 + 0.75)
          : ctr * (Math.random() * 1.0 + 1.0);
  }
  if (active.includes("LPBtn")) {
    cvr =
      cvr >= 3
        ? cvr * (Math.random() * 0.75 + 0.5)
        : cvr >= 1.5
          ? cvr * (Math.random() * 0.75 + 0.75)
          : cvr * (Math.random() * 1.0 + 1.0);
  }
  const currentCpa = parseNum(row.cpa);
  if (active.includes("increaseBtn") && currentCpa <= TARGET_CPA) {
    cost = cost * 1.2;
    ctr = ctr * (Math.random() * 0.25 + 0.75);
    cvr = cvr * (Math.random() * 0.25 + 0.75);
    cpm = cpm * (Math.random() * 0.25 + 1.0);
  }

  const newRow = buildGameRow(weekNum, cost, cpm, ctr, cvr);
  const cv = Math.round(
    (cost / cpm) * 1000 * ctr * cvr * 0.0001
  );
  const newBest = Math.max(prev.bestScore, cv);

  return {
    rows: [newRow, ...prev.rows],
    activeActions: [],
    bestScore: newBest,
  };
}

export function useGameActive(): string[] {
    const [state] = useAtom(gamePlayStateAtom);
    return state.activeActions;
  }

export function useGameToggle(): (id: string) => void {
    const setState = useSetAtom(gamePlayStateAtom);
    return useCallback(
        (id: string) => {
        setState((prev) => ({
            ...prev,
            activeActions: prev.activeActions.includes(id)
            ? prev.activeActions.filter((a) => a !== id)
            : [...prev.activeActions, id],
        }));
        },
        [setState]
    );
}

export function useOpenGameResultModal(): (result: GameResult) => void {
    const setOpen = useSetAtom(gameResultModalOpenAtom);
    const setResult = useSetAtom(gameResultAtom);
    return useCallback(
      (result: GameResult) => {
        setResult(result);
        setOpen(true);
      },
      [setOpen, setResult]
    );
  }
  

export function useGameExecute(): () => void {
    const setState = useSetAtom(gamePlayStateAtom);
    const openGameResultModal = useOpenGameResultModal();
    const queryClient = useQueryClient();

    return useCallback(() => {
      setState((prev) => {
        const next = computeNextState(prev);
        if (next.rows[0].week === "24週目") {
          const cv = parseCv(next.rows[0].cv);
          queueMicrotask(async () => {
            let bestToShow = next.bestScore;
            try {
              const storedBest = await getMyBestScore();
              if (storedBest != null) {
                bestToShow = Math.max(storedBest, cv);
              }
            } catch {
              // 取得失敗時はセッション内ベストのまま
            }
            openGameResultModal({ score: cv, bestScore: bestToShow });
            void submitScore(cv).then(() => {
              queryClient.invalidateQueries({ queryKey: ["topScores"] });
            });
          });
        }
        return next;
      });
    }, [setState, openGameResultModal, queryClient]);
  }
