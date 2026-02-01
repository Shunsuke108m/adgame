import { useCallback, useEffect, useState } from "react";
import type {
  ProfileData,
  ProfileWriteData,
} from "~/components/features/Profile/api/profileApi";
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

/** フォーム送信時の検証結果。親で「何を保存するか」を決めるために使う */
export type ProfileFormSubmitResult = {
  valid: boolean;
  sameAsProfile: boolean;
  payload: ProfileWriteData;
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

  /**
   * フォームを検証し、結果を返す。保存・遷移は呼び出し元（親）で行う。
   * uid があるときは必ず検証して結果を返す（null にしない）。画像変更とテキスト変更を同じフローで扱う。
   */
  const validateAndGetSubmitResult = useCallback((): ProfileFormSubmitResult | null => {
    if (!uid) return null;
    const errNick = validateNickname(nickname);
    const errBio = validateBio(bio);
    const errSns = validateSnsUrl(snsUrl);
    setErrors({ nickname: errNick, bio: errBio, snsUrl: errSns });
    const nextNick = trim(nickname);
    const nextBio = trim(bio);
    const nextSns = trim(snsUrl);
    const payload: ProfileWriteData = { nickname: nextNick, bio: nextBio, snsUrl: nextSns };
    const hasValidationErrors = errNick != null || errBio != null || errSns != null;
    if (hasValidationErrors) {
      return { valid: false, sameAsProfile: false, payload };
    }
    const prevBio = (profile?.bio ?? "").trim();
    const prevSns = (profile?.snsUrl ?? "").trim();
    const sameAsProfile =
      profile != null &&
      nextNick === (profile.nickname ?? "").trim() &&
      nextBio === prevBio &&
      nextSns === prevSns;
    return {
      valid: true,
      sameAsProfile,
      payload,
    };
  }, [uid, nickname, bio, snsUrl, profile]);

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
    validateAndGetSubmitResult,
    canSave,
    upsert,
  };
}
