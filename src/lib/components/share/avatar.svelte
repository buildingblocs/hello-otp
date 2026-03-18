<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  let props = $props();
</script>

<Avatar.Root class={props.size ? `size-${props.size}` : ""}>
  <Avatar.Fallback class={props.bgWhite ? "bg-white dark:bg-slate-800" : " dark:bg-slate-900"}>
    {props.letter.toUpperCase()}
  </Avatar.Fallback>
</Avatar.Root>
