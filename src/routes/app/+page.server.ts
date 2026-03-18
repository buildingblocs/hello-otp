import { error, fail, redirect } from "@sveltejs/kit";
import checkAuth from "$lib/checkAuth.js";
import type { Actions } from "./$types";
import { env } from "$env/dynamic/private";
import { generate } from "otplib";

async function checkPerms(
  kv: KVNamespace<string> | undefined,
  user: App.Locals["session"]["user"],
) {
  if (!kv) error(500, "Somethings not configured properly");
  try {
    const value = await kv.get("allow:" + user.email);
    return value == "1";
  } catch (e) {
    return e;
  }
}

export const actions = {
  delUser: async (event) => {
    const formData = await event.request.formData();
    const key = formData.get("key") as string | null;
    const user = event.locals.session.user;
    const kv = event.platform?.env?.host_otp;
    if (!kv) error(500, "Somethings not configured properly");

    if (!key?.startsWith("allow:")) {
      return fail(400, { message: "Invalid key provided" });
    }

    const allowed = await checkPerms(kv, user);

    if (allowed) {
      try {
        await kv.delete(key);
      } catch (e) {
        return fail(500, { message: String(e) });
      }
    } else {
      return fail(401, { message: "You are not authorised" });
    }
  },

  addUser: async (event) => {
    const formData = await event.request.formData();
    const key = formData.get("key") as string | null;
    const user = event.locals.session.user;
    const kv = event.platform?.env?.host_otp;
    if (!kv) error(500, "Somethings not configured properly");

    if (!key?.startsWith("allow:")) {
      return fail(400, { message: "Invalid key provided" });
    }

    const allowed = await checkPerms(kv, user);

    if (allowed) {
      try {
        const addedOn = new Date().toISOString();
        await kv.put(key, "1", { metadata: { addedOn } });
        return { added: true, key, addedOn };
      } catch (e) {
        return fail(500, { message: String(e) });
      }
    } else {
      return fail(401, { message: "You are not authorised" });
    }
  },

  fetchOTP: async (event) => {
    const user = event.locals.session.user;
    const kv = event.platform?.env?.host_otp;
    if (!kv) error(500, "Somethings not configured properly");

    const allowed = await checkPerms(kv, user);
    const secret = env.OTP_SECRET;

    if (!secret) error(500, "OTP_SECRET environment variable not set");

    if (allowed) {
      try {
        return await generate({ secret });
      } catch (e) {
        return fail(500, { message: String(e) });
      }
    } else {
      return fail(401, { message: "Not authorised" });
    }
  },
} satisfies Actions;

export async function load({ platform, request, locals }) {
  const isAuth = await checkAuth(platform, request);
  if (!isAuth) error(400, "Not authorised");
  if (!isAuth.authorised) {
    redirect(307, "/app/unauthorised");
  }

  return { ...isAuth, email: locals.session.user.email };
}
