import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL")
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY")
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a single supabase client for the browser
const createBrowserClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Singleton pattern for client-side Supabase client
let browserClient: ReturnType<typeof createBrowserClient>

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createBrowserClient()
  }
  return browserClient
}

// Create a server-side Supabase client (for server components and server actions)
export function getSupabaseServerClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    throw new Error("Missing env.SUPABASE_SERVICE_ROLE_KEY")
  }

  return createClient<Database>(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
    },
  })
}

