<script lang="ts" setup>
import { postQuery, somePostsQuery } from "~/sanity/queries";

const { data: post } = await useSanityQuery<PostQueryResult>(postQuery, {
  slug: useRoute().params.slug,
});
const { data: posts } = await useLazySanityQuery<SomePostsQueryResult>(
  somePostsQuery,
  {
    skip: useRoute().params.slug,
    limit: 2,
  }
);

useSiteMetadata({
  title: post?.value?.seoTitle || post?.value?.title,
  description: post?.value?.seoDescription || post?.value?.excerpt,
  ogImage: post?.value?.ogImage || undefined,
  ogType: "article",
  noIndex: post?.value?.noIndex ?? false,
});
</script>

<template>
  <div v-if="post">
    <div class="container my-12 lg:my-24 grid gap-12">
      <div>
        <div class="pb-6 grid gap-6 mb-6 border-b border-border">
          <div class="max-w-3xl flex flex-col gap-6">
            <h2
              class="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
              {{ post.title }}
            </h2>
          </div>
          <div class="max-w-3xl flex gap-4 items-center">
            <Avatar
              v-if="post.author"
              :person="post.author"
              :date="post.date" />
          </div>
        </div>
        <article class="gap-6 grid max-w-4xl">
          <div>
            <!-- <CoverImage :image="post.coverImage" priority /> -->
            <SanityImage
              v-if="post.coverImage?.asset?._ref"
              class="rounded-2xl shadow-md transition-shadow object-cover"
              :alt="post.coverImage?.alt || ''"
              :asset-id="post.coverImage.asset._ref"
              auto=""
              format />
          </div>
          <div class="prose prose-a:text-primary max-w-2xl" v-if="post.content">
            <PortableText :portableText="post.content" />
          </div>
        </article>
      </div>
    </div>
    <div class="border-t border-border" v-if="posts">
      <div class="container my-12 lg:my-24 grid gap-12">
        <aside>
          <Posts heading="Articles récents" :posts="posts" />
        </aside>
      </div>
    </div>
  </div>
</template>
