"use server"

import { getSupabaseServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function createTestEvents() {
  try {
    console.log("Starting createTestEvents function")
    const supabase = getSupabaseServerClient()

    // Get the current user with more detailed logging
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    console.log("Server-side auth check:", {
      hasSession: !!session,
      sessionError,
      userId: session?.user?.id,
      accessToken: session?.access_token ? "Present" : "Missing",
    })

    if (sessionError) {
      console.error("Session error:", sessionError)
      return { error: { message: "Error checking authentication status" } }
    }

    if (!session || !session.user) {
      console.log("No valid session found on server side")
      return { error: { message: "You must be logged in to create test events" } }
    }

    const userId = session.user.id
    console.log("Creating events for user:", userId)

    // Create an array of 10 test events with different dates
    const testEvents = Array.from({ length: 10 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() + i + 1) // Each event is a day after the previous

      return {
        title: `Test Event ${i + 1}`,
        description: `This is a test event number ${i + 1}`,
        date: date.toISOString(),
        location: `Location ${i + 1}`,
        category: ["movie", "party", "food", "travel", "picnic"][i % 5] as "movie" | "party" | "food" | "travel" | "picnic",
        host_id: userId,
        is_private: false,
      }
    })

    console.log("Attempting to insert events:", testEvents)

    // Insert all test events
    const { data, error } = await supabase
      .from("events")
      .insert(testEvents)
      .select()

    if (error) {
      console.error("Error creating test events:", error)
      return { error: { message: `Failed to create events: ${error.message}` } }
    }

    console.log("Successfully created events:", data)

    // Revalidate the home page and events page
    revalidatePath("/")
    revalidatePath("/events")

    return { success: true, count: testEvents.length }
  } catch (error) {
    console.error("Unexpected error in createTestEvents:", error)
    return { error: { message: `An unexpected error occurred: ${error}` } }
  }
} 