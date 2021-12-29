import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router/router.js';
import store from '@/store/store.js';
import VueCookie from 'vue-cookie';
import i18n from '@/localization/i18n.js';
import { BootstrapVue } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue);
Vue.use(VueCookie);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
