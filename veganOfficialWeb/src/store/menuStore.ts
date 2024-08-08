import { defineStore } from "pinia";
import { ref, readonly, watch, computed } from "vue";
import type { Ref } from "vue";
import { reqMenu } from '@/api/menu';
import type { MenuItem } from '@/api/menu/type'
import { nanoid } from "nanoid";

interface Menu {
    items: MenuItem[],
    name: string | null
}

interface ingredientsList {
    ingredients: string[] | null
}

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
                    rating
                    date
                }
            }
        }
    `
    const GET_ingredients = `
        query {
            menu {
                items {
                    ingredients
                }
            }
        }
    `
    let fullMenu: Ref<Menu[]> = ref([
        {
            items: [],
            name: null,
        }
    ])
    let saladList: Ref<MenuItem[]> = ref([
        {
            name: null,
            description: null,
            ingredients: [],
            price: null,
            category: null,
            fileName: null,
            rating: null,
            date: null
        }
    ]);
    let smoothieList: Ref<MenuItem[]> = ref([
        {
            name: null,
            description: null,
            ingredients: [],
            price: null,
            category: null,
            fileName: null,
            rating: null,
            date: null
        }
    ]);
    let ingredientsList: Ref<ingredientsList[]> = ref([
        { ingredients: null }
    ])
    let isLoaded = ref(false);
    let saladMap = ref(new Map())

    let fetchMenu = async () => {
        try {
            let { data: { menu } } = await reqMenu({ query: GET_MENU });

            fullMenu.value = menu;

            menu[0].items.forEach((el) => {
                el.fileName = '/api' + el.fileName + '.png';
                el.id = nanoid(4);
            });
            saladList.value = menu[0].items;

            menu[1].items.forEach((el) => {
                el.fileName = '/api' + el.fileName + '.jpg'
                el.id = nanoid(4);
            });
            smoothieList.value = menu[1].items;
            for (let i in smoothieList.value) {
                saladMap.value.set(smoothieList.value[i].id, Number(i))
            }

            // console.log(data);
            isLoaded.value = true;
        } catch (error) {
            console.log(fetchMenu.name, 'failed');
            console.log(error);
        }
    }

    let fetchIngredients = async () => {
        try {
            let { data: { menu: [{ items: salad }, { items: smoothie }] } } = await reqMenu({ query: GET_ingredients });
            ingredientsList.value = [...salad, ...smoothie];

        } catch (error) {
            console.log(fetchIngredients.name, 'failed');
            console.log(error);
        }
    }

    if (isLoaded.value == false) {
        fetchIngredients()
        fetchMenu()
    }

    return { fullMenu, saladList, smoothieList, ingredientsList, isLoaded, saladMap }
}))