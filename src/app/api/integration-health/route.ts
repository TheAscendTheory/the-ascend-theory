import { NextResponse } from "next/server";

const requiredTables = [
  "ascenders_waitlist",
  "ascend_profiles",
  "ascend_friendships",
  "ascend_messages",
  "ascend_notifications",
  "ascend_social_posts",
  "ascend_saved_posts",
  "ascend_stories",
  "ascend_user_trades",
  "ascend_demo_accounts",
  "ascend_demo_positions",
  "ascend_academy_progress",
];

async function checkTable(
  supabaseUrl: string,
  key: string,
  table: string
) {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=*&limit=1`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    });

    if (response.ok) {
      return {
        table,
        ok: true,
        status: response.status,
        error: null,
      };
    }

    const body = await response.json().catch(() => null);

    return {
      table,
      ok: false,
      status: response.status,
      error: {
        code: body?.code || null,
        message:
          body?.message ||
          (response.status === 404
            ? "Table was not found in the Supabase REST schema."
            : response.status === 401
              ? "Supabase API key is invalid or not accepted by the REST API."
              : "Supabase table check failed."),
        details: body?.details || null,
        hint: body?.hint || null,
      },
    };
  } catch (error) {
    return {
      table,
      ok: false,
      status: 0,
      error: {
        code: "NETWORK_ERROR",
        message: error instanceof Error ? error.message : "Unable to reach Supabase.",
        details: null,
        hint: null,
      },
    };
  }
}

async function checkSupabaseKey(supabaseUrl: string, key: string, label: string) {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    });

    const body = await response.json().catch(() => null);

    return {
      label,
      ok: response.status !== 401,
      status: response.status,
      message: body?.message || (response.status !== 401 ? "Key accepted." : "Invalid API key."),
      hint: body?.hint || null,
    };
  } catch (error) {
    return {
      label,
      ok: false,
      status: 0,
      message: error instanceof Error ? error.message : "Unable to reach Supabase.",
      hint: null,
    };
  }
}

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  const env = {
    supabaseUrl: Boolean(supabaseUrl),
    supabaseServiceRoleKey: Boolean(serviceKey),
    supabaseAnonKey: Boolean(anonKey),
    resendApiKey: Boolean(resendKey),
    openAiApiKey: Boolean(openAiKey),
  };

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({
      ok: false,
      env,
      tables: [],
      message: "Supabase URL or service role key is missing.",
    });
  }

  const serviceKeyCheck = await checkSupabaseKey(supabaseUrl, serviceKey, "service");
  const anonKeyCheck = {
    label: "anon",
    ok: Boolean(anonKey),
    status: anonKey ? 200 : 0,
    message: anonKey
      ? "Publishable key is configured. Browser RLS access is verified inside signed-in app flows."
      : "Publishable key missing.",
    hint: null,
  };
  const tableKey = serviceKeyCheck.ok ? serviceKey : anonKey || serviceKey;
  const tables = await Promise.all(
    requiredTables.map((table) => checkTable(supabaseUrl, tableKey, table))
  );
  const ok =
    Object.values(env).slice(0, 4).every(Boolean) &&
    serviceKeyCheck.ok &&
    tables.every((table) => table.ok);

  return NextResponse.json({
    ok,
    env,
    keys: [serviceKeyCheck, anonKeyCheck],
    tables,
    message: ok
      ? "Core integrations are reachable."
      : "One or more integrations need attention.",
  });
}
