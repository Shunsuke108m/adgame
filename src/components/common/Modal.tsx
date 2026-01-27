import React from "react";
import styled from "styled-components";
import { useAtom } from "jotai";
import { modalAtom } from "../../jotai/DescriptionModal/atom";
import { Colors } from "../../styles/colors";

export const Modal: React.FC = () => {
  const [modal, setModal] = useAtom(modalAtom);
  if (!modal.open) return null;
  return (
    <Overlay onClick={() => setModal({ ...modal, open: false })}>
      <ModalBox onClick={e => e.stopPropagation()}>
        <CloseButton onClick={() => setModal({ ...modal, open: false })}>×</CloseButton>
        <Title>{modal.title}</Title>
        <Text>{modal.text.split("\n").map((line, i) => <div key={i}>{line}</div>)}</Text>
      </ModalBox>
    </Overlay>
  );
};

export const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalBox = styled.div`
  background: ${Colors.BackgroundWhite};
  color: ${Colors.TextBlack};
  border-radius: 8px;
  border: 1px solid ${Colors.Border};
  padding: 24px 20px;
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  position: relative;
  margin: 16px;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  color: ${Colors.TextBlack};
  border: 1px solid ${Colors.Border};
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 18px;
  cursor: pointer;
  z-index: 10;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: ${Colors.Secondary};
    color: ${Colors.Primary};
  }
`;

export const Title = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: ${Colors.TextBlack};
`;

export const Text = styled.div`
  font-size: 1rem;
  line-height: 1.7;
  color: ${Colors.TextBlack};
`;
