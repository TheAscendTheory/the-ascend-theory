"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, ChartCandlestick, Flame, MessageCircle, Star, Trophy } from "lucide-react";
import { createBrowserSupabaseClient } from "../lib/supabaseBrowser";

type AccountStats = {
  academyXp: number;
  academyCompleted: number;
  academySaved: number;
  academyStreak: number;
  trades: number;
  socialPosts: number;
};

const emptyStats: AccountStats = {
  academyXp: 0,
  academyCompleted: 0,
  academySaved: 0,
  academyStreak: 0,
  trades: 0,
  socialPosts: 0,
};

function readLocalStats(): AccountStats {
  try {
    const academy = JSON.parse(
      window.localStorage.getItem("ascend-academy-reader-progress") || "{}"
    ) as {
      xp?: number;
      completed?: string[];
      savedQuestions?: string[];
      savedParagraphs?: unknown[];
      streak?: number;
    };
    const trades = JSON.parse(
      window.localStorage.getItem("ascend-trade-journal") || "[]"
    ) as unknown[];

    return {
      academyXp: academy.xp || 0,
      academyCompleted: academy.completed?.length || 0,
      academySaved:
        (academy.savedQuestions?.length || 0) + (academy.savedParagraphs?.length || 0),
      academyStreak: academy.streak || 0,
      trades: trades.length || 0,
      socialPosts: 0,
    };
  } catch {
    return emptyStats;
  }
}

