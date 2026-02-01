import { useCallback, useEffect, useRef, useState } from "react";
import { useProfile } from "~/components/features/Profile/hooks/useProfile";
import { useUploadProfileImage } from "~/components/features/Profile/hooks/useUploadProfileImage";

export function useProfileEditAvatar(uid: string | undefined) {
  const { data: profile } = useProfile(uid);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
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
    setRemovePhoto(false);
    uploadImage.reset();
  }, [uploadImage]);

  const clearSelection = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleRemovePhoto = useCallback(() => {
    setRemovePhoto(true);
    clearSelection();
  }, [clearSelection]);

  const clearRemovePhoto = useCallback(() => {
    setRemovePhoto(false);
  }, []);

  const displayPhotoUrl =
    removePhoto ? null : (previewUrl ?? profile?.photoURL ?? null);

  return {
    displayPhotoUrl,
    fileInputRef,
    selectedFile,
    removePhoto,
    handleFileChange,
    handleRemovePhoto,
    clearRemovePhoto,
    uploadImage,
    clearSelection,
  };
}
