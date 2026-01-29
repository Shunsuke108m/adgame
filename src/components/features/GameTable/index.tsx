import React from "react";
import styled from "styled-components";
import type { GameRow } from "../../../types/GameRow";
import { useSetAtom } from "jotai";
import { modalAtom } from "../../../jotai/DescriptionModal/atom";
import { Colors } from "../../../styles/colors";

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

type Props = {
  rows: GameRow[];
  targetCPA?: number;
};
export const GameTable: React.FC<Props> = ({ rows, targetCPA = 20000 }) => {
  const setModal = useSetAtom(modalAtom);

  const handleThClick = (key: string) => {
    console.log("Clicked column:", key);
    setModal({
      open: true,
      title: COLUMN_DESCRIPTIONS[key].title,
      text: COLUMN_DESCRIPTIONS[key].text
    });
  };

  return (
    <TableContainer>
      <TableHeader>
        <Tittle>管理画面</Tittle>
        <GoalCPA>
          <GoalLabel>目標CPA:</GoalLabel>
          <GoalValue>¥{targetCPA.toLocaleString()}</GoalValue>
        </GoalCPA>
      </TableHeader>
      <div>行名をタップすると説明が表示されます。</div>
      <VerticalTable>
        <Column>
          {columns.map((col) => (
            <ColumnHeader key={col.key} onClick={() => handleThClick(col.key)} style={{ cursor: "pointer" }}>{col.label}</ColumnHeader>
          ))}
        </Column>
        {rows.map((row, i) => (
          <Column key={i}>
            {columns.map((col) => (
              <ColumnCell key={col.key}>{row[col.key as keyof GameRow]}</ColumnCell>
            ))}
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

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const Tittle = styled.h2`
  margin: 0;
  color: ${Colors.TextBlack};
`;

const GoalCPA = styled.div`
  display: flex;
  border: 1px solid ${Colors.Border};
  background: ${Colors.BackgroundWhite};
`;

const GoalLabel = styled.div`
  padding: 4px 8px;
  background: ${Colors.Secondary};
  color: ${Colors.TextBlack};
  font-weight: bold;
  border-right: 1px solid ${Colors.Border};
`;

const GoalValue = styled.div`
  padding: 4px 8px;
  color: ${Colors.TextBlack};
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
  background: ${Colors.Secondary};
  border: 1px solid ${Colors.Border};
  padding: 6px 8px;
  text-align: center;
  font-weight: bold;
  color: ${Colors.TextBlack};
  &:first-child {
    background: ${Colors.Secondary};
  }
`;

const ColumnCell = styled.div`
  border: 1px solid ${Colors.Border};
  padding: 6px 8px;
  text-align: center;
  background: ${Colors.BackgroundWhite};
  color: ${Colors.TextBlack};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
