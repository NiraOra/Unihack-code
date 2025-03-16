import { NextResponse } from "next/server"
import { google } from "googleapis"

// Google Calendar API setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
)

// Set credentials using refresh token
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
})

const calendar = google.calendar({ version: "v3", auth: oauth2Client })

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { summary, description, location, startTime, endTime } = body

    // Create the event
    const event = {
      summary,
      description,
      location,
      start: {
        dateTime: startTime,
        timeZone: "UTC", // You can make this dynamic based on user's timezone
      },
      end: {
        dateTime: endTime,
        timeZone: "UTC", // You can make this dynamic based on user's timezone
      },
    }

    // Insert the event to Google Calendar
    const response = await calendar.events.insert({
      calendarId: "primary", // Use 'primary' for the user's primary calendar
      requestBody: event,
    })

    return NextResponse.json({
      success: true,
      message: "Event created successfully",
      eventId: response.data.id,
      htmlLink: response.data.htmlLink, // Link to view the event in Google Calendar
    })
  } catch (error) {
    console.error("Error creating Google Calendar event:", error)
    return NextResponse.json({ success: false, message: "Failed to create event in Google Calendar" }, { status: 500 })
  }
}