export default function AccountClient() {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [academyLevel, setAcademyLevel] = useState("New Ascender");
  const [stats, setStats] = useState<AccountStats>(emptyStats);
  const [status, setStatus] = useState("");

  const supabase = useMemo(() => {
    return createBrowserSupabaseClient();
  }, []);

  useEffect(() => {
    const restoreLocalStats = window.setTimeout(() => {
      setStats(readLocalStats());
    }, 0);

    return () => window.clearTimeout(restoreLocalStats);
  }, []);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const client = supabase;

    async function loadAccount(userId: string, fallbackHandle = "") {
      const [{ data: profile }, { data: progress }, { data: trades }, { data: posts }] =
        await Promise.all([
          client
            .from("ascend_profiles")
            .select("display_name, handle, academy_level")
            .eq("user_id", userId)
            .maybeSingle(),
          client
            .from("ascend_academy_progress")
            .select("course_id,saved_question,xp_earned")
            .eq("user_id", userId),
          client
            .from("ascend_user_trades")
            .select("id")
            .eq("user_id", userId),
          client
            .from("ascend_social_posts")
            .select("id")
            .eq("user_id", userId),
        ]);

      if (profile) {
        setDisplayName(profile.display_name || "");
        setHandle(profile.handle || fallbackHandle);
        setAcademyLevel(profile.academy_level || "New Ascender");
      }

      setStats((current) => ({
        ...current,
        academyXp: Math.max(
          current.academyXp,
          (progress || []).reduce((total, row) => total + (row.xp_earned || 0), 0)
        ),
        academyCompleted: Math.max(
          current.academyCompleted,
          new Set((progress || []).filter((row) => row.course_id).map((row) => row.course_id)).size
        ),
        academySaved: Math.max(
          current.academySaved,
          (progress || []).filter((row) => row.saved_question).length
        ),
        trades: Math.max(current.trades, trades?.length || 0),
        socialPosts: Math.max(current.socialPosts, posts?.length || 0),
      }));
    }

    client.auth.getUser().then(({ data }) => {
      const user = data.user;

      if (user) {
        const savedHandle = String(user.user_metadata.handle || "");

        setUserId(user.id);
        setUserEmail(user.email || "");
        setDisplayName(String(user.user_metadata.display_name || ""));
        setHandle(savedHandle);
        loadAccount(user.id, savedHandle);
      }
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      setUserId(user?.id || "");
      setUserEmail(user?.email || "");
      setDisplayName(String(user?.user_metadata.display_name || ""));
      setHandle(String(user?.user_metadata.handle || ""));
      if (user?.id) {
        loadAccount(user.id, String(user.user_metadata.handle || ""));
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setStatus("Account sign-in is unavailable.");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/account`,
      },
    });

    setStatus(
      error
        ? error.message
        : "Check your email for the secure sign-in link."
    );
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setStatus("Profile saving is unavailable.");
      return;
    }

    const cleanHandle = handle
      .trim()
      .toLowerCase()
      .replace(/^@/, "")
      .replace(/[^a-z0-9_]/g, "");

    const { error } = await supabase.auth.updateUser({
      data: {
        display_name: displayName,
        handle: cleanHandle,
      },
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    if (userId) {
      const { error: profileError } = await supabase.from("ascend_profiles").upsert({
        user_id: userId,
        display_name: displayName.trim() || userEmail.split("@")[0] || "Ascender",
        handle: cleanHandle || null,
        updated_at: new Date().toISOString(),
      });

      setStatus(profileError ? profileError.message : "Profile saved.");
      return;
    }

    setStatus("Profile saved.");
  }

  async function signOut() {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setUserId("");
    setUserEmail("");
    setDisplayName("");
    setHandle("");
    setAcademyLevel("New Ascender");
    setStats(readLocalStats());
    setStatus("Signed out.");
  }

  return (
    <div className="accountCommandCenter">
      <section className="accountHeroCard">
        <div>
          <p className="eyebrow">Ascender Profile</p>
          <h2>{displayName || handle || userEmail?.split("@")[0] || "New Ascender"}</h2>
          <p>
            {userEmail
              ? `Signed in as ${userEmail}. Your learning, trading, and social progress can follow this profile.`
              : "Create a profile to carry Academy progress, journal records, saved study material, and social identity across the platform."}
          </p>
        </div>
        <div className="accountIdentityBadge">
          <span>{handle ? `@${handle.replace(/^@/, "")}` : "Handle not set"}</span>
          <strong>{academyLevel}</strong>
        </div>
      </section>

      <section className="accountStatsGrid" aria-label="Account progress stats">
        <article>
          <Trophy size={18} />
          <span>Academy XP</span>
          <strong>{stats.academyXp}</strong>
        </article>
        <article>
          <Star size={18} />
          <span>Modules</span>
          <strong>{stats.academyCompleted}/16</strong>
        </article>
        <article>
          <BookOpen size={18} />
          <span>Saved Study</span>
          <strong>{stats.academySaved}</strong>
        </article>
        <article>
          <Flame size={18} />
          <span>Streak</span>
          <strong>{stats.academyStreak}</strong>
        </article>
        <article>
          <ChartCandlestick size={18} />
          <span>Trades</span>
          <strong>{stats.trades}</strong>
        </article>
        <article>
          <MessageCircle size={18} />
          <span>Posts</span>
          <strong>{stats.socialPosts}</strong>
        </article>
      </section>

      <div className="accountPanel">
        <section className="accountCard">
        <p className="eyebrow">Access</p>
        <h2>{userEmail ? "Your Profile" : "Create Your Profile"}</h2>

        {!supabase && (
          <p>
            Account sign-in is unavailable.
          </p>
        )}

        {!userEmail ? (
          <form onSubmit={signIn} className="accountForm">
            <label>
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </label>

            <button type="submit">Send Sign-In Link</button>
          </form>
        ) : (
          <form onSubmit={saveProfile} className="accountForm">
            <label>
              Email
              <input value={userEmail} disabled />
            </label>

            <label>
              Display Name
              <input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Ascender name"
              />
            </label>

            <label>
              Handle
              <input
                value={handle}
                onChange={(event) => setHandle(event.target.value)}
                placeholder="ascender_name"
              />
            </label>

            <div className="accountActions">
              <button type="submit">Save Profile</button>
              <button type="button" onClick={signOut}>
                Sign Out
              </button>
            </div>
          </form>
        )}

        {status && <p className="accountStatus">{status}</p>}
      </section>

      <section className="accountCard">
        <p className="eyebrow">Command Links</p>
        <h2>Keep moving.</h2>
        <p>
          Jump back into the main loops that build your profile: study, trade
          prep, journaling, and community activity.
        </p>
        <div className="accountQuickLinks">
          <Link href="/learn">Open Academy</Link>
          <Link href="/resources/market-dashboard">Trading Desk</Link>
          <Link href="/resources/trade-journal">Trade Journal</Link>
          <Link href="/social">Social Hub</Link>
        </div>
      </section>
      </div>
    </div>
  );
}
