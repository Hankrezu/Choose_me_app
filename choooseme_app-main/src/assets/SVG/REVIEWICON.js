import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"
const REVIEWICON = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={35}
    height={35}
    fill="none"
    {...props}
  >
    <Circle cx={17.5} cy={17.5} r={17.5} fill="#fff" />
    <Path
      fill="#868686"
      d="M17.974 6.423a.5.5 0 0 0-.948 0l-2.195 6.585a2 2 0 0 1-1.897 1.367H6.425a.5.5 0 0 0-.312.89l5.61 4.489a2 2 0 0 1 .648 2.194l-2.148 6.446c-.158.473.397.86.787.548l5.24-4.192a2 2 0 0 1 2.5 0l5.24 4.192c.39.312.945-.076.787-.548l-2.149-6.446a2 2 0 0 1 .648-2.194l5.611-4.489a.5.5 0 0 0-.312-.89h-6.508a2 2 0 0 1-1.898-1.367l-2.195-6.585Z"
    />
  </Svg>
)
export default REVIEWICON
