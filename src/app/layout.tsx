import "./globals.css"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "./providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "A7 Chat",
    template: "%s - A7 Chat",
  },
  description: "To be written",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scrollbar-thin-transparent">
      <body className={`${geistSans.variable} relative isolate antialiased`}>
        <NuqsAdapter>
          <Providers>
            {children}
            <Toaster richColors position="top-right" />
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  )
}
