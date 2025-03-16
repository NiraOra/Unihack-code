"use client"

import { useState } from "react"
import { EventCard } from "@/components/event-card"

interface FormattedEvent {
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

interface EventListProps {
  events: FormattedEvent[]
}

export function EventList({ events }: EventListProps) {
  const [limit, setLimit] = useState(6)

  // Filter upcoming events
  const upcomingEvents = events.filter((event) => new Date(event.date) >= new Date())

  // Sort events by date
  const sortedUpcomingEvents = upcomingEvents.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  // Slice events based on limit
  const displayedEvents = sortedUpcomingEvents.slice(0, limit)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-8">Upcoming Events</h2>
        {displayedEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No upcoming events found.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Create an event to get started!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  location={event.location}
                  category={event.category}
                  attendees={event.attendees}
                  image={event.image}
                  host={event.host}
                />
              ))}
            </div>
            {limit < upcomingEvents.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setLimit((prev) => prev + 6)}
                  className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80"
                >
                  View More Events
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
} 