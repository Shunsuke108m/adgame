import React from "react";
import styled from "styled-components";
import { useSetAtom } from "jotai";
import { modalAtom } from "../../../jotai/DescriptionModal/atom";
import { Colors } from "../../../styles/colors";

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

export type ActionButtonsProps = {
  active: string[];
  onToggle: (id: string) => void;
  onExecute: () => void;
};

export const ActionButtons: React.FC<ActionButtonsProps> = ({ active, onToggle, onExecute }) => {
  const setModal = useSetAtom(modalAtom);

  const handleInfoClick = (id: string) => {
    setModal({
      open: true,
      title: ACTION_DESCRIPTIONS[id].title,
      text: ACTION_DESCRIPTIONS[id].text
    });
  };

  return (
    <ActionBtnList>
      <ul>
        {actions.map((action) => (
          <ActionCheckItem key={action.id}>
            <input
              type="checkbox"
              id={action.id}
              checked={active.includes(action.id)}
              onChange={() => onToggle(action.id)}
            />
            <label htmlFor={action.id}>{action.label}</label>
            <InfoIcon onClick={() => handleInfoClick(action.id)} tabIndex={0} aria-label="説明を表示">
              i
            </InfoIcon>
          </ActionCheckItem>
        ))}
      </ul>
      <ExecBtn className="executionBtn" onClick={onExecute}>実行する</ExecBtn>
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

export const ActionCheckItem = styled.li`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 4px;
  background: #fff2;
  border: 1px solid ${Colors.Primary};
  border-radius: 8px;
  color: ${Colors.TextBlack};
  position: relative;
  label {
    cursor: pointer;
    color: ${Colors.TextBlack};
    font-size: 16px;
    flex: 1;
  }
  input[type="checkbox"] {
    accent-color: ${Colors.Primary};
    width: 20px;
    height: 20px;
    margin: 0;
  }
`;

export const InfoIcon = styled.button`
  margin-left: auto;
  background: ${Colors.Primary};
  color: ${Colors.BackgroundWhite};
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 1.1rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
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
