import { NextResponse } from "next/server";
import { adminClient } from "@/supabase-utils/adminClient";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const supabaseAdmin = adminClient();

  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: "recovery",
    email,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { hashed_token } = data.properties;
  const constructedLink = new URL(
    `/api/auth/verify?hashed_token=${hashed_token}&type=recovery&email=${email}`,
    req.url
  );

  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 54325,
  });

  await transporter.sendMail({
    from: "Jeremy Okello <nyangijeremy@gmail.com>",
    to: email,
    subject: "Reset Your Password",
    html: `
      <h1>Password Reset Request</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${constructedLink.toString()}">Reset Password</a>
    `,
  });

  return NextResponse.redirect(new URL("/auth/reset-link-sent", req.url));
}
