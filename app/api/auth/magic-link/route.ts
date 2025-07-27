import { NextResponse } from "next/server";
import { adminClient } from "@/supabase-utils/adminClient";
import nodemailer from 'nodemailer';
import { loginWithMagicLinkSchema } from "@/lib/actions/schema";

export async function POST(req: Request) {
  const body = await req.json();
  const parse = loginWithMagicLinkSchema.safeParse(body);

  if (!parse.success) {
    return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
  }

  const supabaseAdmin = adminClient();

  const { data: linkData, error } = await supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email: parse.data.email,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { hashed_token } = linkData.properties;

  const constructedLink = new URL(`/api/auth/verify`, req.url)
  constructedLink.searchParams.set("hashed_token", hashed_token)
  constructedLink.searchParams.set("type", "magiclink")
  constructedLink.searchParams.set("email", parse.data.email)

  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 54325
  })

  await transporter.sendMail({
    from: "Jeremy Okello <nyangijeremy@gmail.com>",
    to: parse.data.email,
    subject: " Log in with Magic Link ",
    html: `
  <h1>Hi there, this is a bespoke magic link email!</h1>
  <p>Click this link to log in: <a href="${constructedLink.toString()}">${constructedLink.toString()}</a></p>
  `
  })

  console.log("Magic login link:", constructedLink);

  return NextResponse.redirect(new URL("/auth/magic-link-sent", req.url), 302);
}
