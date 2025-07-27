import type React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  showBackToLogin?: boolean
  showBackToHome?: boolean
}

export function AuthLayout({
  children,
  title,
  description,
  showBackToLogin = false,
  showBackToHome = false,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          {showBackToHome && (
            <Link href="/" className="inline-flex items-center text-green-400 hover:text-green-300 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Senior Dev
            </Link>
          )}
          {showBackToLogin && (
            <Link href="/auth/login" className="inline-flex items-center text-green-400 hover:text-green-300 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Link>
          )}
          <div className="flex items-center justify-center mb-2">
            <span className="text-green-400 text-2xl font-bold">{"<>"}</span>
            <span className="text-white text-2xl font-bold ml-2">Senior</span>
            <span className="text-white text-2xl font-bold">Dev</span>
          </div>
          {title && <h1 className="text-white text-xl font-semibold mb-2">{title}</h1>}
          {description && <p className="text-gray-400">{description}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}
