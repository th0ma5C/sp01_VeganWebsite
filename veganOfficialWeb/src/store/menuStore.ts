import { defineStore } from "pinia";
import { ref, readonly, watch, computed } from "vue";
import type { Ref } from "vue";
import { reqMenu } from '@/api/menu';
import type { MenuItem } from '@/api/menu/type'
import { nanoid } from "nanoid";
import getTopFiveMostSimilarity from "@/utils/findMostSimilar";

interface Menu {
    items: MenuItem[],
    name: string | null
}

interface ingredientsList {
    ingredients: string[] | null
}
// export type {
// ingredientsList
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

    let fetchMenu = async () => {
        try {
            let { data: { menu } } = await reqMenu({ query: GET_MENU });

            menu[0].items.forEach((el) => {
                // 補全圖片地址
                el.fileName = '/api' + el.fileName + '.png';
                // 新增ID
                el.id = nanoid(4);
                // 補足數量6個
                // while (el.ingredients.length < 6) {
                //     el.ingredients.push('');
                // }
            });

            menu[1].items.forEach((el) => {
                el.fileName = '/api' + el.fileName + '.jpg';
                el.id = nanoid(4);
                // while (el.ingredients.length < 6) {
                //     el.ingredients.push('');
                // }
            });

            fullMenu.value = menu;
            saladList.value = menu[0].items;
            smoothieList.value = menu[1].items;

            // console.log(fullMenu.value);
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

    let getInfoByName = (name: string) => {
        let result
        for (let i in fullMenu.value) {
            result = fullMenu.value[i].items.find((item) => {
                return item.name === name
            })
            if (result) break
        }
        return result
    }

    function getSameStyleItem(targetArr: string[]) {
        const arrays = saladList.value.map((salad) => {
            return [...salad.ingredients]
        });

        const indexList = getTopFiveMostSimilarity(arrays, targetArr);

        const result = indexList.map((index) => {
            return saladList.value[index]
        })

        return result
    }

    function init() {
        if (isLoaded.value == false) {
            fetchIngredients()
            fetchMenu()
        }
    }
    init();


    return {
        fullMenu,
        saladList,
        smoothieList,
        ingredientsList,
        isLoaded,
        fetchMenu,
        getInfoByName,
        getSameStyleItem
    }
}))