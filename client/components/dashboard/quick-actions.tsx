"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Package, ShoppingCart } from "lucide-react"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks to get things done quickly</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button asChild className="justify-start" size="lg">
          <Link href="/sales/new">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Make New Sale
          </Link>
        </Button>
        <Button asChild variant="outline" className="justify-start bg-transparent" size="lg">
          <Link href="/stock?action=add">
            <Plus className="mr-2 h-5 w-5" />
            Add Stock
          </Link>
        </Button>
        <Button asChild variant="outline" className="justify-start bg-transparent" size="lg">
          <Link href="/stock">
            <Package className="mr-2 h-5 w-5" />
            View Stock
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
