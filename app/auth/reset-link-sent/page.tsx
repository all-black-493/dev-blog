import { AuthLayout } from "@/components/auth/auth-layout"
import { ResetLinkSentCard } from "@/components/auth/confirmation-cards"

export default function ResetLinkSentPage() {
  return (
    <AuthLayout showBackToLogin>
      <ResetLinkSentCard />
    </AuthLayout>
  )
}
