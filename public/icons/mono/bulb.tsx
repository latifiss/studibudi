import * as React from "react"
import { SVGProps } from "react"

interface BulbIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  bulbColor?: string
  glowColor?: string
  lightColor?: string
  strokeColor?: string
}

const BulbIcon = ({
  size = 24,
  style,
  bulbColor = "#FADF73",
  glowColor = "#FFD500",
  lightColor = "#FC9900",
  strokeColor = "#fff",
  ...props
}: BulbIconProps) => {
  const pixelSize = typeof size === 'number' ? size : parseInt(size, 10) || 24
  
  const aspectRatio = 22 / 16
  const scale = pixelSize / 16
  
  const bulbGradientId = `bulbGradient_${bulbColor}_${glowColor}_${lightColor}`.replace(/[^a-zA-Z0-9_]/g, '')
  const lightGradientId = `lightGradient_${bulbColor}_${glowColor}_${lightColor}`.replace(/[^a-zA-Z0-9_]/g, '')
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={pixelSize}
      height={pixelSize * aspectRatio}
      fill="none"
      viewBox="0 0 16 22"
      style={{
        flexShrink: 0,
        ...style,
      }}
      {...props}
    >
      <path
        fill="#000"
        stroke={strokeColor}
        strokeWidth={1.225 * scale}
        d="M7.538 18.025c.912 0 1.642.745 1.642 1.652 0 .907-.73 1.651-1.642 1.651a1.647 1.647 0 0 1-1.643-1.651c0-.907.73-1.652 1.643-1.652Z"
      />
      <path
        fill={`url(#${bulbGradientId})`}
        stroke={strokeColor}
        strokeWidth={1.011 * scale}
        d="M7.812.505c2.014 0 3.747.725 5.169 2.16 1.422 1.435 2.138 3.18 2.138 5.207a7.265 7.265 0 0 1-1.247 4.117 7.206 7.206 0 0 1-2.014 2.023 2.31 2.31 0 0 0-.719.9c-.18.382-.27.792-.27 1.237v.806H4.756v-.023h-.051l.043-.545.006-.118v-.001c.002-.04.002-.08.002-.119 0-.438-.088-.844-.263-1.222a2.321 2.321 0 0 0-.702-.896l-.03-.023a7.21 7.21 0 0 1-2.009-2.019A7.264 7.264 0 0 1 .505 7.872c0-2.027.717-3.772 2.139-5.207C4.066 1.23 5.799.505 7.812.505Z"
      />
      <path
        fill={`url(#${lightGradientId})`}
        stroke={strokeColor}
        strokeWidth={1.258 * scale}
        d="M10.993 15.82v1.487a2.338 2.338 0 0 1-2.33 2.344h-1.7a2.337 2.337 0 0 1-2.33-2.344V15.82h6.36Z"
      />
      <path
        fill="#000"
        fillOpacity={0.2}
        d="M9.088 17.308h-2.55a.427.427 0 0 0-.426.428c0 .237.19.43.425.43h2.55a.427.427 0 0 0 .426-.43.427.427 0 0 0-.425-.428Z"
      />
      <path
        fill={strokeColor}
        fillRule="evenodd"
        d="M6.009 6.053a2.447 2.447 0 0 1 1.803-.754.815.815 0 0 0 .601-.25.83.83 0 0 0 .25-.607.83.83 0 0 0-.25-.607.815.815 0 0 0-.6-.251c-1.175 0-2.176.419-3.006 1.256-.83.837-1.245 1.848-1.245 3.033a.83.83 0 0 0 .249.606.816.816 0 0 0 .6.251.816.816 0 0 0 .602-.251.83.83 0 0 0 .249-.606c0-.711.249-1.318.747-1.82Z"
        clipRule="evenodd"
      />
      <defs>
        <radialGradient
          id={bulbGradientId}
          cx={0}
          cy={0}
          r={1}
          gradientTransform={`matrix(6.33747 9.64916 -8.50149 5.68337 5.538 5.256)`}
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
          gradientTransform={`matrix(4.21359 3.37243 -6.68543 8.50207 3.6 15.65)`}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#EFFCFF" />
          <stop offset={1} stopColor="#A5F2FF" />
        </radialGradient>
      </defs>
    </svg>
  )
}

export default BulbIcon