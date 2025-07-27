"use client"
import { AuthLayout } from "@/components/auth/auth-layout"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <AuthLayout description="Reset your password securely" showBackToLogin>
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
