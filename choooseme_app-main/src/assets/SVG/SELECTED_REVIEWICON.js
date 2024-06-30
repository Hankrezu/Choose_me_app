import * as React from "react"
import Svg, { G, Circle, Path, Defs } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SELECTED_REVIEWICON = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={43}
    height={43}
    fill="none"
    {...props}
  >
    <G filter="url(#a)">
      <Circle cx={21.5} cy={17.5} r={17.5} fill="#FAE1BD" />
      <G filter="url(#b)">
        <Path
          fill="#FFBE98"
          d="M21.974 6.423a.5.5 0 0 0-.948 0l-2.195 6.585a2 2 0 0 1-1.898 1.367h-6.508a.5.5 0 0 0-.312.89l5.61 4.489a2 2 0 0 1 .649 2.194l-2.15 6.446c-.157.473.399.86.788.548l5.24-4.192a2 2 0 0 1 2.5 0l5.24 4.192c.39.312.945-.076.787-.548l-2.149-6.446a2 2 0 0 1 .648-2.194l5.611-4.489a.5.5 0 0 0-.312-.89h-6.509a2 2 0 0 1-1.897-1.367l-2.195-6.585Z"
        />
      </G>
    </G>
    <Defs></Defs>
  </Svg>
)
export default SELECTED_REVIEWICON
