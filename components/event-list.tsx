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

  // Sample hardcoded events
  const sampleEvents: Event[] = [
    {
      id: "1",
      title: "Summer Beach Party",
      date: "2024-05-01T14:00:00.000Z", // Fixed future date
      location: "Bondi Beach, Sydney",
      category: "party",
      attendees: 45,
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop",
      host: {
        name: "Sarah Wilson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
      }
    },
    {
      id: "2",
      title: "Tech Meetup 2024",
      date: "2024-04-15T09:00:00.000Z", // Fixed future date
      location: "Innovation Hub, Melbourne",
      category: "picnic",
      attendees: 120,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop",
      host: {
        name: "Saanvi Y",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
      }
    },
    {
      id: "3",
      title: "Movie Night: Classics",
      date: "2024-02-01T18:30:00.000Z", // Fixed past date
      location: "Moonlight Cinema",
      category: "movie",
      attendees: 75,
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop",
      host: {
        name: "Nira Arun",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
      }
    },
    {
      id: "4",
      title: "Food Festival",
      date: "2024-01-15T11:00:00.000Z", // Fixed past date
      location: "Federation Square",
      category: "food",
      attendees: 200,
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop",
      host: {
        name: "Cindy",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma"
      }
    }
  ]

  useEffect(() => {
    setMounted(true)
    const now = "2024-03-01T00:00:00.000Z" // Fixed reference date for consistent sorting
    setUpcomingEvents(sampleEvents.filter(event => event.date >= now))
    setPastEvents(sampleEvents.filter(event => event.date < now))
  }, [])

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