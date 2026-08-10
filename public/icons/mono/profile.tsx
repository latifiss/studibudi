import * as React from "react"
import { SVGProps } from "react"

interface ProfileIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  primaryColor?: string
  secondaryColor?: string
  strokeWidth?: number
}

const ProfileIcon = ({
  size = 24,
  primaryColor = "#000",
  secondaryColor = "#000",
  strokeWidth = 1,
  style,
  ...props
}: ProfileIconProps) => {
  const pixelSize = typeof size === 'number' ? size : parseInt(size, 10) || 24
  
  const scale = pixelSize / 24
  const aspectRatio = 1 
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={pixelSize}
      height={pixelSize * aspectRatio}
      fill="none"
      viewBox="0 0 24 24"
      style={{
        flexShrink: 0,
        ...style,
      }}
      {...props}
    >
      <path
        stroke={primaryColor}
        strokeLinecap="round"
        strokeWidth={strokeWidth * scale}
        d="M21.14 1.492c-3.71-.727-15.3-.581-18.64 0m20.032.727c.206 6.229.564 17.325.444 20.78M22 23c-1.413-1.419-14.555-1.773-17.38-1.773-2.825 0-3.55.454-3.178-1.419C1.75 18.27 1.526 8.281 1 1.88"
      />
      <path
        stroke={secondaryColor}
        strokeLinecap="round"
        strokeWidth={strokeWidth * scale}
        d="M11.303 13.402c-.324.043-.658.04-.989-.008-1.279-.184-2.504-1.03-2.881-2.358-.603-2.116.633-3.81 1.223-4.477 1.503-1.7 5.45-2.425 6.951 0 .184.295.33.638.431 1.031.081.315.134.661.152 1.042.204 4.147-4.685 4.742-4.887 4.77Zm4.735-5.812c.366.922.557 2.339-.084 3.546-.61 1.147-1.971 2.104-4.65 2.266m4.65-2.266c.142-.19.255-.382.345-.578.708-1.554-.12-3.268-.692-4m-5.293 6.836c1.691.268 5.255.077 5.985-2.836m3.883 8.415.363.663c.323.588.516 1.245.438 1.877-.054.428-.474.672-.905.672.51-1.21.414-2.391.104-3.212Zm0 0c-.788-1.437-2.398-2.345-4.16-2.345H7.82c-1.761 0-3.372.908-4.16 2.345l-.178.325c-.304.556-.482 1.167-.482 1.77"
      />
    </svg>
  )
}

export default ProfileIcon