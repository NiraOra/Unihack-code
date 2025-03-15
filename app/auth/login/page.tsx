"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const { signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/"
  const { toast } = useToast()

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [eventCode, setEventCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await signIn(email, password)

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      // Redirect to the requested page or home
      router.push(redirectTo)
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEventCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Implement event code login
      toast({
        title: "Event code login",
        description: "This feature is not yet implemented.",
        variant: "default",
      })
    } catch (error) {
      console.error("Event code error:", error)
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50 flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 blur-3xl -z-10" />

      <div className="container mx-auto flex items-center justify-center py-12 px-4 sm:px-6">
        <Card className="mx-auto max-w-md w-full border-0 shadow-2xl bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl -z-10" />

          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center">Sign in to manage your events or join as a guest</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50 backdrop-blur-sm p-1">
                <TabsTrigger
                  value="account"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300"
                >
                  Account
                </TabsTrigger>
                <TabsTrigger
                  value="event-code"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300"
                >
                  Event Code
                </TabsTrigger>
              </TabsList>

              <TabsContent value="account" className="mt-0">
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-base">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-background/50 backdrop-blur-sm border-muted focus:border-purple-500 transition-colors duration-300"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-base">
                        Password
                      </Label>
                      <Link
                        href="/auth/forgot-password"
                        className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-background/50 backdrop-blur-sm border-muted focus:border-purple-500 transition-colors duration-300"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="event-code" className="mt-0">
                <form onSubmit={handleEventCodeSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="event-code" className="text-base">
                      Event Code or Password
                    </Label>
                    <Input
                      id="event-code"
                      placeholder="Enter event code"
                      value={eventCode}
                      onChange={(e) => setEventCode(e.target.value)}
                      required
                      className="bg-background/50 backdrop-blur-sm border-muted focus:border-purple-500 transition-colors duration-300"
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter the event code or password provided by the host
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? "Joining..." : "Join Event"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex flex-col space-y-6">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              <Button
                type="button"
                variant="outline"
                className="bg-background/50 backdrop-blur-sm hover:bg-gradient-to-r hover:from-[#4285F4]/90 hover:to-[#4285F4]/80 hover:text-white hover:border-transparent transition-all duration-300"
                disabled={isLoading}
              >
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="bg-background/50 backdrop-blur-sm hover:bg-gradient-to-r hover:from-[#000000]/90 hover:to-[#000000]/80 hover:text-white hover:border-transparent transition-all duration-300"
                disabled={isLoading}
              >
                Apple
              </Button>
            </div>

            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

