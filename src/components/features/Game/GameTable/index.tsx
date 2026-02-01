import React from "react";
import styled from "styled-components";
import type { GameRow } from "~/types/GameRow";
import { useSetAtom } from "jotai";
import { descriptionModalAtom } from "~/jotai/DescriptionModal/atom";
import { InfoIcon } from "~/components/appearances/InfoIcon";
import { Colors } from "~/styles/colors";
import { useGameRows } from "./hooks";
import { getCellTrend, type CellTrend } from "./trend";

const COLUMN_DESCRIPTIONS: Record<string, { title: string; text: string }> = {
  week: {
    title: "◯期間",
    text: "・配信された週をwk1、wk2のように記載しています\n・1ターンの実行で1週間が経過します\n・新しい週(=wk)が上に更新されていきます"
  },
  cost: {
    title: "◯COST",
    text: "・COSTは広告配信費を示します\n・このゲームでは週ごとの広告費を表示します\n・増額提案のアクションが実行されると20%増額されます"
  },
  cpm: {
    title: "◯CPM",
    text: "・CPMは1000インプレッションあたりのコストを示します\n・MetaではオークションによってCPMが決まります\n・CPMはそのユーザーに対する広告主の多さと広告の品質(媒体評価)などによって決まるイメージです\n・このゲームでは「CPN変更」というアクションを実行すると数値が変動します"
  },
  imp: {
    title: "◯IMP",
    text: "・インプレッション(表示回数)を示します\n・COST÷CPMで算出されます。\n・同じユーザーに複数回表示されてもカウントされます。"
  },
  ctr: {
    title: "◯CTR",
    text: "・CTRはクリック率を示します。\n・クリック数÷インプレッション数で算出されます。"
  },
  cvr: {
    title: "◯CVR",
    text: "・CVRはコンバージョン率を示します。\n・広告クリック後にコンバージョンされた割合を指します。\n・CV数÷クリック数で算出されます。"
  },
  cv: {
    title: "◯CV",
    text: "・CVはコンバージョン数を示します\n・資料請求や無料面談申し込みなど、その広告で設定している目的を達成された数を指します"
  },
  cpa: {
    title: "◯CPA",
    text: "・CPAはコンバージョンあたりのコストを示します\n・COST÷CV数で算出されます\n・広告主は1CVから生み出される利益から逆算して目標CPAを決めることが一般的で、目標CPA以内であればたくさん広告費を費やした方が利益を増やせます。よってこのゲームでも目標CPA以内に収まると増額提案できます。\n・実際には成約(offer)に至るまでのCPOや、成約後の顧客生涯利益(LTV)まで見た上で運用することもあります。"
  }
};

const columns = [
  { key: "week", label: "期間" },
  { key: "cost", label: "COST" },
  { key: "cpm", label: "CPM" },
  { key: "imp", label: "IMP" },
  { key: "ctr", label: "CTR" },
  { key: "cvr", label: "CVR" },
  { key: "cv", label: "CV" },
  { key: "cpa", label: "CPA" }
];

export const GameTable: React.FC = () => {
  const rows = useGameRows();
  const setDescriptionModal = useSetAtom(descriptionModalAtom);

  const handleThClick = (key: string) => {
    setDescriptionModal({
      open: true,
      title: COLUMN_DESCRIPTIONS[key].title,
      text: COLUMN_DESCRIPTIONS[key].text,
    });
  };

  return (
    <TableContainer>
      <Tittle>管理画面</Tittle>
      {/* <Description>CPAを目標値以内に改善し、予算を増額していくことでCV数を最大化しましょう</Description> */}
      <VerticalTable>
        <Column>
          {columns.map((col) => (
            <ColumnHeader
              key={col.key}
              onClick={() => handleThClick(col.key)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleThClick(col.key);
                }
              }}
              aria-label={`${col.label}の説明を表示`}
            >
              <InfoIconWrapper onClick={(e) => e.stopPropagation()}>
                <InfoIcon
                  onClick={() => handleThClick(col.key)}
                  size={18}
                  backgroundColor={Colors.BackgroundWhite}
                  textColor={Colors.Primary}
                  aria-label={`${col.label}の説明を表示`}
                />
              </InfoIconWrapper>
              <HeaderLabel>{col.label}</HeaderLabel>
            </ColumnHeader>
          ))}
        </Column>
        {rows.map((row, i) => (
          <Column key={i}>
            {columns.map((col) => {
              const prevRow = rows[i + 1];
              const trend: CellTrend =
                prevRow != null
                  ? getCellTrend(
                      col.key,
                      row[col.key as keyof GameRow],
                      prevRow[col.key as keyof GameRow]
                    )
                  : null;
              return (
                <ColumnCell key={col.key} $trend={trend}>
                  {row[col.key as keyof GameRow]}
                </ColumnCell>
              );
            })}
          </Column>
        ))}
      </VerticalTable>
    </TableContainer>
  );
};

const TableContainer = styled.div`
  margin: 8px 0;
  background: ${Colors.BackgroundGray};
  border-radius: 8px;
  padding: 8px;
  width: 100%;
`;

const Tittle = styled.h2`
  margin: 0px;
  margin-bottom: 4px;
  color: ${Colors.TextBlack};
`;

const Description = styled.div`
  color: ${Colors.TextBlack};
  font-size: 14px;
`;

const VerticalTable = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0;
  overflow-x: auto;
  position: relative;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  &:first-child {
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
    position: sticky;
    left: 0;
    z-index: 1;
    background: ${Colors.BackgroundGray};
  }
`;

const ColumnHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  /* justify-content: center; */
  gap: 4px;
  background: ${Colors.Secondary};
  border: 1px solid ${Colors.Border};
  padding: 6px 8px;
  font-weight: bold;
  color: ${Colors.TextBlack};
  cursor: pointer;
  &:first-child {
    background: ${Colors.Secondary};
  }
  &:hover {
    opacity: 0.9;
  }
`;

const HeaderLabel = styled.span`
  white-space: nowrap;
`;

const InfoIconWrapper = styled.span`
  display: flex;
  flex-shrink: 0;
`;

const ColumnCell = styled.div<{ $trend?: CellTrend }>`
  border: 1px solid ${Colors.Border};
  padding: 6px 8px;
  text-align: center;
  background: ${(p) =>
    p.$trend === "improve"
      ? Colors.Improve
      : p.$trend === "worsen"
        ? Colors.Worsen
        : Colors.BackgroundWhite};
  color: ${Colors.TextBlack};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
