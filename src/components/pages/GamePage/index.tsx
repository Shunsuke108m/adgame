import React from "react";
import styled from "styled-components";
import { ActionButtons } from "~/components/features/Game/ActionButtons/index";
import { GameDescriptions } from "~/components/features/Game/GameDescriptions/index";
import { GameInfoBar } from "~/components/features/Game/GameInfoBar/index";
import { Modal } from "~/components/common/Modal";
import { ResultModal } from "~/components/features/ResultModal/index";
import { GameTable } from "~/components/features/Game/GameTable";
import { loginWithGoogle } from "~/components/features/AuthUser/authActions";

export const GamePage: React.FC = () => {
  return (
    <Root>
      <Modal />
      <ResultModal onGoogleLogin={() => void loginWithGoogle()} />
      <GameDescriptions />
      <GameInfoBar />
      <GameTable />
      <ActionButtons />
    </Root>
  );
};

const Root = styled.div`
  padding: 8px;
  margin: 0;
`;
