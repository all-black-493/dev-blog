"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function AuthSuccessPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const router = useRouter();

  const [secondsRemaining, setSecondsRemaining] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      router.push("/");
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router]);

  const successMessages: Record<string, string> = {
    email: "Your email has been verified successfully.",
    magiclink: "Login successful. You are now signed in.",
    recovery: "Password reset successful. You can now access your account.",
  };

  const message =
    successMessages[type ?? ""] ?? "You have been successfully authenticated.";

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-green-600">Success</h1>
        <p className="mt-4 text-gray-700">{message}</p>
        <p className="mt-2 text-sm text-gray-500">
          Redirecting to homepage in {secondsRemaining} second{secondsRemaining !== 1 && "s"}...
        </p>
      </div>
    </div>
  );
}
