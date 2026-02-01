import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthUser } from "~/components/features/AuthUser/hooks/useAuthUser";
import { convertAvatar } from "~/components/features/Profile/image/convertAvatar";
import { getProfileImageUploadUrl, putProfileImage } from "~/components/features/Profile/api/profileImageApi";
import { updatePhotoURL } from "~/components/features/Profile/api/profileApi";

/**
 * プロフィール画像アップロード: 変換 → Worker で URL 取得 → PUT → Firestore 更新。
 * 常に「現在ログイン中のユーザー」の uid で書き込む（URL と auth のずれで権限エラーにならないようにする）。
 * 成功時に profile クエリを無効化して再取得させる。
 */
export function useUploadProfileImage() {
  const queryClient = useQueryClient();
  const { user } = useAuthUser();
  const authUid = user?.uid;

  return useMutation({
    mutationFn: async (file: File) => {
      if (!authUid) {
        throw new Error("ログインしていないため画像を保存できません");
      }
      const { blob, contentType } = await convertAvatar(file);
      const { uploadUrl, publicUrl } = await getProfileImageUploadUrl(
        authUid,
        contentType
      );
      await putProfileImage(uploadUrl, blob, contentType);
      await updatePhotoURL(authUid, publicUrl);
      return publicUrl;
    },
    onSuccess: () => {
      if (authUid) {
        void queryClient.invalidateQueries({ queryKey: ["profile", authUid] });
      }
    },
  });
}
