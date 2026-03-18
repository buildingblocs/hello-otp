import { error, fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const rawEmail = formData.get("email") as string | null;
    const email = rawEmail?.toLowerCase().trim() ?? "";
    const kv = event.platform?.env?.host_otp;
    if (!kv) error(500, "Somethings not configured properly");

    if (!email) {
      return fail(400, { message: "No email provided" });
    }

    const value = await kv.get("allow:" + email);
    if (value == "1") {
      return;
    } else {
      return fail(401, { message: "Not in allowlist" });
    }
  },
} satisfies Actions;
