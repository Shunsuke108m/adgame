import React, { useState } from "react";
import styled from "styled-components";
import { logout, withdraw } from "~/components/features/AuthUser/authActions";
import { useAuthUser } from "~/components/features/AuthUser/hooks/useAuthUser";
import { useProfilePageShare } from "~/components/features/Profile/hooks/useProfilePageShare";
import type { OgpPayload } from "~/components/features/Profile/api/ogpApi";
import { Colors } from "~/styles/colors";

export type ProfileActionBarProps = {
  showShare: boolean;
  showLogout: boolean;
  /** 共有ボタン押下時に OGP 画像生成 API へ送る payload。未指定なら OGP リクエストは行わない。 */
  shareOgpPayload?: OgpPayload;
};

const WITHDRAW_CONFIRM_MESSAGE =
  "退会するとプロフィールとスコアが削除され、ランキングに表示されなくなります。\n再度ログインすると新規として扱われます。\n退会しますか？";

/**
 * プロフィールページの共有・ログアウト・退会アクション。
 */
export const ProfileActionBar: React.FC<ProfileActionBarProps> = ({
  showShare,
  showLogout,
  shareOgpPayload,
}) => {
  const { handleShare, copyMessage } = useProfilePageShare(shareOgpPayload);
  const { user } = useAuthUser();
  const [withdrawing, setWithdrawing] = useState(false);

  const handleWithdraw = async () => {
    if (!user?.uid) return;
    if (!window.confirm(WITHDRAW_CONFIRM_MESSAGE)) return;
    setWithdrawing(true);
    try {
      await withdraw(user.uid);
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <ActionBar>
      {showShare && (
        <ShareBlock>
          <ShareButton type="button" onClick={handleShare}>
            このカードを共有
          </ShareButton>
          {copyMessage === "success" && (
            <CopyToast>コピーしました！</CopyToast>
          )}
          {copyMessage === "fail" && (
            <CopyToast $error>コピーに失敗しました</CopyToast>
          )}
        </ShareBlock>
      )}
      {showLogout && (
        <AccountRow>
          <LogoutLink type="button" onClick={() => void logout()}>
            ログアウト
          </LogoutLink>
          <Separator aria-hidden>|</Separator>
          <WithdrawLink
            type="button"
            onClick={handleWithdraw}
            disabled={withdrawing}
            aria-label="退会（ランキングから外れます）"
          >
            {withdrawing ? "処理中..." : "退会"}
          </WithdrawLink>
        </AccountRow>
      )}
    </ActionBar>
  );
};

const ActionBar = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  width: 100%;
  max-width: 520px;
`;

const ShareBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const ShareButton = styled.button`
  padding: 14px 28px;
  font-size: 0.9375rem;
  font-weight: 600;
  background: ${Colors.Primary};
  color: ${Colors.TextWhite};
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
  box-shadow: 0 2px 8px rgba(9, 120, 190, 0.3);
  &:hover {
    opacity: 0.95;
    transform: translateY(-1px);
  }
`;

const CopyToast = styled.span<{ $error?: boolean }>`
  font-size: 0.8125rem;
  color: ${(p) => (p.$error ? "#c53030" : Colors.Primary)};
`;

const AccountRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const LogoutLink = styled.button`
  padding: 0;
  margin: 0;
  font-size: 0.75rem;
  font-weight: 500;
  color: #c53030;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Separator = styled.span`
  font-size: 0.75rem;
  color: ${Colors.Border};
  user-select: none;
`;

const WithdrawLink = styled.button`
  padding: 0;
  margin: 0;
  font-size: 0.7rem;
  font-weight: 500;
  color: #718096;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
  &:hover:not(:disabled) {
    color: #4a5568;
    text-decoration: underline;
  }
  &:disabled {
    cursor: default;
    color: #a0aec0;
  }
`;
