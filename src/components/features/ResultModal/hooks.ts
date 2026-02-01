import { useAtom, useSetAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { INITIAL_GAME_PLAY_STATE } from "~/jotai/Game/atom";
import { gamePlayStateAtom } from "~/jotai/Game/atom";
import { gameResultAtom, gameResultModalAuthUserAtom, gameResultModalOpenAtom, type GameResult, type GameResultModalAuthUser } from "~/jotai/GameResult/atom";

export function useGamePlayAgain(): () => void {
    const setState = useSetAtom(gamePlayStateAtom);
    const setGameResultModalOpen = useSetAtom(gameResultModalOpenAtom);
    return useCallback(() => {
      setState(INITIAL_GAME_PLAY_STATE);
      setGameResultModalOpen(false);
    }, [setState, setGameResultModalOpen]);
  }
  
  
  export function useGameResultModalOpen(): [boolean, (open: boolean) => void] {
    return useAtom(gameResultModalOpenAtom);
  }
  
  export function useGameResult(): GameResult {
    const [result] = useAtom(gameResultAtom);
    return result;
  }
  
  export function useGameResultModalAuthUser(): GameResultModalAuthUser {
    const [user] = useAtom(gameResultModalAuthUserAtom);
    return user;
  }
  
  export function useCloseGameResultModal(): () => void {
    const setOpen = useSetAtom(gameResultModalOpenAtom);
    return useCallback(() => setOpen(false), [setOpen]);
  }
  
  /**
   * プロフィール共有URLをコピーし、トースト表示用の状態を返す。
   * UI のみの責務（クリップボード API 使用）。
   */
  export function useCopyProfileUrl(uid: string | undefined): {
    copyProfileUrl: () => void;
    copySuccess: boolean;
  } {
    const [copySuccess, setCopySuccess] = useState(false);
  
    useEffect(() => {
      if (!copySuccess) return;
      const t = setTimeout(() => setCopySuccess(false), 2000);
      return () => clearTimeout(t);
    }, [copySuccess]);
  
    const copyProfileUrl = useCallback(() => {
      if (!uid) return;
      const url = `${window.location.origin}/ranking?user=${uid}`;
      void navigator.clipboard.writeText(url).then(() => setCopySuccess(true));
    }, [uid]);
  
    return { copyProfileUrl, copySuccess };
  }
  