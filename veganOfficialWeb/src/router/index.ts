import { createRouter, createWebHistory } from "vue-router";
import { useNewsStore } from "@/store/newsStore";
import { useMenuStore } from "@/store/menuStore";
// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'
// NProgress.configure({ showSpinner: false })


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
            alias: ['/home'],
            beforeEnter: async (to, from, next) => {
                const { fetchNews } = useNewsStore();
                try {
                    await fetchNews();
                    next();
                } catch (err) {
                    console.log('router fetchNews failed', err);
                    next()
                }
            }
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
            component: Menu,
            // beforeEnter: async (to, from, next) => {
            //     const { fetchMenu } = useMenuStore();
            //     try {
            //         await fetchMenu();
            //         next()
            //     } catch (error) {
            //         console.log('router fetchMenu failed', error);
            //         next()
            //     }
            // }
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

// router.beforeEach(() => {
//     NProgress.start()
// })
router.afterEach(() => {
    // NProgress.done()
})

export default router