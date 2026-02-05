import { useEffect } from "react";
import type { ProfileData } from "../api/profileApi";

const SITE_TITLE_SUFFIX = " - 広告運用ゲーム";
const DEFAULT_OG_IMAGE_PATH = "/ogp/adgame_logo.png";

type MetaInput = {
  uid: string;
  profile: ProfileData;
  /** 現在のページの絶対URL（og:url 用）。未指定時は window.location.href を使用。 */
  pageUrl?: string;
};

/**
 * プロフィールページ用の OGP / Twitter メタタグを document.head に設定する。
 * クローラーが JS を実行する場合はプレビューに反映される。
 * クリーンアップはアンマウント時に行う（デフォルトの og に戻すか、タグ削除）。
 */
export function useProfilePageOgpMeta(input: MetaInput | null): void {
  useEffect(() => {
    if (!input) return;

    const { uid, profile, pageUrl } = input;
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "";
    const url = pageUrl ?? (typeof window !== "undefined" ? window.location.href : `${baseUrl}/profiles/${uid}`);
    const title = `${profile.nickname ?? "プロフィール"}${SITE_TITLE_SUFFIX}`;
    const imageUrl = profile.ogpProfileImageUrl
      ? profile.ogpProfileImageUrl
      : `${baseUrl}${DEFAULT_OG_IMAGE_PATH}`;

    const pairs: [string, string, "property" | "name"][] = [
      ["og:title", title, "property"],
      ["og:url", url, "property"],
      ["og:image", imageUrl, "property"],
      ["og:type", "profile", "property"],
      ["twitter:card", "summary_large_image", "name"],
      ["twitter:title", title, "name"],
      ["twitter:image", imageUrl, "name"],
    ];

    const elements: HTMLMetaElement[] = [];
    for (const [key, content, attr] of pairs) {
      const el = document.createElement("meta");
      el.setAttribute(attr, key);
      el.setAttribute("content", content);
      document.head.appendChild(el);
      elements.push(el);
    }

    return () => {
      for (const el of elements) {
        el.remove();
      }
    };
    // input の参照が毎レンダー変わるため、メタに使う値だけを依存に含める
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    input?.uid,
    input?.profile?.nickname,
    input?.profile?.ogpProfileImageUrl,
  ]);
}
