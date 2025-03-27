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
                                <input type="text"
                                    id="email" required
                                    :="field" :class="{
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
                    <div class="submitContainer">
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
                        <button>
                            送出
                        </button>

                        <div class="cancel">
                            <router-link to="/profile">
                                取消
                            </router-link>
                        </div>
                    </div>
                </form>
            </VForm>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import {
    Field as VField, Form as VForm, ErrorMessage
} from 'vee-validate';
import * as yup from 'yup';
import { reqForgetPasswordEmail } from '@/api/userAuth';
import { useToastStore } from '@/store/toastStore';
import { useRoute, useRouter } from 'vue-router';
import type { AxiosError } from 'axios';
import { useLoaderStore } from '@/store/loader';
import { storeToRefs } from 'pinia';

// fix wrong element position when route leaving
const forgetPasswordContainer = ref<HTMLElement>();
const containerStyle = computed(() => {
    if (!forgetPasswordContainer.value) return { top: 0 }
    const top = forgetPasswordContainer.value.getBoundingClientRect().top;
    return { top: `${top}px` }
})

// toast store
const toastStore = useToastStore();
const { addNotification } = toastStore;

// loader store
// const loaderStore = useLoaderStore();
// const { loaderActivated } = storeToRefs(loaderStore);
// watch(loaderActivated, (nVal) => {
//     console.log(loaderActivated.value);
//     if (nVal == false) {
//     }
// }, { immediate: true })

// 路由
const router = useRouter();

function redirectFormReset() {
    const { msg } = window.history.state;
    if (msg) {
        addNotification(msg)
    }
}

// 表單驗證
interface LoginData {
    email?: string | null;
}
interface ErrorResponse {
    message: string;
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
const registerMsg = ref<string | null>(null);
async function onSubmit(values?: Record<string, any>) {
    try {
        if (!values) return
        const res = await reqForgetPasswordEmail(values);
        console.log(res);
        addNotification('重設密碼信件已發送，請至信箱確認')
        await router.push('/profile');
    } catch (error) {
        const message = (error as AxiosError<ErrorResponse>).response?.data.message;
        registerMsg.value = message ?? '未知錯誤'
        // console.error("驗證失敗：", err.response?.data.message);
    }
}

onMounted(() => {
    redirectFormReset()
})
</script>

<style scoped lang="scss">
$container_width: 300px;

.forgetPasswordContainer {
    text-align: center;
    flex: 1;
    // display: flow-root;
    width: 100%;
    max-width: 320px;

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
            // width: $container_width;
            width: 100%;
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

        & div:has(input:focus, input:focus-within, input:valid)>label {
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

    .ResErrMsg {
        position: absolute;
        top: 0rem;

        display: flex;
        align-items: center;
        gap: .5rem;

        span {
            color: $error_color;
        }
    }
}
</style>