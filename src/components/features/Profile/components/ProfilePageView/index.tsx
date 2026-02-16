import React, { useMemo } from "react";
import { AffiliateAdSlot } from "~/components/common/AffiliateAdSlot";
import { useAuthUser } from "~/components/features/AuthUser/hooks/useAuthUser";
import { useProfile } from "~/components/features/Profile/hooks/useProfile";
import { useProfileSavedToast } from "~/components/features/Profile/hooks/useProfileSavedToast";
import { useTopScores } from "~/components/features/Score/hooks/useTopScores";
import { ProfileIncompleteCard } from "./ProfileIncompleteCard";
import { ProfileEmptyCard } from "./ProfileEmptyCard";
import { ProfileCard } from "./ProfileCard";
import { ProfileActionBar } from "./ProfileActionBar";
import {
  Page,
  LoadingText,
  EmptyMessage,
  SavedToast,
} from "./sharedStyles";

const TOP_RANK_LIMIT = 100;

export type ProfilePageViewProps = {
  uid: string | undefined;
};

/**
 * プロフィールページのオーケストレーション。
 * 読み込み・エラー・未作成・存在の各状態に応じて子コンポーネントを切り替える。
 */
export const ProfilePageView: React.FC<ProfilePageViewProps> = ({ uid }) => {
  const { authReady, isMine } = useAuthUser();
  const { data: profile, isLoading, error } = useProfile(uid);
  const { showSavedToast } = useProfileSavedToast();
  const { data: topScores, isLoading: topScoresLoading } = useTopScores(
    TOP_RANK_LIMIT
  );

  const rankDisplay = useMemo(() => {
    if (!uid) return "100位圏外";
    if (topScoresLoading || topScores == null) return "--";
    const entry = topScores.find((e) => e.uid === uid);
    return entry != null ? `${entry.rank}位` : "100位圏外";
  }, [uid, topScores, topScoresLoading]);
  const shareDisabled = topScoresLoading || rankDisplay === "--";

  // 常に同じ順でフックを呼ぶため、早期 return より前に定義（profile が null のときは未使用）
  const shareOgpPayload = useMemo(
    () =>
      uid && profile
        ? {
            uid,
            nickname: profile.nickname ?? "",
            photoURL: profile.photoURL ?? undefined,
            bio: profile.bio ?? undefined,
            bestScore: profile.bestScore ?? 0,
            rankDisplay,
          }
        : null,
    [uid, profile, rankDisplay]
  );

  if (!authReady || isLoading) {
    return (
      <Page>
        <LoadingText>読み込み中...</LoadingText>
      </Page>
    );
  }

  if (error || !uid) {
    return (
      <Page>
        <EmptyMessage>プロフィールを取得できませんでした</EmptyMessage>
      </Page>
    );
  }

  if (profile == null) {
    if (isMine(uid)) {
      return (
        <Page>
          <ProfileIncompleteCard uid={uid} />
          <ProfileActionBar showShare={false} showLogout={true} />
          <AffiliateAdSlot />
        </Page>
      );
    }
    return (
      <Page>
        <ProfileEmptyCard />
        <AffiliateAdSlot />
      </Page>
    );
  }

  return (
    <>
      <Page>
        <ProfileCard
          profile={profile}
          uid={uid}
          isMine={isMine(uid)}
          rankDisplay={rankDisplay}
        />
        <ProfileActionBar
          showShare={true}
          showLogout={isMine(uid)}
          shareDisabled={shareDisabled}
          shareOgpPayload={shareOgpPayload ?? undefined}
        />
        <AffiliateAdSlot />
      </Page>
      {showSavedToast && <SavedToast>保存しました</SavedToast>}
    </>
  );
};
