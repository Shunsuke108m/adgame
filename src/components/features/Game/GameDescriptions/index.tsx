import React from "react";
import styled from "styled-components";
import { Colors } from "~/styles/colors";

export const GameDescriptions: React.FC = () => {

  return (
    <DescriptionContainer>
      <Description>
        目標CPA以内にCPAを改善し、
        予算を増額していくことで
        CV数を最大化しましょう
      </Description>
    </DescriptionContainer>
  );
};

const DescriptionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 4px 0;
  width: 100%;
`;

const Description = styled.span`
  font-size: 14px;
  color: ${Colors.TextBlack};
`;


