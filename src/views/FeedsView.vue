<script setup lang="ts">
import FeedItem from '@/components/FeedItem.vue';
import LastCheckedOn from '@/components/LastCheckedOn.vue';
import ThemeToggle from '@/components/ThemeToggle.vue';
import { useFeedsStore } from '@/utils/useFeedsStore';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  feedId?: string;
}>();

const router = useRouter();
const feedsStore = useFeedsStore();

async function addFeed() {
  const url = prompt('Feed url');
  if (url)
    try {
      await feedsStore.addFeed(url);
    } catch (e) {
      alert(e);
    }
}

const mappedFeeds = computed(() => {
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

const sortedFeeds = computed(() => {
  return mappedFeeds.value.sort((a, b) => {
    const aName = a.name || a.url;
    const bName = b.name || b.url;
    return aName.localeCompare(bName);
  });
});
</script>

<template>
  <div>
    <header :class="$style.header">
      <button type="button" @click="addFeed" :class="$style.addButton">
        Add Feed
      </button>
      <ThemeToggle />
      <div v-if="feedsStore.lastCheckedOn" :class="$style.lastCheckedOn">
        <LastCheckedOn
          :date="feedsStore.lastCheckedOn"
          :loading="feedsStore.isLoading"
          @click="feedsStore.refreshFeeds" />
      </div>
    </header>
    <div :class="$style.content">
      <ul :class="$style.list">
        <li v-for="feed in sortedFeeds" :key="feed.id">
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
  </div>
</template>

<style module lang="scss">
.header {
  align-items: center;
  background-color: var(--foreground);
  column-gap: 0.5ch;
  display: flex;
  padding: 12px;
  position: sticky;
  top: 0;
}

.addButton {
  background-color: var(--foreground);
  border-radius: 6px;
  border: 1px solid var(--border);
  box-shadow: var(--low-shadow);
  color: var(--text);
  cursor: pointer;
  flex-shrink: 0;
  font-size: 0.875rem;
  padding: 6px 10px;
  transition-duration: 200ms;
  transition-property: background-color, border-color;
  &:hover {
    background-color: var(--hover-surface);
    border-color: var(--dark-border);
  }
}

.lastCheckedOn {
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
}

.content {
  padding: 0 12px 64px;
}

.list {
  list-style: none;
  padding: 0;
  &:where(li):not(:last-child) {
    margin-bottom: 1px;
  }
}
</style>
