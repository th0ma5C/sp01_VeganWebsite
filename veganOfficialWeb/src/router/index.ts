import { createRouter, createWebHistory } from "vue-router";
import Home from '@pages/Home/index.vue'
import Menu from '@pages/Menu/index.vue'
import About from '@pages/About/index.vue'
import Checkout from '@/pages/Cart/Checkout.vue'
// import Profile from '@pages/Profile/index.vue'
import Product from "@/pages/Menu/product/Product.vue";
// import Account from "@/pages/Profile/account/Account.vue";
import type { RouteLocationNormalized, NavigationGuardNext, NavigationGuardReturn } from 'vue-router'
import { useUserStore } from '@/store/userStore'
import { reqGetUser, reqRedirectLogin } from "@/api/userAuth";
import { jwtDecode } from "jwt-decode";
import { useToastStore } from "@/store/toastStore";
import { useLoaderStore } from "@/store/loader";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useCartStore } from "@/store/cartStore";
// import { useQuestionnaireStore } from "@/store/questionnaireStore";

NProgress.configure({ showSpinner: false });

interface RedirectResTokenDecoded {
    email: string,
    userID: string,
    isGuest: boolean,
    exp: number
}

const routes = [
    {
        path: '/',
        redirect: '/home',
        meta: {
        }
    },
    {
        path: '/home',
        component: Home,
        name: 'Home',
        meta: {
            searchKeys: ['首頁', 'home'],
        }
    },
    {
        path: '/questionnaire',
        component: () => import('@pages/Questionnaire/index.vue'),
        children: [
            {
                path: 'result',
                component: () => import('@/pages/Questionnaire/result/QNR_result.vue'),
            }
        ],
        meta: {
            searchKeys: ['專屬分析', '分析', '問卷', '測驗', 'questionnaire']
        },
        beforeEnter: () => {
            // console.log('object');
            // const questionnaireStore = useQuestionnaireStore();
            // questionnaireStore.checkResultIsExpired();
            return true
        }
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
            ],
            searchKeys: ['美味菜單', '菜單', '商品', '沙拉', '果昔', 'menu']
        }
    },
    {
        name: 'Product',
        component: Product,
        path: '/product',
        // props(route: RouteLocationNormalized) {
        //     return route.query
        // },
        props: (route: RouteLocationNormalized) => route.query,
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
            ],
        },
    },
    {
        path: '/about',
        component: About,
        meta: {
            searchKeys: ['關於果漾', '關於', 'about']
        }
    },
    {
        path: '/checkout',
        component: Checkout,
        children: [
            {
                path: '',
                name: 'createOrder',
                component: () => import('@/pages/Cart/CreateOrder/CreateOrder.vue'),
                beforeEnter: (
                    to: RouteLocationNormalized,
                    from: RouteLocationNormalized
                ) => {
                    return true
                },
            },
            {
                name: 'orderProcessing',
                path: 'orderProcessing',
                component: () => import('@/pages/Cart/OrderProcessing/OrderProcessing.vue'),
                beforeEnter: (
                    to: RouteLocationNormalized,
                    from: RouteLocationNormalized
                ) => {
                    // const userStore = useUserStore();
                    // const toastStore = useToastStore();
                    // if (userStore.isAuth) {
                    //     toastStore.addNotification('請先登出')
                    //     return '/profile/account'
                    // }
                    // return true
                },
            },
        ]
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/pages/Profile/index.vue'),
        // component: Profile,
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
        meta: {
            searchKeys: ['登入', 'login']
        },
        children: [
            {
                name: 'ForgetPassword',
                path: 'forgetPassword',
                component: () => import('@/pages/Profile/forgetPassword/ForgetPassword.vue'),
                meta: {
                    hideParent: true,
                    searchKeys: ['忘記密碼', 'forgetPassword']
                },
                beforeEnter: (
                    to: RouteLocationNormalized,
                    from: RouteLocationNormalized
                ) => {
                    const userStore = useUserStore();
                    const toastStore = useToastStore();
                    if (userStore.isAuth) {
                        toastStore.addNotification('請先登出')
                        return '/profile/account'
                    }
                    return true
                },
            },
            {
                path: 'resetPassword',
                component: () => import('@/pages/Profile/resetPassword/ResetPassword.vue'),
                meta: {
                    hideParent: true,
                },
                beforeEnter: (
                    to: RouteLocationNormalized,
                    from: RouteLocationNormalized
                ) => {
                    const token = to.query.token as string;
                    if (!token) {
                        return router.push({
                            name: 'ForgetPassword',
                            state: {
                                msg: '重設驗證失效，請重新發送驗證信'
                            }
                        })
                    }

                    const payload = jwtDecode<RedirectResTokenDecoded>(token)
                    const isExpired = (payload.exp ?? 0) < (Date.now() / 1000)
                    if (isExpired) {
                        return {
                            name: 'ForgetPassword',
                            state: {
                                msg: '重設已過期，請重新發送驗證信'
                            }
                        }
                    }
                    const userStore = useUserStore();
                    const { setUserID } = userStore;
                    setUserID(payload.userID);
                    return true
                },
            },
            {
                path: 'signUp',
                component: () => import('@/pages/Profile/signup/Signup.vue'),
                meta: {
                    hideParent: true,
                    searchKeys: ['註冊', 'signUp']
                },
                beforeEnter: (
                    to: RouteLocationNormalized,
                    from: RouteLocationNormalized
                ) => {
                    const userStore = useUserStore();
                    const toastStore = useToastStore();
                    if (userStore.isAuth) {
                        toastStore.addNotification('請先登出')
                        return '/profile/account'
                    }
                    return true
                },
            },
            {
                name: 'EmailVerify',
                path: 'emailVerify',
                component: () => import('@/pages/Profile/emailVerify/EmailVerify.vue'),
                props: true,
                meta: {
                    hideParent: true,
                },
                beforeEnter: (
                    to: RouteLocationNormalized,
                    from: RouteLocationNormalized
                ) => {
                    const userStore = useUserStore();
                    const token = to.query.token;
                    if (token) return true

                    // if (!userStore.user.email) {
                    //     return '/profile'
                    // }
                    // if (userStore.isAuth) {
                    //     return '/profile/account'
                    // }
                    return true
                }
            },
            {
                path: 'account',
                name: 'Account',
                // component: Account,
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
                },
                meta: {
                    hideParent: true,
                    requireAuth: true,
                    searchKeys: ['會員', '購買清單', 'account']

                }
            }
        ]
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/pages/404/404.vue'), }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savePosition) {
        if (to.query.scroll) {
            return false
        }
        return { top: 0 }
    }
})

