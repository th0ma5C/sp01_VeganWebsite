import { reqGetUserOrder, reqGetUserShippingInfo } from "@/api/order/order";
import { reqUserLogout } from "@/api/userAuth";
import { jwtDecode } from "jwt-decode";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

interface LoginTokenPayload {
    username: string,
    email: string,
    userID: string
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
    const userCheckoutForm = reactive({})

    function setUsername(username: string) {
        user.username = username
    }

    function setEmail(email: string) {
        user.email = email
    }

    function setUserID(id: string) {
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
            console.log(shippingInfo);
        } catch (error) {
            console.log(error);
        }
    }

    // get user order
    async function getUserOrderList() {
        const token = userToken.value ?? getStorageToken();
        try {
            const { order } = await reqGetUserOrder(token);
            console.log(order);
        } catch (error) {
            console.log(error);
        }
    }

    return {
        isAuth,
        user,
        login,
        logout,
        setUsername,
        setEmail,
        getSavedShippingInfo,
        getUserOrderList
    }
})