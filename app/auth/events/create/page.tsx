"use client"

import { useState } from "react"
import Link from "next/link"
import { CalendarIcon, ChevronLeft, ImageIcon, MapPin, Sparkles, Upload, Ticket } from "lucide-react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategoryIcon } from "@/components/category-icon"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/context/auth-context"
import { createEvent } from "@/app/actions/event-actions"
import { useToast } from "@/hooks/use-toast"

export default function CreateEventPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [category, setCategory] = useState<string>("party")
  const [isPrivate, setIsPrivate] = useState(false)
  const [eventPassword, setEventPassword] = useState("")

  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    router.push("/auth/login?redirect=/auth/events/create")
    return null
  }

  async function handleSubmit(formData: FormData) {
    // Client-side validation
    const title = formData.get("title") as string
    const startDateValue = formData.get("start_date") as string
    const startTimeValue = formData.get("start_time") as string
    const endDateValue = formData.get("end_date") as string
    const endTimeValue = formData.get("end_time") as string


    if (!title || !startDateValue || !startTimeValue || !endDateValue || !endTimeValue || !category) {
      toast.error("Please fill in all required fields")
      return
    }

    // Validate that end date/time is after start date/time
    const startDateTime = new Date(`${startDateValue}T${startTimeValue}`)
    const endDateTime = new Date(`${endDateValue}T${endTimeValue}`)
    
    if (endDateTime <= startDateTime) {
      toast.error("End time must be after start time")
      return
    }

    // If private event, password is required
    if (isPrivate && !eventPassword) {
      toast.error("Please provide a password for your private event")
      return
    }

    // Add category to form data
    formData.set("category", category)

    // Add is_private to form data
    formData.set("is_private", isPrivate ? "on" : "off")

    // Add event_password to form data if private
    if (isPrivate) {
      formData.set("event_password", eventPassword)
    }

    try {
      await createEvent(formData)
      toast.success("Event created successfully!")
      // Redirect to events page after creation
      router.push("/auth/events")
    } catch (error) {
      console.error("Error creating event:", error)
      toast.error("Failed to create event. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 blur-3xl -z-10" />

      <div className="container mx-auto py-12 px-4 sm:px-6">
        <div className="flex items-center mb-12">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1 hover:bg-background/80 transition-all duration-300">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-4xl font-bold ml-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Create New Event
          </h1>
        </div>

        <form action={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl -z-10" />

                <CardHeader>
                  <CardTitle className="text-2xl">Event Details</CardTitle>
                  <CardDescription>Fill in the information about your event</CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                  <div className="space-y-3">
                    <Label htmlFor="title" className="text-base">
                      Event Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter event title"
                      className="bg-background/50 backdrop-blur-sm border-muted focus:border-purple-500 transition-colors duration-300"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-base">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe your event"
                      rows={4}
                      className="bg-background/50 backdrop-blur-sm border-muted focus:border-purple-500 transition-colors duration-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-base">
                        Start Date <span className="text-red-500">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-background/50 backdrop-blur-sm border-muted hover:border-purple-500 transition-colors duration-300",
                              !startDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-purple-500" />
                            {startDate ? format(startDate, "PPP") : "Select start date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-0 shadow-xl">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                            className="rounded-lg border-0 shadow-lg bg-gradient-to-br from-background to-background/80 backdrop-blur-sm"
                          />
                        </PopoverContent>
                      </Popover>
                      {/* Hidden input to store the date value */}
                      <input type="hidden" name="start_date" value={startDate ? format(startDate, "yyyy-MM-dd") : ""} />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="start_time" className="text-base">
                        Start Time <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="start_time"
                        name="start_time"
                        type="time"
                        className="bg-background/50 backdrop-blur-sm border-muted focus:border-purple-500 transition-colors duration-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-base">
                        End Date <span className="text-red-500">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-background/50 backdrop-blur-sm border-muted hover:border-purple-500 transition-colors duration-300",
                              !endDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-purple-500" />
                            {endDate ? format(endDate, "PPP") : "Select end date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-0 shadow-xl">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                            className="rounded-lg border-0 shadow-lg bg-gradient-to-br from-background to-background/80 backdrop-blur-sm"
                          />
                        </PopoverContent>
                      </Popover>
                      {/* Hidden input to store the date value */}
                      <input type="hidden" name="end_date" value={endDate ? format(endDate, "yyyy-MM-dd") : ""} />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="end_time" className="text-base">
                        End Time <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="end_time"
                        name="end_time"
                        type="time"
                        className="bg-background/50 backdrop-blur-sm border-muted focus:border-purple-500 transition-colors duration-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="location" className="text-base">
                      Location
                    </Label>
                    <div className="flex">
                      <Input
                        id="location"
                        name="location"
                        placeholder="Enter event location"
                        className="rounded-r-none bg-background/50 backdrop-blur-sm border-muted focus:border-purple-500 transition-colors duration-300"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-l-none border-l-0 bg-background/50 backdrop-blur-sm hover:bg-purple-500 hover:text-white transition-all duration-300"
                      >
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base">
                      Event Category <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      defaultValue="party"
                      className="grid grid-cols-2 md:grid-cols-5 gap-3"
                      onValueChange={setCategory}
                      value={category}
                    >
                      <div>
                        <RadioGroupItem value="movie" id="movie" className="peer sr-only" />
                        <Label
                          htmlFor="movie"
                          className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-background/50 backdrop-blur-sm p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:text-blue-600 dark:peer-data-[state=checked]:text-blue-400 [&:has([data-state=checked])]:border-blue-500 transition-all duration-300"
                        >
                          <CategoryIcon category="movie" />
                          <span className="mt-2">Movie</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="party" id="party" className="peer sr-only" />
                        <Label
                          htmlFor="party"
                          className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-background/50 backdrop-blur-sm p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-500 peer-data-[state=checked]:text-purple-600 dark:peer-data-[state=checked]:text-purple-400 [&:has([data-state=checked])]:border-purple-500 transition-all duration-300"
                        >
                          <CategoryIcon category="party" />
                          <span className="mt-2">Party</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="food" id="food" className="peer sr-only" />
                        <Label
                          htmlFor="food"
                          className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-background/50 backdrop-blur-sm p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:text-orange-600 dark:peer-data-[state=checked]:text-orange-400 [&:has([data-state=checked])]:border-orange-500 transition-all duration-300"
                        >
                          <CategoryIcon category="food" />
                          <span className="mt-2">Food</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="travel" id="travel" className="peer sr-only" />
                        <Label
                          htmlFor="travel"
                          className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-background/50 backdrop-blur-sm p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-amber-500 peer-data-[state=checked]:text-amber-600 dark:peer-data-[state=checked]:text-amber-400 [&:has([data-state=checked])]:border-amber-500 transition-all duration-300"
                        >
                          <CategoryIcon category="travel" />
                          <span className="mt-2">Travel</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="picnic" id="picnic" className="peer sr-only" />
                        <Label
                          htmlFor="picnic"
                          className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-background/50 backdrop-blur-sm p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-green-500 peer-data-[state=checked]:text-green-600 dark:peer-data-[state=checked]:text-green-400 [&:has([data-state=checked])]:border-green-500 transition-all duration-300"
                        >
                          <CategoryIcon category="picnic" />
                          <span className="mt-2">Picnic</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center space-x-2 p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-muted">
                    <Checkbox
                      id="is_private"
                      checked={isPrivate}
                      onCheckedChange={(checked) => setIsPrivate(checked as boolean)}
                      className="text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <Label htmlFor="is_private" className="text-base">
                      Password protect this event
                    </Label>
                  </div>

                  {isPrivate && (
                    <div className="space-y-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/20 animate-in fade-in-50 slide-in-from-top-5 duration-300">
                      <Label htmlFor="event_password" className="text-base">
                        Event Password <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="event_password"
                        type="password"
                        placeholder="Enter password for co-hosts"
                        value={eventPassword}
                        onChange={(e) => setEventPassword(e.target.value)}
                        className="bg-background/80 backdrop-blur-sm border-purple-200 dark:border-purple-800/30 focus:border-purple-500"
                      />
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-purple-500"></span>
                        Anyone with this password can make changes to the event
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl -z-10" />

                <CardHeader>
                  <CardTitle className="text-2xl">Event Image</CardTitle>
                  <CardDescription>Upload an image or generate one with AI</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="w-full grid grid-cols-2 bg-muted/50 backdrop-blur-sm p-1">
                      <TabsTrigger
                        value="upload"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300"
                      >
                        Upload
                      </TabsTrigger>
                      <TabsTrigger
                        value="generate"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300"
                      >
                        AI Generate
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="space-y-4 mt-4">
                      <div className="flex justify-center">
                        <div className="border-2 border-dashed border-muted rounded-xl p-12 flex flex-col items-center justify-center bg-background/30 backdrop-blur-sm hover:border-purple-300 dark:hover:border-purple-800/30 transition-colors duration-300 group">
                          <div className="p-4 rounded-full bg-muted/50 mb-4 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/20 transition-colors duration-300">
                            <ImageIcon className="h-8 w-8 text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300" />
                          </div>
                          <p className="text-sm text-muted-foreground mb-1 group-hover:text-foreground transition-colors duration-300">
                            Drag and drop an image
                          </p>
                          <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                            or
                          </p>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="mt-2 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all duration-300"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Browse
                          </Button>
                          <input type="file" name="image" id="image" className="hidden" accept="image/*" />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="generate" className="space-y-4 mt-4">
                      <div className="space-y-3">
                        <Label htmlFor="image-prompt" className="text-base">
                          Image Description
                        </Label>
                        <Textarea
                          id="image-prompt"
                          name="image_prompt"
                          placeholder="Describe the image you want to generate..."
                          rows={4}
                          className="bg-background/50 backdrop-blur-sm border-muted focus:border-purple-500 transition-colors duration-300"
                        />
                      </div>
                      <Button
                        type="button"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Image
                      </Button>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl -z-10" />

                <CardHeader>
                  <CardTitle className="text-2xl">Preview</CardTitle>
                  <CardDescription>See how your event will look</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="bg-muted/30 rounded-xl p-6 flex items-center justify-center h-48 border border-muted">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-2">Event preview will appear here</p>
                      <div className="inline-block p-2 rounded-full bg-muted/50">
                        <Ticket className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-12 flex justify-end">
            <Link href="/">
              <Button
                type="button"
                variant="outline"
                className="mr-4 hover:bg-background/80 transition-all duration-300"
              >
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-300"
            >
              Create Event
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

