// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
        interface Platform {
            env: Env
            cf: CfProperties
            ctx: ExecutionContext
        }
        interface Locals {
			session: Awaited<ReturnType<typeof auth.api.getSession>>;
		}
        interface Env {
            host_otp: KVNamespace;
        }
    }
}

export {};