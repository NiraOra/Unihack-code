import Link from "next/link"
import Image from "next/image"
import { CalendarDays, MapPin, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface Event {
  id: string
  title: string
  date: string
  location: string
  category: string
  attendees: number
  image: string
  host?: {  // Make it optional if you don't always have this property
    name: string
    avatar: string
  }
}

interface EventCardProps {
  event: Event
  className?: string
}

export function EventCard({ event, className }: EventCardProps) {
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const formattedTime = new Date(event.date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case "movie":
        return {
          badge: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-sm",
          card: "border-blue-100 dark:border-blue-900/30 hover:border-blue-200 dark:hover:border-blue-800/30",
          glow: "bg-blue-500/10",
        }
      case "party":
        return {
          badge: "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-sm",
          card: "border-purple-100 dark:border-purple-900/30 hover:border-purple-200 dark:hover:border-purple-800/30",
          glow: "bg-purple-500/10",
        }
      case "picnic":
        return {
          badge: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-sm",
          card: "border-green-100 dark:border-green-900/30 hover:border-green-200 dark:hover:border-green-800/30",
          glow: "bg-green-500/10",
        }
      case "food":
        return {
          badge: "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 shadow-sm",
          card: "border-orange-100 dark:border-orange-900/30 hover:border-orange-200 dark:hover:border-orange-800/30",
          glow: "bg-orange-500/10",
        }
      case "travel":
        return {
          badge: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0 shadow-sm",
          card: "border-amber-100 dark:border-amber-900/30 hover:border-amber-200 dark:hover:border-amber-800/30",
          glow: "bg-amber-500/10",
        }
      default:
        return {
          badge: "bg-gradient-to-r from-gray-500 to-slate-500 text-white border-0 shadow-sm",
          card: "border-gray-100 dark:border-gray-900/30 hover:border-gray-200 dark:hover:border-gray-800/30",
          glow: "bg-gray-500/10",
        }
    }
  }

  const style = getCategoryStyle(event.category)

  return (
    <Card
      className={cn(
        "overflow-hidden border-2 shadow-lg bg-gradient-to-br from-background to-background/80 backdrop-blur-sm group hover:shadow-xl transition-all duration-300",
        style.card,
        className,
      )}
    >
      <div className="relative">
        <div
          className={cn(
            "absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-300",
            style.glow,
          )}
        />
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <Badge className={cn("absolute top-3 right-3", style.badge)}>
            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
          </Badge>
        </div>
      </div>

      <CardContent className="pt-6 pb-2">
        <h3 className="text-xl font-bold mb-3 line-clamp-1">{event.title}</h3>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="mr-2 h-4 w-4 text-purple-500 dark:text-purple-400" />
            <span>
              {formattedDate} at {formattedTime}
            </span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4 text-pink-500 dark:text-pink-400" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-2 h-4 w-4 text-orange-500 dark:text-orange-400" />
            <span>{event.attendees} attendees</span>
          </div>
        </div>
          {/* Add this block to display the host info if available */}
        {event.host && (
          <div className="flex items-center mt-4">
            <Image src={event.host.avatar} alt={event.host.name} width={32} height={32} className="rounded-full" />
            <span className="ml-2 text-sm">{event.host.name}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 pb-6">
        <Link href={`/events/${event.id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:text-white transition-all duration-300"
          >
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

