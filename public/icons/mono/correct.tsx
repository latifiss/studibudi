import * as React from "react"
import { SVGProps } from "react"

interface CorrectIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
}

const CorrectIcon = ({
  size = 24,
  color = "#16A34A",
  style,
  ...props
}: CorrectIconProps) => {
  const pixelSize = typeof size === 'number' ? size : parseInt(size, 10) || 24
  
  const scale = pixelSize / 77
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={pixelSize}
      height={pixelSize}
      fill="none"
      viewBox="0 0 77 77"
      style={{
        flexShrink: 0,
        ...style,
      }}
      {...props}
    >
      <path
        stroke={color}
        strokeLinecap="round"
        strokeWidth={3.333 * scale}
        d="M68.972 7.56c-1.17-3.78-3.684-6.124-8.001-5.875-11.381.656-30.085 1.333-44.27.816-7.938-.29-15.44 7.593-15.017 16.55.507 10.72.872 24.213.274 34.91-.38 6.794 3.02 13.632 8.945 14.888 24.26 5.145 58.877 2.076 58.877-15.98V13.78c0-2.313-.253-4.428-.808-6.22Zm0 0c6.394 4.714 6.461 32.17 5.696 45.31C67.826 78.398 39.353 77.22 20 71.886a87.195 87.195 0 0 1-9.097-3.037m58.069-61.29c1.899 5.814 5.096 23.015 2.695 45.31C69.264 75.166 36.221 74.838 20 71.887"
      />
      <path
        stroke={color}
        strokeLinecap="round"
        strokeWidth={2.222 * scale}
        d="M17.221 39.156c.514 3.802 7.74 19.991 11.036 10.879 3.935-10.879 7.678-22.146 24.52-32.812"
      />
    </svg>
  )
}

export default CorrectIcon