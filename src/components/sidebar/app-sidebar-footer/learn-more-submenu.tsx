import { SiGithub } from "@icons-pack/react-simple-icons"
import { ExternalLink, HatGlasses, Info, ScrollText } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

const LEARN_MORE_LINKS = [
  { href: "https://github.com/andreastande/A7-Chat-v3", icon: SiGithub, label: "GitHub" },
  { href: "/privacy-policy", icon: HatGlasses, label: "Privacy policy", separator: true },
  { href: "/terms-of-service", icon: ScrollText, label: "Terms of service" },
]

export function LearnMoreSubmenu() {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Info />
        Learn more
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          {LEARN_MORE_LINKS.map(({ href, icon: Icon, label, separator }) => (
            <div key={href}>
              {separator && <DropdownMenuSeparator />}
              <DropdownMenuItem className="group/item" asChild>
                <Link href={href} target="_blank">
                  <Icon />
                  <span className="mr-4">{label}</span>
                  <ExternalLink className="invisible ml-auto group-[:hover,:focus-visible]/item:visible" />
                </Link>
              </DropdownMenuItem>
            </div>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}
