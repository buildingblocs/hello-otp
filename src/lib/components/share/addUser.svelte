<script lang="ts">
  import { page } from "$app/state";
  import XIcon from "@lucide/svelte/icons/x";
  import Avatar from "$lib/components/share/avatar.svelte";
  import { toast } from "svelte-sonner";
  import { Badge } from "$lib/components/ui/badge/index.js";

  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  let emailInput = $state("");
  let { userList = $bindable(), addUserList = $bindable() } = $props()

  function addToList(email: string) {
    if (email) {
      const sanitisedEmail = email.toLowerCase().trim();
      const existsInList = addUserList.some(
        (e: string) => e.toLowerCase() === sanitisedEmail,
      );
      const existsInKv = userList.some(
        (e: { name: string }) => e.name.toLowerCase() === "allow:" + sanitisedEmail,
      );
      if (existsInList || existsInKv) {
        toast.warning("User has been added already");
      } else {
        addUserList.push(sanitisedEmail);
      }
    }
    emailInput = "";
  }

  function delFromList(email: string) {
    const i = addUserList.indexOf(email);
    if (i > -1) {
      addUserList.splice(i, 1);
    }
  }

  function onKeydown(e: KeyboardEvent) {
    if (emailRegex.test(emailInput)) {
      if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
        e.preventDefault();
        addToList(emailInput);
      }
    }
    if (e.key === "Backspace" && !emailInput && addUserList.length) {
      addUserList.pop();
    }
  }
</script>

<div class="relative">
  <div class="border dark:border-white/15 rounded-md p-2 px-3 flex gap-2 flex-wrap">
    {#each addUserList as user}
      <Badge variant="secondary" class="break-all text-sm py-1.5 dark:bg-slate-900 dark:text-white">
        <Avatar letter={user.slice(0, 1)} bgWhite size="8" />
        <p class="mb-px">{user}</p>
        <button
          type="button"
          onclick={() => delFromList(user)}
          class="cursor-pointer"
        >
          <XIcon class="size-4" />
        </button>
      </Badge>
    {/each}

    <input
      type="email"
      placeholder="Email"
      bind:value={emailInput}
      onkeydown={onKeydown}
      class="border-0 ring-0 outline-none flex-1"
    />
  </div>

  {#if emailRegex.test(emailInput)}
    <button
      type="button"
      class="text-start mt-2 rounded-md border border-white/15 p-2 px-3 text-sm absolute -bottom-11 bg-white dark:bg-slate-700 w-full shadow-md cursor-pointer"
      onclick={() => addToList(emailInput)}
    >
      Add {emailInput}
    </button>
  {/if}
</div>
