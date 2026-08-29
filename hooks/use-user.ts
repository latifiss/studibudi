"use client";

import { authClient } from "@/src/lib/auth/client";

export function useUser() {
  const { data, isPending } = authClient.useSession();

  const logout = async () => {
    const result = await authClient.signOut();
    if (result.error) {
      throw new Error(result.error.message || "Failed to log out.");
    }
    window.location.assign("/");
  };

  return {
    user: data?.user ?? null,
    session: data?.session ?? null,
    loading: isPending,
    authenticated: !!data?.user,
    logout,
  };
}
