import Home from '@pages/Home/index.vue'
import Questionnaire from '@pages/Questionnaire/index.vue'
import QNR_result from '@/pages/Questionnaire/result/QNR_result.vue'
import Menu from '@pages/Menu/index.vue'
import About from '@pages/About/index.vue'
import Checkout from '@/pages/Cart/Checkout.vue'
import Profile from '@pages/Profile/index.vue'
import Product from "@/pages/Menu/product/Product.vue";
import type { RouteLocationNormalized, NavigationGuardNext, NavigationGuardReturn } from 'vue-router'
import { useUserStore } from '@/store/userStore'

const userStore = useUserStore();

export default [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        // alias: ['/home'],
        component: Home,
        name: 'Home',
        // meta: {
        //     breadcrumbs: [
        //         {
        //             title: '首頁',
        //             link: 'Home'
        //         }
        //     ]
        // }
    },
    {
        path: '/questionnaire',
        component: () => import('@pages/Questionnaire/index.vue'),
        children: [
            {
                path: 'result',
                component: () => import('@/pages/Questionnaire/result/QNR_result.vue'),
            }
        ]
    },
    {
        path: '/menu',
        component: Menu,
        name: 'Menu',
        meta: {
            breadcrumbs: [
                {
                    title: '首頁',
                    link: 'Home'
                },
                {
                    title: '菜單',
                    link: 'Menu'
                }
            ]
        }
    },
    {
        name: 'Product',
        component: Product,
        path: '/product',
        props(route: RouteLocationNormalized) {
            return route.query
        },
        meta: {
            keepAlive: true,
            breadcrumbs: [
                {
                    title: '首頁',
                    link: 'Home'
                },
                {
                    title: '菜單',
                    link: 'Menu'
                }
            ]
        },
        // beforeEnter(to: RouteLocationNormalized) {
        //     // console.log(to);
        //     to.meta.breadcrumbs.push({
        //         title: to.query.name,
        //         link: to.name
        //     })
        // }

    },
    {
        path: '/about',
        component: About
    },
    {
        path: '/Checkout',
        component: Checkout
    },
    {
        path: '/profile',
        component: Profile,
        beforeEnter: (
            to: RouteLocationNormalized,
            from: RouteLocationNormalized) => {
        },
        children: [
            {
                path: 'forgetPassword',
                component: () => import('@/pages/Profile/forgetPassword/ForgetPassword.vue'),
                meta: {
                    hideParent: true
                }
            },
            {
                path: 'signUp',
                component: () => import('@/pages/Profile/signup/Signup.vue'),
                meta: {
                    hideParent: true
                }
            },
            {
                path: 'emailVerify',
                component: () => import('@/pages/Profile/emailVerify/EmailVerify.vue'),
                meta: {
                    hideParent: true
                }
            },
            {
                path: 'account',
                component: () => import('@/pages/Profile/account/Account.vue'),
                meta: {
                    hideParent: true
                }
            },
        ]
    },

]