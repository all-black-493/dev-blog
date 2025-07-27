import { AuthLayout } from "@/components/auth/auth-layout"
import { PasswordResetSuccessCard } from "@/components/auth/confirmation-cards"

export default function PasswordResetSuccessPage() {
  return (
    <AuthLayout>
      <PasswordResetSuccessCard />
    </AuthLayout>
  )
}
