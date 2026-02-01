import { useCallback, useEffect, useRef, useState } from "react";
import { useProfile } from "~/components/features/Profile/hooks/useProfile";
import { useUploadProfileImage } from "~/components/features/Profile/hooks/useUploadProfileImage";

export function useProfileEditAvatar(uid: string | undefined) {
  const { data: profile } = useProfile(uid);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = useUploadProfileImage();

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file ?? null);
    uploadImage.reset();
  }, [uploadImage]);

  const clearSelection = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const displayPhotoUrl = previewUrl ?? profile?.photoURL ?? null;

  return {
    displayPhotoUrl,
    fileInputRef,
    selectedFile,
    handleFileChange,
    uploadImage,
    clearSelection,
  };
}
