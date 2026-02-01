import React from "react";
import { useParams } from "react-router-dom";
import { ProfilePageView } from "~/components/features/Profile/components/ProfilePageView";

export const ProfilePage: React.FC = () => {
  const { uid } = useParams<{ uid: string }>();
  return <ProfilePageView uid={uid} />;
};
