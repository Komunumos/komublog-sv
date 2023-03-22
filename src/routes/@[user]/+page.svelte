<script lang="ts">
	import BabbleList from '$lib/BabbleList.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

{data.user}

<BabbleList babbles={data.posts} />
