import type { GameRow } from "~/types/GameRow";

/**
 * COST, CPM, CTR, CVR から IMP, CV, CPA を導出する。
 * 実態に合わせて「4指標が決まれば他も決まる」形で1箇所にまとめる。
 */
function deriveFromInputs(
  cost: number,
  cpm: number,
  ctr: number,
  cvr: number
): { imp: number; cv: number; cpa: number } {
  const imp = Math.round((cost / cpm) * 1000);
  const cv = Math.round(imp * ctr * cvr * 0.0001);
  const cpa = cv > 0 ? Math.round(cost / cv) : 0;
  return { imp, cv, cpa };
}

/**
 * 週番号と4指標（COST, CPM, CTR, CVR）から GameRow を組み立てる。
 * IMP, CV, CPA は上記の導出ロジックで算出する。
 */
export function buildGameRow(
  weekNum: number,
  cost: number,
  cpm: number,
  ctr: number,
  cvr: number
): GameRow {
  const { imp, cv, cpa } = deriveFromInputs(cost, cpm, ctr, cvr);
  return {
    week: `${weekNum}週目`,
    cost: "¥" + Math.round(cost).toLocaleString(),
    cpm: "¥" + Math.round(cpm).toLocaleString(),
    imp: imp.toLocaleString(),
    ctr: ctr.toFixed(2) + "%",
    cvr: cvr.toFixed(2) + "%",
    cv: cv + "CV",
    cpa: "¥" + cpa.toLocaleString(),
  };
}
