import * as React from "react"
import { SVGProps } from "react"

interface RewardIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  highlightColor?: string
  goldColor?: string
}

const RewardIcon = ({
  size = 123,
  style,
  primaryColor = "#AA572A",
  secondaryColor = "#8F4720",
  accentColor = "#FFBC00",
  highlightColor = "#FFD300",
  goldColor = "#DA8400",
  ...props
}: RewardIconProps) => {
  const pixelSize = typeof size === 'number' ? size : parseInt(size, 10) || 123
  
  const scale = pixelSize / 123
  const aspectRatio = 1 
  
  const maskId1 = `mask1_${primaryColor}_${accentColor}`.replace(/[^a-zA-Z0-9_]/g, '')
  const maskId2 = `mask2_${primaryColor}_${accentColor}`.replace(/[^a-zA-Z0-9_]/g, '')
  const maskId3 = `mask3_${primaryColor}_${accentColor}`.replace(/[^a-zA-Z0-9_]/g, '')
  const maskId4 = `mask4_${primaryColor}_${accentColor}`.replace(/[^a-zA-Z0-9_]/g, '')
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={pixelSize}
      height={pixelSize * aspectRatio}
      fill="none"
      viewBox="0 0 123 123"
      style={{
        flexShrink: 0,
        ...style,
      }}
      {...props}
    >
      <path fill={primaryColor} d="M117.49 62.306H5.34v60.525h112.15V62.305Z" />
      <path stroke={secondaryColor} strokeWidth={4.195 * scale} d="M98.725 100.578H17.067" />
      <path fill={accentColor} d="M103.249 110.369H17.801v12.462h85.448v-12.462Z" />
      <mask
        id={maskId1}
        width={87}
        height={13}
        x={17}
        y={110}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "alpha",
        }}
      >
        <path fill={accentColor} d="M103.249 110.369H17.801v12.462h85.448v-12.462Z" />
      </mask>
      <g mask={`url(#${maskId1})`}>
        <path
          fill={highlightColor}
          d="m103.926 106.879-39.021-39.02-78.044 78.043 39.022 39.021 78.043-78.044Z"
        />
      </g>
      <path
        fill={primaryColor}
        d="M113.017 7.121H8.032c-3.453 0-6.253 2.794-6.253 6.24v55.165c0 3.446 2.8 6.24 6.253 6.24h104.985c3.452 0 6.252-2.794 6.252-6.24V13.36c0-3.446-2.8-6.24-6.252-6.24Z"
      />
      <path
        fill={secondaryColor}
        d="M17.8 16.02v3.561h85.449v-3.56H17.801ZM17.8 40.944v3.56h85.449v-3.56H17.801Z"
      />
      <path stroke={secondaryColor} strokeWidth={4.195 * scale} d="M98.725 75.657H17.067" />
      <path fill={accentColor} d="M112.649 58.744H5.839v23.143h106.81V58.744Z" />
      <path
        fill={accentColor}
        d="M4.195 0A4.195 4.195 0 0 0 0 4.195v114.44a4.196 4.196 0 0 0 4.195 4.196h16.533a4.196 4.196 0 0 0 4.195-4.196V4.195A4.195 4.195 0 0 0 20.728 0H4.195Z"
      />
      <mask
        id={maskId2}
        width={25}
        height={123}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "alpha",
        }}
      >
        <path
          fill={accentColor}
          d="M4.195 0A4.195 4.195 0 0 0 0 4.195v114.44a4.196 4.196 0 0 0 4.195 4.196h16.533a4.196 4.196 0 0 0 4.195-4.196V4.195A4.195 4.195 0 0 0 20.728 0H4.195Z"
        />
      </mask>
      <g mask={`url(#${maskId2})`}>
        <path
          fill={highlightColor}
          d="m40.054-4.45-74.635 74.635 25.328 25.328 74.635-74.635L40.054-4.45Z"
        />
      </g>
      <mask
        id={maskId3}
        width={25}
        height={123}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "alpha",
        }}
      >
        <path
          fill={accentColor}
          d="M4.195 0A4.195 4.195 0 0 0 0 4.195v114.44a4.196 4.196 0 0 0 4.195 4.196h16.533a4.196 4.196 0 0 0 4.195-4.196V4.195A4.195 4.195 0 0 0 20.728 0H4.195Z"
        />
      </mask>
      <g mask={`url(#${maskId3})`}>
        <path
          fill={highlightColor}
          d="m25.868 100.304-49.93 49.93 14.808 14.809 49.93-49.93-14.808-14.809Z"
        />
      </g>
      <path
        fill={accentColor}
        d="M102.102 0a4.195 4.195 0 0 0-4.195 4.195v114.44a4.196 4.196 0 0 0 4.195 4.196h16.533a4.196 4.196 0 0 0 4.195-4.196V4.195A4.195 4.195 0 0 0 118.635 0h-16.533Z"
      />
      <mask
        id={maskId4}
        width={26}
        height={123}
        x={97}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "alpha",
        }}
      >
        <path
          fill={accentColor}
          d="M102.102 0a4.195 4.195 0 0 0-4.195 4.195v114.44a4.196 4.196 0 0 0 4.195 4.196h16.533a4.196 4.196 0 0 0 4.195-4.196V4.195A4.195 4.195 0 0 0 118.635 0h-16.533Z"
        />
      </mask>
      <g mask={`url(#${maskId4})`}>
        <path
          fill={highlightColor}
          d="M125.194 13.657 56.772 82.08l35.978 35.978 68.422-68.422-35.978-35.978Z"
        />
      </g>
      <path
        fill={accentColor}
        d="M48.699 51.624a4.195 4.195 0 0 0-4.195 4.196v32.553a4.195 4.195 0 0 0 4.195 4.195h25.433a4.195 4.195 0 0 0 4.195-4.195V55.82a4.195 4.195 0 0 0-4.195-4.196H48.7Z"
      />
      <path
        fill={goldColor}
        d="M69.426 67.053c0 4.588-3.587 8.307-8.01 8.307-4.424 0-8.01-3.72-8.01-8.307 0-4.588 3.586-8.307 8.01-8.307 4.424 0 8.01 3.72 8.01 8.307Z"
      />
      <path
        fill={goldColor}
        d="M68.187 81.088c-.723-2.06-1.378-7.178-3.019-8.01-2.533-1.282-5.591-1.678-8.048.549-1.114 1.009-1.716 5.812-2.3 7.476a1.936 1.936 0 0 0 1.827 2.577l9.714-.015a1.936 1.936 0 0 0 1.826-2.577Z"
      />
      <path
        fill="#F8A201"
        d="M16.022 70.316a4.45 4.45 0 1 1-8.901 0 4.45 4.45 0 0 1 8.9 0ZM16.022 109.48a4.45 4.45 0 1 1-8.902-.001 4.45 4.45 0 0 1 8.902.001ZM115.709 109.48a4.45 4.45 0 1 1-8.902-.002 4.45 4.45 0 0 1 8.902.002ZM115.709 70.316a4.45 4.45 0 1 1-8.901-.001 4.45 4.45 0 0 1 8.901 0ZM16.022 31.153a4.45 4.45 0 1 1-8.901 0 4.45 4.45 0 0 1 8.9 0ZM115.709 31.153a4.45 4.45 0 1 1-8.901-.001 4.45 4.45 0 0 1 8.901 0Z"
      />
    </svg>
  )
}

export default RewardIcon