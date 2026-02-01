import React from "react";
import { Navigate } from "react-router-dom";
import styled from "styled-components";
import { loginWithGoogle } from "~/components/features/AuthUser/authActions";
import { useAuthUser } from "~/components/features/AuthUser/hooks/useAuthUser";
import { useProfile } from "~/components/features/Profile/hooks/useProfile";
import { useProfileForm } from "~/components/features/Profile/hooks/useProfileForm";
import { useProfileEditAvatar } from "~/components/features/Profile/hooks/useProfileEditAvatar";
import { ProfileEditAvatarSection } from "./ProfileEditAvatarSection";
import { ProfileEditFormFields } from "./ProfileEditFormFields";
import { Colors } from "~/styles/colors";

export type ProfileEditViewProps = {
  uid: string | undefined;
};

export const ProfileEditView: React.FC<ProfileEditViewProps> = ({ uid }) => {
  const { user, authReady, isMine } = useAuthUser();
  const { data: profile, isLoading: profileLoading } = useProfile(uid);
  const form = useProfileForm(uid, profile, profileLoading);
  const avatar = useProfileEditAvatar(uid);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (avatar.selectedFile && uid) {
      try {
        await avatar.uploadImage.mutateAsync(avatar.selectedFile);
        avatar.clearSelection();
      } catch {
        return;
      }
    }
    form.handleSubmit(e);
  };

  if (!uid) {
    return (
      <Page>
        <EmptyMessage>プロフィールを取得できませんでした</EmptyMessage>
      </Page>
    );
  }
  if (!authReady || profileLoading) {
    return (
      <Page>
        <LoadingText>読み込み中...</LoadingText>
      </Page>
    );
  }
  if (user == null) {
    return (
      <Page>
        <Card>
          <GuestText>編集するにはログインしてください</GuestText>
          <LoginButton type="button" onClick={() => void loginWithGoogle()}>
            Googleでログイン
          </LoginButton>
        </Card>
      </Page>
    );
  }
  if (!isMine(uid)) {
    return <Navigate to={`/profiles/${uid}`} replace />;
  }

  const isPending = form.upsert.isPending || avatar.uploadImage.isPending;

  return (
    <Page>
      <Form onSubmit={handleFormSubmit}>
        <Card>
          <ProfileEditAvatarSection
            displayPhotoUrl={avatar.displayPhotoUrl}
            fileInputRef={avatar.fileInputRef}
            selectedFile={avatar.selectedFile}
            onFileChange={avatar.handleFileChange}
            uploadImage={avatar.uploadImage}
          />
          <ProfileEditFormFields
            nickname={form.nickname}
            onNicknameChange={form.setNickname}
            onNicknameBlur={form.handleNicknameBlur}
            bio={form.bio}
            onBioChange={form.setBio}
            onBioBlur={form.handleBioBlur}
            snsUrl={form.snsUrl}
            onSnsUrlChange={form.setSnsUrl}
            onSnsUrlBlur={form.handleSnsUrlBlur}
            errors={form.errors}
            upsertError={form.upsert.isError}
          />
          <SubmitButton
            type="submit"
            disabled={!form.canSave || isPending}
          >
            {isPending ? "保存中..." : "保存する"}
          </SubmitButton>
        </Card>
      </Form>
    </Page>
  );
};

const Page = styled.div`
  padding: 24px 16px;
  max-width: 480px;
  margin: 0 auto;
`;
const LoadingText = styled.p`
  text-align: center;
  color: ${Colors.TextBlack};
  margin: 0;
`;
const EmptyMessage = styled.p`
  text-align: center;
  color: ${Colors.TextBlack};
  margin: 0;
  padding: 48px 16px;
`;
const Card = styled.article`
  background: ${Colors.BackgroundWhite};
  border: 1px solid ${Colors.Border};
  border-radius: 12px;
  padding: 24px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;
const Form = styled.form`
  display: block;
`;
const GuestText = styled.p`
  font-size: 0.9375rem;
  color: ${Colors.TextBlack};
  margin: 0 0 16px 0;
  line-height: 1.5;
`;
const LoginButton = styled.button`
  width: 100%;
  padding: 10px 16px;
  font-size: 0.875rem;
  background: ${Colors.Primary};
  color: ${Colors.TextWhite};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;
const SubmitButton = styled.button`
  width: 100%;
  margin-top: 8px;
  padding: 12px 24px;
  font-size: 0.9375rem;
  font-weight: 600;
  background: ${Colors.Primary};
  color: ${Colors.TextWhite};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover:not(:disabled) {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
