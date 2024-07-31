import { defineStore } from "pinia";
import { ref, readonly, watch, computed } from "vue";
import type { Ref } from "vue";
import { reqMenu } from '@/api/menu';
import type { MenuItem } from '@/api/menu/type'

// interface Menu {
//     items: MenuItem[],
//     name: string
// }

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

    let saladList: Ref<MenuItem[]> = ref([
        {
            name: null,
            description: null,
            ingredients: [],
            price: null,
            category: null,
            fileName: null
        }
    ]);
    let smoothieList: Ref<MenuItem[]> = ref([
        {
            name: null,
            description: null,
            ingredients: [],
            price: null,
            category: null,
            fileName: null
        }
    ]);
    let isLoaded = ref(false)

    let fetchMenu = async () => {
        try {
            let { data: { menu } } = await reqMenu({ query: GET_MENU });
            menu[0].items.forEach((el) => {
                el.fileName = '/api' + el.fileName + '.png'
            });
            saladList.value = [...menu[0].items, ...menu[0].items];

            menu[1].items.forEach((el) => {
                el.fileName = '/api' + el.fileName + '.jpg'
            });
            smoothieList.value = menu[1].items;

            // console.log(saladList.value);
            isLoaded.value = true;
        } catch (error) {
            console.log(fetchMenu.name, 'failed');
            console.log(error);
        }
    }

    if (isLoaded.value == false) {
        // fetchMenu()
    }


    return { saladList, smoothieList, isLoaded }
}))