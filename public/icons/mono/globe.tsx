import * as React from "react"
import { SVGProps } from "react"

interface GlobeIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
  strokeWidth?: number
}

const GlobeIcon = ({
  size = 20,
  color = "#333",
  strokeWidth = 2,
  style,
  ...props
}: GlobeIconProps) => {
  const pixelSize = typeof size === 'number' ? size : parseInt(size, 10) || 20
  
  const scale = pixelSize / 20
  const aspectRatio = 1 
  
  const clipId = `globeClip_${color}`.replace(/[^a-zA-Z0-9_]/g, '')
  const maskId = `globeMask_${color}`.replace(/[^a-zA-Z0-9_]/g, '')
  
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
      <g clipPath={`url(#${clipId})`}>
        <mask
          id={maskId}
          width={20}
          height={20}
          x={0}
          y={0}
          maskUnits="userSpaceOnUse"
          style={{
            maskType: "luminance",
          }}
        >
          <path fill="#fff" d="M20 0H0v20h20V0Z" />
        </mask>
        <g mask={`url(#${maskId})`}>
          <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth * scale}
            d="M1.667 10h16.667M1.667 10A8.333 8.333 0 0 0 10 18.333M1.667 10A8.333 8.333 0 0 1 10 1.667M18.334 10A8.334 8.334 0 0 1 10 18.333M18.334 10A8.333 8.333 0 0 0 10 1.667m0 16.666A12.75 12.75 0 0 0 13.333 10 12.75 12.75 0 0 0 10 1.667m0 16.666A12.75 12.75 0 0 1 6.667 10 12.75 12.75 0 0 1 10 1.667"
          />
        </g>
      </g>
      <defs>
        <clipPath id={clipId}>
          <path fill="#fff" d="M0 0h20v20H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default GlobeIcon