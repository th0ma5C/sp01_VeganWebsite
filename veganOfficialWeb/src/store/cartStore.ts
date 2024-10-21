import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
import type { MenuItem } from "@/api/menu/type";

interface MapState {
    [key: string]: {
        price: number,
        amount: number,
        imgUrl: string
    }
}

export const useCartStore = defineStore('cart', () => {

    // cart drawer 開關
    const isCartCardOpen = ref(false);
    function toggleCartCardOpen() {
        isCartCardOpen.value = !isCartCardOpen.value
    }

    const cartItems = reactive<MenuItem[]>([]);
    const cartMap = reactive<MapState>({})

    // 新增item
    function addItemToCart(item: MenuItem) {
        cartItems.push(item);
        if (!cartMap[item.name!]) {
            cartMap[item.name!] = {
                price: item.price!,
                amount: 1,
                imgUrl: item.fileName!
            }
        } else {
            cartMap[item.name!].amount += 1
        }
    }
    // 刪除item
    function DELItemFromCart(target: string) {
        delete cartMap[target];
    }

    // cart btn icon 計數
    const cartCounter = computed(() => {
        if (Object.keys(cartMap).length == 0) return
        let total = 0;
        for (let i of Object.values(cartMap)) {
            total += i.amount
        }
        return total
    });

    // cart 總金額
    const cartTotalPrice = computed(() => {
        let total = 0;
        for (let i of Object.values(cartMap)) {
            total += (i.amount * i.price)
        }
        return total
    })

    // storage 緩存
    const storageKey = 'cart';
    function getStorageCounter() {

    }

    return {
        isCartCardOpen,
        cartItems,
        cartMap,
        cartCounter,
        cartTotalPrice,
        toggleCartCardOpen,
        addItemToCart,
        DELItemFromCart,
    }
})