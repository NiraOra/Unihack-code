import { CalendarDays, MapPin, QrCode, Ticket } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface Event {
  id: string
  title: string
  date: string
  location: string
  category: string
  image?: string
  host: {
    id?: string
    name: string
    avatar: string
  }
  attendees?: any[]
}

interface EventTicketProps {
  event: Event
}

export function EventTicket({ event }: EventTicketProps) {
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

  const formattedTime = new Date(event.date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })

  const getTicketStyle = (category: string) => {
    switch (category) {
      case "movie":
        return {
          bg: "bg-gradient-to-r from-blue-600/10 to-cyan-600/10",
          border: "border-blue-200 dark:border-blue-900/30",
          accent: "from-blue-600 to-cyan-600",
          icon: "text-blue-600 dark:text-blue-400",
        }
      case "party":
        return {
          bg: "bg-gradient-to-r from-purple-600/10 to-pink-600/10",
          border: "border-purple-200 dark:border-purple-900/30",
          accent: "from-purple-600 to-pink-600",
          icon: "text-purple-600 dark:text-purple-400",
        }
      case "picnic":
        return {
          bg: "bg-gradient-to-r from-green-600/10 to-emerald-600/10",
          border: "border-green-200 dark:border-green-900/30",
          accent: "from-green-600 to-emerald-600",
          icon: "text-green-600 dark:text-green-400",
        }
      case "food":
        return {
          bg: "bg-gradient-to-r from-orange-600/10 to-amber-600/10",
          border: "border-orange-200 dark:border-orange-900/30",
          accent: "from-orange-600 to-amber-600",
          icon: "text-orange-600 dark:text-orange-400",
        }
      case "travel":
        return {
          bg: "bg-gradient-to-r from-amber-600/10 to-yellow-600/10",
          border: "border-amber-200 dark:border-amber-900/30",
          accent: "from-amber-600 to-yellow-600",
          icon: "text-amber-600 dark:text-amber-400",
        }
      default:
        return {
          bg: "bg-gradient-to-r from-gray-600/10 to-slate-600/10",
          border: "border-gray-200 dark:border-gray-900/30",
          accent: "from-gray-600 to-slate-600",
          icon: "text-gray-600 dark:text-gray-400",
        }
    }
  }

  const style = getTicketStyle(event.category)

  return (
    <Card className={`overflow-hidden border-2 shadow-xl ${style.bg} ${style.border} backdrop-blur-sm relative`}>
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${style.accent}`} />

      <div className="flex items-center justify-between p-6 border-b border-dashed border-muted">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full bg-white dark:bg-black ${style.icon}`}>
            <Ticket className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Event Ticket</h3>
            <p className="text-sm text-muted-foreground">#{event.id.substring(0, 8).toUpperCase()}</p>
          </div>
        </div>
        <div className="p-2 rounded-lg bg-white dark:bg-black">
          <QrCode className={`h-10 w-10 ${style.icon}`} />
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-bold">{event.title}</h2>

        <div className="flex items-center gap-3">
          <CalendarDays className={`h-5 w-5 ${style.icon}`} />
          <div>
            <p className="font-medium">{formattedDate}</p>
            <p className="text-sm text-muted-foreground">{formattedTime}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className={`h-5 w-5 ${style.icon}`} />
          <p className="font-medium">{event.location}</p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-muted">
          <div>
            <p className="text-sm text-muted-foreground">Hosted by</p>
            <p className="font-medium">{event.host.name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Category</p>
            <p className="font-medium capitalize">{event.category}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

