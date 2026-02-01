import { useQuery } from "@tanstack/react-query";
import {
  getRankingWithProfiles,
  type RankEntry,
} from "../api/scoresApi";

const STALE_TIME_MS = 5 * 60 * 1000; // 5分

/**
 * 上位 N 件のランキングを取得。limit: 20（初期表示） or 100。
 * queryKey: ["topScores", limit]。
 * ランキング表示時に必ず再取得（refetchOnMount: 'always'）して、全員の最新画像・プロフィールを表示する。
 * スコア更新直後は invalidateQueries(["topScores"]) で順位を fresh にする。
 */
export function useTopScores(limitCount: number) {
  return useQuery<RankEntry[]>({
    queryKey: ["topScores", limitCount],
    queryFn: () => getRankingWithProfiles(limitCount),
    staleTime: STALE_TIME_MS,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
  });
}
