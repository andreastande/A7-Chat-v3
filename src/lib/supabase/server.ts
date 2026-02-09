"server-only"

import { createClient } from "@supabase/supabase-js"
import env from "~/env.config"

export const supabaseServer = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
