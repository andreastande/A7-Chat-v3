import { lastLoginMethodClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const {
  signIn: { social: signInSocial, email: signInEmail },
  signUp: { email: signUpEmail },
  useSession: useClientSession,
  signOut,
  getLastUsedLoginMethod,
} = createAuthClient({ plugins: [lastLoginMethodClient()] })
