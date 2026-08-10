import * as React from "react"
import { SVGProps } from "react"

interface CloseIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
}

const CloseIcon = ({
  size = 24,
  color = "#000",
  style,
  ...props
}: CloseIconProps) => {
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
        strokeWidth={1.5 * scale}
        d="M20.692 2.268C20.34 1.134 19.586.43 18.292.505 14.876.702 9.265.905 5.01.75 2.63.663.378 3.028.505 5.715c.152 3.216.262 7.264.082 10.473-.113 2.038.906 4.09 2.684 4.467 7.278 1.543 17.663.622 17.663-4.794V4.134c0-.694-.076-1.329-.242-1.866Zm0 0C22.61 3.682 22.63 11.919 22.4 15.86c-2.052 7.658-10.594 7.305-16.4 5.705a26.16 26.16 0 0 1-2.73-.911M20.693 2.268c.57 1.744 1.528 6.904.808 13.593-.72 6.688-10.633 6.59-15.5 5.705M6.5 6.5c2.444 1.09 5.643 3.872 4.887 4.364-1.955 1.272-3.42 3.09-4.887 3.636m10-8c-2.444 1.09-5.643 3.872-4.887 4.364 1.955 1.272 3.42 3.09 4.887 3.636"
      />
    </svg>
  )
}

export default CloseIcon