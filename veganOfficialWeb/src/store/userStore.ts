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

const storage_KEY = 'profile';

export const useUserStore = defineStore('user', () => {

    const router = useRouter();
    const isAuth = ref(false);
    const user = reactive({
        username: null as null | string,
        email: null as null | string,
        userID: null as null | string,
    })

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
        localStorage.setItem(storage_KEY, val)
    }

    function loadUserProfile() {
        const data = JSON.parse(localStorage.getItem(storage_KEY) ?? '');
        if (!data || data === '') return

        const decoded = jwtDecode<LoginTokenPayload>(data);
        setUsername(decoded.username);
        setEmail(decoded.email);
        setUserID(decoded.userID);
    }

    function clearStorageProfile() {
        localStorage.removeItem(storage_KEY)
    }

    function verifyToken() {

    }

    return {
        isAuth,
        user,
        login,
        logout,
        setUsername,
        setEmail,
    }
})