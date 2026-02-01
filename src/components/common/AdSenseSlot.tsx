import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { Colors } from "~/styles/colors";

const AD_CLIENT = "ca-pub-1447181358116393";

const SQUARE_AD_SIZE = 250;

export type AdSenseSlotProps = {
  /** 広告スロット ID（data-ad-slot） */
  slot: string;
  /** ラッパーの margin-top など。ランキング下部用は 24px など */
  className?: string;
  /** true にすると広告枠が画面上部にスティッキー（スクロール時も常に表示） */
  sticky?: boolean;
  /** true にすると 250x250 の正方形枠で表示（発行したユニットが正方形の場合に指定） */
  square?: boolean;
};

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

/**
 * Google AdSense の広告スロットを表示する。
 * index.html で adsbygoogle.js を読み込んでいる前提。
 */
export const AdSenseSlot: React.FC<AdSenseSlotProps> = ({
  slot,
  className,
  sticky = false,
  square = false,
}) => {
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense がブロックされている場合など
    }
  }, [slot]);

  const insStyle: React.CSSProperties = square
    ? { display: "block", width: SQUARE_AD_SIZE, height: SQUARE_AD_SIZE }
    : { display: "block" };

  return (
    <Wrapper className={className} $sticky={sticky} $square={square}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={insStyle}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={square ? "rectangle" : "auto"}
        {...(square
          ? {
              "data-ad-width": String(SQUARE_AD_SIZE),
              "data-ad-height": String(SQUARE_AD_SIZE),
            }
          : { "data-full-width-responsive": "true" })}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div<{ $sticky?: boolean; $square?: boolean }>`
  min-height: ${({ $square }) => ($square ? "250px" : "50px")};
  margin-top: 24px;
  overflow: hidden;
  background: ${Colors.BackgroundGray};
  border: 1px dashed ${Colors.Border};
  border-radius: 8px;
  ${({ $sticky }) =>
    $sticky
      ? `
    position: sticky;
    top: 0;
    z-index: 10;
  `
      : ""}
  ${({ $square }) =>
    $square
      ? `
    width: 250px;
    height: 250px;
    margin-left: auto;
    margin-right: auto;
  `
      : ""}
`;
