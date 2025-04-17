<template>
    <div class="container" v-if="!isAuth">
        <div class="login" v-if="!$route.meta.hideParent">
            <h1>
                登入
            </h1>

            <div class="inputWrapper">
                <VForm as=""
                    v-slot="{ meta, isSubmitting, handleSubmit, submitCount, values }"
                    :validation-schema="loginSchema"
                    :initial-values="{
                        email: showEmail
                    }">
                    <form action=""
                        @submit="handleSubmit($event, loginReq)">
                        <fieldset>
                            <div>
                                <VField name="email"
                                    v-slot="{ field, meta }"
                                    v-model="inputEmail">
                                    <input type="text"
                                        id="loginEmail"
                                        required
                                        autocomplete="username"
                                        :="field" :class="{
                                            invalidInput: !meta.valid && submitCount > 0
                                        }"
                                        @keydown.tab="handleTab">
                                    <i class="placeholder"
                                        v-show="!userAgentIsMobile">
                                        <span>
                                            TAB
                                        </span>
                                        測試者快速登入
                                    </i>
                                </VField>
                                <label
                                    for="loginEmail">電子信箱</label>

                                <ErrorMessage as="div"
                                    class="errorMsg"
                                    name="email"
                                    v-slot="{ message }"
                                    :style="{
                                        opacity: submitCount > 0 ? 1 : 0
                                    }">
                                    <SvgIcon
                                        name="QNR_alert"
                                        width="18"
                                        height="18"
                                        color="#b3261e">
                                    </SvgIcon>
                                    <span>{{ message
                                        }}</span>
                                </ErrorMessage>
                            </div>

                            <div>
                                <VField name="password"
                                    v-slot="{ field, meta, validate }"
                                    v-model="inputPassword">
                                    <input ref="passwordRef"
                                        :type="showPassword ? 'text' : 'password'"
                                        id="password"
                                        required
                                        placeholder=""
                                        autocomplete="current-password"
                                        @input="validate"
                                        @keydown.tab="handleTab"
                                        :="field" :class="{
                                            invalidInput: !meta.valid && submitCount > 0
                                        }">
                                    <i class="placeholder"
                                        v-show="!userAgentIsMobile">
                                        <span>
                                            TAB
                                        </span>
                                        測試者快速登入
                                    </i>
                                </VField>
                                <label
                                    for="password">密碼</label>
                                <div class="passwordIcon" @="{
                                    click: toggleShowPassword,
                                }">
                                    <SvgIcon
                                        v-show="!showPassword"
                                        name="Hidepassword"
                                        width="20px"
                                        height="20px"
                                        color="black">
                                    </SvgIcon>
                                    <SvgIcon
                                        v-show="showPassword"
                                        name="Showpassword"
                                        width="20px"
                                        height="20px"
                                        color="black">
                                    </SvgIcon>
                                </div>

                                <ErrorMessage as="div"
                                    class="errorMsg"
                                    name="password"
                                    v-slot="{ message }"
                                    :style="{
                                        opacity: submitCount > 0 ? 1 : 0
                                    }">
                                    <SvgIcon
                                        name="QNR_alert"
                                        width="18"
                                        height="18"
                                        color="#b3261e">
                                    </SvgIcon>
                                    <span>
                                        {{ message }}
                                    </span>
                                </ErrorMessage>
                            </div>
                        </fieldset>
                        <div class="forgetPassword">
                            <router-link
                                to="/profile/forgetPassword">
                                忘記密碼？
                            </router-link>
                        </div>
                        <div class="login_signup">
                            <div class="ResErrMsg"
                                v-show="registerMsg">
                                <SvgIcon name="QNR_alert"
                                    width="18" height="18"
                                    color="#b3261e">
                                </SvgIcon>
                                <span>
                                    {{ registerMsg }}
                                </span>
                            </div>

                            <button
                                :disabled="isSubmitting">
                                <span :style="{
                                    opacity: isSubmitting ? .5 : 1
                                }">登入</span>

                                <Spinner
                                    v-show="isSubmitting">
                                </Spinner>
                            </button>
                            <button class="testLogin"
                                v-if="userAgentIsMobile"
                                :disabled="isSubmitting"
                                @click="MobTestLogin">
                                <span :style="{
                                    opacity: isSubmitting ? .5 : 1
                                }">
                                    使用測試帳號
                                </span>
                                <Spinner
                                    v-show="isSubmitting">
                                </Spinner>
                            </button>

                            <div class="signup">
                                <span>
                                    沒有帳號？
                                </span>
                                <router-link
                                    to="/profile/signUp">
                                    註冊
                                </router-link>
                            </div>
                        </div>
                    </form>
                </VForm>
            </div>
        </div>

        <!-- <div class="divider">
            <span>
                快速登入
            </span>
        </div>

        <div class="outerAccount">
            <div v-for="(url, index) in showIconImgList"
                :key="index" @click="googleLoginRedirect"
                :class="{
                    onLogin: googleAuth.isLoading
                }">
                <img :src="url" alt="">
                <Spinner v-show="googleAuth.isLoading">
                </Spinner>
            </div>
        </div> -->
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeMount, onMounted, onUpdated, reactive, ref, watch, watchEffect, type Ref } from 'vue';
import useConcatImgPath from '@/hooks/useConcatImgPath';
import {
    Field as VField, Form as VForm, ErrorMessage, defineRule, configure,
} from 'vee-validate';
import * as yup from 'yup';
import { reqRedirectLogin, reqUserLogin } from '@/api/userAuth';
import type { AxiosError } from 'axios';
import { useUserStore } from '@/store/userStore';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { jwtDecode } from 'jwt-decode';
import { useToastStore } from '@/store/toastStore';
import { reqGoogleLogin, reqGoogleLoginUrl } from '@/api/userAuth/googleLogin';

