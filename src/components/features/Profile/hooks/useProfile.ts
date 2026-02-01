import { useQuery } from "@tanstack/react-query";
import { getProfile, type ProfileData } from "~/components/features/Profile/api/profileApi";

/**
 * profiles/{uid} を取得。
 * 読み込みで止まる場合: Firestore のルールで profiles の read が許可されているか確認してください。
 */
export function useProfile(uid: string | undefined) {
  return useQuery<ProfileData | null>({
    queryKey: ["profile", uid],
    queryFn: () => getProfile(uid!),
    enabled: !!uid,
    retry: false,
  });
}
