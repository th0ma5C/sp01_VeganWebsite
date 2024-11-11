<template>
    <div class="signupContainer" ref="signupContainer"
        :style="containerStyle">
        <h1>
            註冊
        </h1>

        <div class="inputWrapper">
            <VForm
                v-slot="{ handleSubmit, submitCount, submitForm, validate, values }"
                :initial-values="{ joinPrivacyPolicy: false }"
                :validation-schema="signupSchema">
                <form action=""
                    @submit="handleSubmit($event, onSubmit)">
                    <fieldset class="inputData">
                        <div v-for="({ input, type, label }, index) in signupForm"
                            :class="input" :key="index">
                            <VField :name="input"
                                v-slot="{ field, meta }">
                                <input :id="input"
                                    :type="type == 'password' ?
                                        (showPassword ? 'text' : 'password') : type"
                                    placeholder=""
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
                                        width="18"
                                        height="18"
                                        color="#b3261e">
                                    </SvgIcon>
                                    <span>
                                        {{ message }}
                                    </span>
                                </ErrorMessage>

                                <div v-if="input == 'confirmPassword'"
                                    class="passwordIcon" @="{
                                        mousedown: toggleShowPassword,
                                        mouseup: toggleShowPassword,
                                        mouseleave: () => showPassword = false
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

                    <fieldset class="inputPrivacy">
                        <div>
                            <VField v-slot="{ field }"
                                name="joinPrivacyPolicy"
                                type="checkbox"
                                :value="true"
                                :unchecked-value="false">
                                <input
                                    id="joinPrivacyPolicy"
                                    type="checkbox"
                                    v-bind="field"
                                    :value="true" />
                            </VField>
                            <label for="joinPrivacyPolicy">
                                [必要] 我已詳閱並同意顧客隱私權政策
                            </label>


                            <ErrorMessage as="div"
                                class="errorMsg"
                                name="joinPrivacyPolicy"
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

                    <div class="login_signup">
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

                <pre>{{ values }}</pre>
            </VForm>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
    Field as VField, Form as VForm, ErrorMessage, defineRule, configure,
    useField, useForm, type SubmissionHandler,
    type FormContext
} from 'vee-validate';
import * as yup from 'yup';


/**
 * todo: account store、DB建置 社群登入
 * doing: 密碼格式 確認驗證值 蒐集數據
 * ! 輸入太長會跑版
 * -----------------------------------
 * //同意勾選框
 * //改驗證時機
 */
const signupContainer = ref<HTMLElement>();
const containerStyle = computed(() => {
    if (!signupContainer.value) return { top: 0 }
    const top = signupContainer.value.getBoundingClientRect().top;
    return { top: `${top}px` }
})

// 顯示密碼紐
const showPassword = ref(false);

function toggleShowPassword() {
    showPassword.value = !showPassword.value
}

// 表單驗證
const signupForm = [
    {
        input: 'username',
        type: 'text',
        label: '稱呼'
    },
    {
        input: 'email',
        type: 'email',
        label: '電子郵件'
    },
    {
        input: 'password',
        type: 'password',
        label: '密碼'
    },
    {
        input: 'confirmPassword',
        type: 'password',
        label: '確認密碼'
    },
]

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

yup.addMethod(yup.string, 'email', function validateEmail(message) {
    return this.matches(emailRegex, {
        message: '請輸入正確信箱格式',
        name: 'email',
        excludeEmptyString: true,
    });
});

const signupSchema = yup.object({
    username: yup.string().trim().required('此欄不能空白'),
    email: yup.string().trim().required('此欄不能空白').email(),
    password: yup.string().trim()
        .min(6, '最少6個字').required('此欄不能空白').matches(/^\S*$/, '格式錯誤'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], '密碼不相符')
        .required('此欄不能空白'),
    joinPrivacyPolicy: yup.boolean().oneOf([true], '必須閱讀並接受隱私條款')
})

function onSubmit(values?: Record<string, any>) {
    console.log(JSON.stringify(values, null, 2));
}

function handleRefreshAlert(e: Event) {
    e.preventDefault();
    alert()
}

onMounted(() => {
    window.addEventListener('beforeunload', handleRefreshAlert);
})

onUnmounted(() => {
    window.removeEventListener('beforeunload', handleRefreshAlert);
})

</script>

<style scoped lang="scss">
$container_width: 300px;

.signupContainer {
    text-align: center;
    flex: 1;

    h1 {
        font-size: 2rem;
        font-variation-settings: 'wght' 400;
    }
}

.inputWrapper {
    margin-top: 2rem;

    fieldset {
        // position: relative;


    }

    .inputData {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        margin-bottom: 2rem;

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

        // .errorMsg {
        //     @include flex-center-center;
        //     flex-direction: row;
        //     gap: .5rem;
        //     color: #b3261e;
        //     text-wrap: nowrap;
        //     position: absolute;
        //     bottom: -75%;
        //     left: 0%;
        //     transform: translate(0%, -50%);
        // }

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

    .inputPrivacy>div {
        @include flex-center-center;
        gap: .5rem;
        position: relative;
        // margin-top: 1rem;

        .errorMsg {
            transform: translate(0%, 0%);
            bottom: -100%;
        }
    }
}

.login_signup {
    margin-top: 3rem;
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