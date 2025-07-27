import { AuthLayout } from "@/components/auth/auth-layout"
import { ActivationSentCard } from "@/components/auth/confirmation-cards"

export default function ActivationSentPage() {
  return (
    <AuthLayout showBackToHome>
      <ActivationSentCard />
    </AuthLayout>
  )
}
