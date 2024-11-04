<template>
    <div class="forgetPasswordContainer"
        ref="forgetPasswordContainer"
        :style="containerStyle">
        <h1>
            忘記密碼
        </h1>

        <p>
            重設密碼連結將會傳送至以下信箱
        </p>

        <div class="inputWrapper">
            <VForm v-slot="{ handleSubmit, submitCount }"
                :validation-schema="loginSchema">
                <form action=""
                    @submit="handleSubmit($event, onSubmit)">
                    <fieldset>
                        <div>
                            <VField name="email"
                                v-slot="{ field, meta }">
                                <input type="email"
                                    id="email" required
                                    placeholder="" :="field"
                                    :class="{
                                        invalidInput: !meta.valid && submitCount > 0
                                    }">
                            </VField>
                            <label for="email">電子信箱</label>

                            <ErrorMessage as="div"
                                class="errorMsg"
                                name="email"
                                v-slot="{ message }" :style="{
                                    opacity: submitCount > 0 ? 1 : 0
                                }">
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
                </form>

                <div class="submitContainer">
                    <button>
                        送出
                    </button>

                    <div class="cancel">
                        <router-link to="/profile">
                            取消
                        </router-link>
                    </div>
                </div>
            </VForm>
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * todo: 查找資料庫是否有該帳號
 */

import { computed, onMounted, ref } from 'vue';
import {
    Field as VField, Form as VForm, ErrorMessage
} from 'vee-validate';
import * as yup from 'yup';

// fix wrong element position when route leaving
const forgetPasswordContainer = ref<HTMLElement>();
const containerStyle = computed(() => {
    if (!forgetPasswordContainer.value) return { top: 0 }
    const top = forgetPasswordContainer.value.getBoundingClientRect().top;
    return { top: `${top}px` }
})

// 表單驗證
interface LoginData {
    email?: string | null;
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
})

function onSubmit(values?: Record<string, any>) {
    console.log(JSON.stringify(values, null, 2));
}

onMounted(() => {
})
</script>

<style scoped lang="scss">
$container_width: 300px;

.forgetPasswordContainer {
    text-align: center;
    flex: 1;
    display: flow-root;

    &>p {
        margin-top: .25rem;
    }
}

h1 {
    font-size: 2rem;
    font-variation-settings: 'wght' 400;
}

.inputWrapper {
    margin-top: 2rem;

    fieldset {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        &>div {
            position: relative;
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
        div:has(input:valid)>label {
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

.submitContainer {
    margin-top: 2rem;
    padding-top: 2rem;
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

    .cancel {
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
</style>