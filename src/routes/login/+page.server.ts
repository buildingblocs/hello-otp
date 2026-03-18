import { error, fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const email = formData.get("email") as string | null;
    const kv = event.platform?.env?.host_otp;
    if (!kv) error(500, "Somethings not configured properly");

    const value = await kv.get("allow:" + email);
    console.log(email)
    if (value == "1") {
        return
    } else {
        return fail(401, {message: "Not in allowlist"})
    }
  },
} satisfies Actions;
