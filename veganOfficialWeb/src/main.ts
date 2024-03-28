import { createApp, provide } from "vue"
import App from "@/App.vue"

const app = createApp(App)
// 路由
import router from './router'

// svg插件依賴
import 'virtual:svg-icons-register'

// 引入插件
import plugins from "./components/global"

// swiper依賴
import { register } from "swiper/element/bundle"
register()


app.use(router).use(plugins)

app.mount('#app')