"use server"

import { getSupabaseServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function createEvent(formData: FormData) {
  const supabase = getSupabaseServerClient()

  // Get the current user
  const cookieStore = cookies()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { error: { message: "You must be logged in to create an event" } }
  }

  const userId = session.user.id

  // Extract form data
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const dateStr = formData.get("date") as string
  const timeStr = formData.get("time") as string
  const location = formData.get("location") as string
  const category = formData.get("category") as "movie" | "party" | "food" | "travel" | "picnic"
  const isPrivate = formData.get("is_private") === "on"
  const eventPassword = isPrivate ? (formData.get("event_password") as string) : null

  // Combine date and time
  const date = new Date(`${dateStr}T${timeStr}`)

  // Validate required fields
  if (!title || !dateStr || !timeStr || !category) {
    return { error: { message: "Missing required fields" } }
  }

  // Create the event
  const { data: event, error } = await supabase
    .from("events")
    .insert({
      title,
      description,
      date: date.toISOString(),
      location,
      category,
      is_private: isPrivate,
      event_password: eventPassword,
      host_id: userId,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating event:", error)
    return { error }
  }

  // Revalidate the home page to show the new event
  revalidatePath("/")

  // Redirect to the event page
  redirect(`/events/${event.id}`)
}

export async function submitRsvp(formData: FormData) {
  const supabase = getSupabaseServerClient()

  // Get the current user
  const cookieStore = cookies()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { error: { message: "You must be logged in to RSVP" } }
  }

  const userId = session.user.id

  // Extract form data
  const eventId = formData.get("event_id") as string
  const status = formData.get("status") as "going" | "maybe" | "not-going"
  const note = formData.get("note") as string

  // Check if user already has an RSVP for this event
  const { data: existingRsvp } = await supabase
    .from("attendees")
    .select()
    .eq("event_id", eventId)
    .eq("user_id", userId)
    .maybeSingle()

  let result

  if (existingRsvp) {
    // Update existing RSVP
    result = await supabase
      .from("attendees")
      .update({
        status,
        note,
      })
      .eq("id", existingRsvp.id)
  } else {
    // Create new RSVP
    result = await supabase.from("attendees").insert({
      event_id: eventId,
      user_id: userId,
      status,
      note,
    })
  }

  if (result.error) {
    console.error("Error submitting RSVP:", result.error)
    return { error: result.error }
  }

  // Revalidate the event page to show the updated RSVP
  revalidatePath(`/events/${eventId}`)

  return { success: true }
}

