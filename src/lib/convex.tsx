"use client";

import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { authClient } from "./auth-client";
import { useCallback, useEffect, useMemo, useState } from "react";
import ky from "ky";

interface AuthResponse {
  token: string;
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

async function fetchConvexToken(
  sessionToken: string | null
): Promise<string | null> {
  if (!sessionToken) {
    console.log("[Auth] No session token available");
    return null;
  }

  try {
    console.log("[Auth] Fetching Convex token...");
    const response = await ky
      .get("/api/auth/token", {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
        timeout: 10000,
      })
      .json<AuthResponse>();

    if (!response.token) {
      console.log("[Auth] No token in response");
      return null;
    }

    console.log("[Auth] Token:", response.token);

    return response.token;
  } catch (error) {
    console.error("[Auth] Error fetching token:", error);
    return null;
  }
}

function useBetterAuth() {
  const [convexToken, setConvexToken] = useState<string | null>(null);
  const { data: sessionData, isPending: isLoadingSession } =
    authClient.useSession();
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  // Initialize token when session is available
  useEffect(() => {
    let isMounted = true;

    async function initializeToken() {
      if (!sessionData?.session) {
        console.log("[Auth] No session available");
        return;
      }

      setIsLoadingAuth(true);
      try {
        console.log("[Auth] Initializing token...");
        const storedToken = localStorage.getItem("token");
        const token = await fetchConvexToken(storedToken);

        if (token && isMounted) {
          console.log("[Auth] Token initialized successfully");
          setConvexToken(token);
        }
      } catch (error) {
        console.error("[Auth] Token initialization error:", error);
      } finally {
        if (isMounted) {
          setIsLoadingAuth(false);
        }
      }
    }

    initializeToken();
    return () => {
      isMounted = false;
    };
  }, [sessionData?.session]);

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      console.log("[Auth] fetchAccessToken called:", {
        forceRefreshToken,
        hasSession: Boolean(sessionData?.session),
        hasExistingToken: Boolean(convexToken),
      });

      if (!sessionData?.session) {
        console.log("[Auth] No active session");
        return null;
      }

      try {
        if (forceRefreshToken || !convexToken) {
          const storedToken = localStorage.getItem("token");
          return await fetchConvexToken(storedToken);
        }

        return convexToken;
      } catch (error) {
        console.error("[Auth] fetchAccessToken error:", error);
        return null;
      }
    },
    [convexToken, sessionData?.session]
  );

  const isAuthenticated = Boolean(sessionData?.session && convexToken);
  const isLoading = isLoadingAuth || isLoadingSession;

  // Debug logging
  useEffect(() => {
    console.log("[Auth] State changed:", {
      hasSession: Boolean(sessionData?.session),
      hasToken: Boolean(convexToken),
      isAuthenticated,
      isLoading,
    });
  }, [sessionData?.session, convexToken, isAuthenticated, isLoading]);

  return useMemo(
    () => ({
      isLoading,
      isAuthenticated,
      fetchAccessToken,
    }),
    [isLoading, isAuthenticated, fetchAccessToken]
  );
}

export function ConvexProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProviderWithAuth client={convex} useAuth={useBetterAuth}>
      {children}
    </ConvexProviderWithAuth>
  );
  // return <CProvider client={convex}>{children}</CProvider>;
}

/* function useAuthToken() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: sessionData, isPending } = authClient.useSession();
  const tokenRef = useRef<string | null>(null);

  const fetchAccessToken = useCallback(async () => {
    const sessionToken = sessionData?.session.token;
    if (!sessionToken) return { token: null };

    try {
      setIsLoading(true);
      const { token } = await ky<{ token: string }>(`/api/auth/token`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }).json();

      if (tokenRef.current !== token) {
        tokenRef.current = token;
      }
      return { token };
    } catch {
      return { token: null };
    } finally {
      setIsLoading(false);
    }
  }, [sessionData?.session?.token]);

  useEffect(() => {
    if (sessionData?.session?.token) {
      fetchAccessToken();
    }
  }, [sessionData?.session?.token, fetchAccessToken]);

  return {
    isLoading: isLoading || isPending,
    refresh: fetchAccessToken,
    token: tokenRef.current,
    isAuthenticated: Boolean(sessionData),
  };
}

const useBetterAuth = () => {
  const { token, isAuthenticated, isLoading, refresh } = useAuthToken();
  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      if (forceRefreshToken) {
        const refreshedData = await refresh();
        return refreshedData?.token || null;
      }
      return token || null;
    },
    [refresh, token]
  );

  return useMemo(
    () => ({
      isLoading,
      isAuthenticated,
      fetchAccessToken,
    }),
    [isLoading, fetchAccessToken, isAuthenticated]
  );
};

export function ConvexProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProviderWithAuth client={convex} useAuth={useBetterAuth}>
      {children}
    </ConvexProviderWithAuth>
  );
} */

/* "use client";

import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { authClient } from "./auth-client";
import { useCallback, useEffect, useMemo, useState } from "react";
import ky from "ky";
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

function useAuthToken() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: sessionData, isPending } = authClient.useSession();
  const [data, setData] = useState<{ token: string | null } | null>(null);

  const fetchAccessToken = useCallback(async () => {
    const sessionToken = sessionData?.session.token;
    try {
      setIsLoading(true);
      const { token } = await ky<{ token: string }>(`/api/auth/token`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }).json();
      if (!token) {
        return { token: null };
      }
      return setData({ token });
    } catch {
    } finally {
      setIsLoading(false);
    }
  }, [sessionData?.session?.token]);

  useEffect(() => {
    if (sessionData?.session?.token) {
      fetchAccessToken();
    }
  }, [sessionData?.session?.token, fetchAccessToken]);

  return {
    isLoading: isLoading || isPending,
    refresh: fetchAccessToken,
    data,
    isAuthenticated: Boolean(sessionData),
  };
}

const useBetterAuth = () => {
  const { data, isAuthenticated, isLoading, refresh } = useAuthToken();
  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      console.log("fetch access token");
      if (forceRefreshToken) {
        console.log("force refresh token");
        const refreshedData = await refresh();

        return refreshedData?.token || null;
      }
      return data?.token || null;
    },
    [refresh, data?.token]
  );
  return useMemo(
    () => ({
      isLoading,
      isAuthenticated,
      fetchAccessToken,
    }),
    [isLoading, fetchAccessToken, isAuthenticated]
  );
};

export function ConvexProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProviderWithAuth client={convex} useAuth={useBetterAuth}>
      {children}
    </ConvexProviderWithAuth>
  );
}
 */
