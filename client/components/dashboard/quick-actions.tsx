"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Package, ShoppingCart, Users } from 'lucide-react'

export function QuickActions() {
  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Fast access to common tasks</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Button asChild className="justify-start" size="lg">
          <Link href="/sales/new">
            <ShoppingCart className="mr-2 h-5 w-5" />
            New Sale
          </Link>
        </Button>
        <Button asChild variant="outline" className="justify-start" size="lg">
          <Link href="/stock?action=add">
            <Plus className="mr-2 h-5 w-5" />
            Add Stock
          </Link>
        </Button>
        <Button asChild variant="outline" className="justify-start" size="lg">
          <Link href="/customers">
            <Users className="mr-2 h-5 w-5" />
            Customers
          </Link>
        </Button>
        <Button asChild variant="outline" className="justify-start" size="lg">
          <Link href="/stock">
            <Package className="mr-2 h-5 w-5" />
            Inventory
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
