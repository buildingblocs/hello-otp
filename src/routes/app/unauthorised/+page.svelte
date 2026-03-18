<script lang="ts">
  import { goto } from "$app/navigation";
  import { authClient } from "$lib/auth-client";
  import Button from "$lib/components/ui/button/button.svelte";
  import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
  
  const props = $props();

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

<div class="items-center justify-center flex bg-muted h-dvh">
  <div
    class="flex flex-col p-5 max-w-lg bg-white rounded-lg border border-black/15 gap-2"
  >
    <div class="rounded-full w-min">
      <TriangleAlert size="50" />
    </div>
    <h2 class="text-2xl font-semibold tracking-tight">401: Unauthorised</h2>
    <p>
      You have not been granted access to hello-otp. Kindly check if you have
      signed in with the right email
    </p>
    <p>You are currently signed in as: {props.data.email}</p>
    <Button class="mt-4 cursor-pointer" onclick={() => signOut()}
      >Sign Out</Button
    >
  </div>
</div>
