import * as React from "react"
import { SVGProps } from "react"

interface DownIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
  strokeWidth?: number
}

const DownIcon = ({
  size = 12,
  color = "#333",
  strokeWidth = 2,
  style,
  ...props
}: DownIconProps) => {
  const pixelSize = typeof size === 'number' ? size : parseInt(size, 10) || 12
  
  const scale = pixelSize / 12
  const aspectRatio = 1 
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={pixelSize}
      height={pixelSize * aspectRatio}
      fill="none"
      viewBox="0 0 12 12"
      style={{
        flexShrink: 0,
        ...style,
      }}
      {...props}
    >
      <path
        stroke={color}
        strokeLinecap="square"
        strokeWidth={strokeWidth * scale}
        d="m2 5 4 4 4-4"
      />
    </svg>
  )
}

export default DownIcon