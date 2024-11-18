import { defineStore } from "pinia";
import { computed, reactive, ref, watch } from "vue";
import type { MenuItem } from "@/api/menu/type";
import { useUserStore } from "./userStore";

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
    const userStore = useUserStore();

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

    const headerCart = ref();
    function getHeaderCart(target: HTMLElement) {
        headerCart.value = target
    }

    // 結帳頁
    const isCheckout = ref(false);
    function toggleIsCheckout() {
        isCheckout.value = !isCheckout.value
    }

    // 獲取購物車state
    const freightFee = ref(0);
    const getFreightFee = (fee: number) => freightFee.value = fee;
    const discountAmount = ref(0);
    const getDiscountAmount = (fee: number) => discountAmount.value = fee;
    const couponAmount = ref(0);
    const getCouponAmount = (fee: number) => couponAmount.value = fee;
    const totalAmount = ref(0);
    const getTotalAmount = (total: number) => totalAmount.value = total;

    function getCartState() {
        const list = { ...cartMap };
        const order = [];
        for (let i in list) {
            const item = {
                name: i,
                amount: list[i].amount,
                subtotal: list[i].amount * list[i].price
            }
            order.push(item)
        }
        return order
    }

    function getPurchaseOrder() {
        return {
            userID: userStore.user.userID,
            orderList: getCartState(),
            total: totalAmount.value,
            freightFee: freightFee.value,
            discountAmount: discountAmount.value,
            couponAmount: couponAmount.value,
            status: 'new'
        }
    }

    return {
        isCartCardOpen,
        cartItems,
        cartMap,
        cartCounter,
        cartTotalPrice,
        headerCart,
        isCheckout,
        freightFee,
        discountAmount,
        couponAmount,
        totalAmount,
        toggleCartCardOpen,
        addItemToCart,
        DELItemFromCart,
        setCartToStorage,
        getCartFromStorage,
        initCart,
        getHeaderCart,
        toggleIsCheckout,
        getCartState,
        getFreightFee,
        getDiscountAmount,
        getCouponAmount,
        getTotalAmount,
        getPurchaseOrder
    }
})