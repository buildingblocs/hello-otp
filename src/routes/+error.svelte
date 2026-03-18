<script lang="ts">
  import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { authClient } from "$lib/auth-client";
  import { Button } from "$lib/components/ui/button";

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          goto("/login");
        },
      },
    });
  }
</script>

<div class="items-center justify-center flex bg-muted h-dvh dark:bg-black">
  <div
    class="flex flex-col p-5 max-w-lg bg-white dark:bg-slate-900 dark:text-white dark:border-white/15 rounded-lg border border-black/15 gap-2 mx-5"
  >
    <div class="rounded-full w-min">
      <TriangleAlert size="50" />
    </div>
    <h2 class="text-2xl font-semibold tracking-tight">Error {page.status}</h2>
    <p>
      {page?.error?.message}
    </p>
    <p>
      Please notify the person maintaining this app. Additionally, you may try
      to sign out to fix this issue
    </p>
    <Button class="mt-4 cursor-pointer dark:bg-slate-700 hover:dark:bg-slate-800" onclick={() => signOut()}>
      Sign Out
    </Button>
  </div>
</div>
