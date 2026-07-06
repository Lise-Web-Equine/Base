<template>
  <div class="bg-background text-foreground font-sans">
    <section class="min-h-screen pt-24">
      <Header />
      <main class=""><slot /></main>
      <Footer />
    </section>
  </div>
  <Toast />
</template>
