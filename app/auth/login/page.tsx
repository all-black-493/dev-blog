"use client"
import { AuthLayout } from "@/components/auth/auth-layout"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <AuthLayout description="Sign in to comment and engage with posts" showBackToHome>
      <LoginForm />
    </AuthLayout>
  )
}