const { addNotification } = useToastStore();


// 社群登入圖片路徑
const loginIcon = ['Google.png'];
const showIconImgList = useConcatImgPath(loginIcon, 'Login')

// 顯示密碼紐
const showPassword = ref(false);

function toggleShowPassword() {
    showPassword.value = !showPassword.value
}

// vee validate 表單
interface LoginData {
    email?: string | null;
    password?: string | null;
}
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

yup.addMethod(yup.string, 'email', function validateEmail(message) {
    return this.matches(emailRegex, {
        message: '請輸入正確信箱格式',
        name: 'email',
        excludeEmptyString: true,
    });
});

const loginSchema = yup.object({
    email: yup.string().trim().required('此欄不能空白').email(),
    password: yup.string().trim().required('此欄不能空白').matches(/^\S*$/, '格式錯誤'),
})

// 路由跳轉
const router = useRouter();
async function routerTo(route: string) {
    await router.push(route)
}

// 登入 api req
type ReqForm = yup.InferType<typeof loginSchema>;

interface ErrorResponse {
    message: string;
}

const registerMsg = ref<string | null>(null);

async function loginReq(form: Record<string, any>) {
    try {
        const result = await reqUserLogin(form as ReqForm);
        const { token } = result;
        await login(token);
        await routerTo('/profile/account');
        addNotification(`${user.value.username}，歡迎！`);
        return
    } catch (error) {
        const message = (error as AxiosError<ErrorResponse>).response?.data.message;
        registerMsg.value = message ?? '未知錯誤'
    }
}

// 初始化
const userStore = useUserStore();
const { isAuth, user } = storeToRefs(userStore);
const { login, setEmail } = userStore;


// 跳轉處理
interface RedirectResTokenDecoded {
    email: string,
    userID: string,
    isGuest: boolean
}
const route = useRoute();
// const orderQueue = route.query.orderQueue as string;
// const SSEStore = useSSEStore();
// const { startPaymentQueue } = SSEStore;
// const { } = storeToRefs(SSEStore)

async function handleEmailRedirect() {
    if (!route.query.token) return
    if (route.path == '/profile/resetPassword') return
    if (route.path == '/profile/emailVerify') return

    try {
        const JWT = route.query.token as string;
        const { token } = await reqRedirectLogin({ token: JWT });
        const decoded = jwtDecode<RedirectResTokenDecoded>(token!);
        // if (orderQueue) {
        //     startPaymentQueue(orderQueue);
        // }
        await login(token, decoded.isGuest)
        await routerTo('/profile/account');
        addNotification(`${user.value.username}，歡迎！`)
        return
    } catch (error) {
        console.log(error);
        return
    }
}

