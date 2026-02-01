import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Card, CardAccent } from "./sharedStyles";
import { Colors } from "~/styles/colors";
import type { ProfileData } from "~/components/features/Profile/api/profileApi";

export type ProfileCardProps = {
  profile: ProfileData;
  uid: string;
  isMine: boolean;
  /** 順位表示。「NN位」または「100位圏外」。読み込み中は "--" 可。 */
  rankDisplay: string;
};

/**
 * プロフィールが存在するときの名刺風カード。編集リンクは自分のときのみ右下オーバーレイ。
 */
export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  uid,
  isMine,
  rankDisplay,
}) => {
  const { nickname, bio, snsUrl, photoURL } = profile;
  const bestScore = profile.bestScore ?? null;

  return (
    <Card>
      <CardAccent />
      <CardInner>
        <Nickname>{nickname ?? "名前未設定"}</Nickname>
        {bio != null && bio !== "" && <Bio>{bio}</Bio>}
        {snsUrl != null && snsUrl !== "" && (
          <SnsLink
            href={snsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            SNSリンク
          </SnsLink>
        )}
        <CardRow>
          <CardLeft>
            {photoURL ? (
              <AvatarImage src={photoURL} alt="" />
            ) : (
              <DefaultAvatar aria-hidden>👤</DefaultAvatar>
            )}
          </CardLeft>
          <StatsBox>
            <StatItem>
              <StatLabel>ベストスコア</StatLabel>
              <StatValue>
                {bestScore != null ? bestScore.toLocaleString() : "--"} CV
              </StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>順位</StatLabel>
              <StatValue>{rankDisplay}</StatValue>
            </StatItem>
          </StatsBox>
        </CardRow>
      </CardInner>
      {isMine && (
        <EditOverlayLink to={`/profiles/${uid}/edit`}>編集</EditOverlayLink>
      )}
    </Card>
  );
};

const CardInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 16px 12px 20px;
`;

const CardRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const CardLeft = styled.div`
  flex-shrink: 0;
`;

const AvatarImage = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${Colors.BackgroundWhite};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const DefaultAvatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(
    145deg,
    ${Colors.BackgroundGray} 0%,
    #e8eaed 100%
  );
  border: 2px solid ${Colors.BackgroundWhite};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  line-height: 1;
`;

const Nickname = styled.h1`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${Colors.TextBlack};
  margin: 0 0 4px 0;
  line-height: 1.25;
  letter-spacing: 0.02em;
  text-align: left;
`;

const Bio = styled.p`
  font-size: 0.8125rem;
  color: #4a5568;
  line-height: 1.6;
  margin: 0 0 4px 0;
  white-space: pre-wrap;
  word-break: break-word;
`;

const SnsLink = styled.a`
  display: inline-block;
  font-size: 0.75rem;
  color: ${Colors.Primary};
  text-decoration: none;
  margin-bottom: 4px;
  &:hover {
    text-decoration: underline;
  }
`;

const StatsBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
  min-width: 0;
`;

const StatItem = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

const StatLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  color: #5a6c7d;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const StatValue = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${Colors.TextBlack};
`;

const EditOverlayLink = styled(Link)`
  position: absolute;
  bottom: 12px;
  right: 12px;
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${Colors.Primary};
  color: ${Colors.TextWhite};
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  &:hover {
    opacity: 0.95;
  }
`;
