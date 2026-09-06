import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Use the current site origin so authentication stays same-origin on
  // stidibudi.com / www.stidibudi.com instead of calling the Vercel URL.
  baseURL: typeof window !== "undefined" ? window.location.origin : undefined,
});
