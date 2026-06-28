import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const GOOGLE_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/drive.readonly",
].join(" ");

async function refreshGoogleToken(refreshToken: string) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.AUTH_GOOGLE_ID ?? "",
      client_secret: process.env.AUTH_GOOGLE_SECRET ?? "",
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  if (!res.ok) throw new Error(`refresh failed ${res.status}`);
  return (await res.json()) as { access_token: string; expires_in: number; refresh_token?: string };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: { params: { scope: GOOGLE_SCOPES, access_type: "offline", prompt: "consent" } },
    }),
  ],
  pages: { signIn: "/login" },
  callbacks: {
    // Owner-only allowlist.
    async signIn({ user }) {
      const owner = process.env.OWNER_EMAIL?.toLowerCase();
      if (!owner) return true;
      return user.email?.toLowerCase() === owner;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at ? account.expires_at * 1000 : 0;
      }
      const expiresAt = token.expiresAt as number | undefined;
      if (expiresAt && Date.now() > expiresAt - 60_000 && token.refreshToken) {
        try {
          const r = await refreshGoogleToken(token.refreshToken as string);
          token.accessToken = r.access_token;
          token.expiresAt = Date.now() + r.expires_in * 1000;
          if (r.refresh_token) token.refreshToken = r.refresh_token;
        } catch (e) {
          console.error("Google token refresh failed:", e);
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      return session;
    },
  },
});
