<script>
  import generate from "$lib/stores/generate.svelte";
  import { onMount } from "svelte";
  import GenerationStatus from "./generation-status.svelte";

  onMount(() => {
    generate.init()
  })

  const onGenerate =  () => {
    generate.generateRaptor()
  };
</script>
<h1 class="font-bold text-center text-2xl mb-4">GENERATE</h1>
{#if generate.state.lastImgUrl}<img src={generate.state.lastImgUrl} alt="" style="width: 200px; height: 200px;" />{/if}
{#if !generate.state.lastImgUrl && generate.state.cachedImg}<img src={JSON.parse(generate.state.cachedImg)} alt="" style="width: 200px; height: 200px;" />{/if}
{#if generate.state.generating || (!generate.state.cachedImg && !generate.state.lastImgUrl)}
  <GenerationStatus />
{/if}
<button class="btn-bauhaus w-[200px] mx-auto mt-10" onclick={onGenerate} disabled={generate.state.generating}>GENERATE</button>

<style lang="postcss">
  @reference "tailwindcss/theme";
  img {
    @apply mx-auto;
  }
  button:disabled {
    background-color: red;
    opacity: 0.5;
  }
</style>