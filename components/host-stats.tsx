"use client"

import { useEffect, useState } from "react"
import { PieChart, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Chart, ChartContainer, ChartBars, ChartBar, ChartPie, ChartLegend } from "@/components/ui/chart"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { toast } from "sonner"

interface HostStatsProps {
  userId: string
}

interface Profile {
  full_name: string
}

interface Attendee {
  user_id: string
  profiles: Profile
}

interface SupabaseEvent {
  id: string
  category: string
  attendees: {
    user_id: string
    profiles: {
      full_name: string
    }
  }[]
}

export function HostStats({ userId }: HostStatsProps) {
  const [mounted, setMounted] = useState(false)
  const [topAttendees, setTopAttendees] = useState<{ name: string; count: number }[]>([])
  const [eventCategories, setEventCategories] = useState<{ name: string; value: number; color: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    const fetchStats = async () => {
      if (typeof window === "undefined") return
      
      try {
        setIsLoading(true)
        const supabase = getSupabaseBrowserClient()

        const { data: events, error } = await supabase
          .from("events")
          .select(`
            id,
            category,
            attendees (
              user_id,
              profiles (
                full_name
              )
            )
          `)
          .eq("host_id", userId)

        if (error) {
          toast.error(`Failed to fetch stats: ${error.message}`)
          return
        }

        if (!events?.length) {
          setTopAttendees([])
          setEventCategories([])
          return
        }

        // Process event categories
        const categoryColors: Record<string, string> = {
          movie: "#6366f1",
          party: "#a855f7",
          picnic: "#10b981",
          food: "#f97316",
          travel: "#eab308",
        }

        const categoryCounts: Record<string, number> = {}
        events.forEach((event) => {
          categoryCounts[event.category] = (categoryCounts[event.category] || 0) + 1
        })

        const formattedCategories = Object.entries(categoryCounts).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
          color: categoryColors[name as keyof typeof categoryColors] || "#94a3b8",
        }))

        setEventCategories(formattedCategories)

        // Process top attendees
        const attendeeCounts: Record<string, { name: string; count: number }> = {}
        events.forEach((event: SupabaseEvent) => {
          event.attendees?.forEach((attendee) => {
            if (attendee.profiles?.full_name) {
              const userId = attendee.user_id
              const name = attendee.profiles.full_name

              if (!attendeeCounts[userId]) {
                attendeeCounts[userId] = { name, count: 0 }
              }
              attendeeCounts[userId].count++
            }
          })
        })

        const formattedAttendees = Object.values(attendeeCounts)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)

        setTopAttendees(formattedAttendees)
      } catch (error) {
        console.error('Error fetching stats:', error)
        toast.error("Failed to load hosting statistics")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [userId])

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

  // If no data, show placeholder
  if (isLoading) {
    return (
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Host Wrapped</CardTitle>
          <CardDescription>Loading your hosting statistics...</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading stats...</div>
        </CardContent>
      </Card>
    )
  }

  // If no events hosted, show placeholder
  if (topAttendees.length === 0 && eventCategories.length === 0) {
    return (
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Host Wrapped</CardTitle>
          <CardDescription>Your event hosting statistics and insights</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No hosting statistics available yet</p>
            <p className="text-sm text-muted-foreground">Create and host events to see your stats here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default mock data if needed
  const defaultTopAttendees = [
    { name: "Alex", count: 8 },
    { name: "Jamie", count: 7 },
    { name: "Taylor", count: 6 },
    { name: "Jordan", count: 5 },
    { name: "Casey", count: 4 },
  ]

  const defaultEventCategories = [
    { name: "Movie", value: 8, color: "#6366f1" },
    { name: "Party", value: 5, color: "#a855f7" },
    { name: "Picnic", value: 3, color: "#10b981" },
    { name: "Food", value: 6, color: "#f97316" },
    { name: "Travel", value: 2, color: "#eab308" },
  ]

  // Use real data if available, otherwise use defaults
  const displayTopAttendees = topAttendees.length > 0 ? topAttendees : defaultTopAttendees
  const displayEventCategories = eventCategories.length > 0 ? eventCategories : defaultEventCategories

  return (
    <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl -z-10" />

      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold">Host Wrapped</CardTitle>
        <CardDescription>Your event hosting statistics and insights</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="people" className="w-full">
          <TabsList className="mb-6 w-full grid grid-cols-2 bg-muted/50 backdrop-blur-sm p-1">
            <TabsTrigger
              value="people"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300"
            >
              <Users className="h-4 w-4" />
              People
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300"
            >
              <PieChart className="h-4 w-4" />
              Categories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="people" className="mt-0">
            <div className="space-y-6">
              <h3 className="text-xl font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Who you've hung out with the most
              </h3>

              <div className="bg-gradient-to-br from-background/50 to-background/30 backdrop-blur-sm p-6 rounded-xl border border-purple-100 dark:border-purple-900/20">
                <ChartContainer className="aspect-[4/3]">
                  <Chart className="h-full w-full">
                    <ChartBars>
                      {displayTopAttendees.map((person, index) => {
                        // Calculate gradient colors based on index
                        const startColor =
                          index === 0
                            ? "#a855f7"
                            : index === 1
                              ? "#8b5cf6"
                              : index === 2
                                ? "#6366f1"
                                : index === 3
                                  ? "#ec4899"
                                  : "#f97316"
                        const endColor =
                          index === 0
                            ? "#d946ef"
                            : index === 1
                              ? "#a855f7"
                              : index === 2
                                ? "#8b5cf6"
                                : index === 3
                                  ? "#f43f5e"
                                  : "#fb923c"

                        return (
                          <g key={person.name}>
                            <defs>
                              <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor={startColor} />
                                <stop offset="100%" stopColor={endColor} />
                              </linearGradient>
                            </defs>
                            <ChartBar
                              value={person.count / Math.max(...displayTopAttendees.map((p) => p.count))}
                              label={`${person.name}: ${person.count} events`}
                              fill={`url(#gradient-${index})`}
                              className="rx-2 ry-2"
                              x={index * 20 + 5}
                              width="12"
                            />
                          </g>
                        )
                      })}
                    </ChartBars>
                  </Chart>
                </ChartContainer>
              </div>

              <div className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg backdrop-blur-sm">
                <p className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"></span>
                  You've hosted events for a total of {displayTopAttendees.length} unique people.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="mt-0">
            <div className="space-y-6">
              <h3 className="text-xl font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Event categories you've hosted
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-background/50 to-background/30 backdrop-blur-sm p-6 rounded-xl border border-pink-100 dark:border-pink-900/20">
                  <ChartContainer className="aspect-square">
                    <Chart className="h-full w-full">
                      <ChartPie
                        data={displayEventCategories.map((category) => ({
                          name: category.name,
                          value: category.value,
                          color: category.color,
                        }))}
                      />
                    </Chart>
                  </ChartContainer>
                </div>

                <div className="flex items-center">
                  <ChartLegend
                    className="grid grid-cols-1 gap-3 w-full"
                    items={displayEventCategories.map((category) => ({
                      name: category.name,
                      value: category.value,
                      color: category.color,
                    }))}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

