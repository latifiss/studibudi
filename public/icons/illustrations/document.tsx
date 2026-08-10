import * as React from "react"
import { SVGProps } from "react"

interface DocumentIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  primaryColor?: string
  secondaryColor?: string
  accentColor1?: string
  accentColor2?: string
  accentColor3?: string
  accentColor4?: string
  accentColor5?: string
  accentColor6?: string
  fillColor1?: string
  fillColor2?: string
  fillColor3?: string
  iconColor?: string
}

const DocumentIcon = ({
  size = 200,
  style,
  primaryColor = "#000",
  secondaryColor = "#FE1212",
  accentColor1 = "#FE1212",
  accentColor2 = "#DA3B18",
  accentColor3 = "#FFB423",
  accentColor4 = "#E77331",
  accentColor5 = "#57F430",
  accentColor6 = "#3AD0FF",
  fillColor1 = "#959CB5",
  fillColor2 = "#AFB9D2",
  fillColor3 = "#E4EAF8",
  iconColor = "#FE1212",
  ...props
}: DocumentIconProps) => {
  const pixelSize = typeof size === 'number' ? size : parseInt(size, 10) || 200
  
  const scale = pixelSize / 200
  const aspectRatio = 1 
  
  const gradientIdA = `docGradA_${accentColor1}_${accentColor2}`.replace(/[^a-zA-Z0-9_]/g, '')
  const gradientIdB = `docGradB_${accentColor3}_${accentColor4}`.replace(/[^a-zA-Z0-9_]/g, '')
  const gradientIdC = `docGradC_${accentColor5}_${accentColor6}`.replace(/[^a-zA-Z0-9_]/g, '')
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={pixelSize}
      height={pixelSize * aspectRatio}
      fill="none"
      viewBox="0 0 200 200"
      style={{
        flexShrink: 0,
        ...style,
      }}
      {...props}
    >
      <path
        stroke={primaryColor}
        strokeLinecap="round"
        strokeWidth={8.333 * scale}
        d="M60.103 24.47c-7.192-2.63-22.295-2.367-25.172 19.726-3.596 27.615.002 98.626 0 118.351 0 12.475 3.593 19.726 21.578 23.671 17.98 3.943 109.478 15.731 107.88-15.781-3.6-71.01 17.981-149.913-25.172-145.968m-59.9-12.464c14.912-7.077 45.516-3.756 45.516 8.519 0 15.78 0 19.726-14.384 19.726s-28.768 3.945-32.364-3.945c-3.302-7.245-3.572-17.817-.81-22.552.463-.793 1.213-1.355 2.043-1.748Z"
      />
      <path
        fill={`url(#${gradientIdA})`}
        stroke="#fff"
        strokeWidth={3.907 * scale}
        d="M58.777 63.13c7.343 0 13.296 5.952 13.296 13.295 0 7.342-5.953 13.296-13.296 13.296-7.342 0-13.295-5.954-13.295-13.296 0-7.343 5.953-13.295 13.295-13.295Z"
      />
      <path
        fill={`url(#${gradientIdB})`}
        stroke="#fff"
        strokeWidth={3.907 * scale}
        d="M58.777 99.646c7.343 0 13.296 5.952 13.296 13.295 0 7.342-5.953 13.296-13.296 13.296-7.342-.001-13.295-5.954-13.295-13.296 0-7.343 5.953-13.295 13.295-13.295Z"
      />
      <path
        fill={`url(#${gradientIdC})`}
        stroke="#fff"
        strokeWidth={3.907 * scale}
        d="M58.777 136.162c7.343 0 13.296 5.952 13.296 13.295 0 7.342-5.953 13.296-13.296 13.296-7.342-.001-13.295-5.954-13.295-13.296 0-7.343 5.953-13.295 13.295-13.295Z"
      />
      <path
        stroke={primaryColor}
        strokeLinecap="round"
        strokeWidth={8.333 * scale}
        d="M84.375 83.286c13.956-2.397 44.952-5.034 57.292 3.595M58.333 82.33c.15 1.27 2.268 6.68 3.234 3.635 1.152-3.635 2.249-7.4 7.183-10.964m15.625 37.989c13.956-2.397 44.952-5.034 57.292 3.595m-83.334-4.552c.15 1.271 2.268 6.68 3.234 3.635 1.152-3.635 2.249-7.4 7.183-10.964m15.625 37.989c13.956-2.397 44.952-5.034 57.292 3.595m-78.628 3.667c.236-.041 5.942-.931 5.704-7.14-.273-7.14-6.654-6.208-8.793-3.104-.689.999-2.131 3.534-1.428 6.703.555 2.5 2.676 3.861 4.517 3.541Z"
      />
      <path
        fill={fillColor1}
        stroke="#fff"
        strokeWidth={4.372 * scale}
        d="M181.646 25.084a5.77 5.77 0 0 1 7.935-.41l.221.2v.001l5.926 5.63h-.001a5.77 5.77 0 0 1-5.229 9.813 5.77 5.77 0 0 1-1.197-.411l-5.103 5.374-1.506 1.585-1.585-1.505-5.196-4.935-1.585-1.505 6.552-6.9a5.772 5.772 0 0 1 .767-6.936h.001Z"
      />
      <path
        fill={fillColor2}
        stroke="#fff"
        strokeWidth={4.372 * scale}
        d="M166.753 29.546c18.561 4.133 30.259 22.53 26.126 41.092-4.132 18.56-22.53 30.258-41.091 26.126-18.562-4.133-30.259-22.53-26.126-41.092 4.132-18.56 22.53-30.258 41.091-26.126Z"
      />
      <path
        fill={fillColor3}
        d="M153.82 87.636c13.521 3.01 26.921-5.51 29.931-19.03 3.01-13.52-5.51-26.92-19.03-29.931-13.52-3.01-26.921 5.51-29.931 19.03-3.01 13.52 5.51 26.92 19.03 29.93Z"
      />
      <path
        fill={iconColor}
        d="M158.492 66.653a3.57 3.57 0 0 1-2.244-1.575l-9.515-14.966a3.582 3.582 0 1 1 6.046-3.844l9.515 14.965a3.582 3.582 0 0 1-3.802 5.42Z"
      />
      <path
        fill="#707487"
        d="M162.385 49.167a3.582 3.582 0 0 1-2.718-4.276l.778-3.497a3.582 3.582 0 1 1 6.995 1.557l-.779 3.497a3.582 3.582 0 0 1-4.276 2.72ZM153.82 87.636a3.582 3.582 0 0 1-2.719-4.276l.779-3.498a3.582 3.582 0 1 1 6.995 1.558l-.779 3.497a3.582 3.582 0 0 1-4.276 2.719ZM179.476 71.324l-3.498-.778a3.582 3.582 0 1 1 1.557-6.995l3.498.778a3.582 3.582 0 1 1-1.557 6.995ZM141.006 62.76l-3.497-.779a3.582 3.582 0 1 1 1.557-6.995l3.498.779a3.582 3.582 0 1 1-1.558 6.995Z"
      />
      <defs>
        <linearGradient
          id={gradientIdA}
          x1={58.778 * scale}
          x2={58.778 * scale}
          y1={61.176 * scale}
          y2={91.674 * scale}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={accentColor1} />
          <stop offset={1} stopColor={accentColor2} />
        </linearGradient>
        <linearGradient
          id={gradientIdB}
          x1={58.778 * scale}
          x2={58.778 * scale}
          y1={97.693 * scale}
          y2={128.19 * scale}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={accentColor3} />
          <stop offset={1} stopColor={accentColor4} />
        </linearGradient>
        <linearGradient
          id={gradientIdC}
          x1={58.778 * scale}
          x2={58.778 * scale}
          y1={134.209 * scale}
          y2={164.706 * scale}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={accentColor5} />
          <stop offset={1} stopColor={accentColor6} />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default DocumentIcon