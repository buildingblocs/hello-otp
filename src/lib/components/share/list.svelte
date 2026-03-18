<script lang="ts">
  import CfmDialog from "./cfmDialog.svelte";
  import Avatar from "./avatar.svelte";
  import { page } from "$app/state";

  let {
    userList = $bindable(),
    onCloseShare,
    onRemoveUser,
    onUserAdded,
  } = $props();
  const { data: pageData } = page;
</script>

<div class="gap-3 flex flex-col">
  <h2 class="font-medium">People with access</h2>
  {#each userList as user}
    <div class="flex justify-between">
      <div class="flex items-center gap-3">
        <Avatar letter={user.name.slice(6, 7)} />
        <div>
          {#if user.name.slice(6) == pageData.email}
            <p>{user.name.slice(6)} (You)</p>
          {:else}
            <p>{user.name.slice(6)}</p>
          {/if}
          <p class="text-xs">
            Added on: {new Date(user.addedOn).toLocaleString()}
          </p>
        </div>
      </div>
      <div>
        <CfmDialog {user} {onCloseShare} {onRemoveUser} {onUserAdded} />
      </div>
    </div>
  {/each}
</div>
