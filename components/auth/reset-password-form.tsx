"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Eye, EyeOff, CheckCircle, X } from "lucide-react"
import { useRouter } from "next/navigation"

interface ResetPasswordFormProps {
  token: string | null
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const passwordRequirements = [
    { text: "At least 8 characters", met: formData.password.length >= 8 },
    { text: "Contains uppercase letter", met: /[A-Z]/.test(formData.password) },
    { text: "Contains lowercase letter", met: /[a-z]/.test(formData.password) },
    { text: "Contains number", met: /\d/.test(formData.password) },
    { text: "Contains special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    const allRequirementsMet = passwordRequirements.every((req) => req.met)
    if (!allRequirementsMet) {
      alert("Please meet all password requirements")
      return
    }

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      router.push("/auth/password-reset-success")
    }, 2000)
  }

  if (!token) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="text-center p-8">
          <X className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-white text-xl font-semibold mb-2">Invalid Reset Link</h2>
          <p className="text-gray-400 mb-4">This password reset link is invalid or has expired.</p>
          <Link href="/auth/forgot-password">
            <Button className="bg-green-600 hover:bg-green-700">Request New Reset Link</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Reset Password</CardTitle>
        <CardDescription className="text-gray-400">Enter your new password below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500 pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">
              Confirm New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500 pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {formData.password && (
            <div className="rounded-lg bg-gray-800 p-4">
              <h3 className="text-white font-medium text-sm mb-3">Password Requirements</h3>
              <div className="space-y-2">
                {passwordRequirements.map((requirement, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {requirement.met ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <X className="h-4 w-4 text-gray-500" />
                    )}
                    <span className={`text-sm ${requirement.met ? "text-green-400" : "text-gray-400"}`}>
                      {requirement.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <div className="rounded-lg bg-red-600/10 border border-red-600/20 p-3">
              <div className="flex items-center space-x-2">
                <X className="h-4 w-4 text-red-400" />
                <span className="text-red-400 text-sm">Passwords do not match</span>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={
              loading || !passwordRequirements.every((req) => req.met) || formData.password !== formData.confirmPassword
            }
          >
            {loading ? "Updating Password..." : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
