import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50 flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 blur-3xl -z-10" />

      <div className="container mx-auto py-12 px-4 sm:px-6 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist or has been moved.</p>

        <div className="flex flex-col items-center justify-center gap-4">
          <Link href="/">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-300">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