// pre load component
const ProfilePages = import.meta.glob(
    '@/pages/Profile/account/Account.vue',
    { eager: false }
);

// 預加載 account page
function preloadProfilePages() {
    for (const path in ProfilePages) {
        ProfilePages[path](); // 觸發實際 import，這時候 chunk 才會被載入
    }
}

router.beforeEach(async (to, from) => {
    NProgress.start();

    const userStore = useUserStore();
    const toastStore = useToastStore();
    const loaderStore = useLoaderStore();

    if (to.path == '/profile') preloadProfilePages()

    if (to.path == '/profile' && to.query.token) {
        try {
            loaderStore.loaderActivated = true;
            const JWT = to.query.token as string
            const decoded = jwtDecode<RedirectResTokenDecoded>(JWT);
            if (decoded.isGuest) {
                if (decoded.userID !== userStore.user.userID) {
                    await userStore.logout();
                }
                const { token } = await reqRedirectLogin({ token: JWT });
                await userStore.login(token, decoded.isGuest);
                setTimeout(() => {
                    loaderStore.loaderActivated = false;
                }, 5000);
            } else {
                setTimeout(() => {
                    loaderStore.loaderActivated = false;
                }, 5000);
                return true
            }
        } catch (error) {
            console.log(error);
        }
        return '/profile/account'
    }

    if (userStore.user.username !== 'anonymous' && !userStore.isAuth) {
        try {
            loaderStore.loaderActivated = true;
            const { state, token } = await reqGetUser();
            if (state && state == 'confirm' && token) {
                await userStore.login(token);
            } else {
                userStore.clearExpiredUserData();
            }
            setTimeout(() => {
                loaderStore.loaderActivated = false;
                toastStore.addNotification(`${userStore.user.username}，歡迎！`)
            }, 5000);
            return true
        } catch (error) {
            userStore.clearExpiredUserData();
            console.log(error);
        }
    }

    setTimeout(() => {
        loaderStore.loaderActivated = false;
    }, 5000);

    return true
})

router.afterEach((to, from) => {
    NProgress.done()
})

export default router