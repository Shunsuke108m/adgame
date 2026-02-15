import React from "react";
import styled from "styled-components";
import type { ProfileFormErrors } from "~/components/features/Profile/hooks/useProfileForm";
import { SNS_ALLOWED_LABEL } from "~/components/features/Profile/lib/profileFormValidation";
import { Colors } from "~/styles/colors";

export type ProfileEditFormFieldsProps = {
  nickname: string;
  onNicknameChange: (v: string) => void;
  onNicknameBlur: () => void;
  bio: string;
  onBioChange: (v: string) => void;
  onBioBlur: () => void;
  snsUrl: string;
  onSnsUrlChange: (v: string) => void;
  onSnsUrlBlur: () => void;
  errors: ProfileFormErrors;
  upsertError: boolean;
};

export const ProfileEditFormFields: React.FC<ProfileEditFormFieldsProps> = ({
  nickname,
  onNicknameChange,
  onNicknameBlur,
  bio,
  onBioChange,
  onBioBlur,
  snsUrl,
  onSnsUrlChange,
  onSnsUrlBlur,
  errors,
  upsertError,
}) => (
  <>
    <Field>
      <Label htmlFor="profile-edit-nickname">
      <Required>*</Required>表示名（20文字以内）
      </Label>
      <Input
        id="profile-edit-nickname"
        type="text"
        value={nickname}
        onChange={(e) => onNicknameChange(e.target.value)}
        onBlur={onNicknameBlur}
        maxLength={40}
        aria-invalid={errors.nickname != null}
      />
      {errors.nickname && <ErrorText>{errors.nickname}</ErrorText>}
    </Field>
    <Field>
      <Label htmlFor="profile-edit-bio">自己紹介（140文字以内）</Label>
      <Textarea
        id="profile-edit-bio"
        value={bio}
        onChange={(e) => onBioChange(e.target.value)}
        onBlur={onBioBlur}
        rows={4}
        maxLength={200}
        aria-invalid={errors.bio != null}
      />
      {errors.bio && <ErrorText>{errors.bio}</ErrorText>}
    </Field>
    <Field>
      <Label htmlFor="profile-edit-sns">SNS URL（{SNS_ALLOWED_LABEL}）</Label>
      <Input
        id="profile-edit-sns"
        type="url"
        value={snsUrl}
        onChange={(e) => onSnsUrlChange(e.target.value)}
        onBlur={onSnsUrlBlur}
        maxLength={250}
        aria-invalid={errors.snsUrl != null}
      />
      {errors.snsUrl && <ErrorText>{errors.snsUrl}</ErrorText>}
    </Field>
    {upsertError && (
      <ErrorText>保存に失敗しました。しばらくしてからお試しください。</ErrorText>
    )}
  </>
);

const Field = styled.div`
  margin-bottom: 20px;
`;
const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${Colors.TextBlack};
  margin-bottom: 6px;
`;
const Required = styled.span`
  color: #c53030;
  font-size: 1rem;
`;
const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  font-size: 0.9375rem;
  border: 1px solid ${Colors.Border};
  border-radius: 8px;
  color: ${Colors.TextBlack};
  background: ${Colors.BackgroundWhite};
  box-sizing: border-box;
  &[aria-invalid="true"] {
    border-color: #c53030;
  }
`;
const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  font-size: 0.9375rem;
  border: 1px solid ${Colors.Border};
  border-radius: 8px;
  color: ${Colors.TextBlack};
  background: ${Colors.BackgroundWhite};
  resize: vertical;
  box-sizing: border-box;
  &[aria-invalid="true"] {
    border-color: #c53030;
  }
`;
const ErrorText = styled.p`
  font-size: 0.8125rem;
  color: #c53030;
  margin: 6px 0 0 0;
`;
