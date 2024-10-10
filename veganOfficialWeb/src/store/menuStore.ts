import { defineStore } from "pinia";
import { ref, readonly, watch, computed } from "vue";
import type { Ref } from "vue";
import { reqGetNewMenu, reqGetHotMenu, reqMenu } from '@/api/menu';
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
const GET_MENU = `
        query {
            menu {
                name
                items {
                    name
                    description
                    ingredients
                    main
                    price
                    category
                    fileName
                    rating
                    date
                    tags
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

export const useMenuStore = defineStore('menu', (() => {

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
            date: null,
            tags: [],
            main: null
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
            date: null,
            tags: [],
            main: null
        }
    ]);
    let ingredientsList: Ref<ingredientsList[]> = ref([
        { ingredients: null }
    ])
    let isLoaded = ref(false);
    const hotList = ref<MenuItem[]>([]);
    const newList = ref<MenuItem[]>([]);

    async function fetchMenu() {
        try {
            let { data: { menu } } = await reqMenu({ query: GET_MENU });

            menu[0].items.forEach((el) => {
                // 補全圖片地址
                el.fileName = '/api' + el.fileName + '.png';
                // 新增ID
                el.id = nanoid(4);
            });

            menu[1].items.forEach((el) => {
                el.fileName = '/api' + el.fileName + '.jpg';
                el.id = nanoid(4);
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

    async function fetchIngredients() {
        try {
            let { data: { menu: [{ items: salad }, { items: smoothie }] } } = await reqMenu({ query: GET_ingredients });
            ingredientsList.value = [...salad, ...smoothie];

        } catch (error) {
            console.log(fetchIngredients.name, 'failed');
            console.log(error);
        }
    }

    async function fetchHotList(params = {}) {
        try {
            if (Object.keys(params).length == 0) {
                params = {
                    name: 'salad'
                }
            }
            const data = await reqGetHotMenu({ params });
            return hotList.value = [...data];
        } catch (error) {
            console.log(fetchHotList.name, error);
            return []
        }
    }
    async function fetchNewList(params = {}) {
        try {
            if (Object.keys(params).length == 0) {
                params = {
                    name: 'salad'
                }
            }
            const data = await reqGetNewMenu({ params });
            return newList.value = [...data];
        } catch (error) {
            console.log(fetchHotList.name, error);
            return []
        }
    }

    function getInfoByName(name: string) {
        let result
        for (let i in fullMenu.value) {
            result = fullMenu.value[i].items.find((item) => {
                return item.name === name
            })
            if (result) return { ...result }
        }
        // return result
    }

    function getSameStyleItem(targetArr: string[], category: string) {
        let arrays;
        switch (category) {
            case 'salad':
                arrays = saladList.value.map((salad) => {
                    return [...salad.ingredients]
                });

            case 'smoothies':
                arrays = smoothieList.value.map((smoothies) => {
                    return [...smoothies.ingredients]
                });
            default:
                break;
        }
        const indexList = getTopFiveMostSimilarity(arrays!, targetArr);

        const result = indexList.map((index) => {
            return category == 'salad' ? saladList.value[index] : smoothieList.value[index]
        })

        return result
    }

    // function init() {
    //     if (isLoaded.value == false) {
    //         fetchIngredients()
    //         fetchMenu()
    //     }
    // }
    // init();


    return {
        fullMenu,
        saladList,
        smoothieList,
        hotList,
        newList,
        ingredientsList,
        isLoaded,
        fetchMenu,
        fetchHotList,
        fetchNewList,
        getInfoByName,
        getSameStyleItem
    }
}))