import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "Email required." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("ascenders_waitlist")
      .upsert(
        {
          email,
          source: "website",
          status: "active",
        },
        {
          onConflict: "email",
          ignoreDuplicates: true,
        }
      );

    if (error) {
      return NextResponse.json(
        { error: "Database error." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Welcome to The Ascend Theory.",
    });

  } catch {
    return NextResponse.json(
      { error: "Server error." },
      { status: 500 }
    );
  }
}