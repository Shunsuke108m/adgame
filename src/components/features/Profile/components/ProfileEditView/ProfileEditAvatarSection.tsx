import React from "react";
import styled from "styled-components";
import type { useUploadProfileImage } from "~/components/features/Profile/hooks/useUploadProfileImage";
import { Colors } from "~/styles/colors";

export type ProfileEditAvatarSectionProps = {
  displayPhotoUrl: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  selectedFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadImage: ReturnType<typeof useUploadProfileImage>;
};

export const ProfileEditAvatarSection: React.FC<ProfileEditAvatarSectionProps> = ({
  displayPhotoUrl,
  fileInputRef,
  selectedFile,
  onFileChange,
  uploadImage,
}) => (
  <Section>
    <Label>プロフィール画像</Label>
    <Row>
      <Wrap>
        {displayPhotoUrl ? (
          <Img src={displayPhotoUrl} alt="" />
        ) : (
          <DefaultAvatar aria-hidden>👤</DefaultAvatar>
        )}
      </Wrap>
      <Controls>
        <FileInput
          ref={fileInputRef}
          id="profile-edit-photo"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          aria-label="画像を選択"
        />
        <FileLabel htmlFor="profile-edit-photo">画像を選択</FileLabel>
        {selectedFile != null && (
          <Hint>選択中: {selectedFile.name}（保存で反映されます）</Hint>
        )}
        {uploadImage.isError && (
          <ErrorText>
            {uploadImage.error instanceof Error
              ? uploadImage.error.message
              : "画像のアップロードに失敗しました"}
          </ErrorText>
        )}
      </Controls>
    </Row>
  </Section>
);

const Section = styled.div`
  margin-bottom: 24px;
`;
const Label = styled.span`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${Colors.TextBlack};
  margin-bottom: 10px;
`;
const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;
const Wrap = styled.div`
  flex-shrink: 0;
`;
const Img = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${Colors.Border};
`;
const DefaultAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${Colors.BackgroundGray};
  border: 2px solid ${Colors.Border};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  line-height: 1;
`;
const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`;
const FileInput = styled.input`
  position: absolute;
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  z-index: -1;
`;
const FileLabel = styled.label`
  display: inline-block;
  padding: 8px 14px;
  font-size: 0.875rem;
  background: ${Colors.BackgroundGray};
  color: ${Colors.TextBlack};
  border: 1px solid ${Colors.Border};
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background: ${Colors.Secondary};
    border-color: ${Colors.Primary};
  }
`;
const Hint = styled.span`
  font-size: 0.75rem;
  color: #5a6c7d;
`;
const ErrorText = styled.p`
  font-size: 0.8125rem;
  color: #c53030;
  margin: 6px 0 0 0;
`;
