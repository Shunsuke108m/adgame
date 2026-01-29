import { atom } from "jotai";

export type ModalState = {
  open: boolean;
  title: string;
  text: string;
};

export const modalAtom = atom<ModalState>({
  open: false,
  title: "",
  text: ""
});
