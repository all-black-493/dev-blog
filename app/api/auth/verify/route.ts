import { NextResponse } from "next/server";
import { createClient } from "@/supabase-utils/server";

export async function GET(req: Request) {
  const requestUrl = new URL(req.url);
  const hashedToken = requestUrl.searchParams.get("hashed_token");
  const type = requestUrl.searchParams.get("type");
  const email = requestUrl.searchParams.get("email");

  if (!hashedToken) {
    return NextResponse.redirect(new URL("/auth/error?type=missing_token", requestUrl.origin));
  }

  if (!email) {
    return NextResponse.redirect(new URL("/auth/error?type=no_email_provided", requestUrl.origin));
  }

  if (!type) {
    return NextResponse.redirect(new URL("/auth/error?type=no_verification_type_provided", requestUrl.origin));
  }

  const allowedTypes = ["email", "magiclink", "recovery"];
  if (!allowedTypes.includes(type)) {
    return NextResponse.redirect(new URL("/auth/error?type=invalid_verification_type", requestUrl.origin));
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    token_hash: hashedToken,
    type: type as "email" | "magiclink" | "recovery",
  });

  if (error) {
    let errorType = "invalid_token";
    if (type === "magiclink") errorType = "invalid_magiclink";
    else if (type === "email") errorType = "invalid_email";
    else if (type === "recovery") errorType = "recovery_failed";

    console.log("The cause of the problem: ", error.message)

    return NextResponse.redirect(new URL(`/auth/error?type=${errorType}`, requestUrl.origin));
  }

  const successTypeMap: Record<string, string> = {
    email: "email_confirmed",
    magiclink: "login_successful",
    recovery: "password_reset_successful",
  };

  const successType = successTypeMap[type];

  return NextResponse.redirect(new URL(`/auth/success?type=${successType}`, requestUrl.origin));
}
