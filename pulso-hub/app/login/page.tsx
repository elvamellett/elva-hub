import Image from "next/image";
import { signIn } from "@/auth";
import { config } from "@/lib/config";

export default function LoginPage() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink px-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl">
        <div className="mx-auto mb-5 flex items-center justify-center gap-2">
          <Image src="/pulso-mark.png" alt="PULSO" width={40} height={40} className="rounded-lg" />
          <span className="text-xl font-bold tracking-tight text-ink">PULSO Hub</span>
        </div>
        <h1 className="text-lg font-semibold text-ink">Sign in</h1>
        <p className="mt-1 mb-6 text-sm text-slate">
          Owner access only. Use the Google account allow-listed for PULSO.
        </p>

        {config.authConfigured ? (
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Continue with Google
            </button>
          </form>
        ) : (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
            Login isn&apos;t configured yet (demo mode). Add <code>AUTH_GOOGLE_ID</code>,{" "}
            <code>AUTH_GOOGLE_SECRET</code> and <code>AUTH_SECRET</code> — see the README.
          </p>
        )}
      </div>
    </div>
  );
}
