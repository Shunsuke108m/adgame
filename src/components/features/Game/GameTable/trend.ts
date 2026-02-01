const parseNum = (str: string) => parseFloat(str.replace(/[^\d.]/g, "")) || 0;
const parseCv = (cvStr: string) => parseInt(cvStr.replace(/\D/g, ""), 10) || 0;

/** 数値が上がると良いカラム */
const HIGHER_IS_BETTER = new Set(["cost", "imp", "ctr", "cvr", "cv"]);
/** 数値が下がると良いカラム */
const LOWER_IS_BETTER = new Set(["cpm", "cpa"]);

function parseValue(key: string, value: string): number {
  if (key === "cv") return parseCv(value);
  return parseNum(value);
}

export type CellTrend = "improve" | "worsen" | null;

/**
 * 先週比で改善/悪化を判定する。
 * week カラムは比較しない（null）。
 */
export function getCellTrend(
  key: string,
  current: string,
  previous: string
): CellTrend {
  if (key === "week") return null;
  const curr = parseValue(key, current);
  const prev = parseValue(key, previous);
  if (curr === prev) return null;
  if (HIGHER_IS_BETTER.has(key)) return curr > prev ? "improve" : "worsen";
  if (LOWER_IS_BETTER.has(key)) return curr < prev ? "improve" : "worsen";
  return null;
}
