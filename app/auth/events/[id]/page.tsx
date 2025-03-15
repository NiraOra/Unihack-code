import Link from "next/link"
import Image from "next/image"
import { CalendarDays, ChevronLeft, Clock, Copy, MapPin, Share2, Users } from "lucide-react"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RsvpForm } from "@/components/rsvp-form"
import { PhotoGallery } from "@/components/photo-gallery"
import { EventTicket } from "@/components/event-ticket"
import { getSupabaseServerClient } from "@/lib/supabase"
import { cookies } from "next/headers"

export const revalidate = 0

export default async function EventPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const supabase = getSupabaseServerClient()

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const userId = session?.user?.id

  try {
    // Fetch event details - without joins
    const { data: event, error: eventError } = await supabase.from("events").select("*").eq("id", params.id).single()

    if (eventError) {
      console.error("Error fetching event:", eventError)
      return notFound()
    }

    if (!event) {
      console.error("Event not found")
      return notFound()
    }

    // Fetch host profile separately
    const { data: hostProfile } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .eq("id", event.host_id)
      .single()

    // Fetch attendees separately
    const { data: attendees } = await supabase
      .from("attendees")
      .select("id, user_id, status, note")
      .eq("event_id", event.id)

    // Fetch attendee profiles
    let attendeeProfiles = []
    if (attendees && attendees.length > 0) {
      const attendeeIds = attendees.map((a) => a.user_id)
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", attendeeIds)

      // Create a map for quick lookup
      const profileMap = {}
      if (profiles) {
        profiles.forEach((profile) => {
          profileMap[profile.id] = profile
        })
      }

      // Combine attendees with their profiles
      attendeeProfiles = attendees.map((attendee) => ({
        id: attendee.id,
        userId: attendee.user_id,
        status: attendee.status,
        note: attendee.note,
        name: profileMap[attendee.user_id]?.full_name || "Unknown",
        avatar: profileMap[attendee.user_id]?.avatar_url || "/placeholder.svg?height=40&width=40",
      }))
    }

    // Fetch photos separately
    const { data: photos } = await supabase
      .from("photos")
      .select("id, url, alt_text, uploaded_by, created_at")
      .eq("event_id", event.id)

    // Format event for display
    const formattedEvent = {
      id: event.id,
      title: event.title,
      description: event.description || "",
      date: event.date,
      location: event.location || "No location specified",
      category: event.category,
      image: event.image_url || "/placeholder.svg?height=400&width=800",
      host: {
        id: hostProfile?.id || "",
        name: hostProfile?.full_name || "Unknown Host",
        avatar: hostProfile?.avatar_url || "/placeholder.svg?height=40&width=40",
      },
      attendees: attendeeProfiles || [],
      photos: photos
        ? photos.map((photo: any) => ({
            id: photo.id,
            src: photo.url,
            alt: photo.alt_text || "Event photo",
            uploadedBy: photo.uploaded_by,
            createdAt: photo.created_at,
          }))
        : [],
    }

    // Get user's RSVP status if logged in
    const userRsvp = formattedEvent.attendees.find((attendee) => attendee.userId === userId)

    const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })

    const formattedTime = new Date(event.date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })

    const getCategoryColor = (category: string) => {
      switch (category) {
        case "movie":
          return "from-blue-600 to-cyan-600"
        case "party":
          return "from-purple-600 to-pink-600"
        case "picnic":
          return "from-green-600 to-emerald-600"
        case "food":
          return "from-orange-600 to-amber-600"
        case "travel":
          return "from-amber-600 to-yellow-600"
        default:
          return "from-gray-600 to-slate-600"
      }
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 blur-3xl -z-10" />

        <div className="container mx-auto py-12 px-4 sm:px-6">
          <div className="flex items-center mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-1 hover:bg-background/80 transition-all duration-300">
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="relative rounded-xl overflow-hidden h-64 md:h-96 shadow-xl">
                <Image
                  src={formattedEvent.image || "/placeholder.svg"}
                  alt={formattedEvent.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="gap-1 bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black backdrop-blur-sm shadow-md transition-all duration-300"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="gap-1 bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black backdrop-blur-sm shadow-md transition-all duration-300"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-8">
                  <Badge
                    className={`mb-3 bg-gradient-to-r ${getCategoryColor(formattedEvent.category)} border-0 shadow-md px-3 py-1`}
                  >
                    {formattedEvent.category.charAt(0).toUpperCase() + formattedEvent.category.slice(1)}
                  </Badge>
                  <h1 className="text-4xl font-bold text-white mb-2">{formattedEvent.title}</h1>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2 border-2 border-white">
                      <AvatarImage src={formattedEvent.host.avatar} alt={formattedEvent.host.name} />
                      <AvatarFallback>{formattedEvent.host.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="text-white text-sm">
                      Hosted by <span className="font-medium">{formattedEvent.host.name}</span>
                    </p>
                  </div>
                </div>
              </div>

              <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-10" />

                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Event Details</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                      <CalendarDays className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-lg">{formattedDate}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>{formattedTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-full bg-pink-100 dark:bg-pink-900/30">
                      <MapPin className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div>
                      <p className="font-medium text-lg">{formattedEvent.location}</p>
                      <p className="text-sm text-muted-foreground underline cursor-pointer">View on map</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
                      <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="font-medium text-lg">{formattedEvent.attendees.length} Attendees</p>
                      <div className="flex -space-x-2 mt-1">
                        {formattedEvent.attendees.slice(0, 5).map((attendee) => (
                          <Avatar key={attendee.id} className="h-8 w-8 border-2 border-background">
                            <AvatarImage src={attendee.avatar} alt={attendee.name} />
                            <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ))}
                        {formattedEvent.attendees.length > 5 && (
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-medium border-2 border-background">
                            +{formattedEvent.attendees.length - 5}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-medium text-xl mb-3">About this event</h3>
                    <p className="text-muted-foreground leading-relaxed">{formattedEvent.description}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl -z-10" />

                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Event Content</CardTitle>
                </CardHeader>

                <CardContent>
                  <Tabs defaultValue="photos" className="w-full">
                    <TabsList className="w-full grid grid-cols-3 bg-muted/50 backdrop-blur-sm p-1 mb-6">
                      <TabsTrigger
                        value="photos"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300"
                      >
                        Photos
                      </TabsTrigger>
                      <TabsTrigger
                        value="polls"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300"
                      >
                        Polls
                      </TabsTrigger>
                      <TabsTrigger
                        value="discussion"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300"
                      >
                        Discussion
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="photos" className="mt-0">
                      <PhotoGallery photos={formattedEvent.photos} eventId={formattedEvent.id} />
                    </TabsContent>

                    <TabsContent value="polls" className="mt-0">
                      <div className="text-center py-12 bg-muted/30 rounded-xl backdrop-blur-sm">
                        <p className="text-muted-foreground mb-4">No polls have been created yet</p>
                        <Button
                          variant="outline"
                          className="bg-background/50 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all duration-300"
                        >
                          Create Poll
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="discussion" className="mt-0">
                      <div className="text-center py-12 bg-muted/30 rounded-xl backdrop-blur-sm">
                        <p className="text-muted-foreground mb-4">Join the discussion by leaving a comment</p>
                        <Button
                          variant="outline"
                          className="bg-background/50 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all duration-300"
                        >
                          Add Comment
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <EventTicket event={formattedEvent} />

              <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl -z-10" />

                <CardHeader>
                  <CardTitle className="text-2xl font-bold">RSVP</CardTitle>
                  <CardDescription>Let the host know if you're coming</CardDescription>
                </CardHeader>

                <CardContent>
                  <RsvpForm eventId={formattedEvent.id} />
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl -z-10" />

                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Attendees</CardTitle>
                  <CardDescription>{formattedEvent.attendees.length} people are attending</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {formattedEvent.attendees.slice(0, 5).map((attendee) => (
                      <div
                        key={attendee.id}
                        className="flex items-center p-2 rounded-lg hover:bg-muted/50 transition-colors duration-300"
                      >
                        <Avatar className="h-10 w-10 mr-3 border border-muted">
                          <AvatarImage src={attendee.avatar} alt={attendee.name} />
                          <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{attendee.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {attendee.status === "going"
                              ? "Going"
                              : attendee.status === "maybe"
                                ? "Maybe"
                                : "Not Going"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full bg-background/50 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all duration-300"
                  >
                    See All Attendees
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Unexpected error in event page:", error)
    return notFound()
  }
}

