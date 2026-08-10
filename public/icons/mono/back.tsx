import * as React from "react"
import { SVGProps } from "react"

interface BackIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
}

const BackIcon = ({
  size = 24,
  color = "#000",
  style,
  ...props
}: BackIconProps) => {
  const pixelSize = typeof size === 'number' ? size : parseInt(size, 10) || 24
  
  const scale = pixelSize / 23
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={pixelSize}
      height={pixelSize}
      fill="none"
      viewBox="0 0 23 23"
      style={{
        flexShrink: 0,
        ...style,
      }}
      {...props}
    >
      <path
        stroke={color}
        strokeLinecap="round"
        strokeWidth={1.045 * scale}
        d="M21.632 2.37c-.367-1.185-1.155-1.92-2.51-1.842-3.569.206-9.435.418-13.884.256C2.748.693.395 3.165.528 5.974c.16 3.363.274 7.595.086 10.95-.119 2.13.947 4.275 2.806 4.67 7.609 1.613 18.465.65 18.465-5.013V4.321c0-.725-.079-1.388-.253-1.95Zm0 0c2.005 1.48 2.027 10.09 1.787 14.211-2.146 8.007-11.076 7.638-17.146 5.965a27.327 27.327 0 0 1-2.853-.953M21.632 2.371c.596 1.823 1.598 7.218.845 14.21-.753 6.993-11.117 6.89-16.204 5.965m3.601-13.66c-.686.645-2.418 2.088-4.074 2.924-.068.034-.066.187.003.22 1.05.492 3.01 2.006 4.071 3.129m-3.66-3.171c2.532.098 7.9.035 9.99-1.011"
      />
    </svg>
  )
}

export default BackIcon