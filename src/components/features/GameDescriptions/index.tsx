import React, { useState } from "react";
import styled from "styled-components";
import { Colors } from "../../../styles/colors";

export const GameDescriptions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DescriptionContainer>
      <ToggleButton onClick={() => setIsOpen(!isOpen)}>
        ゲーム説明 {isOpen ? '▼' : '▶︎'}
      </ToggleButton>
      {isOpen && (
        <DescriptionContent>
          <p>
            このゲームは、広告運用の基本的な概念を学ぶためのシンプルなシミュレーションゲームです。<br />
            プレイヤーは、広告キャンペーンのパフォーマンスを向上させるために、様々な施策を選択し、実行します。<br />
            各施策は、広告のコスト、クリック率（CTR）、コンバージョン率（CVR）などに影響を与えます。<br />
            施策を組み合わせて最適な結果を出すことが目標です。<br />
            ゲームを通じて、広告運用の基本的な考え方や指標の理解を深めましょう。
          </p>
        </DescriptionContent>
      )}
    </DescriptionContainer>
  );
};

export const DescriptionContainer = styled.div`
  /* margin: 8px 0; */
  background: ${Colors.BackgroundGray};
  /* border-radius: 8px; */
  padding: 4px;
  width: 100%;
`;

export const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${Colors.TextBlack};
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  margin: 0;
  width: 100%;
  text-align: left;
`;

export const DescriptionContent = styled.div`
  margin-top: 1rem;
  color: ${Colors.TextBlack};
`;