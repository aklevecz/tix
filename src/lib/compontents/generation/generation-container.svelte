<script>
  import generate from "$lib/stores/generate.svelte";
	import { onMount } from "svelte";
  import GenerationStatus from "./generation-status.svelte";
	import backgrounds from "$lib/backgrounds";

  onMount(() => {
    generate.init()
  })

  const onGenerate = async () => {
    // const text = `A compact disc (CD) with the word '${auth.state.user.name.split(" ")[0]}' handwritten in black marker on the silver surface. Abstract pastel colored smoke or mist effects swirl in the background. cute retro style. photo realistic.`
    const randomBetween0and100 = Math.floor(Math.random() * 100);
    const randomBackground = backgrounds[randomBetween0and100];
    const text = `a baby raptor hatching from an egg ${randomBackground}`;
    const model = "aklevecz/flux-raptor-lora";
    try {
      let data = await generate.createGeneration(text, model);
      if (!data?.id) {
        throw new Error("id is missing");
      }
      generate.pollGeneration(data.id);
    } catch (/** @type {*} */ e) {
      alert(e.message);
    }
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