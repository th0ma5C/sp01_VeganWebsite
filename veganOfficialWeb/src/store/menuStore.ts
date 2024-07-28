import { defineStore } from "pinia";
import { ref, readonly } from "vue";
import { reqMenu } from '@/api/menu';



export const useMenuStore = defineStore('menu', (() => {
    const GET_MENU = `
    query {
        menu {
            name
            items {
                name
                description
                ingredients
                price
                category
                fileName
            }
        }
    }
`

    let menuData = ref();
    let fetchMenu = async () => {
        try {
            let { data: { menu } } = await reqMenu({ query: GET_MENU });
            menuData.value = menu;
            console.log(menuData);
        } catch (error) {
            console.log(fetchMenu.name, 'failed');
            console.log(error);
        }

    }

    return { menuData, fetchMenu }
}))