import { createApp } from "vue"
import App from "@/App.vue"

const app = createApp(App)
// svg插件配置
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/svg-icon/index.vue'
app.component('SvgIcon', SvgIcon)

app.mount('#app');