import * as React from "react"
import { SVGProps } from "react"

interface AnswerIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  primaryColor?: string
  secondaryColor?: string
  bulbColor?: string
  glowColor?: string
  lightColor?: string
  fillColor1?: string
  fillColor2?: string
  strokeColor?: string
}

const AnswerIcon = ({
  size = 192,
  style,
  primaryColor = "#000",
  secondaryColor = "#000",
  bulbColor = "#FADF73",
  glowColor = "#FFD500",
  lightColor = "#FC9900",
  fillColor1 = "#EFFCFF",
  fillColor2 = "#A5F2FF",
  strokeColor = "#fff",
  ...props
}: AnswerIconProps) => {
  const pixelSize = typeof size === 'number' ? size : parseInt(size, 10) || 192
  
  const scale = pixelSize / 192
  const aspectRatio = 200 / 192
  
  const bulbGradientId = `answerBulbGrad_${bulbColor}_${glowColor}_${lightColor}`.replace(/[^a-zA-Z0-9_]/g, '')
  const lightGradientId = `answerLightGrad_${fillColor1}_${fillColor2}`.replace(/[^a-zA-Z0-9_]/g, '')
  const clipId = `answerClip_${primaryColor}_${secondaryColor}`.replace(/[^a-zA-Z0-9_]/g, '')
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={pixelSize}
      height={pixelSize * aspectRatio}
      fill="none"
      viewBox="0 0 192 200"
      style={{
        flexShrink: 0,
        ...style,
      }}
      {...props}
    >
      <path
        stroke={primaryColor}
        strokeLinecap="round"
        strokeWidth={7.989 * scale}
        d="M61.96 61.46c3.28-3.614 6.668-16.374-.944-22.898-1.311-1.137-2.964-2.082-5.008-2.758C42.205 31.233 33.4 46.764 41.702 52.11m19.1-14.115c1.177-7.003 11.213-14.318 23.312-8.245 13 8.324 6.468 20.564.54 24.835m.008-25.436c2.466-5.521 11.766-16.168 24.036-11.791 16.478 8.143 6.992 24.184.096 26.237m-.236-27c3.747-6.132 13.094-12.059 22.223-6.197 9.13 5.864 6.233 21.403-3.044 26.377"
      />
      <path
        stroke={primaryColor}
        strokeLinecap="round"
        strokeWidth={7.989 * scale}
        d="M49.012 183.751c-10.84-41.105-27.294-123.366-8.487-130.848.854-.339 1.786-.56 2.65-.886l71.488-27.02m18.608 8.81 4.699 19.703m-90.253 7.12c-8.083 13.787 4.478 71.918 14.619 110.131 2.205 8.331 12.216 12.697 20.914 9.273l67.195-26.462c6.868-2.707 10.62-9.446 8.939-16.027l-17.649-68.59"
      />
      <g clipPath={`url(#${clipId})`}>
        <path
          fill={secondaryColor}
          stroke={strokeColor}
          strokeWidth={5.49 * scale}
          d="M128.463 171.797c4.025.714 6.665 4.572 5.955 8.574-.71 4.003-4.516 6.717-8.541 6.003-4.025-.714-6.665-4.571-5.955-8.574s4.516-6.717 8.541-6.003Z"
        />
        <path
          fill={`url(#${bulbGradientId})`}
          stroke={strokeColor}
          strokeWidth={4.531 * scale}
          d="M143.393 94.7c8.885 1.577 15.962 6.129 21.116 13.575 5.153 7.445 6.947 15.708 5.36 24.655-1.172 6.609-4.09 12.356-8.726 17.189-3.068 3.198-6.57 5.661-10.498 7.369-1.48.739-2.762 1.849-3.848 3.386v.001c-1.093 1.547-1.816 3.288-2.165 5.252l-.63 3.555-26.971-4.784.018-.103-.23-.041.616-2.371c.044-.172.085-.345.123-.518l.104-.522c.343-1.935.27-3.794-.206-5.601-.476-1.808-1.282-3.292-2.398-4.503l-.075-.082c-2.901-2.764-5.225-6.021-6.97-9.754l-.349-.77c-2.692-6.133-3.454-12.533-2.282-19.142 1.587-8.946 6.114-16.088 13.513-21.307 7.401-5.22 15.612-7.06 24.498-5.483Z"
        />
        <path
          fill={`url(#${lightGradientId})`}
          stroke={strokeColor}
          strokeWidth={5.639 * scale}
          d="m145.435 164.773-1.164 6.56c-1.009 5.691-6.414 9.534-12.115 8.523l-7.503-1.331c-5.7-1.011-9.453-6.478-8.444-12.169l1.164-6.561 28.062 4.978Z"
        />
        <path
          fill="#000"
          fillOpacity={0.2}
          d="m135.868 169.843-11.254-1.996a1.914 1.914 0 0 0-2.212 1.559 1.914 1.914 0 0 0 1.54 2.225l11.255 1.997a1.915 1.915 0 0 0 2.212-1.56 1.915 1.915 0 0 0-1.541-2.225Z"
        />
        <path
          fill={strokeColor}
          fillRule="evenodd"
          d="M131.09 117.77c2.591-1.827 5.44-2.465 8.548-1.914 1.036.184 1.986-.029 2.85-.638.863-.609 1.388-1.436 1.573-2.482a3.72 3.72 0 0 0-.624-2.871c-.601-.869-1.42-1.395-2.456-1.579-5.18-.919-9.929.145-14.247 3.19-4.318 3.046-6.941 7.181-7.868 12.407-.185 1.045.023 2.003.624 2.872.602.869 1.421 1.395 2.457 1.579 1.035.183 1.985-.029 2.849-.638.864-.609 1.388-1.437 1.573-2.482.557-3.135 2.13-5.617 4.721-7.444Z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <radialGradient
          id={bulbGradientId}
          cx={0}
          cy={0}
          r={1}
          gradientTransform={`matrix(20.4133 47.5407 -41.9642 18.4252 129.639 113.884)`}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={bulbColor} />
          <stop offset={0.457} stopColor={glowColor} />
          <stop offset={1} stopColor={lightColor} />
        </radialGradient>
        <radialGradient
          id={lightGradientId}
          cx={0}
          cy={0}
          r={1}
          gradientTransform={`matrix(15.9541 18.1801 -36.1566 32.2851 112.943 158.234)`}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={fillColor1} />
          <stop offset={1} stopColor={fillColor2} />
        </radialGradient>
        <clipPath id={clipId}>
          <path
            fill="#fff"
            d="m104.499 79.452 82.535 14.64L168.248 200l-82.535-14.64z"
          />
        </clipPath>
      </defs>
    </svg>
  )
}

export default AnswerIcon