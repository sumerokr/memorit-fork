import { parse } from "cookie";

interface Env {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const requestUrl = new URL(request.url);
  if (
    !requestUrl.searchParams.has("code") ||
    !requestUrl.searchParams.has("state")
  ) {
    return new Response("code or state is not provided", {
      status: 400,
    });
  }

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
};
