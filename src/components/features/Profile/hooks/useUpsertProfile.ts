import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { upsertProfile, type ProfileWriteData } from "~/components/features/Profile/api/profileApi";

/**
 * プロフィール保存 mutation。
 * 成功後に /profiles/:uid へ遷移（state.profileSaved でトースト表示用）。
 */
export function useUpsertProfile(uid: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: ProfileWriteData) => upsertProfile(uid, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["profile", uid] });
      navigate(`/profiles/${uid}`, { state: { profileSaved: true }, replace: true });
    },
  });
}
