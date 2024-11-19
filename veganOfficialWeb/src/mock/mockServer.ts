import type { MockMethod, MockConfig } from 'vite-plugin-mock'
import newCatalog from './data/home/newCatalog.json'
import hotCatalog from './data/home/hotCatalog.json'

export default [
    {
        url: '/api/home',
        method: 'get',
        response: () => {
            return {
                code: 1000,
                data: newCatalog
            }
        }
    }
] as MockMethod[]