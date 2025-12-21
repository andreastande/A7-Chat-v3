"use client"

import { SiGithub, SiGoogle } from "@icons-pack/react-simple-icons"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { signInSocial } from "@/lib/auth/client"
import { LastUsedBadge } from "./last-used-badge"

const providers = [
  { name: "google", icon: SiGoogle },
  { name: "github", icon: SiGithub },
] as const

export function SocialLoginButtons({ lastMethod }: { lastMethod?: string | null }) {
  return (
    <Field className="grid grid-cols-2 gap-6">
      {providers.map(({ name, icon: Icon }) => (
        <div key={name} className="relative">
          <Button variant="outline" type="button" onClick={() => signInSocial({ provider: name })} className="w-full">
            <Icon />
            <span className="capitalize">{name}</span>
          </Button>
          {lastMethod && <LastUsedBadge show={lastMethod === name} />}
        </div>
      ))}
    </Field>
  )
}
