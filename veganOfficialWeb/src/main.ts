import { createApp, provide } from "vue"
import App from "@/App.vue"

const app = createApp(App)
// 路由
import router from './router'

// svg插件依賴
import 'virtual:svg-icons-register'

// 引入插件
import plugins from "./components/global"

// nanoid


app.use(router).use(plugins)

app.mount('#app')