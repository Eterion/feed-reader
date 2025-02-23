<script setup lang="ts">
import { useFeedsStore } from '@/utils/useFeedsStore';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const feedsStore = useFeedsStore();
const router = useRouter();

async function addFeed() {
  const url = prompt('Feed url');
  if (url)
    try {
      await feedsStore.addFeed(url);
    } catch (e) {
      alert(e);
    }
}

const feeds = computed(() => {
  return feedsStore.feeds.map((feed) => {
    const feedArticles = feedsStore.articles.filter(
      (article) => article.feedId === feed.id,
    );
    const unreadArticles = feedArticles.filter((article) => {
      return !article.isRead;
    });
    const readArticles = feedArticles.filter((article) => {
      return article.isRead;
    });
    return {
      ...feed,
      hasUnread: unreadArticles.length > 0,
      unreadCount: unreadArticles.length,
      rename: async () => {
        const name = prompt('New name');
        if (name)
          try {
            await feedsStore.renameFeed(feed.id, name);
          } catch (e) {
            alert(e);
          }
      },
      remove: async () => {
        if (confirm('Really remove?'))
          try {
            await feedsStore.removeFeed(feed.id);
            router.push('/');
          } catch (e) {
            alert(e);
          }
      },
      markRead: async () => {
        if (unreadArticles.length)
          await feedsStore.markRead(
            unreadArticles.map((article) => ({
              feedId: article.feedId,
              link: article.link,
            })),
          );
      },
      markUnread: async () => {
        if (readArticles.length)
          await feedsStore.markUnread(
            readArticles.map((article) => ({
              feedId: article.feedId,
              link: article.link,
            })),
          );
      },
    };
  });
});
</script>

<template>
  <div>
    <button type="button" @click="addFeed">Add</button>
    <ul>
      <li v-for="feed in feeds" :key="feed.id">
        <RouterLink
          :to="`/${feed.id}`"
          :class="[$style.link, { [$style.unread]: feed.hasUnread }]">
          {{ feed.name }} ({{ feed.unreadCount }})
        </RouterLink>
        | <a href="" @click.prevent="feed.rename">Rename</a> |
        <a href="" @click.prevent="feed.remove">Remove</a> |
        <a href="" @click.prevent="feed.markRead">Mark read</a> |
        <a href="" @click.prevent="feed.markUnread">Mark unread</a>
      </li>
    </ul>
  </div>
</template>

<style module lang="scss">
.link {
  &.unread {
    font-weight: bold;
  }
}
</style>
