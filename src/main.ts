import { castArray } from 'es-toolkit/compat';
import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalizedGeneric,
} from 'vue-router';
import App from './App.vue';
import './globalStyle.scss';
import { routeName } from './routeName';
import ArticlesView from './views/ArticlesView.vue';
import FeedsView from './views/FeedsView.vue';
import MainView from './views/MainView.vue';

const pinia = createPinia();

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/:feedUrl?:/:articleLink?',
      name: routeName.feed,
      props: {
        feeds: paramsToProps,
        articles: paramsToProps,
        default: paramsToProps,
      },
      components: {
        feeds: FeedsView,
        articles: ArticlesView,
        default: MainView,
      },
    },
    {
      path: '/:folderId(\d+)/:feedUrl?/:articleLink?',
      name: routeName.folder,
      props: {
        feeds: paramsToProps,
        articles: paramsToProps,
        default: paramsToProps,
      },
      components: {
        feeds: FeedsView,
        articles: ArticlesView,
        default: MainView,
      },
    },
  ],
});

createApp(App).use(pinia).use(router).mount('#app');

function paramsToProps(route: RouteLocationNormalizedGeneric) {
  const folderId = castArray(route.params.folderId).at(0);
  const feedUrl = castArray(route.params.feedUrl).at(0);
  const articleLink = castArray(route.params.articleLink).at(0);
  return {
    folderId: folderId ? parseInt(folderId) : undefined,
    feedUrl,
    articleLink,
  };
}
