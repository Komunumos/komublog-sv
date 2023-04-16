<script lang="ts">
	import BabbleCard from "@components/BabbleCard.svelte";
	import type { PageData } from './$types';
	export let data: PageData;


</script>

<BabbleCard babble={data.babble}>

</BabbleCard>