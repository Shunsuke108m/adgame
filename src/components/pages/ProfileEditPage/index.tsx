import React from "react";
import { useParams } from "react-router-dom";
import { ProfileEditView } from "~/components/features/Profile/components/ProfileEditView";

export const ProfileEditPage: React.FC = () => {
  const { uid } = useParams<{ uid: string }>();
  return <ProfileEditView uid={uid} />;
};
