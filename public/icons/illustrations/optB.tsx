import * as React from "react"
import { SVGProps } from "react"

interface OptBIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  primaryColor?: string
  secondaryColor?: string
  accentColor1?: string
  accentColor2?: string
  gradientColors?: [string, string]
}

const OptBIcon = ({
  size = 139,
  style,
  primaryColor = "#000",
  secondaryColor = "#2563EB",
  accentColor1 = "#3AD0FF",
  accentColor2 = "#BF5FD7",
  gradientColors = ["#3AD0FF", "#BF5FD7"],
  ...props
}: OptBIconProps) => {
  const pixelSize = typeof size === 'number' ? size : parseInt(size, 10) || 139
  
  const scale = pixelSize / 139
  const aspectRatio = 134 / 139
  
  const gradientId1 = `optbGrad1_${gradientColors.join('_')}`.replace(/[^a-zA-Z0-9_]/g, '')
  const gradientId2 = `optbGrad2_${gradientColors.join('_')}`.replace(/[^a-zA-Z0-9_]/g, '')
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={pixelSize}
      height={pixelSize * aspectRatio}
      fill="none"
      viewBox="0 0 139 134"
      style={{
        flexShrink: 0,
        ...style,
      }}
      {...props}
    >
      <path
        stroke={primaryColor}
        strokeLinecap="round"
        strokeWidth={4.5 * scale}
        d="M95.132 32.127c-16.697-3.272-68.855-2.617-83.883 0m90.145 3.272c.924 28.028 2.538 77.96 1.995 93.512m-4.39.001c-6.356-6.383-65.495-7.98-78.208-7.98-12.712 0-15.98 2.044-14.301-6.383 1.378-6.922.374-51.87-1.99-80.678"
      />
      <path
        stroke={`url(#${gradientId1})`}
        strokeLinecap="round"
        strokeWidth={4.5 * scale}
        d="M42.188 61.883c10.55-1.438 33.984-3.02 43.313 2.157m-63-2.73c.113.762 1.714 4.007 2.444 2.18.871-2.18 1.7-4.44 5.43-6.578m11.813 22.793c10.55-1.438 33.984-3.02 43.313 2.157m-63-2.73c.113.761 1.714 4.007 2.444 2.18.871-2.18 1.7-4.44 5.43-6.578m11.813 22.793c10.55-1.439 33.984-3.02 43.313 2.157m-59.443 2.2c.178-.024 4.492-.559 4.312-4.284-.207-4.284-5.03-3.725-6.648-1.862-.52.6-1.61 2.12-1.08 4.022.42 1.5 2.024 2.316 3.416 2.124Z"
      />
      <path
        fill={`url(#${gradientId2})`}
        stroke={primaryColor}
        strokeWidth={1.271 * scale}
        d="M114.353 18.424C111.84 19.93 84.695 34.81 70.983 42.31a3.059 3.059 0 0 0-.825.66l-2 2.248a.26.26 0 0 0 .033.377c.234.187 2.265 1.117 2.558 1.182.557.124 1.309.302 2.31.552 1.412.354 2.457.59 3.219.742.945.19 2.768.438 3.703.671.443.111.81.42.994.836l2.248 5.057 2.47 4.941a1.276 1.276 0 0 0 2.39-.303l.506-2.36c.768-3.586 3.87-6.162 7.502-6.661 4.882-.671 10.341-1.965 12.226-4.193 2.796-3.304 7.941-14.083 10.165-19.059l2.148-4.833a4.569 4.569 0 0 0 .393-1.853v-.785a2.67 2.67 0 0 0-.781-1.887c-.321-.32-.719-.566-1.172-.59-1.015-.053-2.738.184-4.717 1.372Z"
      />
      <path
        stroke={secondaryColor}
        strokeLinecap="round"
        strokeWidth={2.685 * scale}
        d="M87.21 50.07c5.165-5.076 18.258-17.84 29.305-28.294M82.671 45.444l14.24-10.934"
      />
      <path
        stroke={secondaryColor}
        strokeLinecap="round"
        strokeWidth={2.685 * scale}
        d="m69.117 43.688 47.952-26.454c2.465-1.36 5.206 1.429 3.894 3.962l-14.54 28.095c-.133.258-.295.5-.541.648-1.47.885-5.325 1.01-9.368.83m-28.596-4.81c2.193.82 6.74 2.183 10.405 2.335 1.45.06 2.865.94 3.338 2.354 1.159 3.468 2.797 7.8 4.21 10.067.737 1.18 1.734.54 1.752-.848.005-.34.008-.702.01-1.082m-.235 2.062 9.116-10.078m0 0a96.688 96.688 0 0 1-3.165-.197m-5.717 8.212 7.275-8.017-1.558-.195m-5.717 8.212c.002-.52.001-1.077-.004-1.663m5.721-6.549-5.721 6.55m-.076-4.099c.142-1.46 1.305-2.604 2.73-2.692.154-.01.311-.007.47.01a115.47 115.47 0 0 0 2.597.231m-5.797 2.451c-.013.139-.017.28-.012.424a121.697 121.697 0 0 1 .088 3.674m-.032-1.907 4.021-4.79m-1.334-.093-2.73 2.692"
      />
      <defs>
        <linearGradient
          id={gradientId1}
          x1={54.001 * scale}
          x2={54.001 * scale}
          y1={56.912 * scale}
          y2={101.912 * scale}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={gradientColors[0]} />
          <stop offset={1} stopColor={gradientColors[1]} />
        </linearGradient>
        <linearGradient
          id={gradientId2}
          x1={94.5 * scale}
          x2={94.5 * scale}
          y1={17.046 * scale}
          y2={60.988 * scale}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={gradientColors[0]} />
          <stop offset={1} stopColor={gradientColors[1]} />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default OptBIcon