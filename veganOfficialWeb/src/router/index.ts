import { createRouter, createWebHistory } from "vue-router";

import Home from '@pages/Home/index.vue'
import Questionnaire from '@pages/Questionnaire/index.vue'
import Menu from '@pages/Menu/index.vue'
import About from '@pages/About/index.vue'
import Cart from '@pages/Cart/index.vue'
import Profile from '@pages/Profile/index.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            // redirect: '/home',
            component: Home,
            alias: ['/home']
        },
        // {
        //     path: '/home',
        //     component: Home
        // },
        {
            path: '/questionnaire',
            component: Questionnaire
        },
        {
            path: '/menu',
            component: Menu
        },
        {
            path: '/about',
            component: About
        },
        {
            path: '/cart',
            component: Cart
        },
        {
            path: '/profile',
            component: Profile
        },

    ]
})

export default router