const showEmail = computed(() => {
    if (user.value.email) {
        return user.value.email
    }
    return ''
})
const passwordRef = ref()
function autofocusInput(target: Ref) {
    target.value.focus()
}

watch(passwordRef, (nVal) => {
    if (nVal && showEmail.value !== '') {
        autofocusInput(passwordRef)
    }
}, { once: true })

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

// let pollingInterval: ReturnType<typeof setInterval> | null;

// function msgEvent(event: MessageEvent, targetWindow: Window) {
//     if (event.origin !== window.location.origin) return

//     const { code, state, error } = event.data;
//     console.log(code, state, error);

//     if (error) {
//         addNotification('登入失敗，請重試');
//         googleAuth.error = error;
//         return
//     }

//     if (code && state) {
//         googleAuth.data.code = code;
//         googleAuth.data.state = state;
//     }

// }

function openLoginWindow(url: string) {
    const popup = window.open(url, '_self');
    // if (!popup) return googleAuth.error = '請允許彈出視窗以繼續登入';

    // const eventHandler = (e: MessageEvent) => {
    //     return msgEvent(e, popup)
    // }
    // window.addEventListener('message', eventHandler);

    // pollingInterval = setInterval(() => {
    //     if (popup.closed && pollingInterval) {
    //         clearInterval(pollingInterval);
    //         googleAuth.isLoading = false;
    //         window.removeEventListener('message', eventHandler);
    //     }
    // }, 1000);
}



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

// 測試帳號快速登入
const testEmail = import.meta.env.VITE_ADMIN_ACCOUNT;
const testPwd = import.meta.env.VITE_ADMIN_PASSWORD;
const inputEmail = ref('');
const inputPassword = ref('');

function handleTab(e: KeyboardEvent) {
    const tabTarget = e.target as HTMLInputElement;
    if (tabTarget.value || userAgentIsMobile.value) return
    e.preventDefault();
    tabTarget.id == 'loginEmail' ?
        inputEmail.value = testEmail :
        inputPassword.value = testPwd
}

// mobile 快速登入
const userAgent = ref(navigator.userAgent);
const userAgentIsMobile = computed(() => /Mobi|Android|iPhone|iPad|iPod|Mobile/i.test(userAgent.value))
function MobTestLogin() {
    inputEmail.value = testEmail;
    inputPassword.value = testPwd
}

onBeforeMount(async () => {
    await handleEmailRedirect();
    if (isAuth.value) {
        router.push('/profile/account')
    }
})

onMounted(() => {
})

</script>

<style scoped lang="scss">
* {
    // outline: 1px solid black
}

$container_width: 300px;

.container {
    // @extend %headerPseudo;
    // @extend %fixContainer;
    @include flex-center-center;
    max-width: 100%;
    flex-direction: column;
    justify-content: normal;
    // min-height: 80vh;

    // padding-top: 3rem;
    // gap: 2rem;
    overflow: hidden;
    // width: max-content;
    margin-inline: auto;
    padding-inline: 1.5rem;
    flex: 1;

    h1 {
        font-size: 2rem;
        font-variation-settings: 'wght' 400;
    }

    &>div {
        // margin-top: 1rem;
    }
}

.login {
    text-align: center;
    flex: 1;
    width: 100%;
    max-width: 320px;
}

