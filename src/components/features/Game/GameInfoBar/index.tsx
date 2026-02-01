import React from "react";
import styled from "styled-components";
import { TARGET_CPA, TOTAL_TURNS } from "~/lib/gameConfig";
import { Colors } from "~/styles/colors";
import { useGameRows } from "../GameTable/hooks";

export const GameInfoBar: React.FC = () => {
  const rows = useGameRows();

  const currentWeek =
    rows.length > 0
      ? parseInt(rows[0].week.replace(/\D/g, ""), 10) || 0
      : 0;
  const remainingTurns = Math.max(0, TOTAL_TURNS - currentWeek);

  return (
    <Bar>
      <InfoItem>
        <InfoLabel>残りターン</InfoLabel>
        <InfoValue>{remainingTurns}週</InfoValue>
      </InfoItem>
      <InfoItem>
        <InfoLabel>目標CPA</InfoLabel>
        <InfoValue>¥{TARGET_CPA.toLocaleString()}</InfoValue>
      </InfoItem>
    </Bar>
  );
};

const Bar = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin: 4px 0;
  flex-wrap: wrap;
`;

const InfoItem = styled.div`
  display: flex;
  border: 1px solid ${Colors.Border};
  background: ${Colors.BackgroundWhite};
`;

const InfoLabel = styled.div`
  padding: 4px 8px;
  background: ${Colors.Secondary};
  color: ${Colors.TextBlack};
  font-weight: bold;
  border-right: 1px solid ${Colors.Border};
`;

const InfoValue = styled.div`
  padding: 4px 8px;
  color: ${Colors.TextBlack};
`;
