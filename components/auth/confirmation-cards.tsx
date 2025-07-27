import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, CheckCircle, Zap, Clock, ArrowRight } from "lucide-react"

export function ActivationSentCard() {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600/20">
          <Mail className="h-8 w-8 text-green-400" />
        </div>
        <CardTitle className="text-white">Check Your Email</CardTitle>
        <CardDescription className="text-gray-400">We've sent an activation link to your email address</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-gray-800 p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
            <div>
              <h3 className="text-white font-medium">Activation Required</h3>
              <p className="text-gray-400 text-sm mt-1">
                Click the activation link in your email to verify your account and complete the registration process.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-gray-400 text-sm">Didn't receive the email? Check your spam folder or</p>
          <Button
            variant="outline"
            className="border-gray-700 text-green-400 hover:bg-green-600/10 hover:border-green-500 bg-transparent"
          >
            Resend Activation Email
          </Button>
        </div>

        <div className="pt-4 border-t border-gray-800">
          <p className="text-center text-gray-400 text-sm">
            Already activated?{" "}
            <Link href="/auth/login" className="text-green-400 hover:text-green-300 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function MagicLinkSentCard() {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600/20">
          <Zap className="h-8 w-8 text-green-400" />
        </div>
        <CardTitle className="text-white">Magic Link Sent!</CardTitle>
        <CardDescription className="text-gray-400">We've sent a secure login link to your email</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-gray-800 p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
            <div>
              <h3 className="text-white font-medium">Check Your Inbox</h3>
              <p className="text-gray-400 text-sm mt-1">
                Click the magic link in your email to sign in instantly. The link will expire in 15 minutes for
                security.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-blue-600/10 border border-blue-600/20 p-4">
          <div className="flex items-start space-x-3">
            <Zap className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <h3 className="text-blue-400 font-medium">Pro Tip</h3>
              <p className="text-gray-400 text-sm mt-1">
                Keep this tab open and click the link from your email client for the smoothest experience.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-gray-400 text-sm">Didn't receive the email? Check your spam folder or</p>
          <Button
            variant="outline"
            className="border-gray-700 text-green-400 hover:bg-green-600/10 hover:border-green-500 bg-transparent"
          >
            Send Another Magic Link
          </Button>
        </div>

        <div className="pt-4 border-t border-gray-800">
          <p className="text-center text-gray-400 text-sm">
            Want to use a password instead?{" "}
            <Link href="/auth/login" className="text-green-400 hover:text-green-300 font-medium">
              Sign in with password
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function ResetLinkSentCard() {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600/20">
          <Mail className="h-8 w-8 text-green-400" />
        </div>
        <CardTitle className="text-white">Reset Link Sent!</CardTitle>
        <CardDescription className="text-gray-400">We've sent a password reset link to your email</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-gray-800 p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
            <div>
              <h3 className="text-white font-medium">Check Your Email</h3>
              <p className="text-gray-400 text-sm mt-1">
                Click the reset link in your email to create a new password. Make sure to check your spam folder if you
                don't see it.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-amber-600/10 border border-amber-600/20 p-4">
          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-amber-400 mt-0.5" />
            <div>
              <h3 className="text-amber-400 font-medium">Time Sensitive</h3>
              <p className="text-gray-400 text-sm mt-1">
                This reset link will expire in 1 hour for security reasons. If it expires, you'll need to request a new
                one.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-gray-400 text-sm">Didn't receive the email?</p>
          <Button
            variant="outline"
            className="border-gray-700 text-green-400 hover:bg-green-600/10 hover:border-green-500 bg-transparent"
          >
            Resend Reset Link
          </Button>
        </div>

        <div className="pt-4 border-t border-gray-800">
          <p className="text-center text-gray-400 text-sm">
            Remember your password?{" "}
            <Link href="/auth/login" className="text-green-400 hover:text-green-300 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function PasswordResetSuccessCard() {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600/20">
          <CheckCircle className="h-8 w-8 text-green-400" />
        </div>
        <CardTitle className="text-white">Password Updated!</CardTitle>
        <CardDescription className="text-gray-400">Your password has been successfully reset</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-green-600/10 border border-green-600/20 p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
            <div>
              <h3 className="text-green-400 font-medium">Success!</h3>
              <p className="text-gray-400 text-sm mt-1">
                Your password has been updated successfully. You can now sign in with your new password.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/auth/login">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Sign In Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="pt-4 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            Want to go back to the blog?{" "}
            <Link href="/" className="text-green-400 hover:text-green-300 font-medium">
              Visit Senior Dev
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
