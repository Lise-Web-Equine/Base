<script lang="ts" setup>
import { postsQuery, settingsQuery } from "~/sanity/queries";

// Rubrique blog/actualités désactivée dans les Réglages → 404.
const { data: settings } = await useSanityQuery<SettingsQueryResult>(
  settingsQuery
);
if (settings.value?.blog?.enabled !== true) {
  throw createError({ statusCode: 404, statusMessage: "Page introuvable" });
}

const label =
  settings.value?.blog?.label === "actualites" ? "Actualités" : "Blog";

const { data: posts } = await useSanityQuery<PostsQueryResult>(postsQuery);

useSiteMetadata({
  title: label,
});
</script>

<template>
  <div class="container my-12 lg:my-24">
    <Posts :heading="label" :posts="posts ?? []" />
  </div>
</template>
