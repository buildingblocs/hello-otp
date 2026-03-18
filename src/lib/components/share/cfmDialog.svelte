<script lang="ts">
  import { toast } from "svelte-sonner";
  import TrashIcon from "@lucide/svelte/icons/trash";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Spinner from "$lib/components/ui/spinner/spinner.svelte";
  import { enhance } from "$app/forms";
  import addUser from "$lib/addUser";

  let isDelOpen = $state(false);
  let loading = $state(false);
  let props = $props();
  const user = $derived(props.user);
</script>

<Button
  onclick={() => (isDelOpen = true)}
  type="submit"
  size="icon"
  variant="destructive"
  class="cursor-pointer">
  <TrashIcon />
</Button>
<Dialog.Root bind:open={isDelOpen} >
  <Dialog.Content class="w-90 dark:bg-slate-800 dark:text-white border-white/15">
    <Dialog.Header>
      <Dialog.Title>Remove access for {user.name.slice(6)}?</Dialog.Title>
      <Dialog.Footer>
        <form
          method="POST"
          action="?/delUser"
          class="mt-2"
          use:enhance={() => {
            loading = true;
            return async ({ result }) => {
              loading = false;
              if (result.type == "success") {
                props.onRemoveUser(user.name);
                isDelOpen = false;
                props.onCloseShare();
                toast.success("Access removed", {
                  description: user.name.slice(6),
                  action: {
                    label: "Undo",
                    onClick: () => addUser(user.name.slice(6), fetch, props.onUserAdded),
                  },
                });
              }
            };
          }}
        >
          <input hidden bind:value={user.name} name="key" />
          {#if loading}
            <Button type="submit" variant="destructive" class="cursor-not-allowed">
              <Spinner />
              Removing
            </Button>
          {:else}
            <Button type="submit" variant="destructive" class="cursor-pointer">
              <TrashIcon />
              Remove
            </Button>
          {/if}
        </form>
      </Dialog.Footer>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
