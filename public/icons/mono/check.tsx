import * as React from "react"
import { SVGProps } from "react"

interface CheckIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
}

const CheckIcon = ({
  size = 24,
  color = "#fff",
  style,
  ...props
}: CheckIconProps) => {
  const pixelSize = typeof size === 'number' ? size : parseInt(size, 10) || 24
  
  const aspectRatio = 11 / 14
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={pixelSize}
      height={pixelSize * aspectRatio}
      fill="none"
      viewBox="0 0 14 11"
      style={{
        flexShrink: 0,
        ...style,
      }}
      {...props}
    >
      <path
        fill={color}
        fillRule="evenodd"
        d="m5.274 6.195-2.39-2.334a1.712 1.712 0 0 0-2.388 0 1.62 1.62 0 0 0 0 2.334L4.08 9.697a1.712 1.712 0 0 0 2.568-.207 1.72 1.72 0 0 0 .213-.177l6.64-6.49a1.63 1.63 0 0 0 .007-2.34 1.717 1.717 0 0 0-2.395.007l-5.84 5.705Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export default CheckIcon