import * as React from "react"
import { SVGProps } from "react"

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
}

const Icon = ({
  size = 35,
  color = "#000",
  style,
  ...props
}: IconProps) => {
  const pixelSize = typeof size === 'number' ? size : parseInt(size, 10) || 35
  
  const scale = pixelSize / 35
  const aspectRatio = 1 
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={pixelSize}
      height={pixelSize * aspectRatio}
      fill="none"
      viewBox="0 0 35 35"
      style={{
        flexShrink: 0,
        ...style,
      }}
      {...props}
    >
      <path
        stroke={color}
        strokeLinecap="round"
        strokeWidth={1.458 * scale}
        d="M11.546 16.378c2.376-.669 7.576-2.406 9.363-4.01m-8.3 7.505c2.219-.334 7.423-2.35 9.47-3.084m-8.83 6.887c2.502-.367 7.838-1.56 9.15-3.392m-7.98 7.299c1.252-.163 7.144-2.102 8.753-3.34"
      />
      <path
        stroke={color}
        strokeLinecap="round"
        strokeWidth={2.3 * scale}
        d="M8.752 33.542C6.897 26.038 4.082 11.022 7.3 9.657c.146-.062.305-.102.453-.162l12.234-4.932m3.184 1.608.804 3.597m-15.445 1.3c-1.383 2.516.767 13.127 2.502 20.103.377 1.52 2.09 2.317 3.58 1.692l11.498-4.83c1.176-.494 1.818-1.724 1.53-2.926l-3.02-12.52M10.968 11.22c.56-.66 1.14-2.989-.162-4.18a2.439 2.439 0 0 0-.857-.503c-2.362-.835-3.869 2-2.448 2.976m3.269-2.577c.201-1.278 1.918-2.613 3.989-1.505 2.225 1.52 1.107 3.754.092 4.534m.002-4.643c.422-1.008 2.013-2.952 4.113-2.153 2.82 1.487 1.197 4.415.016 4.79m-.04-4.929c.641-1.12 2.24-2.201 3.803-1.131 1.563 1.07 1.067 3.907-.52 4.815"
      />
    </svg>
  )
}

export default Icon