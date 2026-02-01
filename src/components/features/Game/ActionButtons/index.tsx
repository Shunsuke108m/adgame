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
    title: "バナー変更",
    text: `・広告バナーを変更すること\n・このゲームではCTRのみを変動させます。\n・CTRが低い時は上がりやすく、既に高い時は上がりにくくなります。\n・アクションによって悪化することもあります`
  },
  LPBtn: {
    title: "LP改修",
    text: `・ランディングページを改修すること\n・このゲームではCVRのみを変動させます。\n・CVRが低い時は上がりやすく、既に高い時は上がりにくくなります。\n・アクションによって悪化することもあります`
  },
  CPNBtn: {
    title: "配信設定変更",
    text: `・配信設定(オーディエンスや構造など)を変更すること\n・このゲームではCPMのみを変動させます。\n・CPMが高い時は下がりやすく、既に低い時は下がりにくくなります。\n・アクションによって悪化することもあります`
  },
  increaseBtn: {
    title: "予算増額",
    text: `・広告費を増額させること\n・CPAが目標CPA以内の場合、COSTを20%増額させられます。\n・このゲームではCTR、CVR、CPM全てがランダムで悪化します。`
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
