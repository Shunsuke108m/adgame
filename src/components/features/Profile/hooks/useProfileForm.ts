import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ProfileData } from "~/components/features/Profile/api/profileApi";
import {
  trim,
  validateNickname,
  validateBio,
  validateSnsUrl,
} from "~/components/features/Profile/lib/profileFormValidation";
import { useUpsertProfile } from "~/components/features/Profile/hooks/useUpsertProfile";

export type ProfileFormErrors = {
  nickname: string | null;
  bio: string | null;
  snsUrl: string | null;
};

export function useProfileForm(
  uid: string | undefined,
  profile: ProfileData | null | undefined,
  profileLoading: boolean
) {
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [snsUrl, setSnsUrl] = useState("");
  const [errors, setErrors] = useState<ProfileFormErrors>({
    nickname: null,
    bio: null,
    snsUrl: null,
  });

  const navigate = useNavigate();
  const upsert = useUpsertProfile(uid ?? "");

  useEffect(() => {
    if (profile) {
      setNickname(profile.nickname ?? "");
      setBio(profile.bio ?? "");
      setSnsUrl(profile.snsUrl ?? "");
    } else if (uid && !profileLoading && profile === null) {
      setNickname("");
      setBio("");
      setSnsUrl("");
    }
  }, [profile, profileLoading, uid]);

  const nicknameValid = validateNickname(nickname) === null;
  const bioValid = validateBio(bio) === null;
  const snsUrlValid = validateSnsUrl(snsUrl) === null;
  const canSave = nicknameValid && bioValid && snsUrlValid && !!uid;

  const handleNicknameBlur = useCallback(() => {
    setErrors((e) => ({ ...e, nickname: validateNickname(nickname) }));
  }, [nickname]);

  const handleBioBlur = useCallback(() => {
    setErrors((e) => ({ ...e, bio: validateBio(bio) }));
  }, [bio]);

  const handleSnsUrlBlur = useCallback(() => {
    setErrors((e) => ({ ...e, snsUrl: validateSnsUrl(snsUrl) }));
  }, [snsUrl]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!uid || !canSave) return;
      const errNick = validateNickname(nickname);
      const errBio = validateBio(bio);
      const errSns = validateSnsUrl(snsUrl);
      setErrors({ nickname: errNick, bio: errBio, snsUrl: errSns });
      if (errNick || errBio || errSns) return;
      const nextNick = trim(nickname);
      const nextBio = trim(bio);
      const nextSns = trim(snsUrl);
      const prevBio = (profile?.bio ?? "").trim();
      const prevSns = (profile?.snsUrl ?? "").trim();
      const sameAsProfile =
        profile != null &&
        nextNick === (profile.nickname ?? "").trim() &&
        nextBio === prevBio &&
        nextSns === prevSns;
      if (sameAsProfile) {
        navigate(`/profiles/${uid}`, { replace: true });
        return;
      }
      // 空で保存する場合も API で上書きするため、bio/snsUrl は常に文字列で渡す（"" でクリア）
      upsert.mutate({
        nickname: nextNick,
        bio: nextBio,
        snsUrl: nextSns,
      });
    },
    [uid, canSave, nickname, bio, snsUrl, profile, upsert, navigate]
  );

  return {
    nickname,
    setNickname,
    bio,
    setBio,
    snsUrl,
    setSnsUrl,
    errors,
    handleNicknameBlur,
    handleBioBlur,
    handleSnsUrlBlur,
    handleSubmit,
    canSave,
    upsert,
  };
}
