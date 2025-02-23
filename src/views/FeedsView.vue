<script setup lang="ts">
import FeedItem from '@/components/FeedItem.vue';
import { useFeedsStore } from '@/utils/useFeedsStore';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  feedId?: string;
}>();

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
      isActive: feed.id === props.feedId,
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
  <div :class="$style.el">
    <button type="button" @click="addFeed" :class="$style.button">
      Add Feed
    </button>
    <ul :class="$style.list">
      <li v-for="feed in feeds" :key="feed.id">
        <FeedItem
          :active="feed.isActive"
          :id="feed.id"
          :name="feed.name"
          :unread-count="feed.unreadCount"
          :url="feed.url"
          @mark-read="feed.markRead"
          @mark-unread="feed.markUnread"
          @remove="feed.remove"
          @rename="feed.rename" />
      </li>
    </ul>
  </div>
</template>

<style module lang="scss">
.el {
  padding: 12px;
}

.button {
  background-color: var(--foreground);
  border-radius: 6px;
  border: 1px solid var(--border);
  box-shadow: var(--low-shadow);
  color: var(--text);
  cursor: pointer;
  font-size: 0.875rem;
  margin-bottom: 12px;
  padding: 6px 10px;
  transition-duration: 200ms;
  transition-property: background-color, border-color;
  &:hover {
    background-color: var(--hover-surface);
    border-color: var(--dark-border);
  }
}

.list {
  list-style: none;
  padding: 0;
  &:where(li):not(:last-child) {
    margin-bottom: 1px;
  }
}
</style>
