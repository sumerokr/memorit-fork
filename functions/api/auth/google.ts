interface Env {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const requestUrl = new URL(request.url);

  if (!requestUrl.searchParams.has("state")) {
    return new Response("no state provided", {
      status: 400,
    });
  }

  const state = requestUrl.searchParams.get("state");
  const nonce = crypto.randomUUID();

  const authorizeURL = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authorizeURL.searchParams.append("response_type", "code");
  authorizeURL.searchParams.append("scope", "openid email profile");
  authorizeURL.searchParams.append("client_id", env.GOOGLE_CLIENT_ID);
  authorizeURL.searchParams.append("state", state);
  authorizeURL.searchParams.append("nonce", nonce);
  authorizeURL.searchParams.append(
    "redirect_uri",
    "http://127.0.0.1:8788/api/auth/callback"
  );

  return new Response(null, {
    status: 301,
    headers: {
      "Set-Cookie": `state=${state}; HttpOnly; Secure; Path=/api/auth/callback; SameSite=Strict; Max-Age=120`,
      Location: authorizeURL.toString(),
    },
  });
};
