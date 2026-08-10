import * as React from "react"
import { SVGProps } from "react"

interface ChatIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
  strokeWidth?: number
}

const ChatIcon = ({
  size = 20,
  color = "#333",
  strokeWidth = 1.5,
  style,
  ...props
}: ChatIconProps) => {
  const pixelSize = typeof size === 'number' ? size : parseInt(size, 10) || 20
  
  const scale = pixelSize / 20
  const aspectRatio = 1 
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={pixelSize}
      height={pixelSize * aspectRatio}
      fill="none"
      viewBox="0 0 20 20"
      style={{
        flexShrink: 0,
        ...style,
      }}
      {...props}
    >
      <path
        stroke={color}
        strokeLinecap="round"
        strokeWidth={0.833 * scale}
        d="M6.667 1.667h1.25"
      />
      <path
        stroke={color}
        strokeLinecap="round"
        strokeWidth={strokeWidth * scale}
        d="M9.583 1.667h6.25c1.841 0 3.333 1.408 3.333 3.145v7.076c0 1.737-1.492 3.145-3.333 3.145h-5.182c-.945 0-1.846.378-2.478 1.04l-2.03 2.13c-.256.267-.727.097-.727-.264v-2.12c0-.434-.373-.786-.833-.786h-.417c-1.84 0-3.333-1.408-3.333-3.145V4.812c0-1.737 1.492-3.145 3.333-3.145H5"
      />
    </svg>
  )
}

export default ChatIcon