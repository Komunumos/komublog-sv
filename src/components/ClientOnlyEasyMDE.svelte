<!-- ClientOnlyEasyMDE.svelte -->
<script lang="ts">
	import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  
  let EasyMDEComponent: any;
  
  onMount(async () => {
    if (browser) {
      const easyMDEModule = await import('./EasyMDE.svelte');
      EasyMDEComponent = easyMDEModule.default;
    }
  });
  
  export let value: string;
  export let options: { maxLength: number };
  export let handleSubmit: () => void;
</script>

<svelte:component this={EasyMDEComponent} bind:value={value} {options} {handleSubmit} />
