"use client"

import type React from "react"
import { useAction } from "next-safe-action/hooks";
import { loginUser } from "@/lib/actions/auth/pw";
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Lock, Zap } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { execute: login, result: loginResult, status: loginStatus } = useAction(loginUser);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
    console.log(loginResult.data)
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }

    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }


  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Welcome Back</CardTitle>
        <CardDescription className="text-gray-400">Choose your preferred sign-in method</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="email" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Lock className="w-4 h-4 mr-2" />
              Email & Password
            </TabsTrigger>
            <TabsTrigger value="magic" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Zap className="w-4 h-4 mr-2" />
              Magic Link
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4 mt-6">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={loginStatus === "executing"}
              >
                {loginStatus === "executing" ? "Signing in..." : "Sign In"}
              </Button>

              <div className="text-center">
                <Link href="/auth/forgot-password" className="text-sm text-green-400 hover:text-green-300">
                  Forgot your password?
                </Link>
              </div>
            </form>
            {loginResult.data?.success && (
              <p className="text-green-400 text-sm mt-2 text-center">{loginResult.data.success}</p>
            )}

            {loginResult.serverError && (
              <p className="text-red-400 text-sm mt-2 text-center">{loginResult.serverError}</p>
            )}

            {loginResult.validationErrors?._errors?.[0] && (
              <p className="text-red-400 text-sm mt-2 text-center">{loginResult.validationErrors._errors[0]}</p>
            )}

          </TabsContent>

          <TabsContent value="magic" className="space-y-4 mt-6">
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="magic-email" className="text-white">
                  Email
                </Label>
                <Input
                  id="magic-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
                <Mail className="w-4 h-4 mr-2" />
                {loading ? "Sending..." : "Send Magic Link"}
              </Button>
            </form>
            <p className="text-sm text-gray-400 text-center">We'll send you a secure link to sign in instantly</p>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-green-400 hover:text-green-300 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
