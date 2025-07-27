"use client";

import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const errorMessages: Record<string, string> = {
    missing_token: "No token was provided. Please request a new link.",
    no_email_provided: "No email was provided. Please try again.",
    no_verification_type_provided: "Verification type was missing. Please try again.",
    invalid_verification_type: "The verification type is invalid.",
    invalid_magiclink: "The magic link is invalid or expired. Please request a new one.",
    invalid_email: "The email verification link is invalid or expired.",
    recovery_failed: "Password recovery failed. Try requesting a new recovery link.",
    invalid_token: "The token provided is invalid. Please try again from the beginning.",
  };

  const message = errorMessages[type ?? ""] ?? "Something went wrong. Please try again or contact support.";

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-600">Verification Failed</h1>
        <p className="mt-4 text-gray-700">
          {message}
        </p>
      </div>
    </div>
  );
}
