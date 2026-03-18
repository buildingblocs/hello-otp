import { auth } from "$lib/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";
import { error, redirect } from "@sveltejs/kit";

const exceptions = new Set(["/robots.txt"]);

export async function handle({ event, resolve }) {
  const { pathname } = event.url;
  const isException =
    exceptions.has(pathname) || pathname.startsWith("/api/auth");
  let session;

  if (!isException) {
    try {
      session = await auth.api.getSession({
        headers: event.request.headers,
      });
    } catch (e) {
      error(500, "Failed to authenticate, please report this issue");
    }

    event.locals.session = session;

    if (!session && pathname !== "/login") throw redirect(307, "/login");
    if (session && (pathname === "/login" || pathname === "/"))
      throw redirect(307, "/app");
  }

  return svelteKitHandler({ event, resolve, auth, building });
}
