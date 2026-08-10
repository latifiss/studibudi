import * as React from "react"
import { SVGProps } from "react"

interface OcIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  primaryColor?: string
}

const OcIcon = ({
  size = 62,
  style,
  primaryColor = "#000",
  ...props
}: OcIconProps) => {
  const pixelSize = typeof size === 'number' ? size : parseInt(size, 10) || 62
  
  const scale = pixelSize / 62
  const aspectRatio = 120 / 62
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={pixelSize}
      height={pixelSize * aspectRatio}
      fill="none"
      viewBox="0 0 62 120"
      style={{
        flexShrink: 0,
        ...style,
      }}
      {...props}
    >
      <path
        stroke={primaryColor}
        strokeLinecap="round"
        strokeWidth={0.655 * scale}
        d="M28.712 48.896v9.156M35.606 49.973v8.725M19.482 89.624c-2.276.284-7.605 1.329-8.773 3.455-.35.638-.756 2.19.42 3.295 1.177 1.105 3.328.815 4.256.531l5.41-2.179"
      />
      <path
        fill={primaryColor}
        d="M50.504 73.581c-4.248.137-23.008 9.22-31.858 13.744-.753 4.985 2.427 8.565 4.11 9.731 8.822-2.56 26.926-7.75 28.776-8.024 1.85-.273 3.682-1.593 4.367-2.22 4.796-5.6 1.256-10.357-1.113-12.036-1.687-1.195-3.143-1.231-4.282-1.195Z"
      />
      <path
        fill={primaryColor}
        d="M10.716 72.31c3.01.201 16.138 5.29 22.359 7.956l-14.227 7.11c-6.367 1.867-10.278 1.251-11.472.849C.48 84.903 3.182 76.708 5.922 73.672c1.765-1.502 3.715-1.433 4.794-1.361Z"
      />
      <path
        stroke={primaryColor}
        strokeLinecap="round"
        strokeWidth={0.655 * scale}
        d="M44.212 90.593c1.88.903 2.898 2.088 3.414 3.059 1.105 2.53-.88 4.05-3.145 3.335-1.252-.395-1.547-.66-2.21-1.21-.337-.28-1.908-1.74-3.702-3.464"
      />
      <path
        fill={primaryColor}
        d="m8.218 49.721 1.204 21.876a3.277 3.277 0 0 0 3.272 3.097h36.009a3.277 3.277 0 0 0 3.277-3.277V49.039a3.277 3.277 0 0 0-3.321-3.277l-37.213.502a3.277 3.277 0 0 0-3.228 3.457Z"
      />
      <rect
        width={42.657}
        height={2.047}
        x={9.322}
        y={75.072}
        fill={primaryColor}
        rx={1.023 * scale}
      />
      <path
        stroke={primaryColor}
        strokeLinecap="round"
        strokeWidth={0.655 * scale}
        d="M35.714 34.353c3.753-.053 12.011 2.801 15.297 11.796M27.474 34.3c-8.564 1.67-12.658 5.333-15.89 12.388M56.127 42.82l2.1-3.502M58.227 43.788l2.855-2.37M58.66 45.404c.556.216 1.82.42 2.423-.484M3.56 42.164l-3.232-3.34M6.846 41.624l-1.94-5.009M2.752 44.049l-2.424-.916M53.165 52.191c1.993 3.124 4.255 6.84 0 13.833"
      />
      <path
        fill={primaryColor}
        d="M35.768 34.623c.485-1.4.043-2.343-.388-2.523-2.585 2.37-6.506 1.49-7.96.054-.517.474-.216 1.876 0 2.307 2.8 3.102 6.786 1.365 8.348.162Z"
      />
      <path
        stroke={primaryColor}
        strokeLinecap="round"
        strokeWidth={0.655 * scale}
        d="m24.297 43.24.217-.333a4.674 4.674 0 0 1 5.664-1.783c1.86.75 3.992.23 5.297-1.294l1.694-1.976M7.437 54.173c-.808 1.904-1.766 6.518.862 9.75"
      />
      <path
        fill={primaryColor}
        d="M43.195 12.605c-1.185 4.255-1.778 4.633-3.501 6.518 0-1.863-.32-4.99-.32-6.293-5.644 0-10.407-2.303-12.082-3.455.06 3.906-3.603 6.46-3.603 6.46s.526 1.578.826 5.108c.24 2.825-.45 2.28-.826 1.653-1.08-3.485-2.851-2.554-3.602-1.652C10.88 5.98 25.04 3.09 27.742 3.364 29.783 1.622 32.63.256 34.63.056c7.217-.722 10.485 5.65 8.564 12.55Z"
      />
      <path
        stroke={primaryColor}
        strokeLinecap="round"
        strokeWidth={0.655 * scale}
        d="M23.816 25.26c.97 5.918 7.476 10.174 12.172 5.38 4.696-4.795 3.756-13.571 3.255-17.667M19.98 20.577c-.592 1.454-.036 4.676 3.835 4.676M21.69 21.376c-.086.311-.018 1.048.942 1.508"
      />
      <path
        stroke={primaryColor}
        strokeLinecap="round"
        strokeWidth={0.655 * scale}
        d="M39.112 24.5c1.264-.527 2.155-2.478 1.812-5.602M32.002 28.055c1.238.323 1.16-.566 2.1-1.347"
      />
      <circle cx={35.7} cy={20.529} r={0.808 * scale} fill={primaryColor} />
      <circle cx={28.591} cy={20.637} r={0.808 * scale} fill={primaryColor} />
      <path
        stroke={primaryColor}
        strokeLinecap="round"
        strokeWidth={0.655 * scale}
        d="M26.831 18.79c.17-.5.904-1.426 2.478-1.126M34.373 17.82c.375-.325 1.396-.78 2.477 0M31.766 20.083c-.126 1.064-.211 3.221.451 3.34"
      />
      <ellipse cx={30.112} cy={116.768} fill={primaryColor} rx={26.661 * scale} ry={3.232 * scale} />
    </svg>
  )
}

export default OcIcon