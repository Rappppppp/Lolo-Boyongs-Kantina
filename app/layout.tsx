import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Lolo Boyong's Kantina",
  description: "Lolo Boyong's Kantina was founded in 2019 by husband-and-wife team Mr. Richmond and Mrs. Joan Bonza. Named in honor of Mr. Richmond’s beloved grandfather, “Lolo Boyong”, the restaurant stands as a tribute to family, tradition, and good food.",
  // generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/app-logo.jpg",
        type: "image/svg+xml",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
