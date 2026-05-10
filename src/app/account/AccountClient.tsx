"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createBrowserSupabaseClient } from "../lib/supabaseBrowser";

export default function AccountClient() {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [userEmail, setUserEmail] = useState("");
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
        setUserEmail(user.email || "");
        setDisplayName(String(user.user_metadata.display_name || ""));
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      setUserEmail(user?.email || "");
      setDisplayName(String(user?.user_metadata.display_name || ""));
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setStatus("Supabase Auth needs public environment keys before sign-in works.");
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
      setStatus("Supabase Auth needs public environment keys before profile saving works.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      data: {
        display_name: displayName,
      },
    });

    setStatus(error ? error.message : "Profile saved.");
  }

  async function signOut() {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setUserEmail("");
    setDisplayName("");
    setStatus("Signed out.");
  }

  return (
    <div className="accountPanel">
      <section className="accountCard">
        <p className="eyebrow">Access</p>
        <h2>{userEmail ? "Your Profile" : "Create Your Profile"}</h2>

        {!supabase && (
          <p>
            The interface is ready, but sign-in needs
            <code>NEXT_PUBLIC_SUPABASE_URL</code> and
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> added to the project
            environment.
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
        <h2>Profile-based tools.</h2>
        <p>
          Once Supabase Auth is enabled, this account system can connect the
          trade journal, saved watchlists, alert plans, saved notes, course
          progress, and member resources to each user profile.
        </p>
      </section>
    </div>
  );
}
