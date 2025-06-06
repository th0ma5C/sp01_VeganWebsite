import type { App } from 'vue'
import SvgIcon from '@/components/global/SvgIcon/index.vue'
import Spinner from './Spinner/index.vue'
import { nanoid } from 'nanoid'

const globalComponents = { SvgIcon, Spinner };

export default {
    install(app: App) {
        (Object.keys(globalComponents) as (keyof typeof globalComponents)[]).forEach(key => {
            app.component(key, globalComponents[key])
        });

        app.provide('nanoid', nanoid);

    }
}