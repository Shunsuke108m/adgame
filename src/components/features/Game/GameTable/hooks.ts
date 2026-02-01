import { useAtom } from "jotai";
import { gamePlayStateAtom } from "../../../../jotai/Game/atom";
import type { GameRow } from "../../../../types/GameRow";

export function useGameRows(): GameRow[] {
  const [state] = useAtom(gamePlayStateAtom);
  return state.rows;
}