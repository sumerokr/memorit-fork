import { parse } from "cookie";

interface Env {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  // const authorizeURL = "https://accounts.google.com/o/oauth2/v2/auth";
  // const tokenURL = "https://www.googleapis.com/oauth2/v4/token";
  const cookie = parse(request.headers.get("Cookie") || "");
  // const { state, nonce } = cookie;

  // const authorizeURL = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  // authorizeURL.searchParams.append('')

  // return Response.redirect(authorizeURL.toString(), 301);
  return new Response(JSON.stringify(cookie, null, 2));
};
