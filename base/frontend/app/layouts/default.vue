<template>
  <div class="bg-background text-foreground font-sans">
    <!-- UHeader (dans <Header>) est sticky et renseigne --ui-header-height ;
         UMain pose le <main> et remplit la hauteur restante du viewport
         (min-h calculé). Plus besoin de pt-24 / min-h-screen faits main. -->
    <Header />
    <UMain>
      <slot />
    </UMain>
    <Footer />
  </div>
  <Toast />
</template>
