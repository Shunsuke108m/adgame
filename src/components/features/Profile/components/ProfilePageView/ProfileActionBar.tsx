import React from "react";
import styled from "styled-components";
import { logout } from "~/components/features/AuthUser/authActions";
import { useProfilePageShare } from "~/components/features/Profile/hooks/useProfilePageShare";
import { Colors } from "~/styles/colors";

export type ProfileActionBarProps = {
  showShare: boolean;
  showLogout: boolean;
};

/**
 * プロフィールページの共有・ログアウトアクション。
 */
export const ProfileActionBar: React.FC<ProfileActionBarProps> = ({
  showShare,
  showLogout,
}) => {
  const { handleShare, copyMessage } = useProfilePageShare();

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
        <LogoutLink type="button" onClick={() => void logout()}>
          ログアウト
        </LogoutLink>
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
