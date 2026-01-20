import { User } from "better-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function FooterAvatar({ user }: { user?: User }) {
  if (!user) {
    return (
      <div className="size-8 shrink-0 rounded-md bg-linear-to-br from-emerald-400 via-cyan-400 to-purple-400 group-data-[collapsible=icon]:group-[:hover,:focus,[data-state=open]]/menu-button:brightness-90 dark:from-emerald-600 dark:via-cyan-600 dark:to-purple-600" />
    )
  }

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase())
    .join("")

  return (
    <Avatar className="rounded-md group-data-[collapsible=icon]:group-[:hover,:focus,[data-state=open]]/menu-button:brightness-90">
      <AvatarImage src={user.image ?? undefined} alt={user.name} />
      <AvatarFallback className="rounded-md">{initials}</AvatarFallback>
    </Avatar>
  )
}
