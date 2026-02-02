import "./globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Geist } from "next/font/google"
import { headers } from "next/headers"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { SessionProvider } from "@/components/providers/session-provider"
import { Toaster } from "@/components/ui/sonner"
import { auth } from "@/lib/auth/server"

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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} relative isolate antialiased`}>
        <NuqsAdapter>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SessionProvider session={session}>
              {children}
              <Toaster richColors position="top-right" />
            </SessionProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  )
}
