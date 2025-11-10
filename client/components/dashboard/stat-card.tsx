import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    label: string
  }
  variant?: "default" | "success" | "warning" | "danger"
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, variant = "default" }: StatCardProps) {
  const variantColors = {
    default: "text-primary",
    success: "text-green-600",
    warning: "text-yellow-600",
    danger: "text-red-600",
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-5 w-5", variantColors[variant])} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        {trend && (
          <p className={cn("text-xs mt-2", trend.value >= 0 ? "text-green-600" : "text-red-600")}>
            {trend.value >= 0 ? "+" : ""}
            {trend.value}% {trend.label}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
