import Link from "next/link"
import { ChevronLeft, Plus } from "lucide-react"
import { cookies } from "next/headers"

import { Button } from "@/components/ui/button"
import { EventCard } from "@/components/event-card"
import { getSupabaseServerClient } from "@/lib/supabase"
import { EventList } from "@/components/event-list"

// Add these interfaces at the top of the file
interface Profile {
  id: string
  full_name: string
  avatar_url: string
}

interface HostProfiles {
  [key: string]: Profile
}

interface AttendeeCounts {
  [key: string]: number
}

export const revalidate = 0

export default async function EventsPage() {
  const cookieStore = cookies()
  const supabase = getSupabaseServerClient()

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const userId = session?.user?.id

  try {
    // Fetch all events without joins
    const { data: eventsData } = await supabase.from("events").select("*").order("date", { ascending: true })

    // Add this after the query to ensure we always have an array
    const events = eventsData || []

    // Fetch host profiles
    const hostIds = events.map((event) => event.host_id).filter(Boolean)
    const hostProfiles: HostProfiles = {}

    if (hostIds.length > 0) {
      const { data: profiles } = await supabase.from("profiles").select("id, full_name, avatar_url").in("id", hostIds)

      if (profiles) {
        profiles.forEach((profile) => {
          hostProfiles[profile.id] = profile
        })
      }
    }

    // Fetch attendee counts
    const attendeeCounts: AttendeeCounts = {}
    const { data: attendees } = await supabase.from("attendees").select("event_id")

    if (attendees) {
      attendees.forEach((attendee) => {
        attendeeCounts[attendee.event_id] = (attendeeCounts[attendee.event_id] || 0) + 1
      })
    }

    // Format events for display
    const formattedEvents = events.map((event) => ({
      id: event.id,
      title: event.title,
      date: event.date,
      location: event.location || "No location specified",
      category: event.category,
      attendees: attendeeCounts[event.id] || 0,
      image: event.image_url || "/placeholder.svg?height=200&width=400",
      host: {
        name: hostProfiles[event.host_id]?.full_name || "Unknown Host",
        avatar: hostProfiles[event.host_id]?.avatar_url || "/placeholder.svg?height=40&width=40",
      },
    }))

    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 blur-3xl -z-10" />

        <div className="container mx-auto py-12 px-4 sm:px-6">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-1 hover:bg-background/80 transition-all duration-300">
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
              <h1 className="text-4xl font-bold ml-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                All Events
              </h1>
            </div>
            <Link href="/events/create">
              <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-300">
                <Plus className="h-4 w-4" />
                Create Event
              </Button>
            </Link>
          </div>

          <div className="mb-16 relative">
            <div className="absolute top-20 right-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-10 left-20 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl -z-10" />

            <h2 className="text-3xl font-bold mb-8">Upcoming Events</h2>

            <EventList events={formattedEvents} />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading events page:", error)
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Events</h1>
          <p className="text-muted-foreground mb-6">There was a problem loading the events page.</p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }
}

