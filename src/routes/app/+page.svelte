<script lang="ts">
  import Logo from "$lib/logo.svg";
  import Share from "$lib/components/share/index.svelte";
  import Otp from "$lib/components/otp.svelte";
</script>

<div class="p-5 px-7 h-dvh flex flex-col dark:bg-black">
  <div class="flex justify-between">
    <img src={Logo} alt="BuildingBloCS Logo" class="w-7 h-7" />
    <Share />
  </div>
  <Otp />
</div>
