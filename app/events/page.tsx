import { ChevronLeft, Plus } from "lucide-react"
import Link from "next/link"
import { cookies } from "next/headers"

import { Button } from "@/components/ui/button"
import { EventList } from "@/components/event-list"
import { getSupabaseServerClient } from "@/lib/supabase"

interface HostProfile {
  id: string
  full_name: string | null
  avatar_url: string | null
}

interface HostProfiles {
  [key: string]: HostProfile
}

interface Event {
  id: string
  title: string
  date: string
  location: string | null
  category: "movie" | "party" | "food" | "travel" | "picnic"
  host_id: string
  image_url: string | null
}

interface AttendeeCounts {
  [key: string]: number
}

export default async function EventsPage() {
  const cookieStore = cookies()
  const supabase = getSupabaseServerClient()

  try {
    // Fetch all upcoming events
    const { data: eventsData } = await supabase
      .from("events")
      .select("*")
      .gte("date", new Date().toISOString())
      .order("date", { ascending: true })

    // Add this after the query to ensure we always have an array
    const events = eventsData || []

    // Fetch host profiles
    const hostIds = events.map((event) => event.host_id).filter(Boolean)
    const hostProfiles: HostProfiles = {}

    if (hostIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", hostIds)

      if (profiles) {
        profiles.forEach((profile: HostProfile) => {
          hostProfiles[profile.id] = profile
        })
      }
    }

    // Fetch attendee counts
    const attendeeCounts: AttendeeCounts = {}
    if (events.length > 0) {
      const eventIds = events.map((event) => event.id)
      const { data: attendees } = await supabase
        .from("attendees")
        .select("event_id")
        .in("event_id", eventIds)

      if (attendees) {
        attendees.forEach((attendee: { event_id: string }) => {
          attendeeCounts[attendee.event_id] = (attendeeCounts[attendee.event_id] || 0) + 1
        })
      }
    }

    // Format events for display
    const formattedEvents = events.map((event: Event) => ({
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
            <Link href="/auth/events/create">
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
    console.error("Error fetching events:", error)
    return <div>Error loading events</div>
  }
} 