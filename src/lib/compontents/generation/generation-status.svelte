<script>
  import generate from "$lib/stores/generate.svelte";

  let message = $state("");
  $effect(() => {
    if (generate.state.status === "idle" || generate.state.status === "starting") {
      message = "Incubator is booting up... please wait";
    } else if (generate.state.status === "processing") {
      message = "your raptor is hatching... standby!";
    }
  });
</script>
<div class="flex flex-col items-center gap-4 w-full">
  {#if generate.state.status === "idle" || generate.state.status === "starting"}
  <div class="text-center font-semibold text-xl mt-8">{message}</div>
  {/if}

  {#if generate.state.status === "processing"}
    <div class="text-center font-semibold text-xl mt-8">{message}</div>
    <div class="relative w-full max-w-[300px]">
      <img class="egg shaking m-auto mb-4 w-[100px] h-[140px]" src="raptor/dino-egg.svg" alt="dino egg" />
      <div class="percent-text absolute bottom-0 left-0 s">{generate.state.percentage || 0}%</div>
      <div class="w-full bg-black/20 overflow-hidden h-[30px]">
        <div
          class="h-full bg-[var(--color-2)] transition-all duration-300 ease-out glow"
          style="width: {generate.state.percentage || 10}%"
        ></div>
      </div>
    </div>
  {/if}

</div>

<style>
  .egg {
    animation: shake 0.5s infinite;
  }

  .percent-text {
    z-index: 99;
    bottom: 2px;
    left: 43%;
    font-size: 18px;
  }

  .glow {
    box-shadow: 0 0 10px rgb(74 222 128 / 0.5);
  }

  @keyframes shake {
    0% {
      transform: translate(1px, 1px) rotate(0deg);
    }
    10% {
      transform: translate(-1px, -2px) rotate(-1deg);
    }
    20% {
      transform: translate(-3px, 0px) rotate(1deg);
    }
    30% {
      transform: translate(3px, 2px) rotate(0deg);
    }
    40% {
      transform: translate(1px, -1px) rotate(1deg);
    }
    50% {
      transform: translate(-1px, 2px) rotate(-1deg);
    }
    60% {
      transform: translate(-3px, 1px) rotate(0deg);
    }
    70% {
      transform: translate(3px, 1px) rotate(-1deg);
    }
    80% {
      transform: translate(-1px, -1px) rotate(1deg);
    }
    90% {
      transform: translate(1px, 2px) rotate(0deg);
    }
    100% {
      transform: translate(1px, -2px) rotate(-1deg);
    }
  }
</style>
