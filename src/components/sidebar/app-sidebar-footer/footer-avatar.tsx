import { User } from "better-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/base-ui/avatar"

export function FooterAvatar({ user }: { user?: User }) {
  if (!user) {
    return (
      <Avatar
        key="guest"
        className="rounded-md group-data-[collapsible=icon]:group-[:hover,:focus,[data-state=open]]/menu-button:brightness-90 after:rounded-md"
      >
        <AvatarFallback className="rounded-md bg-linear-to-br from-emerald-400 via-cyan-400 to-purple-400 dark:from-emerald-600 dark:via-cyan-600 dark:to-purple-600" />
      </Avatar>
    )
  }

  const [first, ...rest] = user.name.split(" ").filter(Boolean)
  const last = rest.at(-1)
  const initials = (first[0] + (last?.[0] ?? "")).toUpperCase()

  return (
    <Avatar
      key={user.id}
      className="rounded-md group-data-[collapsible=icon]:group-[:hover,:focus,[data-state=open]]/menu-button:brightness-90 after:rounded-md"
    >
      <AvatarImage className="rounded-md" src={user.image ?? undefined} alt={user.name} referrerPolicy="no-referrer" />
      <AvatarFallback className="rounded-md bg-primary text-white">{initials}</AvatarFallback>
    </Avatar>
  )
}
