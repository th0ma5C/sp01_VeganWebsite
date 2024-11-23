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
                                    v-slot="{ field, meta }">
                                    <input type="email"
                                        id="email" required
                                        placeholder=""
                                        autocomplete="username"
                                        :="field" :class="{
                                            invalidInput: !meta.valid && submitCount > 0
                                        }">
                                </VField>
                                <label
                                    for="email">電子信箱</label>

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
                                    v-slot="{ field, meta, validate }">
                                    <input ref="passwordRef"
                                        :type="showPassword ? 'text' : 'password'"
                                        id="password"
                                        required
                                        placeholder=""
                                        autocomplete="current-password"
                                        @input="validate"
                                        :="field" :class="{
                                            invalidInput: !meta.valid && submitCount > 0
                                        }">
                                </VField>
                                <label
                                    for="password">密碼</label>
                                <div class="passwordIcon" @="{
                                    mousedown: toggleShowPassword,
                                    mouseup: toggleShowPassword
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


        <router-view v-slot="{ Component, route }">
            <transition name="profileRoute">
                <component :is="Component"
                    v-if="!route.meta.requireAuth">
                </component>
            </transition>
        </router-view>

        <div class="divider">
            <span>
                快速登入
            </span>
        </div>

        <div class="outerAccount">
            <div v-for="(url, index) in showIconImgList"
                :key="index">
                <img :src="url" alt="">
            </div>
        </div>
        <!-- <button @click="login">登入測試</button> -->
        <router-link to="/profile/account"
            @click="login">登入測試</router-link>
    </div>

    <router-view v-else v-slot="{ Component, route }">
        <component :is="Component"
            v-if="route.meta.requireAuth">
        </component>
    </router-view>
</template>

<script setup lang="ts">
/**
 * todo:  社群登入, 臨時帳號, 登出清理資料, 忘記密碼, user DB 連結購物車
 * doing: 登入後頁面(訂單), 登入後資料庫添加session, store建置, 記住登入資訊
 * * store含本地儲存JWT, 記住資訊會挾帶token至後端驗證, 添加JWT時限
 * !登出時結構崩潰，因為vif
 * -----------------------------------------
 * ? profile組件是否添加路由守衛
 * ? 遊客購物車
 * 
 * //樣式完成 分隔線
 * //label 轉場 社群icon
 * //密碼顯示紐
 * //忘記密碼/註冊分頁
 * //驗證時機改為送出前
 * //帳號驗證
 * //響應返回cookie: JWT
 * //註冊後跳轉驗證
 */

import { computed, nextTick, onBeforeMount, onMounted, onUpdated, ref, watch, type Ref } from 'vue';
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

// 社群登入圖片路徑
const loginIcon = ['Fb.png', 'Google.png', 'Line.png'];
const showIconImgList = useConcatImgPath(loginIcon, 'Login');

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

// function onSubmit(val: LoginData) {
//     console.log(val);
//     console.log(JSON.stringify(val, null, 2));
// }

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
function routerTo(route: string) {
    router.push(route)
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
        login(token);
        routerTo('/profile/account')
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
const route = useRoute();

async function handleEmailRedirect() {
    if (!route.query.token) return

    try {
        const JWT = route.query.token as string;
        const { token } = await reqRedirectLogin({ token: JWT });
        login(token);
        routerTo('/profile/account');
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

// initialize order list


watch(passwordRef, (nVal) => {
    if (nVal && showEmail.value !== '') {
        autofocusInput(passwordRef)
    }
}, { once: true })

onBeforeMount(async () => {
    await handleEmailRedirect();
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
    @extend %headerPseudo;
    @extend %fixContainer;

    flex-direction: column;
    justify-content: normal;
    min-height: 80vh;

    padding-top: 3rem;
    // gap: 2rem;

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
            width: $container_width;
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

        & div:has(input:focus)>label,
        & div:has(input:not(:placeholder-shown))>label {
            transform: translateY(calc(-100% - 10px)) scale(0.8);
        }

        .passwordIcon {
            @include absoluteCenterTLXY($left: 100%, $X: -150%);
            cursor: pointer;
            // right: 0;
            // top: 50%;
        }
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

        &:hover {
            box-shadow: 2px 2px 4px black;
        }

        &:active {
            transition: none;
            box-shadow: 2px 2px 2px black;
            transform: translate(1px, 1px);
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

    &>div {
        // border: 1px solid green;
        cursor: pointer;
        max-width: 36px;
        border-radius: 18px;
        overflow: hidden;
        transition: scale .15s ease;

        &:hover {
            scale: 1.1;
        }
    }
}

.profileRoute-enter-active {
    transition: opacity .15s ease;
}

.profileRoute-leave-active {
    position: absolute;
}

.profileRoute-enter-from {
    opacity: 0;
}

.profileRoute-enter-to {
    opacity: 1;
}
</style>