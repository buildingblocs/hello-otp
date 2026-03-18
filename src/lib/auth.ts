import { APIError, betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { env } from "$env/dynamic/private";

export const auth = betterAuth({
  // ... other config options
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        try {
          const response = await fetch(
            "https://app.loops.so/api/v1/transactional",
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
                Authorization: "Bearer " + env.LOOPS_SECRET,
              },
              body: JSON.stringify({
                transactionalId: "cmmual9z803t40iz9aivr50pp",
                email,
                dataVariables: {
                  otp,
                },
              }),
            },
          );
          const res = await response.json();
          if (!response.ok) throw new APIError("BAD_GATEWAY");
          return;
        } catch (error) {
          throw new APIError("BAD_GATEWAY");
        }
      },
    }),
  ],
});
