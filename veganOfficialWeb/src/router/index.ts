import { createRouter, createWebHistory } from "vue-router";
import routes from './config'
import { useNewsStore } from "@/store/newsStore";
import { useMenuStore } from "@/store/menuStore";
// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'
// NProgress.configure({ showSpinner: false })



const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savePosition) {
        return { top: 0 }
    }
})

// router.beforeEach(() => {
//     NProgress.start()
// })
router.afterEach(() => {
    // NProgress.done()
})

export default router