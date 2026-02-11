import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAtomValue } from "jotai";
import { authUserAtom, authReadyAtom } from "~/jotai/Auth/atoms";
import { loginWithGoogle } from "~/components/features/AuthUser/authActions";
import { useProfile } from "~/components/features/Profile/hooks/useProfile";
import { Colors } from "~/styles/colors";
import adgameLogo from "~/assets/adgame_logo.png";

export const Header: React.FC = () => {
  const authReady = useAtomValue(authReadyAtom);
  const user = useAtomValue(authUserAtom);
  const { data: profile } = useProfile(user?.uid ?? undefined);

  if (!authReady) {
    return null;
  }

  return (
    <HeaderRoot>
      <TitleLink to="/" aria-label="広告運用ゲーム トップへ">
        <HeaderLogo src={adgameLogo} alt="広告運用ゲーム" />
      </TitleLink>
      <RightBlock>
        <NavLink to="/ranking">ランキング</NavLink>
        {user == null ? (
          <LoginButton type="button" onClick={() => void loginWithGoogle()}>
            ログイン
          </LoginButton>
        ) : (
          <ProfileLink to={`/profiles/${user.uid}`} aria-label="自分のプロフィールへ">
            {profile?.photoURL ? (
              <HeaderAvatar src={profile.photoURL} alt="" />
            ) : (
              <ProfileIcon aria-hidden>👤</ProfileIcon>
            )}
          </ProfileLink>
        )}
      </RightBlock>
    </HeaderRoot>
  );
};

const HeaderRoot = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 12px;
  background: ${Colors.BackgroundWhite};
  border-bottom: 1px solid ${Colors.Border};
`;

const TitleLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  &:hover {
    opacity: 0.85;
  }
`;

const HeaderLogo = styled.img`
  display: block;
  height: 28px;
  width: auto;
`;

const RightBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const NavLink = styled(Link)`
  font-size: 0.9375rem;
  color: ${Colors.Primary};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const LoginButton = styled.button`
  padding: 6px 12px;
  font-size: 0.875rem;
  background: ${Colors.Primary};
  color: ${Colors.TextWhite};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const ProfileLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: inherit;
  &:hover {
    opacity: 0.85;
  }
`;

const HeaderAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
`;

const ProfileIcon = styled.span`
  font-size: 1.25rem;
  line-height: 1;
`;
