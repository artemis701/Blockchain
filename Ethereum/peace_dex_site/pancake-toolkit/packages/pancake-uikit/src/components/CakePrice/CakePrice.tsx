import React from "react";
import styled from "styled-components";
import { PancakeRoundIcon, PancakeRoundNewIcon } from "../Svg";
import Text from "../Text/Text";
import Skeleton from "../Skeleton/Skeleton";
import { Colors } from "../../theme";

export interface Props {
  color?: keyof Colors;
  cakePriceUsd?: number;
}

const PriceLink = styled.a`
  display: flex;
  align-items: center;
  svg {
    transition: transform 0.3s;
  }
  :hover {
    svg {
      transform: scale(1.2);
    }
  }
`;

const CakePrice: React.FC<Props> = ({ cakePriceUsd, color = "textSubtle" }) => {
  return cakePriceUsd ? (
    <PriceLink
      href="https://pancakeswap.finance/swap?outputCurrency=0xb15f39d979208F05474CF4B8f66Fd46f6f4A77f3"
      target="_blank"
    >
      <PancakeRoundNewIcon width="24px" mr="8px" />
      <Text color={color} bold>{`$${cakePriceUsd.toFixed(13)}`}</Text>
    </PriceLink>
  ) : (
    <Skeleton width={80} height={24} />
  );
};

export default React.memo(CakePrice);
