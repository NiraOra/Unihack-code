import * as React from "react"

import { cn } from "@/lib/utils"

const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn("relative", className)} ref={ref} {...props} />
  },
)
ChartContainer.displayName = "ChartContainer"

const Chart = React.forwardRef<SVGSVGElement, React.SVGAttributes<SVGSVGElement>>(({ className, ...props }, ref) => {
  return (
    <svg
      ref={ref}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={cn("overflow-visible", className)}
      {...props}
    />
  )
})
Chart.displayName = "Chart"

interface ChartBarsProps {
  children: React.ReactNode
}

const ChartBars = React.forwardRef<HTMLDivElement, ChartBarsProps>(({ className, children, ...props }, ref) => {
  return (
    <g className={cn("h-full w-full", className)} ref={ref} {...props}>
      {children}
    </g>
  )
})
ChartBars.displayName = "ChartBars"

interface ChartBarProps extends React.SVGProps<SVGRectElement> {
  value: number
  label?: string
}

const ChartBar = React.forwardRef<SVGRectElement, ChartBarProps>(({ className, value, label, ...props }, ref) => {
  const height = value * 100
  const y = 100 - height

  return (
    <rect
      ref={ref}
      y={y}
      width="8"
      height={height}
      rx="2"
      ry="2"
      fill="currentColor"
      className={cn("origin-bottom transform transition-all", className)}
      {...props}
    />
  )
})
ChartBar.displayName = "ChartBar"

interface ChartPieProps extends React.SVGProps<SVGGElement> {
  data: { name: string; value: number; color: string }[]
}

const ChartPie = React.forwardRef<SVGGElement, ChartPieProps>(({ className, data, ...props }, ref) => {
  const total = data.reduce((acc, item) => acc + item.value, 0)
  let currentAngle = 0

  return (
    <g ref={ref} className={cn("h-full w-full", className)} {...props}>
      {data.map((item, index) => {
        const sliceAngle = (item.value / total) * 360
        const midAngle = currentAngle + sliceAngle / 2
        const x = 50 + 40 * Math.cos((midAngle * Math.PI) / 180)
        const y = 50 + 40 * Math.sin((midAngle * Math.PI) / 180)
        const largeArcFlag = sliceAngle > 180 ? 1 : 0
        const x1 = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180)
        const y1 = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180)
        const x2 = 50 + 40 * Math.cos(((currentAngle + sliceAngle) * Math.PI) / 180)
        const y2 = 50 + 40 * Math.sin(((currentAngle + sliceAngle) * Math.PI) / 180)

        const d = `M ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} L 50 50 Z`

        currentAngle += sliceAngle

        return <path key={index} d={d} fill={item.color} stroke="white" strokeWidth="2" />
      })}
    </g>
  )
})
ChartPie.displayName = "ChartPie"

interface ChartLegendProps {
  items: { name: string; value: number; color: string }[]
  className?: string
}

const ChartLegend = ({ items, className }: ChartLegendProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item) => (
        <div
          key={item.name}
          className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors duration-300"
        >
          <span className="block h-4 w-4 rounded-full" style={{ backgroundColor: item.color }} />
          <p className="text-sm font-medium">
            {item.name} <span className="text-muted-foreground">({item.value})</span>
          </p>
        </div>
      ))}
    </div>
  )
}

export { Chart, ChartBar, ChartBars, ChartContainer, ChartPie, ChartLegend }

