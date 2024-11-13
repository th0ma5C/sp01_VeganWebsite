import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useUserStore = defineStore('user', () => {

    const isAuth = ref(false);
    const user = reactive({
        username: null as null | string,
        email: null as null | string,
    })

    function login() {
        isAuth.value = true;
    }

    function logout() {
        isAuth.value = false;
    }

    function setUsername(username: string) {
        user.username = username
    }

    function setEmail(email: string) {
        user.email = email
    }

    return {
        isAuth,
        user,
        login,
        logout,
        setUsername,
        setEmail
    }
})