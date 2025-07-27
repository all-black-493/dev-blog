"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Shield } from "lucide-react"
import { useRouter } from "next/navigation"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      router.push("/auth/reset-link-sent")
    }, 2000)
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600/20">
          <Shield className="h-8 w-8 text-green-400" />
        </div>
        <CardTitle className="text-white">Forgot Password?</CardTitle>
        <CardDescription className="text-gray-400">
          No worries! Enter your email and we'll send you a reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500 pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
            {loading ? "Sending Reset Link..." : "Send Reset Link"}
          </Button>
        </form>

        <div className="mt-6 rounded-lg bg-gray-800 p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <h3 className="text-blue-400 font-medium text-sm">Security Note</h3>
              <p className="text-gray-400 text-sm mt-1">
                For your security, password reset links expire after 1 hour and can only be used once.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Remember your password?{" "}
            <Link href="/auth/login" className="text-green-400 hover:text-green-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
