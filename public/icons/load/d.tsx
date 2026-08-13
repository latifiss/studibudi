import * as React from "react"
import { SVGProps } from "react"

interface DIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
}

const DIcon = ({
  size = 71,
  style,
  ...props
}: DIconProps) => {
  const pixelSize = typeof size === 'number' ? size : parseInt(size, 10) || 71
  const scale = pixelSize / 71
  const aspectRatio = 72 / 71

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={pixelSize}
      height={pixelSize * aspectRatio}
      fill="none"
      viewBox="0 0 71 72"
      style={{
        flexShrink: 0,
        ...style,
      }}
      {...props}
    >
      <path
        fill="#FF627B"
        d="M68.297 6.703v53.625c0 2.98-1.469 4.469-4.406 4.469H6.609c-2.937 0-4.406-1.49-4.406-4.469V6.703l.11-1.061C2.607 3.37 4.04 2.234 6.61 2.234h57.282c2.57 0 4.02 1.136 4.35 3.408l.056 1.061ZM6.609 4.47c-1.211 0-1.909.484-2.093 1.452l-.055.224-.055.558v53.625c0 1.49.735 2.234 2.203 2.234h57.282c1.468 0 2.203-.744 2.203-2.234V6.703l-.055-.782.055.056c-.257-1.006-.992-1.508-2.203-1.508H6.609Z"
      />
      <path
        fill="url(#d-gradient)"
        d="M6.61 4.469h57.28c1.212 0 1.947.502 2.204 1.508l-.055-.056.055.782v53.625c0 1.49-.735 2.234-2.203 2.234H6.609c-1.468 0-2.203-.744-2.203-2.234V6.703l.055-.558.055-.224C4.7 4.953 5.398 4.47 6.61 4.47Z"
      />
      <path
        fill="#F1314F"
        d="M0 60.607V6.703C0 2.234 2.203 0 6.61 0h57.28c4.407 0 6.61 2.234 6.61 6.703v53.904c-.11 4.283-2.313 6.424-6.61 6.424H6.61c-4.297 0-6.5-2.141-6.61-6.424ZM68.297 6.703l-.055-1.061c-.33-2.272-1.781-3.408-4.351-3.408H6.609c-2.57 0-4.002 1.136-4.296 3.408l-.11 1.061v53.625c0 2.98 1.469 4.469 4.406 4.469h57.282c2.937 0 4.406-1.49 4.406-4.469V6.703Z"
      />
      <path
        fill="#871023"
        d="M70.5 60.607v4.19c0 4.469-2.203 6.703-6.61 6.703H6.61C2.202 71.5 0 69.266 0 64.797v-4.19c.11 4.283 2.313 6.424 6.61 6.424h57.28c4.297 0 6.5-2.141 6.61-6.424Z"
      />
      <path
        fill="#fff"
        opacity={0.5}
        d="M20.7 48.082v-32.9h12.6c10.3 0 16.65 5.95 16.65 16.4 0 10.55-6 16.5-15.6 16.5H20.7Zm6-5h7.55c5.9 0 9.75-3.95 9.75-11.5 0-7.5-4.15-11.4-10.45-11.4H26.7v22.9Z"
      />
      <defs>
        <linearGradient
          id="d-gradient"
          x1={-31.835 * scale}
          x2={-31.835 * scale}
          y1={8.993 * scale}
          y2={71.444 * scale}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF627B" />
          <stop offset={1} stopColor="#EE2747" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default DIcon