import { defineStore, storeToRefs } from "pinia";
import { computed, reactive, ref, watch } from "vue";
import type { MenuItem } from "@/api/menu/type";
import type { ResData } from "@/api/cart/type";
import { useUserStore } from "./userStore";
import { useMenuStore } from "./menuStore";
import { reqGetMemberCart, reqResetMemberCart, reqSaveCartList } from "@/api/cart/CartRequest";
import debounce from "lodash/debounce";


interface MapState {
    [key: string]: {
        price: number,
        amount: number,
        imgUrl: string,
        category: string,
        id: string
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
    const { storeUserProfile } = userStore;
    const { isAuth, user, userToken } = storeToRefs(userStore);

    const menuStore = useMenuStore();
    const { getInfoByName, fetchMenu } = menuStore;
    const { isLoaded, fullMenu } = storeToRefs(menuStore);


    // cart drawer 開關
    const isCartCardOpen = ref(false);
    function toggleCartCardOpen() {
        isCartCardOpen.value = !isCartCardOpen.value
    }

    // const cartItems = reactive<MenuItem[]>([]);
    const cartMap = reactive<MapState>({});
    const localCart = ref<MapState>({});
    const cloudCart = ref<MapState>({});

    // 新增item
    function addItemToCart(item: MenuItem) {
        // cartItems.push(item);
        if (!cartMap[item.name!]) {
            cartMap[item.name!] = {
                price: item.price!,
                amount: 1,
                imgUrl: item.fileName!,
                category: item.category!,
                id: item.id!
            }
        } else {
            cartMap[item.name!].amount += 1
        }
        setCartToStorage();
        // if (isAuth.value) {
        //     memberSaveCart();
        // }
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
    // const user = 'mock user';
    // const userID = '00000000';
    const expiredTime = 1000 * 60 * 60 * 24 * 2; // 2天
    const stamp = ref(Date.now());

    const cacheData = computed(() => {
        return {
            user: user.value,
            data: cartMap,
            expiration: stamp.value
        }
    })

    function isExpired(stamp: number) {
        return Date.now() > stamp
    }

    function setCartToStorage() {
        if (isAuth.value) return
        stamp.value = Date.now() + expiredTime;

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

    function initCartMap() {
        const cartData = getCartFromStorage();
        if (!cartData) return

        const { data } = cartData;

        Object.assign(cartMap, { ...data });
        // localCart.value = { ...data };
    }

    async function initCartItems() {
        try {
            if (!menuStore.isLoaded) {
                await fetchMenu();
            }

            for (const [key, val] of Object.entries(cartMap)) {
                let item = getInfoByName(key);
                if (item) {
                    // cartItems.push(...Array(val.amount).fill(item));
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function initCart() {
        try {
            initCartMap();
            setCartToStorage();
            await initCartItems();
        } catch (error) {
            console.log(error);
        }
    }

    let saveCartTimer: ReturnType<typeof setTimeout> | null = null;
    watch([cartMap, isAuth], async (nVal, oVal) => {
        try {
            if (nVal) {
                storeUserProfile();
                setCartToStorage();
                if (oVal[1] && nVal[1]) {
                    // if (saveCartTimer) clearTimeout(saveCartTimer);

                    // saveCartTimer = setTimeout(async () => {
                    await memberSaveCart();
                    // saveCartTimer = null
                    // }, 50);
                    // await memberSaveCart();
                }
            }
        } catch (error) {
            console.log(error);
        }
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

    // 會員儲存 cart list
    interface MemberCartList {
        item: string,
        quantity: number
    }
    const memberCartList = computed<MemberCartList[]>(() => {
        return Object.values(cartMap).map((item) => {
            return {
                item: item.id,
                quantity: item.amount
            }
        })
    })

    async function memberSaveCart() {
        try {
            const result = await reqSaveCartList(memberCartList.value, userToken.value);
        } catch (error) {
            console.log(error);
        }
    }

    // function setCloudCart(item: MenuItem) {
    //     if (!cloudCart.value[item.name!]) {
    //         cloudCart.value[item.name!] = {
    //             price: item.price!,
    //             amount: 1,
    //             imgUrl: item.fileName!,
    //             category: item.category!,
    //             id: item.id!
    //         }
    //     } else {
    //         cloudCart.value[item.name!].amount += 1
    //     }
    // }

    async function formattedCartData(data: ResData['cart']) {
        try {
            localCart.value = { ...cartMap };
            if (!isLoaded.value) await fetchMenu();
            const menu = fullMenu.value.flatMap((el) => {
                return el.items
            })
            data.forEach((cartItem) => {
                const target = menu.find((item) => {
                    return item.id == cartItem.item
                })
                if (target) {
                    for (let i = 0; i < cartItem.quantity; i++) {
                        addItemToCart(target);
                    }
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    // function mergeLocalAndCloudCart(local: MapState, cloud: MapState) {
    //     const mergeMap = new Map<keyof MapState, MapState[string]>();
    //     const mergeCart: MapState = {};

    //     for (const [key, val] of Object.entries(cloud)) {
    //         mergeMap.set(key, val)
    //     }

    //     for (const [key, val] of Object.entries(local)) {
    //         const cloudQuantity = mergeMap.get(key)?.amount || 0;
    //         mergeMap.set(key, { ...val, amount: val.amount + cloudQuantity })
    //     }

    //     mergeMap.forEach((item, index) => {
    //         mergeCart[index] = item;
    //     })

    //     return mergeCart
    // }

    // 登入後清空本地cart
    function clearLocalCart() {
        localStorage.removeItem(storageKey);
    }

    async function memberLoadCart() {
        try {
            const { cart } = await reqGetMemberCart(userToken.value);
            await formattedCartData(cart);
            clearLocalCart()
        } catch (error) {
            console.log(error);
        }
    }

    // todo 送出訂單後清空購物車
    async function memberResetCart() {
        try {
            await reqResetMemberCart(userToken.value);
        } catch (error) {
            console.log(error);
        }
    }

    function guestResetCart() {
        for (let i in cartMap) {
            delete cartMap[i];
        }
    }

    async function refreshMemberCart() {
        try {
            if (isAuth.value) {
                for (let item in cartMap) {
                    delete cartMap[item]
                }
                await memberResetCart();
                await memberLoadCart();
            } else {
                guestResetCart();
            }
        } catch (error) {
            console.log(error);
        }
    }



    return {
        isCartCardOpen,
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
        getPurchaseOrder,
        memberSaveCart,
        memberLoadCart,
        clearLocalCart,
        memberResetCart,
        refreshMemberCart
    }
})