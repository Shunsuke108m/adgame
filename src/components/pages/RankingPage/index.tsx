import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AffiliateAdSlot } from "~/components/common/AffiliateAdSlot";
import { useTopScores } from "~/components/features/Score/hooks/useTopScores";
import { Colors } from "~/styles/colors";

const INITIAL_LIMIT = 20;
const FULL_LIMIT = 100;

export const RankingPage: React.FC = () => {
  const [limit, setLimit] = useState(INITIAL_LIMIT);
  const { data: entries, isLoading, error } = useTopScores(limit);

  if (isLoading) {
    return (
      <Page>
        <Title>ランキング</Title>
        <Description>
          ベストスコア順です。行をタップするとプロフィールへ移動します。
        </Description>
        <LoadingText>読み込み中...</LoadingText>
        <AffiliateAdSlot />
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <Title>ランキング</Title>
        <Description>
          ベストスコア順です。行をタップするとプロフィールへ移動します。
        </Description>
        <EmptyMessage>ランキングを取得できませんでした</EmptyMessage>
        <AffiliateAdSlot />
      </Page>
    );
  }

  const list = entries ?? [];
  const showExpandButton = limit === INITIAL_LIMIT;

  return (
    <Page>
      <Title>ランキング</Title>
      <Description>
        ベストスコア順です。行をタップするとプロフィールへ移動します。
      </Description>
      <List>
        {list.map((entry) => (
          <RowLink key={entry.uid} to={`/profiles/${entry.uid}`}>
            <Rank>{entry.rank}</Rank>
            <UserCell>
              {entry.photoURL ? (
                <Avatar src={entry.photoURL} alt="" />
              ) : (
                <DefaultAvatar aria-hidden>👤</DefaultAvatar>
              )}
              <UserInfo>
                <Nickname>{entry.nickname ?? entry.uid}</Nickname>
                {entry.bioPreview != null && entry.bioPreview !== "" && (
                  <BioPreview>{entry.bioPreview}</BioPreview>
                )}
              </UserInfo>
            </UserCell>
            <Score>{entry.bestScore.toLocaleString()} CV</Score>
          </RowLink>
        ))}
      </List>
      {list.length === 0 && (
        <EmptyMessage>まだスコアがありません</EmptyMessage>
      )}
      {showExpandButton && list.length > 0 && (
        <ExpandButton
          type="button"
          onClick={() => setLimit(FULL_LIMIT)}
        >
          上位100位を表示
        </ExpandButton>
      )}
      <AffiliateAdSlot />
    </Page>
  );
};

const Page = styled.div`
  padding: 24px 20px;
  max-width: 600px;
  margin: 0 auto;
  min-height: 60vh;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${Colors.TextBlack};
  margin: 0 0 8px 0;
  text-align: center;
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: #5a6c7d;
  margin: 0 0 16px 0;
  text-align: center;
  line-height: 1.5;
`;

const LoadingText = styled.p`
  text-align: center;
  color: ${Colors.TextBlack};
  margin: 0;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: ${Colors.TextBlack};
  margin: 24px 0 0 0;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid ${Colors.Border};
  border-radius: 12px;
  overflow: hidden;
`;

const RowLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: ${Colors.BackgroundWhite};
  border-bottom: 1px solid ${Colors.Border};
  text-decoration: none;
  color: inherit;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: ${Colors.BackgroundGray};
  }
`;

const Rank = styled.span`
  flex-shrink: 0;
  width: 32px;
  font-size: 1rem;
  font-weight: 700;
  color: ${Colors.TextBlack};
  text-align: right;
`;

const UserCell = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

const DefaultAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${Colors.BackgroundGray};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const Nickname = styled.span`
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${Colors.TextBlack};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/** 画面幅に応じて省略（コンテナ幅で ellipsis）。文字数制限は使わない */
const BioPreview = styled.span`
  font-size: 0.75rem;
  color: #5a6c7d;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.3;
`;

const Score = styled.span`
  flex-shrink: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  color: ${Colors.Primary};
`;

const ExpandButton = styled.button`
  margin-top: 16px;
  width: 100%;
  max-width: 520px;
  padding: 12px 16px;
  font-size: 0.9375rem;
  font-weight: 600;
  background: ${Colors.BackgroundWhite};
  color: ${Colors.Primary};
  border: 1px solid ${Colors.Primary};
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s, background 0.2s;
  &:hover {
    opacity: 0.9;
    background: ${Colors.Secondary};
  }
`;
