import styled, { DefaultTheme } from "styled-components";
import { space, layout, variant } from "styled-system";
import { scaleVariants, styleVariants } from "./theme";
import { BaseButtonProps } from "./types";

interface ThemedButtonProps extends BaseButtonProps {
  theme: DefaultTheme;
}

interface TransientButtonProps extends ThemedButtonProps {
  $isLoading?: boolean;
}

const getDisabledStyles = ({ $isLoading, theme }: TransientButtonProps) => {
  if ($isLoading === true) {
    return `
      &:disabled,
      &.pancake-button--disabled {
        cursor: not-allowed;
      }
    `;
  }

  return `
    &:disabled,
    &.pancake-button--disabled {
      background-color: ${theme.colors.backgroundDisabled};
      border-color: ${theme.colors.backgroundDisabled};
      box-shadow: none;
      color: ${theme.colors.textDisabled};
      cursor: not-allowed;
    }
  `;
};

/**
 * This is to get around an issue where if you use a Link component
 * React will throw a invalid DOM attribute error
 * @see https://github.com/styled-components/styled-components/issues/135
 */

const getOpacity = ({ $isLoading = false }: TransientButtonProps) => {
  return $isLoading ? ".5" : "1";
};

const GoldenButton = styled.button<BaseButtonProps>`
  color: #000 !important;
  cursor: pointer;
  padding: 10px 30px;
  border: none;
  font-weight: 800;
  font-size: 16px;
  vertical-align: middle;
  position: relative;
  font-family: "Comfortaa", cursive;
  display: inline-block;
  -webkit-border-radius: 90px;
  -moz-border-radius: 90px;
  border-radius: 90px;
  background-image: linear-gradient(
  150deg, #fe9600 0%, rgb(249 183 7) 78%);
`;

export default GoldenButton;
