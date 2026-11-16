"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SUPABASE_URL } from "@/lib/supabase/env";
import { portalAuth } from "@/content/portal";

type Mode = "signIn" | "signUp" | "forgot";

interface AuthFormProps {
  initialError?: string;
}

const inputClass =
  "w-full px-4 py-3 rounded-[3px] border border-psc-border bg-psc-bg font-sans text-base text-psc-ink focus:outline-none focus:border-psc-ink focus-visible:ring-2 focus-visible:ring-psc-ink/20";
const labelClass = "block mb-2 font-sans text-sm font-medium text-psc-ink";
const linkClass =
  "font-sans text-sm text-psc-ink underline underline-offset-4 hover:text-psc-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-ink";

export default function AuthForm({ initialError }: AuthFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initialError ?? "");
  const [notice, setNotice] = useState("");

  const copy = portalAuth[mode];

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    setNotice("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (!SUPABASE_URL) {
      setError(portalAuth.errors.notConfigured);
      return;
    }
    if (mode === "signUp" && password.length < 8) {
      setError(portalAuth.errors.shortPassword);
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const callback = `${window.location.origin}/portal/auth/callback`;

    if (mode === "signIn") {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setError(err.message);
        setBusy(false);
        return;
      }
      router.push("/portal/dashboard");
      router.refresh();
      return;
    }

    if (mode === "signUp") {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: callback },
      });
      if (err) {
        setError(err.message);
      } else if (data.session) {
        // "Confirm email" is off in Supabase: the user is signed in already.
        // The dashboard shows the pending screen until PSC approves them.
        router.push("/portal/dashboard");
        router.refresh();
        return;
      } else {
        setNotice(portalAuth.signUp.sent);
      }
    } else {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${callback}?next=/portal/reset`,
      });
      if (err) setError(err.message);
      else setNotice(portalAuth.forgot.sent);
    }
    setBusy(false);
  }

  return (
    <div>
      <h1
        className="font-display text-psc-ink mb-1"
        style={{ fontSize: "clamp(32px, 2.8vw, 44px)", lineHeight: 1.1 }}
      >
        {copy.heading}
      </h1>
      <p className="font-sans text-psc-gray text-sm mb-8">{copy.intro}</p>

      <form onSubmit={handleSubmit} noValidate={false} className="space-y-5">
        <div>
          <label htmlFor="portal-email" className={labelClass}>
            {portalAuth.fields.email}
          </label>
          <input
            id="portal-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        {mode !== "forgot" && (
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="portal-password" className={labelClass}>
                {portalAuth.fields.password}
              </label>
              {mode === "signIn" && (
                <button type="button" onClick={() => switchMode("forgot")} className={linkClass}>
                  {portalAuth.signIn.forgot}
                </button>
              )}
            </div>
            <input
              id="portal-password"
              type="password"
              autoComplete={mode === "signUp" ? "new-password" : "current-password"}
              required
              minLength={mode === "signUp" ? 8 : undefined}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>
        )}

        <div aria-live="polite" className="min-h-[1.25rem]">
          {error && <p className="font-sans text-sm text-psc-red">{error}</p>}
          {notice && <p className="font-sans text-sm text-psc-ink">{notice}</p>}
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full px-4 py-3 rounded-[3px] font-sans text-base font-medium bg-psc-red text-white hover:bg-psc-ink transition-colors duration-200 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-ink"
        >
          {copy.submit}
        </button>
      </form>

      <p className="mt-8 font-sans text-sm text-psc-gray">
        {mode === "forgot" ? (
          <button type="button" onClick={() => switchMode("signIn")} className={linkClass}>
            {portalAuth.forgot.back}
          </button>
        ) : (
          <>
            {mode === "signIn" ? portalAuth.signIn.switchPrompt : portalAuth.signUp.switchPrompt}{" "}
            <button
              type="button"
              onClick={() => switchMode(mode === "signIn" ? "signUp" : "signIn")}
              className={linkClass}
            >
              {mode === "signIn" ? portalAuth.signIn.switchLink : portalAuth.signUp.switchLink}
            </button>
          </>
        )}
      </p>
    </div>
  );
}
