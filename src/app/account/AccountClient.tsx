"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createBrowserSupabaseClient } from "../lib/supabaseBrowser";

export default function AccountClient() {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [academyLevel, setAcademyLevel] = useState("New Ascender");
  const [status, setStatus] = useState("");

  const supabase = useMemo(() => {
    return createBrowserSupabaseClient();
  }, []);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;

      if (user) {
        const savedHandle = String(user.user_metadata.handle || "");

        setUserId(user.id);
        setUserEmail(user.email || "");
        setDisplayName(String(user.user_metadata.display_name || ""));
        setHandle(savedHandle);
        supabase
          .from("ascend_profiles")
          .select("display_name, handle, academy_level")
          .eq("user_id", user.id)
          .maybeSingle()
          .then(({ data }) => {
            if (data) {
              setDisplayName(data.display_name || "");
              setHandle(data.handle || savedHandle);
              setAcademyLevel(data.academy_level || "New Ascender");
            }
          });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      setUserId(user?.id || "");
      setUserEmail(user?.email || "");
      setDisplayName(String(user?.user_metadata.display_name || ""));
      setHandle(String(user?.user_metadata.handle || ""));
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
    setStatus("Signed out.");
  }

  return (
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
        <p className="eyebrow">Next Layer</p>
        <h2>{academyLevel}</h2>
        <p>
          Your Ascend Academy level appears here as you complete structured lessons,
          pass quizzes, earn XP, and unlock badges across the learning system.
        </p>
      </section>
    </div>
  );
}
