import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '@/components/views/homepage/Home.vue';
import Login from '@/components/views/login/Login.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
];

const router = new VueRouter({
    routes: routes,
});

export default router;
