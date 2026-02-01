import React from "react";
import {
  Card,
  CardAccent,
  CardInnerVertical,
  EmptyMessage,
} from "./sharedStyles";

/**
 * 他人のプロフィールが未作成のときのカード。
 */
export const ProfileEmptyCard: React.FC = () => (
  <Card>
    <CardAccent />
    <CardInnerVertical>
      <EmptyMessage>このプロフィールはまだ作成されていません</EmptyMessage>
    </CardInnerVertical>
  </Card>
);
