"use client"

import { useEffect, useState } from "react"
import { EventCard } from "@/components/event-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

interface Event {
  id: string
  title: string
  date: string
  location: string
  category: string
  attendees: number
  image: string
  host: {
    name: string
    avatar: string
  }
}

export function EventList({ events }: { events: Event[] }) {
  const [mounted, setMounted] = useState(false)
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [pastEvents, setPastEvents] = useState<Event[]>([])

  useEffect(() => {
    setMounted(true)
    const now = new Date().toISOString()
    setUpcomingEvents(events.filter(event => event.date >= now))
    setPastEvents(events.filter(event => event.date < now))
  }, [events])

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-muted rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-muted rounded" />
          ))}
        </div>
      </div>
    )
  }

  if (upcomingEvents.length === 0 && pastEvents.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-xl backdrop-blur-sm">
        <p className="text-muted-foreground mb-4">No events found</p>
        <Link href="/auth/events/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Event
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-16">
      {upcomingEvents.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold mb-8">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold mb-8">Past Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 