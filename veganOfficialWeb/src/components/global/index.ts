import type { App } from 'vue'
import SvgIcon from '@/components/global/SvgIcon/index.vue'

const globalComponents = { SvgIcon }

export default {
    install(app: App) {
        (Object.keys(globalComponents) as (keyof typeof globalComponents)[]).forEach(key => {
            app.component(key, globalComponents[key])
        })
    }
}