.inputWrapper {
    margin-top: 2rem;

    fieldset {
        display: flex;
        flex-direction: column;
        gap: 2rem;

        &>div {
            position: relative;
            // margin-bottom: 3rem;
        }

        input {
            width: 100%;
            // width: $container_width;
            max-width: 100%;
            height: 48px;
            padding: 0 1rem;
            border: 1px solid gray;
            border-radius: .5rem;
            background-color: $primaryBacColor;
        }

        .invalidInput {
            border: 1px solid #b3261e;
        }

        label {
            background-color: $primaryBacColor;
            position: absolute;
            text-wrap: nowrap;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            font-size: 18px;
            color: rgba(0, 0, 0, 0.75);
            transition: transform .3s ease;
            transform-origin: left;
            user-select: none;
            pointer-events: none;
        }

        .errorMsg {
            @include flex-center-center;
            flex-direction: row;
            gap: .5rem;
            color: #b3261e;
            text-wrap: nowrap;
            position: absolute;
            bottom: -75%;
            left: 0%;
            transform: translate(0%, -50%);
        }

        // & div:has(input:focus)>label,
        // & div:has(input:focus-within)>label,
        // & div:has(input:valid)>label {
        //     transform: translateY(calc(-100% - 10px)) scale(0.8);
        // }

        & div:has(input:focus, input:focus-within, input:valid)>label {
            transform: translateY(calc(-100% - 10px)) scale(0.8);
        }

        & div:has(input:focus, input:focus-within)>.placeholder {
            opacity: .25;
        }

        & div:has(input:valid)>.placeholder {
            opacity: 0;
        }

        // & div:has(input:focus)>label,
        // & div:has(input:not(:placeholder-shown))>label {
        //     transform: translateY(calc(-100% - 10px)) scale(0.8);
        // }

        // & div:has(input:focus)>.placeholder,
        // & div:has(input:not(:placeholder-shown))>.placeholder {
        //     opacity: .25;
        // }

        // & div:has(input:valid)>.placeholder,
        // & div:has(input:not(:placeholder-shown))>.placeholder {
        //     opacity: 0;
        // }

        .passwordIcon {
            @include absoluteCenterTLXY($left: 100%, $X: -150%);
            cursor: pointer;
            // right: 0;
            // top: 50%;
        }
    }
}

.placeholder {
    position: absolute;
    left: 1.25rem;
    top: 50%;
    translate: 0 -50%;
    user-select: none;
    pointer-events: none;
    font-variation-settings: 'wght' 500;
    opacity: 0;
    transition: opacity .15s;

    span {
        outline: 1px solid black;
        border-radius: .25rem;
        text-align: center;
        display: inline-flex;
        justify-content: center;
        padding: 0 .25rem;
    }
}

.forgetPassword {
    margin-top: .5rem;
    margin-bottom: 3rem;
    font-size: .75rem;
    text-align: end;
    opacity: .5;
    text-decoration: underline;
    text-underline-offset: 3px;

    &:hover {
        opacity: 1;
    }

}

.login_signup {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: .75rem;
    position: relative;

    button {
        background-color: $btnBacColor_light;
        color: $primaryBacColor;
        width: 150px;
        height: 42px;
        font-size: 1.25rem;
        border: 1px solid $btnBacColor_light;
        border-radius: 21px;
        box-shadow: 1px 1px 2px black;
        transition: box-shadow .15s ease;
        position: relative;
        user-select: none;

        &:hover {
            box-shadow: 2px 2px 4px black;
        }

        &:active {
            transition: none;
            box-shadow: 2px 2px 2px black;
            transform: translate(1px, 1px);
        }
    }

    .testLogin {
        font-size: 1rem;
        opacity: .5;

        &:active {
            opacity: 1;
        }
    }

    .signup {
        font-size: .75rem;

        a,
        span {
            opacity: .5;
        }

        a {
            text-decoration: underline;
            text-underline-offset: 3px;

            &:hover {
                opacity: 1;
            }
        }
    }

    .ResErrMsg {
        position: absolute;
        top: -2.25rem;
        display: flex;
        align-items: center;
        gap: .5rem;
        transform: translateX(-3px);

        span {
            color: $error_color;
        }
    }
}

%divider_line {
    @include WnH(50%, 1px);
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: $secondBacColor;
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

// .profileRoute-enter-active {
//     transition: opacity .15s ease;
// }

// .profileRoute-leave-active {
//     position: absolute;
// }

// .profileRoute-enter-from {
//     opacity: 0;
// }

// .profileRoute-enter-to {
//     opacity: 1;
// }</style>