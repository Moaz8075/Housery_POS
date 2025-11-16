"use client"

import type { Alert as AlertType } from "@/lib/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertItemProps {
  alert: AlertType
  onClick?: () => void
}

export function AlertItem({ alert, onClick }: AlertItemProps) {
  const icons = {
    info: Info,
    warning: AlertTriangle,
    error: AlertCircle,
    danger: AlertCircle,
  }

  const Icon = icons[alert?.severity]

  return (
    <Alert
      className={cn(
        "cursor-pointer transition-colors hover:bg-muted/50",
        alert.severity === "error" && "border-red-200 bg-red-50/50",
        alert.severity === "warning" && "border-yellow-200 bg-yellow-50/50",
        alert.severity === "info" && "border-blue-200 bg-blue-50/50",
      )}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      <AlertTitle>{alert.title}</AlertTitle>
      <AlertDescription className="text-sm">{alert.message}</AlertDescription>
    </Alert>
  )
}
