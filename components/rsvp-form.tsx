"use client"

import type React from "react"

import { useState } from "react"
import { Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { submitRsvp } from "@/app/actions/event-actions"

interface RsvpFormProps {
  eventId: string
}

export function RsvpForm({ eventId }: RsvpFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [rsvpStatus, setRsvpStatus] = useState<string | null>(null)
  const [note, setNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      // Redirect to login if not authenticated
      router.push(`/auth/login?redirect=/events/${eventId}`)
      return
    }

    if (!rsvpStatus) {
      toast.error("RSVP status required", {
        description: "Please select your RSVP status"
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("event_id", eventId)
      formData.append("status", rsvpStatus)
      formData.append("note", note)

      const result = await submitRsvp(formData)

      if (result.error) {
        toast.error("RSVP failed", {
          description: result.error.message
        })
        return
      }

      toast.success("RSVP submitted", {
        description: "Your RSVP has been submitted successfully"
      })

      // Refresh the page to show the updated RSVP
      router.refresh()
    } catch (error) {
      console.error("RSVP error:", error)
      toast.error("RSVP failed", {
        description: "An unexpected error occurred. Please try again."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <RadioGroup value={rsvpStatus || ""} onValueChange={setRsvpStatus} className="space-y-3">
        <div className="flex items-center space-x-2 p-3 rounded-lg bg-background/50 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors duration-300">
          <RadioGroupItem value="going" id="going" className="text-green-600 border-green-600" />
          <Label htmlFor="going" className="flex items-center text-base cursor-pointer">
            <div className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/30 mr-2">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            Going
          </Label>
        </div>

        <div className="flex items-center space-x-2 p-3 rounded-lg bg-background/50 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors duration-300">
          <RadioGroupItem value="maybe" id="maybe" className="text-amber-600 border-amber-600" />
          <Label htmlFor="maybe" className="flex items-center text-base cursor-pointer">
            <div className="p-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 mr-2">
              <span className="block h-4 w-4 text-center text-amber-600 dark:text-amber-400 font-bold">?</span>
            </div>
            Maybe
          </Label>
        </div>

        <div className="flex items-center space-x-2 p-3 rounded-lg bg-background/50 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors duration-300">
          <RadioGroupItem value="not-going" id="not-going" className="text-red-600 border-red-600" />
          <Label htmlFor="not-going" className="flex items-center text-base cursor-pointer">
            <div className="p-1.5 rounded-full bg-red-100 dark:bg-red-900/30 mr-2">
              <X className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            Not Going
          </Label>
        </div>
      </RadioGroup>

      <div className="space-y-3">
        <Label htmlFor="note" className="text-base">
          Add a note (optional)
        </Label>
        <Textarea
          id="note"
          placeholder="Add a note to the host..."
          value={note}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
          className="bg-background/50 backdrop-blur-sm border-muted focus:border-purple-500 transition-colors duration-300"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-300"
        disabled={!rsvpStatus || isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit RSVP"}
      </Button>
    </form>
  )
}

