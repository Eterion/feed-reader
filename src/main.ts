import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import './globalStyle.scss';
import ArticlesView from './views/ArticlesView.vue';
import FeedsView from './views/FeedsView.vue';
import MainView from './views/MainView.vue';

const pinia = createPinia();

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/:feedId?/:articleLink?',
      props: true,
      components: {
        feeds: FeedsView,
        articles: ArticlesView,
        default: MainView,
      },
    },
  ],
});

createApp(App).use(pinia).use(router).mount('#app');
