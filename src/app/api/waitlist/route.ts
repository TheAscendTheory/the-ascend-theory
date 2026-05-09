import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email;

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("ascenders_waitlist")
      .insert([{ email }]);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    await resend.emails.send({
      from: "The Ascend Theory <hello@ascendtheoryglobal.com>",
      to: email,
      subject: "Welcome to The Ascend Theory",
      html: `
        <div style="background:#000;padding:40px;font-family:sans-serif;color:white;">
          <h1 style="font-size:40px;">WELCOME ASCENDER.</h1>

          <p style="font-size:18px;color:#aaa;">
            You are now part of the foundation.
          </p>

          <p style="font-size:18px;color:#aaa;">
            Systems. Markets. Mindset.
          </p>

          <br />

          <p style="color:#facc15;">
            THE ASCEND THEORY
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}