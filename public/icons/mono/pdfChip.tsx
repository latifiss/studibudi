import * as React from "react"
import { SVGProps } from "react"

interface PdfChipIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  strokeColor?: string
  pdfIconColor?: string
  chipColor?: string
}

const PdfChipIcon = ({
  size = 89,
  style,
  strokeColor = "#E5E5E5",
  pdfIconColor = "#FE1212",
  chipColor = "#DC2626",
  ...props
}: PdfChipIconProps) => {
  const pixelSize = typeof size === 'number' ? size : parseInt(size, 10) || 89
  
  const scale = pixelSize / 89
  const aspectRatio = 1 
  
  const gradientId = `pdfChipGradient_${pdfIconColor}_${chipColor}`.replace(/[^a-zA-Z0-9_]/g, '')
  const maskId = `pdfChipMask_${pdfIconColor}_${chipColor}`.replace(/[^a-zA-Z0-9_]/g, '')
  const filterId = `pdfChipFilter_${pdfIconColor}_${chipColor}`.replace(/[^a-zA-Z0-9_]/g, '')
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={pixelSize}
      height={pixelSize * aspectRatio}
      fill="none"
      viewBox="0 0 89 89"
      style={{
        flexShrink: 0,
        ...style,
      }}
      {...props}
    >
      <rect
        width={82.68}
        height={82.68}
        x={2.953}
        y={2.953}
        stroke={strokeColor}
        strokeWidth={5.906 * scale}
        rx={20.67 * scale}
      />
      <path
        fill={pdfIconColor}
        d="m29.448 26.49 3.578-9.54 16.298 4.373 26.235 3.975-4.373 11.925-12.322 29.813-9.54-1.59-31.8-7.553-3.976-3.975 15.9-27.428Z"
      />
      <path
        stroke="#000"
        strokeLinecap="round"
        strokeWidth={2.621 * scale}
        d="M13.571 54.088c8.046-8.916 15.811-27.466 19-36.507a.748.748 0 0 1 .917-.466c10.57 2.97 32.594 8.482 41.481 8.221m-.93 3.303c-3.296 10.02-10.662 31.356-14.3 38.248a.718.718 0 0 1-.756.37c-10.175-1.52-31.883-5.385-41.379-9.325"
      />
      <g filter={`url(#${filterId})`}>
        <mask
          id={maskId}
          width={36}
          height={27}
          x={15}
          y={25}
          maskUnits="userSpaceOnUse"
          style={{
            maskType: "luminance",
          }}
        >
          <path
            fill="#fff"
            d="m48.61 32.693-26.167-6.986a2.41 2.41 0 0 0-2.95 1.707l-3.883 14.55a2.41 2.41 0 0 0 1.706 2.95l26.167 6.985a2.41 2.41 0 0 0 2.95-1.706l3.884-14.551a2.41 2.41 0 0 0-1.707-2.95Z"
          />
        </mask>
        <g mask={`url(#${maskId})`}>
          <path
            fill="#fff"
            d="m48.61 32.693-26.167-6.986a2.41 2.41 0 0 0-2.95 1.707l-3.883 14.55a2.41 2.41 0 0 0 1.706 2.95l26.167 6.985a2.41 2.41 0 0 0 2.95-1.706l3.884-14.551a2.41 2.41 0 0 0-1.707-2.95Z"
          />
          <path
            fill={chipColor}
            d="m21.825 39.572 2.098-7.598 2.998.828c.58.156 1.042.404 1.384.734.349.334.574.72.68 1.165.108.444.091.924-.043 1.426-.145.505-.372.925-.702 1.249-.325.326-.74.55-1.19.642-.477.1-1.003.069-1.58-.094l-1.913-.527.357-1.288 1.647.457c.313.084.576.109.81.048.232-.053.427-.16.576-.317.157-.171.267-.374.34-.63.065-.252.075-.487.028-.697a1.031 1.031 0 0 0-.338-.568 1.717 1.717 0 0 0-.723-.369l-1.092-.304-1.729 6.288-1.608-.445Zm9.636 2.66-2.696-.74 2.1-7.604 2.71.746c.77.205 1.381.545 1.855 1.004.466.454.77 1.005.909 1.651.146.65.108 1.369-.111 2.166-.212.782-.556 1.42-1.014 1.91a3.197 3.197 0 0 1-1.634.963c-.643.15-1.347.12-2.12-.097Zm-.707-1.685 1.014.283c.484.135.896.162 1.273.084.377-.08.69-.279.952-.592.27-.31.479-.747.63-1.32.148-.466.194-.959.134-1.444a1.67 1.67 0 0 0-.514-.984 2.68 2.68 0 0 0-1.127-.588l-1.025-.28-1.337 4.841Zm5.782 3.085 2.101-7.605 5.03 1.387-.368 1.326-3.422-.94-.502 1.81 3.094.849-.368 1.327-3.09-.856-.867 3.148-1.608-.446Z"
          />
        </g>
        <path
          stroke="#000"
          strokeOpacity={0.1}
          strokeWidth={0.398 * scale}
          d="m48.55 32.883-26.167-6.985a2.21 2.21 0 0 0-2.706 1.565l-3.884 14.551a2.21 2.21 0 0 0 1.566 2.706l26.166 6.986a2.21 2.21 0 0 0 2.706-1.566l3.885-14.551a2.21 2.21 0 0 0-1.566-2.706Z"
        />
      </g>
      <defs>
        <filter
          id={filterId}
          width={47.6 * scale}
          height={39.078 * scale}
          x={9.159 * scale}
          y={24.034 * scale}
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy={4.77 * scale} />
          <feGaussianBlur stdDeviation={3.18 * scale} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_97_1966" />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_97_1966"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  )
}

export default PdfChipIcon