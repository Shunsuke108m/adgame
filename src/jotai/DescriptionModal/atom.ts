import { atom } from "jotai";

/** 説明モーダル（用語・アクション説明）の開閉・タイトル・本文 */
export type DescriptionModalState = {
  open: boolean;
  title: string;
  text: string;
};

export const descriptionModalAtom = atom<DescriptionModalState>({
  open: false,
  title: "",
  text: "",
});
