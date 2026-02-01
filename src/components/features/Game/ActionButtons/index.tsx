import React from "react";
import styled from "styled-components";
import { useSetAtom } from "jotai";
import { descriptionModalAtom } from "~/jotai/DescriptionModal/atom";
import { TARGET_CPA, TOTAL_TURNS } from "~/lib/gameConfig";
import { InfoIcon } from "~/components/appearances/InfoIcon";
import { useGamePlayAgain } from "~/components/features/ResultModal/hooks";
import { useGameActive, useGameExecute, useGameToggle } from "./hooks";
import { useGameRows } from "../GameTable/hooks";
import { Colors } from "~/styles/colors";

const parseNum = (str: string) => parseFloat(str.replace(/[^\d.]/g, "")) || 0;

const actions = [
  { id: "CRBtn", label: "バナー変更" },
  { id: "LPBtn", label: "LP改修" },
  { id: "CPNBtn", label: "配信設定変更" },
  { id: "increaseBtn", label: "予算増額" }
];

const ACTION_DESCRIPTIONS: Record<string, { title: string; text: string }> = {
  CRBtn: {
    title: "CR変更",
    text: `◯言葉の意味\n・広告バナーを変更すること\n　※CR=クリエイティブ\n\n◯このゲームでの効果\n・CTRを変動させます。\n・CTRが低い時は上がりやすく、既に高い時は上がりにくくなります。\n・アクションによって悪化することもあります\n・実行すると考案費とデザイン費として、キャッシュを5万円消費します。\n\n◯現実での効果\n・実際にはLPに流入するユーザーの質を変えられるのでCVRも変動させ、媒体の広告評価も左右するのでCPMも変動させられます。`
  },
  LPBtn: {
    title: "LP変更",
    text: `◯言葉の意味\n・ランディングページを変更すること\n　※LP=ランディングページ\n\n◯このゲームでの効果\n・CVRを変動させます\n・CVRが低い時は上がりやすく、既に高い時は上がりにくくなります。\n・アクションによって悪化することもあります\n・実行すると考案費とデザイン費とコーディング費として、キャッシュを50万円消費します。`
  },
  CPNBtn: {
    title: "CPN変更",
    text: `◯言葉の意味\n・キャンペーン変更の略称で、ターゲティングや配信構造を変更することを指します。\n\n◯このゲームでの効果\n・このゲームではCPMを変動させます。キャッシュは消費されません。\n・CPMが高い時は下がりやすく、既に低い時は下がりにくくなります。\n\n◯現実での効果\n・実際には配信されるユーザーが変わるため、CTRもCVRもCPMも変動します。`
  },
  increaseBtn: {
    title: "予算増額",
    text: `◯言葉の意味\n・広告費を増額させることを示します\n\n◯このゲームでの効果\n・CPAが2万円以下の場合、COSTを20%増額させられます。CPAが1CVあたりの利益以内の場合、上司からGOが出るイメージです\n・広告費を増やしすぎると学習が崩れるため、増額できるのは20%ずつです\n・実際には20%以内の変動だと大きな悪化はないとされていますが、このゲームではゲーム性を高めるためにCTR、CVR、CPM全てがランダムで悪化します。`
  }
};

export const ActionButtons: React.FC = () => {
  const setDescriptionModal = useSetAtom(descriptionModalAtom);
  const rows = useGameRows();
  const active = useGameActive();
  const onToggle = useGameToggle();
  const onExecute = useGameExecute();
  const onRetry = useGamePlayAgain();

  const currentWeek =
    rows.length > 0
      ? parseInt(rows[0].week.replace(/\D/g, ""), 10) || 0
      : 0;
  const remainingTurns = Math.max(0, TOTAL_TURNS - currentWeek);
  const isGameOver = remainingTurns === 0;

  const currentCpa =
    rows.length > 0 ? parseNum(rows[0].cpa) : Infinity;
  const canIncreaseBudget = currentCpa <= TARGET_CPA;

  const handleInfoClick = (id: string) => {
    setDescriptionModal({
      open: true,
      title: ACTION_DESCRIPTIONS[id].title,
      text: ACTION_DESCRIPTIONS[id].text,
    });
  };

  return (
    <ActionBtnList>
      <ul>
        {actions.map((action) => {
          const isIncrease = action.id === "increaseBtn";
          const disabled = isIncrease && !canIncreaseBudget;
          return (
            <ActionCheckItem key={action.id} $disabled={disabled}>
              <input
                type="checkbox"
                id={action.id}
                checked={active.includes(action.id)}
                disabled={disabled}
                onChange={() => !disabled && onToggle(action.id)}
              />
              <label htmlFor={action.id}>{action.label}</label>
              <InfoIconWrapper>
                <InfoIcon
                  onClick={() => handleInfoClick(action.id)}
                  size={28}
                  aria-label={`${action.label}の説明を表示`}
                  tabIndex={0}
                />
              </InfoIconWrapper>
            </ActionCheckItem>
          );
        })}
      </ul>
      {isGameOver ? (
        <ExecBtn type="button" onClick={onRetry}>
          リトライ
        </ExecBtn>
      ) : (
        <ExecBtn type="button" className="executionBtn" onClick={onExecute}>
          実行する
        </ExecBtn>
      )}
    </ActionBtnList>
  );
};



export const ActionBtnList = styled.div`
  margin: 4px 0;
  width: auto;
  ul {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding: 0;
    margin: 0 0 8px 0;
  }
`;

export const ActionCheckItem = styled.li<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 4px;
  background: ${(p) => (p.$disabled ? Colors.BackgroundGray : "#fff2")};
  border: 1px solid ${(p) => (p.$disabled ? Colors.Border : Colors.Primary)};
  border-radius: 8px;
  color: ${Colors.TextBlack};
  position: relative;
  opacity: ${(p) => (p.$disabled ? 0.85 : 1)};
  label {
    cursor: ${(p) => (p.$disabled ? "not-allowed" : "pointer")};
    color: ${Colors.TextBlack};
    font-size: 16px;
    flex: 1;
  }
  input[type="checkbox"]:disabled {
    cursor: not-allowed;
  }
  input[type="checkbox"] {
    accent-color: ${Colors.Primary};
    width: 20px;
    height: 20px;
    margin: 0;
  }
`;

const InfoIconWrapper = styled.span`
  margin-left: auto;
`;

export const ExecBtn = styled.button`
  margin: 0 auto;
  background: ${Colors.Primary};
  color: ${Colors.TextWhite};
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
  width: 100%;
`;
