import { AuthLayout } from "@/components/auth/auth-layout"
import { MagicLinkSentCard } from "@/components/auth/confirmation-cards"

export default function MagicLinkSentPage() {
  return (
    <AuthLayout showBackToHome>
      <MagicLinkSentCard />
    </AuthLayout>
  )
}
