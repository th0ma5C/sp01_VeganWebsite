import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import type { MenuItem } from "@/api/menu/type"

export const useCartStore = defineStore('cart', () => {

    const storageKey = 'cart';
    function getStorageCounter() {

    }

    const cartCounter = ref(0);
    function counterIncrease() {
        cartCounter.value += 1;
    }

    const isCartCardOpen = ref(false);
    function toggleCartCardOpen() {
        isCartCardOpen.value = !isCartCardOpen.value
    }

    const cartItems = reactive<MenuItem[]>([]);
    function addItemToCart(item: MenuItem) {
        cartItems.push(item)
        console.log(cartItems);
    }

    function DELItemFromCart() {

    }

    return {
        isCartCardOpen,
        cartCounter,
        cartItems,
        counterIncrease,
        toggleCartCardOpen,
        addItemToCart,
        DELItemFromCart
    }
})