"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const { signUp } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreedToTerms) {
      toast({
        title: "Terms required",
        description: "You must agree to the Terms of Service and Privacy Policy",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await signUp(email, password, { full_name: name })

      if (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      // Show success message
      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account.",
        variant: "default",
      })

      // Redirect to login page
      router.push("/auth/login")
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration failed",
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
              Create an Account
            </CardTitle>
            <CardDescription className="text-center">Enter your information to create an account</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base">
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-background/50 backdrop-blur-sm border-muted focus:border-purple-500 transition-colors duration-300"
                />
              </div>

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
                <Label htmlFor="password" className="text-base">
                  Password
                </Label>
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
                <p className="text-sm text-muted-foreground">Password must be at least 8 characters long</p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  className="text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-purple-600 dark:text-purple-400 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-purple-600 dark:text-purple-400 hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
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
              Already have an account?{" "}
              <Link href="/auth/login" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

