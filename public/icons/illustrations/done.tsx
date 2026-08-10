import * as React from "react"
import { SVGProps } from "react"

interface DoneIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  backgroundColor?: string
  progressColor?: string
  progressOpacity?: number
}

const DoneIcon = ({
  size = 298,
  style,
  backgroundColor = "#E5E5E5",
  progressColor = "#FFC800",
  progressOpacity = 0.2,
  ...props
}: DoneIconProps) => {
  const pixelSize = typeof size === 'number' ? size : parseInt(size, 10) || 298
  
  const scale = pixelSize / 298
  const aspectRatio = 75 / 298
  
  const clipId = `doneClip_${backgroundColor}_${progressColor}`.replace(/[^a-zA-Z0-9_]/g, '')
  const maskId1 = `doneMask1_${backgroundColor}_${progressColor}`.replace(/[^a-zA-Z0-9_]/g, '')
  const maskId2 = `doneMask2_${backgroundColor}_${progressColor}`.replace(/[^a-zA-Z0-9_]/g, '')
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={pixelSize}
      height={pixelSize * aspectRatio}
      fill="none"
      viewBox="0 0 298 75"
      style={{
        flexShrink: 0,
        ...style,
      }}
      {...props}
    >
      <rect width={260} height={20} y={27} fill={backgroundColor} rx={10 * scale} />
      <rect width={260} height={20} y={27} fill={progressColor} rx={10 * scale} />
      <rect
        width={240}
        height={6}
        x={10}
        y={32}
        fill="#fff"
        fillOpacity={progressOpacity}
        rx={3 * scale}
      />
      <g clipPath={`url(#${clipId})`}>
        <mask
          id={maskId1}
          width={75}
          height={75}
          x={223}
          y={0}
          maskUnits="userSpaceOnUse"
          style={{
            maskType: "luminance",
          }}
        >
          <path fill="#fff" d="M297.18.005h-73.36v74.99h73.36V.005Z" />
        </mask>
        <g mask={`url(#${maskId1})`}>
          <mask
            id={maskId2}
            width={649}
            height={787}
            x={-166}
            y={-313}
            maskUnits="userSpaceOnUse"
            style={{
              maskType: "luminance",
            }}
          >
            <path
              fill="#fff"
              d="M482.036 304.661 135.059 473.892l-300.857-616.849L181.18-312.188l300.856 616.849Z"
            />
          </mask>
          <g mask={`url(#${maskId2})`}>
            <path
              fill={progressColor}
              d="M261.325 15.924a2.272 2.272 0 1 1-1.991-4.083 2.272 2.272 0 0 1 1.991 4.083Z"
              opacity={0.042}
            />
          </g>
        </g>
      </g>
      <defs>
        <clipPath id={clipId}>
          <path fill="#fff" d="M223.82 0h73.359v75H223.82z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default DoneIcon