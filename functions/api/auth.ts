import { parse } from "cookie";

interface Env {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const requestUrl = new URL(request.url);
  if (
    requestUrl.searchParams.has("code") &&
    requestUrl.searchParams.has("state")
  ) {
    const code = requestUrl.searchParams.get("code");
    const state = requestUrl.searchParams.get("state");
    const cookie = parse(request.headers.get("Cookie") || "");
    const { state: stateFromCookie, nonce } = cookie;
    if (stateFromCookie === state) {
      const tokenURL = new URL("https://www.googleapis.com/oauth2/v4/token");

      const response = await fetch(tokenURL.toString(), {
        method: "POST",
        body: JSON.stringify({
          code,
          client_id: env.GOOGLE_CLIENT_ID,
          client_secret: env.GOOGLE_CLIENT_SECRET,
          redirect_uri: "http://127.0.0.1:8788/api/auth",
          grant_type: "authorization_code",
        }),
      });
      const data = await response.json();
      return new Response(JSON.stringify(data, null, 2));
    } else {
      return new Response("state doesn't match");
    }
  }
  // const tokenURL = "https://www.googleapis.com/oauth2/v4/token";
  // const cookie = parse(request.headers.get("Cookie") || "");
  // const { state, nonce } = cookie;

  const state = crypto.randomUUID();
  const nonce = crypto.randomUUID();

  const authorizeURL = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authorizeURL.searchParams.append("response_type", "code");
  authorizeURL.searchParams.append("scope", "openid email profile");
  authorizeURL.searchParams.append("client_id", env.GOOGLE_CLIENT_ID);
  authorizeURL.searchParams.append("state", state);
  authorizeURL.searchParams.append("nonce", nonce);
  authorizeURL.searchParams.append(
    "redirect_uri",
    "http://127.0.0.1:8788/api/auth"
  );

  return new Response(null, {
    status: 301,
    headers: {
      "Set-Cookie": `state=${state}; HttpOnly; Secure; Path=/api/auth; SameSite=Strict; Max-Age=60`,
      Location: authorizeURL.toString(),
    },
  });
  // return newResponse;
  // return Response.redirect(authorizeURL.toString(), 301);
  // return new Response(JSON.stringify(authorizeURL.searchParams.toString()));
  // return new Response(JSON.stringify(authorizeURL.searchParams.toString()));
};
