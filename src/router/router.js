import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '@/components/views/homepage/HomePage.vue';
import Login from '@/components/views/login/LoginPage.vue';
import Profile from '@/components/views/profile/ProfilePage.vue';
import Room from '@/components/views/room/Room.vue';


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
    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
    },
    {
        path: '/room',
        name: 'Room',
        component: Room,
        props: true,
    },
];

const router = new VueRouter({
    mode: "history",
    routes: routes,
});

export default router;
