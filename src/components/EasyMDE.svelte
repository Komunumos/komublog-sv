<!-- EasyMDE.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import EasyMDE from 'easymde';
	import 'easymde/dist/easymde.min.css';
  
	export let value = '';
	export let options = { maxLength: 300 };
  
	let textarea: HTMLTextAreaElement;
	let editor: EasyMDE;
  
	function truncateValue() {
	  const currentValue = editor.value();
	  if (currentValue.length > options.maxLength) {
		editor.value(currentValue.slice(0, options.maxLength));
	  }
	  value = editor.value();
	}
  
	onMount(() => {
	  editor = new EasyMDE({ ...options, element: textarea });
	  editor.codemirror.on('change', truncateValue);
	  editor.codemirror.on('blur', truncateValue);
	});
  
	onDestroy(() => {
	  editor.toTextArea();
	});
  </script>

<textarea bind:this={textarea} />

<style>
	:global(.editor-toolbar) {
		z-index: 1;
	}
</style>
