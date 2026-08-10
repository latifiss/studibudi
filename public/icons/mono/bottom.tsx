import * as React from "react"
import { SVGProps } from "react"

interface BottomIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
  strokeWidth?: number
}

const BottomIcon = ({
  size = 74,
  color = "#000",
  strokeWidth = 2.708,
  style,
  ...props
}: BottomIconProps) => {
  const pixelSize = typeof size === 'number' ? size : parseInt(size, 10) || 74
  
  const scale = pixelSize / 74
  const aspectRatio = 1 
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={pixelSize}
      height={pixelSize * aspectRatio}
      fill="none"
      viewBox="0 0 74 74"
      style={{
        flexShrink: 0,
        ...style,
      }}
      {...props}
    >
      <path
        stroke={color}
        strokeLinecap="round"
        strokeWidth={strokeWidth * scale}
        d="M25.52 41.413c.555-.07 1.106-.135 1.641-.194 1.54-.172 2.66-1.571 2.439-3.104-1.337-9.308-2.346-12.015-8.107-14.076-1.12-.4-2.18-.572-3.18-.56m8.848 17.74c.313-5.168-1.02-15.95-8.848-17.74m7.207 17.934c-5.494.693-11.55 1.88-9.646 3.307 3.077 2.306 22.626 24.167 26.334 20.94 3.71-3.225 26.775-26.78 21.165-27.38-3.522-.378-8.865-.212-12.529.003-1.438.084-2.714-.941-2.908-2.37l-2.058-15.179C44.592 11.248 32.772 1.91 16.731 11.81c-9.966 6.152-10.078 16.114-7.54 16.992.328.114.653-.108.864-.381 1.206-1.563 2.667-2.997 4.383-3.913 1.173-.626 2.465-1.01 3.875-1.028m7.207 17.933c.451-5.297-1.133-16.094-11.082-16.905"
      />
    </svg>
  )
}

export default BottomIcon