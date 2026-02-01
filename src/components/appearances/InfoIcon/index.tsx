import React from "react";
import styled from "styled-components";
import { Colors } from "../../../styles/colors";

export type InfoIconProps = {
  onClick: () => void;
  size?: number;
  /** 背景色（未指定時は Primary） */
  backgroundColor?: string;
  /** アイコン文字色（未指定時は BackgroundWhite） */
  textColor?: string;
  "aria-label"?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;

export const InfoIcon: React.FC<InfoIconProps> = ({
  onClick,
  size = 24,
  backgroundColor,
  textColor,
  "aria-label": ariaLabel,
  ...rest
}) => {
  return (
    <IconButton
      type="button"
      onClick={onClick}
      $size={size}
      $backgroundColor={backgroundColor ?? Colors.Primary}
      $textColor={textColor ?? Colors.BackgroundWhite}
      aria-label={ariaLabel}
      {...rest}
    >
      i
    </IconButton>
  );
};

const IconButton = styled.button<{
  $size: number;
  $backgroundColor: string;
  $textColor: string;
}>`
  background: ${(p) => p.$backgroundColor};
  color: ${(p) => p.$textColor};
  border: none;
  border-radius: 50%;
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  font-size: ${(p) => Math.round(p.$size * 0.65)}px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: opacity 0.2s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  &:hover {
    opacity: 0.9;
  }
`;
