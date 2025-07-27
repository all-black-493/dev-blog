"use client"
import { AuthLayout } from "@/components/auth/auth-layout"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

interface PageProps {
  searchParams: { token?: string }
}

export default function ResetPasswordPage({ searchParams }: PageProps) {
  return (
    <AuthLayout description="Create your new password" showBackToLogin>
      <ResetPasswordForm token={searchParams.token || null} />
    </AuthLayout>
  )
}
