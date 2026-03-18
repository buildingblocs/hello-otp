<script lang="ts">
  import { Skeleton } from "$lib/components/ui/skeleton/index.js";
  import { Progress } from "$lib/components/ui/progress/index.js";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  import type { ActionResult } from "@sveltejs/kit";
  import { deserialize } from "$app/forms";
  import { onMount } from "svelte";

  let token = $state("");
  let timeLeft = $state(30);
  let tooltipTxt = $state("Click to copy");

  async function fetchOTP() {
    const data = new FormData();
    const response = await fetch("?/fetchOTP", {
      method: "POST",
      body: data,
    });
    const result: ActionResult = deserialize(await response.text());
    return result;
  }

  async function generateOtp() {
    const epoch = Math.floor(Date.now() / 1000);
    timeLeft = 30 - (epoch % 30);
    if (timeLeft == 30 || token == "") {
      const res = await fetchOTP();
      if (res.type == "success") {
        if (res.data) {
          token = String(res.data);
        }
      } else {
        if (res.type == "error") {
          token = res.error.message
        }
      }
    }
  }

  let interval: ReturnType<typeof setInterval>;

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function copyOtp() {
    navigator.clipboard.writeText(token);
    tooltipTxt = "Copied!";
    await sleep(2000);
    tooltipTxt = "Click to copy";
  }

  onMount(() => {
    generateOtp();

    interval = setInterval(() => {
      generateOtp();
    }, 1000);

    return () => clearInterval(interval);
  });
</script>

<div class="flex-1 flex items-center justify-center min-h-0">
  {#if token}
    <Tooltip.Provider delayDuration={0}>
      <Tooltip.Root disableCloseOnTriggerClick>
        <Tooltip.Trigger>
          <button
            class="flex-col mx-auto bg-muted hover:bg-muted/50 dark:bg-slate-800 hover:dark:bg-slate-700 dark:text-white transition rounded-lg overflow-hidden dark:border-black/15 border cursor-pointer"
            onclick={() => copyOtp()}
            type="button"
          >
            <h1 class="sm:text-8xl text-7xl font-semibold p-4 px-5">{token}</h1>
            <Progress value={timeLeft} max={30} class="rounded-none " />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Content>
          {tooltipTxt}
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  {:else}
    <Skeleton class="sm:h-37.5 sm:w-100 w-75 h-30 rounded-xl dark:bg-slate-900" />
  {/if}
</div>
