import { NextResponse } from "next/server";
import { adminClient } from "@/supabase-utils/adminClient";
import { registerUserSchema } from "@/lib/actions/schema";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    const body = await req.json();
    const result = registerUserSchema.safeParse(body);

    if (!result.success) {
        console.error("Zod validation error:", result.error.flatten());
        return NextResponse.json({ error: "Invalid input", details: result.error.flatten() }, { status: 400 });
    }


    const { email, password, username } = result.data;
    const supabaseAdmin = adminClient();

    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: false,
    });

    if (userError || !userData?.user) {
        return NextResponse.json({ error: userError?.message ?? "Failed to create user" }, { status: 500 });
    }

    const { data: profile } = await supabaseAdmin
        .from("profiles")
        .insert({
            id: userData.user.id,
            email: email,
            username
        })
        .select()
        .single();

    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: "signup",
        email,
        password: password,
    });

    if (linkError) {
        return NextResponse.json({ error: linkError.message }, { status: 500 });
    }

    const { hashed_token } = linkData.properties;
    const constructedLink = new URL(`/api/auth/verify?hashed_token=${hashed_token}&type=email&email=${email}`, req.url);

    const transporter = nodemailer.createTransport({
        host: "localhost",
        port: 54325,
    });

    await transporter.sendMail({
        from: "Jeremy Okello <nyangijeremy@gmail.com>",
        to: email,
        subject: "Activate Your Account",
        html: `
      <h1>Welcome to My Developer Blog Application</h1>
      <p>Click below to activate your account:</p>
      <p><a href="${constructedLink.toString()}">Activate Account</a></p>
    `,
    });

    console.log("Sign Up Activation link:", constructedLink);
    return NextResponse.redirect(new URL("/auth/activation-sent", req.url), 302);
}
