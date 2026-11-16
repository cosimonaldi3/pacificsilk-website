"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { portalAuth } from "@/content/portal";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const copy = portalAuth.reset;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password.length < 8) {
      setError(portalAuth.errors.shortPassword);
      return;
    }
    setBusy(true);
    const { error: err } = await createClient().auth.updateUser({ password });
    if (err) {
      setError(err.message);
      setBusy(false);
      return;
    }
    setDone(true);
    router.push("/portal/dashboard");
    router.refresh();
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
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="portal-new-password" className="block mb-2 font-sans text-sm font-medium text-psc-ink">
            {portalAuth.fields.newPassword}
          </label>
          <input
            id="portal-new-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-[3px] border border-psc-border bg-psc-bg font-sans text-base text-psc-ink focus:outline-none focus:border-psc-ink focus-visible:ring-2 focus-visible:ring-psc-ink/20"
          />
        </div>
        <div aria-live="polite" className="min-h-[1.25rem]">
          {error && <p className="font-sans text-sm text-psc-red">{error}</p>}
          {done && <p className="font-sans text-sm text-psc-ink">{copy.done}</p>}
        </div>
        <button
          type="submit"
          disabled={busy}
          className="w-full px-4 py-3 rounded-[3px] font-sans text-base font-medium bg-psc-red text-white hover:bg-psc-ink transition-colors duration-200 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-ink"
        >
          {copy.submit}
        </button>
      </form>
    </div>
  );
}
