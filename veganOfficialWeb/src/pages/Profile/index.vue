<template>
    <div :class="{
        profileContainer: $route.path !== '/profile/account'
    }">
        <router-view v-slot="{ Component, route }">
            <transition name="profileRoute">
                <component :is="Component">
                </component>
            </transition>
        </router-view>

        <div class="quickLogin" v-if="!isAuth">
            <div class="divider">
                <span>
                    快速登入
                </span>
            </div>

            <div class="outerAccount">
                <div v-for="(url, index) in showIconImgList"
                    :key="index"
                    @click="googleLoginRedirect" :class="{
                        onLogin: googleAuth.isLoading
                    }">
                    <img :src="url" alt="">
                    <Spinner v-show="googleAuth.isLoading">
                    </Spinner>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reqGoogleLogin, reqGoogleLoginUrl } from '@/api/userAuth/googleLogin';
import useConcatImgPath from '@/hooks/useConcatImgPath';
import { useToastStore } from '@/store/toastStore';
import { useUserStore } from '@/store/userStore';
import { storeToRefs } from 'pinia';
import { reactive, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';


const loginIcon = ['Google.png'];
const showIconImgList = useConcatImgPath(loginIcon, 'Login');

// store
const { addNotification } = useToastStore();

const userStore = useUserStore();
const { isAuth, user } = storeToRefs(userStore);
const { login } = userStore;

// route
const route = useRoute();
const router = useRouter();
async function routerTo(route: string) {
    await router.push(route)
}

// google login
interface GoogleAuthData {
    code: null | string,
    state: null | string,
}
const googleAuth = reactive({
    isLoading: false,
    error: null as null | string,
    data: {
        code: route.query.code,
        state: route.query.state,
    } as GoogleAuthData
})

async function googleLoginRedirect() {
    if (googleAuth.isLoading) return
    googleAuth.isLoading = true;
    googleAuth.error = null;
    try {
        const { authUrl, state } = await reqGoogleLoginUrl();
        if (!authUrl) return googleAuth.error = '跳轉驗證失敗';
        return openLoginWindow(authUrl)
    } catch (error) {
        googleAuth.error = '發生錯誤，請重試'
        console.error(error)
    }
}

function openLoginWindow(url: string) {
    const popup = window.open(url, '_self');
}

watchEffect(async () => {
    if (!googleAuth.data.code || !googleAuth.data.state) return
    googleAuth.isLoading = true
    try {
        const { result, token } = await reqGoogleLogin(googleAuth.data);
        if (!token) {
            addNotification('網路錯誤，請重試');
            return
        }
        await login(token);
        await routerTo('/profile/account');
        addNotification(`${user.value.username}，歡迎！`);
        googleAuth.data.code = null
        googleAuth.data.state = null
        return
    } catch (error) {
        googleAuth.error = '登入失敗，請重試'
        console.error(error)
    } finally {
        googleAuth.isLoading = false
    }
})

</script>

<style scoped lang="scss">
$container_width: 300px;

%divider_line {
    @include WnH(50%, 1px);
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: $secondBacColor;
}

.profileContainer {
    @extend %headerPseudo;
    @extend %fixContainer;

    flex-direction: column;
    justify-content: normal;
    min-height: 80vh;

    padding-top: 3rem;
    // gap: 2rem;
    overflow: hidden;
    // width: max-content;
    margin-inline: auto;
    padding-inline: 1.5rem;

    h1 {
        font-size: 2rem;
        font-variation-settings: 'wght' 400;
    }
}

.quickLogin {
    @include flex-center-center;
    flex-direction: column;
    max-width: 100%;
}

.divider {
    width: $container_width;
    margin: 1rem;
    position: relative;
    text-align: center;
    // overflow: hidden;

    &::before {
        @extend %divider_line;
        left: -15%;
    }

    &::after {
        @extend %divider_line;
        right: -15%;
    }
}

.outerAccount {
    margin: 1rem 0 3rem 0;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    min-height: 36px;

    &>div {
        // border: 1px solid green;
        cursor: pointer;
        max-width: 36px;
        border-radius: 18px;
        overflow: hidden;
        transition: scale .15s ease;
        // margin: .5rem;
        box-shadow: 1px 1px 4px gray;
        position: relative;

        &:hover {
            scale: 1.1;
        }
    }

    .onLogin::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        backdrop-filter: blur(2px);
    }
}

.profileRoute-enter-active,
.profileRoute-leave-active {
    transition: opacity .3s;
}

.profileRoute-leave-active {
    position: absolute;
    top: 148px;
}

.profileRoute-enter-from,
.profileRoute-leave-to {
    opacity: 0;
}

.profileRoute-enter-to,
.profileRoute-leave-from {
    opacity: 1;
}
</style>
