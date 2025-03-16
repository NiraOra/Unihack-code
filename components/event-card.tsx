import Link from "next/link"
import { CalendarDays, MapPin, Users } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export interface EventCardProps {
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

export function EventCard({
  id,
  title,
  date,
  location,
  category,
  attendees,
  image,
  host,
}: EventCardProps) {
  const eventDate = new Date(date)
  const timeFromNow = formatDistanceToNow(eventDate, { addSuffix: true })

  return (
    <Link href={`/events/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="capitalize bg-primary/5 hover:bg-primary/5"
            >
              {category}
            </Badge>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-xs">{attendees}</span>
            </div>
          </div>
          <h3 className="font-semibold text-xl leading-none tracking-tight">
            {title}
          </h3>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>{timeFromNow}</span>
          </div>
          {location && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex items-center space-x-2">
            <Avatar src={host.avatar} alt={host.name} size={32} />
            <div className="text-sm">
              <p className="text-muted-foreground">Hosted by</p>
              <p className="font-medium">{host.name}</p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

