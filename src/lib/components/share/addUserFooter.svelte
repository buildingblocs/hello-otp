<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import addUser from "$lib/addUser";
  import PlusIcon from "@lucide/svelte/icons/plus";
  import Spinner from "../ui/spinner/spinner.svelte";
  import { toast } from "svelte-sonner";
  let { addUserList = $bindable(), onUserAdded, onCloseShare } = $props();
  let loading = $state(false);

  async function addUsers() {
    loading = true;
    for (const user of addUserList) {
      await addUser(user, fetch, onUserAdded);
      onCloseShare();
      addUserList = addUserList.filter((u: string) => u !== user);
      toast.success("Access added", {
        description: user,
      });
    }
    loading = false;
  }
</script>

<Dialog.Footer>
  {#if loading}
    <Button class="cursor-not-allowed">
      <Spinner />
      Adding
    </Button>
  {:else}
    <Button onclick={() => addUsers()} class="cursor-pointer">
      <PlusIcon />
      Add
      {addUserList.length}
      {addUserList.length > 1 ? "users" : "user"}
    </Button>
  {/if}
</Dialog.Footer>
