import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function EventNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50 flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 blur-3xl -z-10" />

      <div className="container mx-auto py-12 px-4 sm:px-6 text-center">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1 hover:bg-background/80 transition-all duration-300">
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Event Not Found
        </h1>
        <p className="text-muted-foreground mb-8">The event you're looking for doesn't exist or has been removed.</p>

        <div className="flex flex-col items-center justify-center gap-4">
          <Link href="/events">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-300">
              Browse All Events
            </Button>
          </Link>
          <Link href="/events/create">
            <Button
              variant="outline"
              className="bg-background/50 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all duration-300"
            >
              Create New Event
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

