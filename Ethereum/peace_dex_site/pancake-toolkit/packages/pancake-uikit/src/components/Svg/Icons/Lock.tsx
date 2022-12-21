import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 330 330" width="10px" {...props}>
      <path
        d="M65,330h200c8.284,0,15-6.716,15-15V145c0-8.284-6.716-15-15-15h-15V85c0-46.869-38.131-85-85-85 S80.001,38.131,80.001,85v45H65c-8.284,0-15,6.716-15,15v170C50,323.284,56.716,330,65,330z M110.001,85 c0-30.327,24.673-55,54.999-55c30.327,0,55,24.673,55,55v45H110.001V85z"
      />
    </Svg>
  );
};

export default Icon;
