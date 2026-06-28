// Central config: detects which integrations are wired via env vars.
// When an integration's env is missing, the data layer falls back to mock data
// so the hub builds, runs, and demos with zero credentials.

export const config = {
  shopify: {
    domain: process.env.SHOPIFY_STORE_DOMAIN ?? "",
    token: process.env.SHOPIFY_ADMIN_TOKEN ?? "",
    get connected() {
      return Boolean(this.domain && this.token);
    },
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    get connected() {
      return Boolean(this.clientId && this.clientSecret);
    },
  },
  meta: {
    token: process.env.META_ACCESS_TOKEN ?? "",
    get connected() {
      return Boolean(this.token);
    },
  },
  klaviyo: {
    key: process.env.KLAVIYO_API_KEY ?? "",
    get connected() {
      return Boolean(this.key);
    },
  },
};

// Force mocks everywhere with USE_MOCKS=true (default true if nothing connected).
export const useMocks =
  process.env.USE_MOCKS === "true" ||
  (!config.shopify.connected && process.env.USE_MOCKS !== "false");

export const ownerEmail = process.env.OWNER_EMAIL ?? "you@pulso.ie";
