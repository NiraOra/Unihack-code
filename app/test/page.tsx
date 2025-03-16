"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { createTestEvents } from "@/app/actions/test-events"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase"

export default function TestPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = getSupabaseBrowserClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      console.log("Initial auth check:", {
        hasSession: !!session,
        userId: session?.user?.id
      })
      
      setIsAuthenticated(!!session)
      
      if (!session) {
        router.push('/auth/login?redirect=/test')
      }
    }
    
    checkAuth()

    // Set up auth state listener
    const supabase = getSupabaseBrowserClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", { event, hasSession: !!session })
      setIsAuthenticated(!!session)
      
      if (!session) {
        router.push('/auth/login?redirect=/test')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const handleCreateTestEvents = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // First check if user is logged in
      const supabase = getSupabaseBrowserClient()
      const { data: { session } } = await supabase.auth.getSession()

      console.log("Create events session check:", {
        hasSession: !!session,
        userId: session?.user?.id,
      })

      if (!session) {
        setError("Please log in first")
        router.push('/auth/login?redirect=/test')
        return
      }

      const result = await createTestEvents()
      
      if (result.error) {
        console.error("Error creating test events:", result.error)
        setError(result.error.message || "Error creating test events")
      } else {
        alert(`Successfully created ${result.count} test events!`)
        router.push("/events")
      }
    } catch (error) {
      console.error("Error:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-center">Event List Testing</h1>
          <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md">
            Please log in to create test events
          </div>
          <div className="flex justify-center">
            <Link href="/auth/login?redirect=/test">
              <Button>Log In</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center">Event List Testing</h1>
        <div className="space-y-4">
          {error && (
            <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          <Button
            onClick={handleCreateTestEvents}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Creating Events..." : "Create 10 Test Events"}
          </Button>
          <div className="flex justify-center gap-4">
            <Link href="/">
              <Button variant="outline">Go to Home</Button>
            </Link>
            <Link href="/events">
              <Button variant="outline">View All Events</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 