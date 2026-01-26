import Link from "next/link"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/dal/auth"

export default async function Page() {
  const user = await getCurrentUser()

  return (
    <>
      <AppSidebar />
      <div className="flex min-h-screen w-full flex-col items-center justify-center px-8 text-center">
        <h1 className="text-3xl">Can't open this chat</h1>
        <p className="mt-6 mb-8 text-muted-foreground">
          It may have been deleted or you might not have permission to view it.
        </p>
        {user ? (
          <Button render={<Link href="/" />} nativeButton={false}>
            Start a new chat
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button render={<Link href="/login" />} nativeButton={false}>
              Log in
            </Button>
            <Button variant="outline" render={<Link href="/" />} nativeButton={false}>
              Start a new chat
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
