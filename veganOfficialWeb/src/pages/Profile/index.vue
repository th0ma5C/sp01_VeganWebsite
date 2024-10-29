<template>
    <div class="container">
        <div class="login" v-if="!$route.meta.hideParent">
            <h1>
                登入
            </h1>

            <div class="inputWrapper">
                <!-- <form action="">
                    <fieldset>
                        <div class="username">
                            <input type="text" required>
                            <label for="">電子郵件</label>
                        </div>

                        <div class="password">
                            <input
                                :type="showPassword ? 'text' : 'password'"
                                required>
                            <label for="">密碼</label>
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
                        </div>
                    </fieldset>
                </form> -->
                <VForm @submit="onSubmit"
                    :validation-schema="loginSchema">
                    <fieldset>
                        <div>
                            <VField name="email"
                                v-slot="{ field, meta }">
                                <input type="email"
                                    id="email" required
                                    placeholder="" :="field"
                                    :class="{
                                        invalidInput: (meta.validated && !meta.valid)
                                    }">
                            </VField>
                            <label for="email">電子信箱</label>

                            <ErrorMessage as="div"
                                class="errorMsg"
                                name="email"
                                v-slot="{ message }">
                                <SvgIcon name="QNR_alert"
                                    width="18" height="18"
                                    color="#b3261e">
                                </SvgIcon>
                                <span>{{ message
                                    }}</span>
                            </ErrorMessage>
                        </div>

                        <div>
                            <VField name="password"
                                v-slot="{ field, meta }">
                                <input
                                    :type="showPassword ? 'text' : 'password'"
                                    id="password" required
                                    placeholder="" :="field"
                                    :class="{
                                        invalidInput: (meta.validated && !meta.valid)
                                    }">
                            </VField>
                            <label for="password">密碼</label>
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
                                v-slot="{ message }">
                                <SvgIcon name="QNR_alert"
                                    width="18" height="18"
                                    color="#b3261e">
                                </SvgIcon>
                                <span>
                                    {{ message }}
                                </span>
                            </ErrorMessage>
                        </div>
                    </fieldset>
                </VForm>

                <div class="forgetPassword">
                    <router-link
                        to="/profile/forgetPassword">
                        忘記密碼？
                    </router-link>
                </div>
            </div>

            <div class="login_signup">
                <button>
                    登入
                </button>

                <div class="signup">
                    <span>
                        沒有帳號？
                    </span>
                    <router-link to="/profile/signUp">
                        註冊
                    </router-link>
                </div>
            </div>
        </div>


        <router-view v-slot="{ Component }">
            <transition name="profileRoute">
                <component :is="Component"></component>
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
    </div>
</template>

<script setup lang="ts">
/**
 * todo:  account store、DB建置 社群登入
 * doing: 驗證時機改為送出前 臨時帳號 帳號驗證 記住登入資訊
 * -----------------------------------------
 * ? 
 * 
 * //樣式完成 分隔線
 * //label 轉場 社群icon
 * //密碼顯示紐
 * //忘記密碼/註冊分頁
 */

import { ref } from 'vue';
import useConcatImgPath from '@/hooks/useConcatImgPath';
import {
    Field as VField, Form as VForm, ErrorMessage, defineRule, configure,
} from 'vee-validate';
import * as yup from 'yup';

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

function onSubmit(val: LoginData) {
    console.log(val);
    console.log(JSON.stringify(val, null, 2));
}

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