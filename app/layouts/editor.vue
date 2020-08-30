<template>
  <div class="w-vw h-vh flex flex-col">
    <div class="bg-green flex flex-col">
      <div class="mb-2 flex flex-row justify-between xs:justify-start">
        <div class="div-mono h-8 min-w-8"></div>
        <div class="div-mono border-l-2 border-r-2 h-12 w-full max-w-screen-xs xs:h-24"></div>
        <div class="min-w-8 flex flex-col xs:flex-grow">
          <div class="div-mono w-full h-8"></div>
          <div class="invisible flex-grow p-2 pb-0 xs:visible">
            <div class="w-full h-full"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-grow bg-gray-500"><nuxt /></div>
  </div>
</template>

<style>
.div-mono {
  @apply border-b-4 border-solid border-dark bg-light;
}
</style>