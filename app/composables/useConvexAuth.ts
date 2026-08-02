import { ConvexHttpClient } from "convex/browser";
import type { FunctionReference } from "convex/server";
import type { Value } from "convex/values";

type Tokens = {
  token: string;
  refreshToken: string;
};

type SignInResult = {
  redirect?: string;
  verifier?: string;
  tokens?: Tokens | null;
};

const signInAction =
  "auth:signIn" as unknown as FunctionReference<"action">;

const signOutAction =
  "auth:signOut" as unknown as FunctionReference<"action">;

export function useConvexAuth() {
  const client = useConvexClient();
  const config = useRuntimeConfig();

  const convexUrl = config.public.convex.url as string;
  const storageSuffix = convexUrl.replace(/[^a-zA-Z0-9]/g, "");

  const verifierKey = `__convexAuthOAuthVerifier_${storageSuffix}`;
  const jwtKey = `__convexAuthJWT_${storageSuffix}`;
  const refreshTokenKey = `__convexAuthRefreshToken_${storageSuffix}`;

  const isAuthenticated = useState(
    "convex-auth-authenticated",
    () => false,
  );

  const isLoading = useState(
    "convex-auth-loading",
    () => true,
  );

  const error = useState<string | null>(
    "convex-auth-error",
    () => null,
  );

  const initialized = useState(
    "convex-auth-initialized",
    () => false,
  );

  function clearTokens() {
    localStorage.removeItem(jwtKey);
    localStorage.removeItem(refreshTokenKey);
    isAuthenticated.value = false;
  }

  function saveTokens(tokens: Tokens) {
    localStorage.setItem(jwtKey, tokens.token);
    localStorage.setItem(refreshTokenKey, tokens.refreshToken);
  }

  async function exchangeAuthData(
    args:
      | { code: string; verifier?: string }
      | { refreshToken: string },
  ) {
    // Use a separate unauthenticated client so refreshing a token
    // does not recursively trigger the authenticated client.
    const httpClient = new ConvexHttpClient(convexUrl);

    const result = await httpClient.action(
      signInAction,
      "code" in args
        ? {
          params: { code: args.code },
          verifier: args.verifier,
        }
        : args,
    ) as { tokens: Tokens | null };

    if (!result.tokens) {
      clearTokens();
      return null;
    }

    saveTokens(result.tokens);

    return result.tokens.token;
  }

  async function fetchAccessToken({
    forceRefreshToken,
  }: {
    forceRefreshToken: boolean;
  }) {
    if (!forceRefreshToken) {
      return localStorage.getItem(jwtKey);
    }

    const refreshToken = localStorage.getItem(refreshTokenKey);

    if (!refreshToken) {
      clearTokens();
      return null;
    }

    return await exchangeAuthData({ refreshToken });
  }

  function configureClientAuth() {
    client.setAuth(fetchAccessToken, (authenticated) => {
      isAuthenticated.value = authenticated;

      if (!authenticated) {
        clearTokens();
      }
    });
  }

  async function initialize() {
    if (!import.meta.client || initialized.value) {
      return;
    }

    initialized.value = true;
    isLoading.value = true;

    try {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (code) {
        const verifier =
          localStorage.getItem(verifierKey) ?? undefined;

        localStorage.removeItem(verifierKey);

        url.searchParams.delete("code");

        window.history.replaceState(
          {},
          "",
          `${url.pathname}${url.search}${url.hash}`,
        );

        await exchangeAuthData({ code, verifier });
      }

      if (localStorage.getItem(jwtKey)) {
        configureClientAuth();
      } else {
        isAuthenticated.value = false;
      }
    } catch (cause) {
      clearTokens();

      error.value =
        cause instanceof Error
          ? cause.message
          : "Authentication failed.";
    } finally {
      isLoading.value = false;
    }
  }

  async function signIn(provider = "github") {
    error.value = null;
    isLoading.value = true;

    try {
      const result = await client.action(signInAction, {
        provider,
        params: {
          redirectTo: window.location.pathname,
        },
      } satisfies Record<string, Value>) as SignInResult;

      if (result.redirect) {
        if (result.verifier) {
          localStorage.setItem(verifierKey, result.verifier);
        }

        window.location.assign(result.redirect);
        return;
      }

      if (result.tokens) {
        saveTokens(result.tokens);
        configureClientAuth();
      }
    } catch (cause) {
      error.value =
        cause instanceof Error
          ? cause.message
          : "Unable to sign in.";

      isLoading.value = false;
    }
  }

  async function signOut() {
    error.value = null;
    isLoading.value = true;

    try {
      await client.action(signOutAction, {});
    } finally {
      clearTokens();
      client.setAuth(async () => null);
      isLoading.value = false;
    }
  }

  onMounted(initialize);

  return {
    error: readonly(error),
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    signIn,
    signOut,
  };
}