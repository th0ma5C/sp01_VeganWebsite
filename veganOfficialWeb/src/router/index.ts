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
import Product from "@/pages/Menu/product/Product.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            alias: ['/home'],
            // redirect: '/home',
            component: Home,
            name: 'Home',
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
            // children: [
            //     {
            //         name: 'Product',
            //         path: 'product',
            //         component: Product
            //     }
            // ]
        },
        {
            name: 'Product',
            component: Product,
            path: '/product/:name',
            props: true

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