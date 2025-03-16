import { cookies } from "next/headers"

import { EventCard } from "@/components/event-card"
import { Button } from "@/components/ui/button"
import { getSupabaseServerClient } from "@/lib/supabase"

export const revalidate = 0

interface Profile {
  id: string
  full_name: string
  avatar_url: string
}

interface Event {
  id: string
  title: string
  date: string
  location: string
  category: string
  host_id: string
  image_url?: string
}

interface HostProfiles {
  [key: string]: Profile
}

interface AttendeeCounts {
  [key: string]: number
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1
  const pageSize = 6
  const cookieStore = cookies()
  const supabase = getSupabaseServerClient()

  try {
    // Fetch total count of events
    const { count } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .gte("date", new Date().toISOString())

    // Fetch paginated events
    const { data: eventsData } = await supabase
      .from("events")
      .select("*")
      .gte("date", new Date().toISOString())
      .order("date", { ascending: true })
      .range((page - 1) * pageSize, page * pageSize - 1)

    const events = (eventsData as Event[]) || []

    // Fetch host profiles
    const hostIds = events.map((event) => event.host_id).filter(Boolean)
    const hostProfiles: HostProfiles = {}

    if (hostIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", hostIds)

      if (profiles) {
        profiles.forEach((profile: Profile) => {
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

    const totalPages = count ? Math.ceil(count / pageSize) : 1

    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 blur-3xl -z-10" />

        <div className="container mx-auto py-12 px-4 sm:px-6">
          <div className="mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              All Events
            </h1>
            <p className="text-muted-foreground mt-2">Discover and join upcoming events</p>
          </div>

          {formattedEvents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {formattedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>

              <div className="flex justify-center gap-2">
                {page > 1 && (
                  <a href={`/events?page=${page - 1}`}>
                    <Button variant="outline">Previous</Button>
                  </a>
                )}
                {page < totalPages && (
                  <a href={`/events?page=${page + 1}`}>
                    <Button variant="outline">Next</Button>
                  </a>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-xl backdrop-blur-sm">
              <p className="text-muted-foreground">No events found</p>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading events page:", error)
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Events</h1>
          <p className="text-muted-foreground">There was a problem loading the events page.</p>
        </div>
      </div>
    )
  }
} 