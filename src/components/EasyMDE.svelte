<!-- EasyMDE.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import EasyMDE from 'easymde';
	import Tribute from 'tributejs';
	import type { UsernameItem } from 'tributejs';
	import { pb } from '$lib/pocketbase';
	import 'easymde/dist/easymde.min.css';
	import '../style/ayu-mirage.css';
	import 'tributejs/dist/tribute.css';

	export let value = '';
	export let options = { maxLength: 300 };
	export let handleSubmit: () => void;

	let textarea: HTMLTextAreaElement;
	let editor: EasyMDE;
	let tributeInstance: Tribute<UsernameItem>;

	function initTribute() {
		tributeInstance = new Tribute({
			trigger: '@',
			requireLeadingSpace: true,
			spaceSelectsMatch: true,
			selectTemplate: (item) => `@${item.original.username}`,
			menuItemTemplate: (item) => `<div>${item.original.username}</div>`,
			lookup: 'username',
			values: async (text, cb) => {
				const usernames = await fetchUsernames(text);
				cb(usernames.map((username) => ({ username })));
			}
		});
	}

	async function fetchUsernames(query: string): Promise<string[]> {
		const response = await pb
			.collection('usersView')
			.getList<{ username: string }>(1, 50, { filter: `username ~ "${query}"` });
		return response.items.map((item) => item.username);
	}

	function truncateValue() {
		const currentValue = editor.value();
		if (currentValue.length > options.maxLength) {
			editor.value(currentValue.slice(0, options.maxLength));
		}
		value = editor.value();
	}

	onMount(() => {
		editor = new EasyMDE({ ...options, element: textarea, theme: 'ayu-mirage' });
		editor.codemirror.on('change', truncateValue);
		editor.codemirror.on('blur', truncateValue);
		initTribute();
		tributeInstance.attach(editor.codemirror.getInputField());

		editor.codemirror.on('keydown', (_, event) => {
			if (event.ctrlKey && event.key === 'Enter') {
				handleSubmit();
				event.preventDefault();
			} else if (tributeInstance.isActive && (event.key === 'Enter' || event.key === 'Tab')) {
				if(tributeInstance.menu.innerText === 'No Match Found!') {
					tributeInstance.hideMenu();
					event.preventDefault();
					return;
				}
				
				const activeItem = tributeInstance.menu.querySelector('.highlight');
				if (activeItem) {
					event.preventDefault();
				}
			} else if (event.key === 'Tab') {
				event.preventDefault();
			}
		});
	});

	$: {
		if (editor && value === '') {
			editor.value(value);
		}
	}

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
