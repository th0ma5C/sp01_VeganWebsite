import { reqCancelUserOrder, reqGetUserOrder, reqGetUserShippingInfo } from "@/api/order/order";
import { reqUserLogout } from "@/api/userAuth";
import { jwtDecode } from "jwt-decode";
import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import type { UserOrder } from "@/api/order/type";

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

    const router = useRouter();
    const isAuth = ref(false);
    const userToken = ref<string | null>(null);
    const user = reactive({
        username: null as null | string,
        email: null as null | string,
        userID: null as null | string,
    })
    const userSavedCheckoutForm = reactive({});
    const userOrderList = ref<UserOrder[]>([]);

    function setUsername(username: string | null) {
        user.username = username
    }

    function setEmail(email: string | null) {
        user.email = email
    }

    function setUserID(id: string | null) {
        user.userID = id
    }

    function login(token?: string) {
        isAuth.value = true;
        if (token) {
            storeUserProfile(token)
            loadUserProfile();
            userToken.value = token;
        }
    }

    async function logout() {
        isAuth.value = false;
        try {
            const result = await reqUserLogout();
            if (result.state == 'logout') {
                setUsername(null);
                setEmail(null);
                setUserID(null);
                clearStorageProfile();
                await router.replace('/home');
                await router.push('/profile')
            }
        } catch (error) {

        }
    }

    function storeUserProfile(token: string) {
        const val = JSON.stringify(token)
        localStorage.setItem(ProfileStorage_KEY, val)
    }

    function loadUserProfile() {
        const data = JSON.parse(localStorage.getItem(ProfileStorage_KEY) ?? '');
        if (!data || data === '') return

        const decoded = jwtDecode<LoginTokenPayload>(data);
        setUsername(decoded.username);
        setEmail(decoded.email);
        setUserID(decoded.userID);
    }

    function clearStorageProfile() {
        localStorage.removeItem(ProfileStorage_KEY)
    }

    function getStorageToken() {
        const token = JSON.parse(localStorage.getItem(ProfileStorage_KEY) ?? '');
        return token
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
    })

    return {
        isAuth,
        user,
        userSavedCheckoutForm,
        userOrderList,
        login,
        logout,
        setUsername,
        setEmail,
        getSavedShippingInfo,
        getUserOrderList,
        cancelOrder,
        refreshOrderList
    }
})