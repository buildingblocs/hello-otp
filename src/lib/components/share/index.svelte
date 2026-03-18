<script lang="ts">
  import ShareIcon from "@lucide/svelte/icons/share";
  import { Button } from "$lib/components/ui/button/index.js";
  import { page } from "$app/state";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import List from "./list.svelte";
  import AddUser from "./addUser.svelte";
  import AddUserFooter from "./addUserFooter.svelte";

  let userList = $state([...page.data.userList]);
  let isShareOpen = $state(false);
  let addUserList = $state<string[]>([]);

  type UserItem = { name: string; addedOn: string };

  function onRemoveUser(name: string) {
    userList = userList.filter((u) => u.name !== name);
  }

  function onUserAdded(user: UserItem) {
    userList = [...userList, user];
  }

  $effect(() => {
    if (userList.length === 0 && page.data.email) {
      onUserAdded({
        name: "allow:" + page.data.email,
        addedOn: new Date().toISOString(),
      });
    }
  });
</script>

<Button onclick={() => (isShareOpen = true)} variant="secondary" size="sm" class="cursor-pointer dark:text-white dark:bg-slate-800 border dark:border-white/15 hover:dark:bg-slate-800">
  <ShareIcon /> Share
</Button>
<Dialog.Root bind:open={isShareOpen}>
  <Dialog.Content
    style="transform: scale(calc(1 - var(--bits-dialog-nested-count) * 0.05));
             filter: blur(calc(var(--bits-dialog-nested-count) * 2px));"
    class="dark:bg-slate-800 dark:text-white dark:border-white/15"
  >
    <Dialog.Header>
      <Dialog.Title>Share access to hello-otp</Dialog.Title>
    </Dialog.Header>

    <AddUser bind:addUserList bind:userList />

    {#if addUserList.length >= 1}
      <AddUserFooter
        {onUserAdded}
        onCloseShare={() => (isShareOpen = false)}
        bind:addUserList
      />
    {:else}
      <List
        bind:userList
        onCloseShare={() => (isShareOpen = false)}
        {onRemoveUser}
        {onUserAdded}
      />
    {/if}
  </Dialog.Content>
</Dialog.Root>
