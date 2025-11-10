import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LayoutContent } from "./layout-content"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Housery POS System",
  description: "Complete point of sale and inventory management system",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  )
}
