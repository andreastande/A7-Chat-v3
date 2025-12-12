import { AppSidebar } from "@/components/sidebar/app-sidebar"

export default function Home() {
  return (
    <>
      <AppSidebar />
      <main className="flex min-h-screen w-full items-center justify-center bg-background">
        <p>Test</p>
      </main>
    </>
  )
}
