import { createRouter, createWebHistory } from "vue-router";
// import routes from './config'
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
import { useNewsStore } from "@/store/newsStore";
import { useMenuStore } from "@/store/menuStore";
import { storeToRefs } from "pinia";
import { reqGetUser } from "@/api/userAuth";
// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'


const routes = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        component: Home,
        name: 'Home',
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
        name: 'Profile',
        component: Profile,
        beforeEnter: (
            to: RouteLocationNormalized,
            from: RouteLocationNormalized
        ) => {
            const userStore = useUserStore();
            if (userStore.isAuth && to.path == '/profile') {
                return '/profile/account'
            }
            return true
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
                name: 'EmailVerify',
                path: 'emailVerify',
                component: () => import('@/pages/Profile/emailVerify/EmailVerify.vue'),
                props: true,
                meta: {
                    hideParent: true
                },
                beforeEnter: () => {
                    const userStore = useUserStore();
                    if (!userStore.user.email) {
                        return '/profile'
                    }
                }
            },
            {
                path: 'account',
                name: 'Account',
                component: () => import('@/pages/Profile/account/Account.vue'),
                beforeEnter: async (
                    to: RouteLocationNormalized,
                    from: RouteLocationNormalized
                ) => {
                    const userStore = useUserStore();
                    if (!userStore.isAuth) {
                        try {
                            const { state, token } = await reqGetUser();
                            if (state && state == 'confirm' && token) {
                                userStore.login(token);
                                return true
                            }
                        } catch (error) {
                            userStore.isAuth = false;
                            await router.replace('/home')
                            await router.push('/profile')
                            return
                        }
                    }
                    // const userStore = useUserStore();
                    // if (userStore.isAuth) {
                    //     return true
                    // } else {
                    //     return router.replace('/profile')
                    // }
                },
                meta: {
                    hideParent: true,
                    requireAuth: true
                }
            }
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savePosition) {
        return { top: 0 }
    }
})

router.beforeEach(async (to, from) => {
    const userStore = useUserStore();
    if (userStore.user.username !== 'anonymous' && !userStore.isAuth) {
        try {
            const { state, token } = await reqGetUser();
            if (state && state == 'confirm' && token) {
                await userStore.login(token);
            } else {
                userStore.clearExpiredUserData();
            }
        } catch (error) {
            userStore.clearExpiredUserData();
            console.log(error);
        }
    }
    return true
})

export default router