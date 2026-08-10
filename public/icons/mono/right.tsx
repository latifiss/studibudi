import * as React from "react"
import { SVGProps } from "react"

interface RightIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
  strokeWidth?: number
}

const RightIcon = ({
  size = 77,
  color = "#000",
  strokeWidth = 2.708,
  style,
  ...props
}: RightIconProps) => {
  const pixelSize = typeof size === 'number' ? size : parseInt(size, 10) || 77
  
  const scale = pixelSize / 77
  const aspectRatio = 1 
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={pixelSize}
      height={pixelSize * aspectRatio}
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
        strokeWidth={strokeWidth * scale}
        d="M44.015 49.107c-.108-.55-.211-1.094-.308-1.625-.278-1.523-1.752-2.543-3.266-2.217-9.192 1.98-11.822 3.175-13.478 9.065-.322 1.145-.42 2.214-.338 3.211m17.082-10.059c-5.176.048-15.84 2.126-17.082 10.06m17.39-8.435c1.072 5.432 2.678 11.39 3.969 9.392 2.087-3.23 22.537-24.25 19.06-27.726C63.57 27.298 38.47 5.924 38.26 11.563c-.132 3.54.405 8.857.874 12.498.184 1.428-.75 2.773-2.161 3.065l-15 3.108c-9.374 1.942-17.868 14.382-6.878 29.696 6.83 9.515 16.775 8.935 17.475 6.342.09-.335-.153-.644-.44-.836-1.643-1.094-3.175-2.452-4.208-4.1-.707-1.127-1.18-2.389-1.296-3.795m17.39-8.434c-5.315-.083-15.976 2.248-16.094 12.23"
      />
    </svg>
  )
}

export default RightIcon