import { defineStore } from "pinia";
import { computed, reactive, ref, watch } from "vue";
import type { MenuItem } from "@/api/menu/type";

interface MapState {
    [key: string]: {
        price: number,
        amount: number,
        imgUrl: string,
        category: string
    }
}

interface StorageData {
    user: string;
    id: string;
    data: MapState;
    expiration: any;
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
                imgUrl: item.fileName!,
                category: item.category!
            }
        } else {
            cartMap[item.name!].amount += 1
        }
        setCartToStorage();
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
    const user = 'mock user';
    const userID = '00000000';
    const expiredTime = 1000 * 60 * 60 * 24 * 2; // 2天
    const stamp = ref(Date.now() + expiredTime);

    const cacheData = computed(() => {
        return {
            user,
            id: userID,
            data: cartMap,
            expiration: stamp.value
        }
    })

    function isExpired(stamp: number) {
        return Date.now() > stamp
    }

    function setCartToStorage() {
        if (cacheData.value.user == 'mock user') {
            stamp.value = Date.now() + expiredTime;
        }
        try {
            const data = JSON.stringify(cacheData.value);
            localStorage.setItem(storageKey, data);
        } catch (error) {
            console.error('failed when stringify cart data to localStorage', error);
        }
    }

    function getCartFromStorage() {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return
        try {
            const data = JSON.parse(raw) as StorageData;
            return isExpired(data.expiration) ? localStorage.removeItem(storageKey) : data
        } catch (error) {
            console.error('failed when parsing cart data from localStorage', error);
            localStorage.removeItem(storageKey)
            return
        }
    }

    function initCart() {
        const cartData = getCartFromStorage();
        if (!cartData) return
        const { data } = cartData;
        Object.assign(cartMap, { ...data });
    }

    watch(cartMap, () => {
        setCartToStorage()
    }, { deep: true })

    const headerCartBtn = ref();
    function getHeaderCartBtn(target: HTMLElement) {
        headerCartBtn.value = target
    }

    return {
        isCartCardOpen,
        cartItems,
        cartMap,
        cartCounter,
        cartTotalPrice,
        headerCartBtn,
        toggleCartCardOpen,
        addItemToCart,
        DELItemFromCart,
        setCartToStorage,
        getCartFromStorage,
        initCart,
        getHeaderCartBtn
    }
})