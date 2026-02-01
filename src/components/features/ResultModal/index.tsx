import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AdSenseSlot } from "~/components/common/AdSenseSlot";
import { Colors } from "../../../styles/colors";
import {
  useGameResultModalOpen,
  useGameResult,
  useGameResultModalAuthUser,
  useCopyProfileUrl,
  } from "./hooks";
import { useGamePlayAgain } from "./hooks";

const RESULT_MODAL_AD_SLOT = "7654247128";

export type ResultModalProps = {
  /** 未ログイン時の Google ログインボタン押下（Auth 連携時は渡す） */
  onGoogleLogin?: () => void;
};

export const ResultModal: React.FC<ResultModalProps> = ({
  onGoogleLogin,
}) => {
  const [open, setOpen] = useGameResultModalOpen();
  const result = useGameResult();
  const user = useGameResultModalAuthUser();
  const { copyProfileUrl, copySuccess } = useCopyProfileUrl(user?.uid);

  const isLoggedIn = user !== null;

  const onPlayAgain = useGamePlayAgain();

  const handlePlayAgain = () => {
    setOpen(false);
    onPlayAgain?.();
  };

  if (!open) return null;

  return (
    <Overlay onClick={() => setOpen(false)}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <Title>ゲーム結果</Title>

        <ScoreRow>
          <Label>今回のスコア</Label>
          <Value>{result.score.toLocaleString()} CV</Value>
        </ScoreRow>
        <ScoreRow>
          <Label>ベストスコア</Label>
          <Value>{result.bestScore?.toLocaleString()} CV</Value>
        </ScoreRow>

        {isLoggedIn && (
          <>
            <CopyRow>
              <CopyButton type="button" onClick={copyProfileUrl}>
                プロフィール共有URLをコピー
              </CopyButton>
              {copySuccess && <Toast>コピーしました</Toast>}
            </CopyRow>
            <ProfileEditLink to={`/profiles/${user.uid}/edit`}>
              プロフィールを作成して共有しよう
            </ProfileEditLink>
          </>
        )}

        {!isLoggedIn && (
          <GuestBlock>
            <GuestText>
              ログインするとランキングに参加できます
            </GuestText>
            <GoogleLoginButton type="button" onClick={onGoogleLogin}>
              Googleでログイン
            </GoogleLoginButton>
          </GuestBlock>
        )}

        <ButtonRow>
          <PrimaryButton type="button" onClick={handlePlayAgain}>
            もう一度プレイ
          </PrimaryButton>
          <SecondaryButton as="a" href="/ranking">
            ランキングを見る
          </SecondaryButton>
        </ButtonRow>
        <AdSenseSlot slot={RESULT_MODAL_AD_SLOT} square />
      </ModalBox>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalBox = styled.div`
  background: ${Colors.BackgroundWhite};
  color: ${Colors.TextBlack};
  border-radius: 8px;
  border: 1px solid ${Colors.Border};
  padding: 24px 20px;
  min-width: 320px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  margin: 16px;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: ${Colors.TextBlack};
`;

const ScoreRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid ${Colors.Border};
  &:last-of-type {
    border-bottom: none;
  }
`;

const Label = styled.span`
  font-size: 0.875rem;
  color: ${Colors.TextBlack};
`;

const Value = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${Colors.TextBlack};
`;

const CopyRow = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const CopyButton = styled.button`
  background: ${Colors.BackgroundGray};
  color: ${Colors.TextBlack};
  border: 1px solid ${Colors.Border};
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  &:hover {
    background: ${Colors.Secondary};
    border-color: ${Colors.Primary};
  }
`;

const Toast = styled.span`
  font-size: 0.8125rem;
  color: ${Colors.Primary};
`;

const GuestBlock = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${Colors.Border};
`;

const GuestText = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${Colors.TextBlack};
  margin: 0 0 4px 0;
  line-height: 1.5;
`;

const GoogleLoginButton = styled.button`
  width: 100%;
  background: ${Colors.BackgroundWhite};
  color: ${Colors.TextBlack};
  border: 1px solid ${Colors.Border};
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 0.875rem;
  cursor: pointer;
  margin-bottom: 16px;
  transition: background 0.2s, border-color 0.2s;
  &:hover {
    background: ${Colors.Secondary};
    border-color: ${Colors.Primary};
  }
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PrimaryButton = styled.button`
  background: ${Colors.Primary};
  color: ${Colors.TextWhite};
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

const SecondaryButton = styled.a`
  background: ${Colors.BackgroundWhite};
  color: ${Colors.Primary};
  border: 1px solid ${Colors.Primary};
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 0.9375rem;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: ${Colors.Secondary};
  }
`;

const ProfileEditLink = styled(Link)`
  display: block;
  margin-top: 12px;
  background: ${Colors.BackgroundGray};
  color: ${Colors.TextBlack};
  border: 1px solid ${Colors.Border};
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 0.875rem;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  &:hover {
    background: ${Colors.Secondary};
    border-color: ${Colors.Primary};
  }
`;
