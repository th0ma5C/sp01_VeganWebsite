import { reqCancelUserOrder, reqGetUserOrder, reqGetUserShippingInfo } from "@/api/order/order";
import { reqUserLogout } from "@/api/userAuth";
import { jwtDecode } from "jwt-decode";
import { defineStore } from "pinia";
import { computed, inject, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import type { UserOrder, ShippingInfo } from "@/api/order/type";
import { useCartStore } from "./cartStore";
import { useQuestionnaireStore } from "./questionnaireStore";

interface LoginTokenPayload {
    username: string,
    email: string,
    userID: string,
    exp: number,
    iat: number
}

const ProfileStorage_KEY = 'profile';
const CheckoutFormStorage_KEY = 'checkoutForm';


export const useUserStore = defineStore('user', () => {
    const nanoid = inject('nanoid') as (t: number) => string;

    const router = useRouter();
    const isAuth = ref(false);
    const userToken = ref<string | null>(null);
    const user = reactive({
        username: 'anonymous' as 'anonymous' | string,
        email: null as null | string,
        userID: nanoid(6) as | string,
    })
    const userSavedCheckoutForm = reactive<Partial<ShippingInfo>>({});
    const userOrderList = ref<UserOrder[]>([]);

    function setUsername(username: string) {
        user.username = username
    }

    function setEmail(email: string | null) {
        user.email = email
    }

    function setUserID(id: string) {
        user.userID = id
    }

    function setUserState({ username = 'anonymous', email = null as null | string, userID = nanoid(6) }) {
        setUsername(username);
        setEmail(email);
        setUserID(userID);
    }

    async function login(token?: string, isGuest?: boolean) {
        try {
            isAuth.value = true;
            if (token && !isGuest) {
                storeUserProfile(token)
                loadUserProfile();
                userToken.value = token;
            }

            const cartStore = useCartStore();
            if (isGuest && token) {
                userToken.value = token
                return
            }
            await cartStore.memberLoadCart();
        } catch (error) {
            console.log(error);
        }
    }

    async function logout() {
        const questionnaireStore = useQuestionnaireStore();
        try {
            const result = await reqUserLogout();
            if (result.state == 'logout') {
                clearExpiredUserData();
                questionnaireStore.clearSurveyData();

                await router.replace('/home');
                await router.push('/profile');
            }
        } catch (error) {
            console.log(error);
        }
    }

    function storeUserProfile(token?: string) {
        let val = null;
        token ? (val = JSON.stringify(token)) : (val = JSON.stringify(user));
        localStorage.setItem(ProfileStorage_KEY, val)
    }

    function loadUserProfile() {
        try {
            const data = JSON.parse(localStorage.getItem(ProfileStorage_KEY) ?? 'null');
            if (!data) return
            if (typeof data === 'string') {
                const decoded = jwtDecode<LoginTokenPayload>(data);
                if (!decoded) return;
                setUserState(decoded);
                return
            }
            else {
                Object.assign(user, data)
            }
        } catch (error) {
            console.log(error);
        }
    }
    // user state initialize
    loadUserProfile();

    function clearStorageProfile() {
        localStorage.removeItem(ProfileStorage_KEY)
    }

    function getStorageToken() {
        const token = JSON.parse(localStorage.getItem(ProfileStorage_KEY) ?? 'null');
        return token ?? ''
    }

    // user token expired
    function clearExpiredUserData() {
        setUserState({})
        clearStorageProfile();
        isAuth.value = false;
        userToken.value = null;
        if (Object.keys(userSavedCheckoutForm).length !== 0) {
            Object.keys(userSavedCheckoutForm).forEach(key => {
                delete userSavedCheckoutForm[key];
            });
        }

        userOrderList.value.length = 0;

        const cartStore = useCartStore();
        Object.keys(cartStore.cartMap).forEach(key => {
            delete cartStore.cartMap[key];
        });
    }

    // get saved shipping info
    async function getSavedShippingInfo() {
        const token = userToken.value ?? getStorageToken();
        try {
            const { shippingInfo } = await reqGetUserShippingInfo(token);
            return shippingInfo
        } catch (error) {
            console.log(error);
        }
    }

    // get user order
    async function getUserOrderList() {
        const token = userToken.value ?? getStorageToken();
        try {
            const { order } = await reqGetUserOrder(token);
            // const orderList = order?.map((item) => item.purchaseOrder);
            if (!order) return
            return userOrderList.value = order
        } catch (error) {
            console.log(error);
        }
    }

    async function cancelOrder(orderID: string) {
        try {
            if (!userToken.value) throw new Error('請重新登入');
            const decoded = jwtDecode<LoginTokenPayload>(userToken.value);
            const currTime = Math.floor(Date.now() / 1000);
            if (decoded.exp < currTime) throw new Error('請重新登入');

            const result = await reqCancelUserOrder(userToken.value, orderID);
            return result
        } catch (error) {
            console.error('Error canceling order:', error);
        }
    }

    async function refreshOrderList() {
        try {
            userOrderList.value.length = 0;
            const result = await getUserOrderList()
            return result
        } catch (error) {
            console.log(error);
        }
    }

    // 在結帳頁刷新時可以復原已登入的使用者數據
    watch(userToken, async (nVal) => {
        if (nVal) {
            try {
                const info = await getSavedShippingInfo();
                if (info && info['_id']) {
                    const { _id, ...filteredInfo } = info;
                    Object.assign(userSavedCheckoutForm, filteredInfo);
                }
            } catch (error) {
                console.log(error);
            }
        }
    });


    return {
        isAuth,
        user,
        userSavedCheckoutForm,
        userOrderList,
        userToken,
        login,
        logout,
        setUsername,
        setEmail,
        storeUserProfile,
        getSavedShippingInfo,
        getUserOrderList,
        cancelOrder,
        refreshOrderList,
        clearExpiredUserData
    }
})