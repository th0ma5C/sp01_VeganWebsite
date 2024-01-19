import { createApp } from "vue"
import App from "@/App.vue"

const app = createApp(App)
// svg插件配置
import 'virtual:svg-icons-register'
import globalComponents from "./components/global"
app.use(globalComponents)

app.mount('#app')