import Link from "next/link"
import { CalendarDays, Plus, Ticket, Users } from "lucide-react"
import { cookies } from "next/headers"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EventCard } from "@/components/event-card"
import { HostStats } from "@/components/host-stats"
import { Confetti } from "@/components/confetti"
import { getSupabaseServerClient } from "@/lib/supabase"
import { AuthButton } from "@/components/auth-button"

export const revalidate = 0

interface Event {
  id: string;
  title: string;
  start_datetime: string;
  location: string;
  category: string;
  host_id: string;
  image_url?: string;
}

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
}

export default async function Home() {
  const cookieStore = cookies()
  const supabase = getSupabaseServerClient()

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const userId = session?.user?.id

  try {
    // Fetch upcoming events without joins
    const { data: upcomingEventsData } = await supabase
      .from("events")
      .select("*")
      .gte("start_datetime", new Date().toISOString())
      .order("start_datetime", { ascending: true })
      .limit(3)

    // Add this after the query to ensure we always have an array
    const upcomingEvents: Event[] = upcomingEventsData || []

    // Fetch host profiles
    const hostIds = upcomingEvents.map((event) => event.host_id).filter(Boolean)
    const hostProfiles: Record<string, Profile> = {}

    if (hostIds.length > 0) {
      const { data: profiles } = await supabase.from("profiles").select("id, full_name, avatar_url").in("id", hostIds)

      if (profiles) {
        profiles.forEach((profile: Profile) => {
          hostProfiles[profile.id] = profile
        })
      }
    }

    // Fetch attendee counts
    const attendeeCounts: Record<string, number> = {}
    if (upcomingEvents.length > 0) {
      const eventIds = upcomingEvents.map((event) => event.id)
      const { data: attendees } = await supabase.from("attendees").select("event_id").in("event_id", eventIds)

      if (attendees) {
        attendees.forEach((attendee: { event_id: string }) => {
          attendeeCounts[attendee.event_id] = (attendeeCounts[attendee.event_id] || 0) + 1
        })
      }
    }

    // Format events for display
    const formattedEvents = upcomingEvents.map((event) => ({
      id: event.id,
      title: event.title,
      date: event.start_datetime,
      location: event.location || "No location specified",
      category: event.category,
      attendees: attendeeCounts[event.id] || 0,
      image: event.image_url || "/placeholder.svg?height=200&width=400",
      host: {
        name: hostProfiles[event.host_id]?.full_name || "Unknown Host",
        avatar: hostProfiles[event.host_id]?.avatar_url || "/placeholder.svg?height=40&width=40",
      },
    }))

    // Fetch past events count
    const { count: pastEventsCount } = await supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .lt("start_datetime", new Date().toISOString())

    // Calculate total attendees
    const totalAttendees = Object.values(attendeeCounts).reduce((sum: number, count: number) => sum + count, 0)

    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 blur-3xl -z-10" />

        <div className="container mx-auto py-12 px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Your Events
              </h1>
              <p className="text-muted-foreground mt-2">Create, manage and track your special moments</p>
            </div>
            <div className="flex gap-4">
              <AuthButton />
              <Link href="/auth/events/create">
                <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-300">
                  <Plus className="h-4 w-4" />
                  Create Event
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-background to-background/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -z-10" />
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <CalendarDays className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {formattedEvents.length}
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-background to-background/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl -z-10" />
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <div className="p-2 rounded-full bg-pink-100 dark:bg-pink-900/30">
                    <Users className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  Total Attendees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                  {totalAttendees}
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-background to-background/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl -z-10" />
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/30">
                    <Ticket className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  Past Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {pastEventsCount || 0}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-16 relative">
            <div className="absolute top-20 right-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-10 left-20 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl -z-10" />

            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Upcoming Events</h2>
              <Link href="/events">
                <Button variant="ghost" className="hover:bg-background/80 transition-all duration-300">
                  View All
                </Button>
              </Link>
            </div>

            {formattedEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {formattedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-xl backdrop-blur-sm">
                <p className="text-muted-foreground mb-4">No upcoming events found</p>
                <Link href="/auth/events/create">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-300">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Event
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {userId && (
            <div className="mb-16 relative">
              <div className="absolute top-20 left-20 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -z-10" />
              <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Host Wrapped
              </h2>
              <HostStats userId={userId} />
            </div>
          )}

          <Confetti />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading home page:", error)
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Events</h1>
          <p className="text-muted-foreground mb-6">There was a problem loading the home page.</p>
          <Link href="/events">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Browse Events
            </Button>
          </Link>
        </div>
      </div>
    )
  }
}

