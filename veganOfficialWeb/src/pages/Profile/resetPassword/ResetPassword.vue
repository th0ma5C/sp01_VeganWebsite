<template>
    <div class="resetPasswordContainer"
        ref="resetPasswordContainer"
        :style="containerStyle">
        <h1>
            重設密碼
        </h1>

        <div class="inputWrapper">
            <VForm as=""
                v-slot="{ meta, isSubmitting, handleSubmit, submitCount }"
                :validation-schema="resetPasswordSchema">
                <form action=""
                    @change="handleFormChange(meta)"
                    @submit="handleSubmit($event, resetPasswordReq)">
                    <fieldset class="inputData">
                        <div v-for="({ input, type, label }, index) in resetPasswordForm"
                            :class="input" :key="index">
                            <VField :name="input"
                                v-slot="{ field, meta }">
                                <input :id="input"
                                    :type="type == 'password' ?
                                        (showPassword ? 'text' : 'password') : type"
                                    required
                                    autocomplete="off"
                                    :="field" :class="{
                                        invalidInput: !meta.valid && submitCount > 0
                                    }">

                                <label :for="input">
                                    {{ label }}
                                </label>

                                <ErrorMessage as="div"
                                    class="errorMsg"
                                    :name="input"
                                    v-slot="{ message }"
                                    :style="{
                                        opacity: submitCount > 0 ? 1 : 0
                                    }">
                                    <SvgIcon
                                        name="QNR_alert"
                                        width="18px"
                                        height="18px"
                                        color="#b3261e">
                                    </SvgIcon>
                                    <span>
                                        {{ message }}
                                    </span>
                                </ErrorMessage>

                                <div v-if="input == 'confirmPassword'"
                                    class="passwordIcon" @="{
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
                            </VField>
                        </div>
                    </fieldset>

                    <div class="login_resetPassword">
                        <div class="ResErrMsg"
                            v-show="registerMsg">
                            <SvgIcon name="QNR_alert"
                                width="18px" height="18px"
                                color="#b3261e">
                            </SvgIcon>
                            <span>
                                {{ registerMsg }}
                            </span>
                        </div>

                        <button :disabled="isSubmitting">
                            <span :style="{
                                opacity: isSubmitting ? .5 : 1
                            }">送出</span>
                            <Spinner v-show="isSubmitting">
                            </Spinner>
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
    Field as VField, Form as VForm, ErrorMessage, defineRule, configure,
    useField, useForm, type SubmissionHandler,
    type FormContext,
    type FormMeta
} from 'vee-validate';
import * as yup from 'yup';
import { reqResetPassword, reqUserRegister } from '@/api/userAuth';
import { AxiosError } from 'axios';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/store/userStore';
import { storeToRefs } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import { useToastStore } from '@/store/toastStore';

//  user store
// const userStore = useUserStore();
// const { user } = storeToRefs(userStore);

// toast store
const toastStore = useToastStore();
const { addNotification } = toastStore;

const resetPasswordContainer = ref<HTMLElement>();
const containerStyle = computed(() => {
    if (!resetPasswordContainer.value) return { top: 0 }
    const top = resetPasswordContainer.value.getBoundingClientRect().top;
    return { top: `${top}px` }
})

// 路由
const router = useRouter();
const route = useRoute();
function routerTo(link: string) {
    return async () => {
        await router.push(link)
    }
}
const routerToLogin = routerTo('/profile')

// handle token
interface RedirectResTokenDecoded {
    email: string,
    userID: string,
    exp: number
}
const token = route.query.token as string;
// const JWTpayload = jwtDecode<RedirectResTokenDecoded>(token);

// 顯示密碼紐
const showPassword = ref(false);

function toggleShowPassword() {
    showPassword.value = !showPassword.value
}

// 表單驗證
const resetPasswordForm = [
    {
        input: 'password',
        type: 'password',
        label: '新密碼'
    },
    {
        input: 'confirmPassword',
        type: 'password',
        label: '確認密碼'
    },
]

const resetPasswordSchema = yup.object({
    password: yup.string().trim()
        .min(6, '最少6個字').required('此欄不能空白').matches(/^\S*$/, '格式錯誤'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], '密碼不相符')
        .required('此欄不能空白'),
})

// 註冊 api req
type ReqForm = yup.InferType<typeof resetPasswordSchema>;

interface ErrorResponse {
    message: string;
}

const registerMsg = ref<string | null>(null);
const formState = ref('processing')
async function resetPasswordReq(form: Record<string, any>) {
    try {
        const { password } = form as ReqForm;
        const JWTpayload = jwtDecode<RedirectResTokenDecoded>(token);
        const data = {
            userID: JWTpayload.userID,
            password,
            token
        }
        const res = await reqResetPassword(data);
        formState.value = 'finish';
        addNotification('密碼已重設');
        await routerToLogin();
    } catch (error) {
        const message = (error as AxiosError<ErrorResponse>).response?.data.message;
        registerMsg.value = message ?? '未知錯誤'
        // console.error("驗證失敗：", err.response?.data.message);
    }
}

// 提示失去進度
const formHasChanged = ref(false);

function handleFormChange(meta: FormMeta<ReqForm>) {
    formHasChanged.value = meta.dirty;
}

function handleRefreshAlert(e: Event) {
    e.preventDefault();
    if (formHasChanged.value) {
        confirm()
    }
}

onBeforeRouteLeave(() => {
    if (formHasChanged.value && formState.value !== 'finish') {
        const answer = confirm('離開將丟失當前進度');
        return answer
    }
})




onMounted(() => {
    window.addEventListener('beforeunload', handleRefreshAlert);
})

onUnmounted(() => {
    window.removeEventListener('beforeunload', handleRefreshAlert);
})

</script>

<style scoped lang="scss">
$container_width: 300px;

.resetPasswordContainer {
    text-align: center;
    flex: 1;
    width: 100%;
    max-width: 320px;

    h1 {
        font-size: 2rem;
        font-variation-settings: 'wght' 400;
    }
}

.inputWrapper {
    margin-top: 2rem;

    .inputData {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        margin-bottom: 2rem;

        &>div {
            position: relative;
        }

        input {
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

        & div:has(input:focus, input:focus-within, input:valid)>label {
            transform: translateY(calc(-100% - 10px)) scale(0.8);
        }

        .passwordIcon {
            @include absoluteCenterTLXY($left: 100%, $X: -150%);
            cursor: pointer;
        }
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
}

.login_resetPassword {
    padding-top: calc(2rem + 10px);
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

    .resetPassword {
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