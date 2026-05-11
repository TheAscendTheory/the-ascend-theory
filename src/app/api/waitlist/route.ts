import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServerKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const resendApiKey = process.env.RESEND_API_KEY;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getWaitlistClients() {
  if (!supabaseUrl || !supabaseServerKey) {
    return null;
  }

  return {
    supabase: createClient(supabaseUrl, supabaseServerKey),
    resend: resendApiKey ? new Resend(resendApiKey) : null,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email) {
      return NextResponse.json({ error: "Email required." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const clients = getWaitlistClients();

    if (!clients) {
      console.error("Waitlist API missing environment variables:", {
        supabaseUrl: Boolean(supabaseUrl),
        supabaseServerKey: Boolean(supabaseServerKey),
      });

      return NextResponse.json(
        { error: "Waitlist is not configured yet." },
        { status: 503 }
      );
    }

    const { error } = await clients.supabase
      .from("ascenders_waitlist")
      .insert([{ email }]);

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({
          success: true,
          message:
            "You are already on the Ascenders list. The starter guide is available on the Resources page.",
        });
      }

      console.error("Supabase waitlist error:", error);

      return NextResponse.json(
        { error: "Unable to join the waitlist right now." },
        { status: 500 }
      );
    }

    if (clients.resend) {
      const { error: emailError } = await clients.resend.emails.send({
        from: "The Ascend Theory <contact@theascendtheory.com>",
        to: email,
        subject: "Welcome to The Ascend Theory",
        html: `
          <div style="background:#030303;padding:44px;font-family:Arial,Helvetica,sans-serif;color:white;">
            <div style="max-width:640px;margin:0 auto;">
              <p style="color:#facc15;font-size:12px;letter-spacing:0.24em;text-transform:uppercase;margin:0 0 24px;">
                The Ascend Theory
              </p>

              <h1 style="font-size:40px;line-height:1;margin:0 0 24px;color:white;">
                Welcome Ascender.
              </h1>

              <p style="font-size:18px;line-height:1.7;color:#b5b5b5;margin:0 0 18px;">
                You are now part of the early foundation.
              </p>

              <p style="font-size:18px;line-height:1.7;color:#b5b5b5;margin:0 0 28px;">
                The Ascend Theory is building a media and education ecosystem around financial literacy, systems, markets, mindset, technology, and execution.
              </p>

              <div style="border:1px solid rgba(250,204,21,0.28);background:rgba(250,204,21,0.06);border-radius:18px;padding:24px;margin:30px 0;">
                <h2 style="font-size:24px;line-height:1.1;margin:0 0 14px;color:white;">
                  Your starter resource is ready.
                </h2>

                <p style="font-size:16px;line-height:1.7;color:#b5b5b5;margin:0 0 22px;">
                  Start with The Ascender Starter Guide: a practical introduction to financial literacy, market awareness, discipline, systems, AI literacy, and execution.
                </p>

                <a href="https://theascendtheory.com/the-ascender-starter-guide.html" style="display:inline-block;background:#facc15;color:#000;padding:14px 20px;border-radius:999px;font-weight:700;text-decoration:none;">
                  Open The Starter Guide
                </a>
              </div>

              <div style="border-top:1px solid rgba(255,255,255,0.12);padding-top:24px;margin-top:32px;">
                <p style="color:#facc15;font-weight:700;letter-spacing:0.18em;margin:0;">
                  SYSTEMS. MARKETS. MINDSET.
                </p>
              </div>
            </div>
          </div>
        `,
      });

      if (emailError) {
        console.error("Resend welcome email error:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: clients.resend
        ? "Welcome email sent. The starter guide is on its way."
        : "You are on the Ascenders list. The starter guide is available on the Resources page.",
    });
  } catch (err) {
    console.error("Waitlist API error:", err);

    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
