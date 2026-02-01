import React from "react";
import styled from "styled-components";
import { Card, CardAccent } from "./sharedStyles";
import { useGoToProfileEdit } from "~/components/features/Profile/hooks/useGoToProfileEdit";
import { Colors } from "~/styles/colors";

export type ProfileIncompleteCardProps = {
  uid: string | undefined;
};

/**
 * 自分のプロフィールが未作成のときの誘導カード。
 * 入力誘導ボタンはカードの中央（左右・上下）に配置し、onClick は useGoToProfileEdit で共通化。
 */
export const ProfileIncompleteCard: React.FC<ProfileIncompleteCardProps> = ({
  uid,
}) => {
  const { goToEdit } = useGoToProfileEdit(uid);

  return (
    <Card>
      <CardAccent />
      <IncompleteCenter>
        <IncompleteTitle>プロフィールを完成させよう</IncompleteTitle>
        <IncompleteText>
          表示名は必須で入力してください。
          <br />
          設定するとランキングに参加できます。
        </IncompleteText>
        <IncompleteButton type="button" onClick={goToEdit}>
          表示名を入力
        </IncompleteButton>
      </IncompleteCenter>
    </Card>
  );
};

const IncompleteCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 24px 20px;
  text-align: center;
`;

const IncompleteTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${Colors.TextBlack};
  margin: 0 0 8px 0;
  line-height: 1.3;
`;

const IncompleteText = styled.p`
  font-size: 0.9375rem;
  color: ${Colors.TextBlack};
  line-height: 1.6;
  margin: 0 0 16px 0;
`;

const IncompleteButton = styled.button`
  padding: 10px 20px;
  font-size: 0.9375rem;
  font-weight: 600;
  background: ${Colors.Primary};
  color: ${Colors.TextWhite};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  &:hover {
    opacity: 0.95;
  }
`;
