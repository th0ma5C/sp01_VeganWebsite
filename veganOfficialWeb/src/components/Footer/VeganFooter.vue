<template>
    <div class="container" v-if="!QNR_IsLoaded">
        <div class="top">
            <div class="sub">
                <h2>訂閱第一手消息！</h2>
                <p>成為我們的VIP！訂閱我們的電子報，即刻獲得獨家優惠、新菜品消息和特別活動邀請。
                    每週精選的美味直送您的信箱！
                </p>
                <VForm as=""
                    v-slot="{ meta, isSubmitting, handleSubmit, submitCount }"
                    :validation-schema="Schema">
                    <form action="" class="submitForm"
                        @submit="handleSubmit($event, fetchSubscribe)">
                        <VField id="subEmail" name="email"
                            type="email"
                            placeholder="E-mail">
                        </VField>
                        <ErrorMessage as="div"
                            class="errorMsg" name="email"
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
                        <button
                            :disabled="isSubmitting || isReqConfirm">
                            <transition name="rightArrow">
                                <div class="wrapper"
                                    v-show="arrowState == ''">
                                    <SvgIcon
                                        name="rightArrow"
                                        color="#FCFAF2"
                                        width="24px"
                                        height="24px">
                                    </SvgIcon>
                                </div>
                            </transition>
                            <transition name="check">
                                <div class=""
                                    v-show="isReqConfirm">
                                    <SvgIcon name="Check"
                                        color="#FCFAF2"
                                        width="24px"
                                        height="24px">
                                    </SvgIcon>
                                </div>
                            </transition>
                        </button>
                    </form>
                </VForm>
            </div>
            <div class="app">
                <div class="content">
                    <h2>立即下載APP！</h2>
                    <p>
                        即刻下載，立即掌握美味的滋味～獨享訂單優惠、專屬菜單推薦，輕鬆預訂、方便外帶，尊享美食新體驗！
                    </p>
                    <div class="download">
                        <button
                            @click="appLinkOnclick">下載APP</button>
                    </div>
                </div>
                <div class="phone">
                    <img src="@assets/img/InfoFooter/app.png"
                        alt="" class="info-phone">
                </div>
            </div>
        </div>
        <div class="mid">
            <nav>
                <ul v-for="({ title, content, routeTo }, listIndex) in footerList"
                    :key="title">
                    <li>
                        <h2>
                            {{ title }}
                        </h2>
                    </li>
                    <li v-for="(item, contentIndex) in content"
                        :key="item"
                        @mouseenter="handleMouseEnter(listIndex, contentIndex)"
                        @mouseleave="handleMouseLeave(listIndex, contentIndex)"
                        @click="routeTo(item)">
                        {{ item }}
                        <SvgIcon name="ConceptArrow"
                            width="18px" height="18px"
                            class="in"
                            :class="[{ 'out': iconStates[listIndex][contentIndex].setAnimate }]">
                        </SvgIcon>
                    </li>
                </ul>
                <div class="socialLink">
                    <a target="_blank"
                        v-for="(item, index) in iconList"
                        :key="index" :href="item">
                        <SvgIcon :name="index" width="20px"
                            height="20px" class="linkIcon">
                        </SvgIcon>
                    </a>
                </div>
            </nav>
            <div class="copyRight">
                <SvgIcon name="copyRight" width="17px"
                    height="17px" color="#FCFAF2"></SvgIcon>
                Relation-Ship&nbsp;果漾
            </div>
        </div>
        <div class="bot">
            <svg id="b" data-name="圖層 2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1095.78 245.4">
                <g id="c" data-name="圖層 1">
                    <text class="d"
                        transform="translate(10.2 162.2)">
                        <tspan x="0" y="0">Relation-Ship
                        </tspan>
                    </text>
                </g>
            </svg>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, watchEffect, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';
import useArrowFly from '@/hooks/useArrowFly';
import { useQuestionnaireStore } from '@/store/questionnaireStore';
import { storeToRefs } from 'pinia';
import { useCartStore } from '@/store/cartStore';
import {
    Field as VField, Form as VForm, ErrorMessage, defineRule, configure,
    useField, useForm, type SubmissionHandler,
    type FormContext,
    type FormMeta,
    type SubmissionContext
} from 'vee-validate';
import * as yup from 'yup';
import { reqSubscribe } from '@/api/subscribe/subscribe';
import { useRouter } from 'vue-router';




let footerList = reactive([
    {
        title: '快速連結',
        content: ['開始專屬分析', '菜單', '關於果漾', '我的帳戶'],
        routeTo: (item: string) => {
            switch (item) {
                case '開始專屬分析':
                    router.push('/questionnaire')
                    break;
                case '菜單':
                    router.push('/menu')
                    break;
                case '關於果漾':
                    router.push('/about')
                    break;
                case '我的帳戶':
                    router.push('/profile')
                    break;
                default:
                    break;
            }
        }
    },
    {
        title: '顧客服務',
        content: ['常見問題', '付款與寄送流程', '果漾會員制度'],
        routeTo: () => {
            router.push({
                path: '/about',
                query: {
                    scroll: "FAQ"
                }
            })
        }
    },
    {
        title: '聲明條款',
        content: ['隱私權服務', '服務條款', '退貨政策', '反詐騙公告'],
        routeTo: () => {
            router.push({
                path: '/about',
                query: {
                    scroll: "FAQ"
                }
            })
        }
    },
    {
        title: '果漾蔬食',
        content: ['信箱', '客服專線', '服務時間'],
        routeTo: () => {
            router.push({
                path: '/about',
                query: {
                    scroll: "FAQ"
                }
            })
        }
    },
]);

const iconList = reactive({
    Fb: 'https://www.facebook.com/',
    Ig: 'https://www.instagram.com/',
    LINE: 'https://www.line.me/tw/',
    Twitter: 'https://x.com/',
})

// li icon hover
const iconStates = reactive(footerList.map(section =>
    section.content.map(() => ({
        isHover: false,
        isAnimating: false,
        timer: null as number | null | NodeJS.Timeout,
        setAnimate: false
    }))
));

const ANIMATION_DURATION = 500;

const handleMouseEnter = (listIndex: number, contentIndex: number) => {
    const state = iconStates[listIndex][contentIndex];
    state.isHover = true;

    if (!state.isAnimating) {
        triggerAnimation(listIndex, contentIndex, true);
    }
};

const handleMouseLeave = (listIndex: number, contentIndex: number) => {
    const state = iconStates[listIndex][contentIndex];
    state.isHover = false;

    if (!state.isAnimating) {
        triggerAnimation(listIndex, contentIndex, false);
    }
};
const triggerAnimation = (listIndex: number, contentIndex: number, isEntering: boolean) => {
    const state = iconStates[listIndex][contentIndex];
    state.isAnimating = true;
    state.setAnimate = isEntering;

    if (state.timer) clearTimeout(state.timer);

    state.timer = setTimeout(() => {
        completeAnimation(listIndex, contentIndex, isEntering);
    }, ANIMATION_DURATION);
};

const completeAnimation = (listIndex: number, contentIndex: number, isEntering: boolean) => {
    const state = iconStates[listIndex][contentIndex];
    state.isAnimating = false;
    if (state.isHover !== isEntering) {
        triggerAnimation(listIndex, contentIndex, !isEntering);
    }
};
function clearAllTimers() {
    iconStates.forEach(i => {
        i.forEach(j => {
            if (j.timer) {
                clearTimeout(j.timer)
            }
        })
    })
}

// sub btn hover
let arrowState = ref('')

function setArrowState(state: string) {
    arrowState.value = state;
}

// QNR_store
const { QNR_IsLoaded } = storeToRefs(useQuestionnaireStore());
const { isCheckout } = storeToRefs(useCartStore());

// email subscribe
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
yup.addMethod(yup.string, 'email', function validateEmail(message) {
    return this.matches(emailRegex, {
        message: '請輸入正確信箱格式',
        name: 'email',
        excludeEmptyString: true,
    });
});
const Schema = yup.object({
    email: yup.string().trim().required('此欄不能空白').email(),
})

type ReqForm = yup.InferType<typeof Schema>;
const isReqConfirm = ref(false);
async function fetchSubscribe(form: Record<string, any>, ctx: SubmissionContext) {
    if (isReqConfirm.value) return
    const data = form as ReqForm;
    try {
        const params = {
            recipient: data.email
        }
        const result = await reqSubscribe(params);
        if (result.state == 'confirm') {
            setArrowState('out')
            isReqConfirm.value = true
            ctx.resetForm()
        }
    } catch (error) {
        console.log(error);
    }
}

// app btn
function appLinkOnclick() {
    const url = 'https://www.microsoft.com/zh-tw/store/top-free/apps/pc';
    window.open(url, '_blank')?.focus();
}

// list btn
const router = useRouter();

function listOnclick(item: string) {
    switch (item) {
        case '開始專屬分析':
            router.push('/questionnaire')
            break;
        case '菜單':
            router.push('/menu')
            break;
        case '關於果漾':
            router.push('/about')
            break;
        case '我的帳戶':
            router.push('/profile')
            break;
        default:
            break;
    }
}

onMounted(() => {
})
onUnmounted(() => {
    clearAllTimers();
})

</script>

<style scoped lang="scss">
%default {
    width: calc(80% - 6rem);
    margin: 0 auto;
}

%topLayout {
    position: relative;
    flex: 1 1 0;
    padding: 2rem 3rem 3rem 3rem;

    * {
        // border: 1px solid black;
    }

    h2 {
        // text-align: center;
        padding-left: 1rem;
        font-size: 1.5rem;
        font-weight: 600;
    }

    p {
        font-size: 1rem;
        margin-top: 1rem;
        padding: 1rem;
        text-align: justify;
        line-height: 2rem;
    }

    .submitForm,
    .download {
        position: absolute;
        bottom: 48px;
        right: 50%;
        transform: translateX(50%);

        button {
            // @include WnH(9rem, 3rem);
            // border-radius: 2rem;
        }

    }

    .errorMsg {
        @include flex-center-center;
        flex-direction: row;
        gap: .5rem;
        color: #b3261e;
        text-wrap: nowrap;
        position: absolute;
        bottom: -85%;
        left: 50%;
        transform: translate(-35%, -50%);
        // padding-left: 1.5rem;
    }
}

.container {
    max-width: $primaryWidth;
    color: $primaryBacColor;

    display: flex;
    flex-direction: column;
    min-height: 920px;
    margin: 0 auto;

    &>div {
        display: flex;
        padding-top: 2rem;
        flex: 1 1 0;
    }

    .top {
        @extend %default;

        flex-direction: row;
        // gap: 1rem;
        position: relative;

        &::after {
            @include WnH(calc(100% + 6rem), 1px);
            content: '';
            left: -1.5rem;
            bottom: 0;
            background-color: $primaryBacColor;
            position: absolute;
        }

        .sub {
            @extend %topLayout;

            form {
                color: black;
                width: calc(100% - 6rem);
                margin-top: 4rem;
                position: relative;
                padding: 0 1rem;
                text-align: end;

                input {
                    @include WnH(60%, 3rem);
                    border-radius: 3rem;
                    background-color: #B3D4B9;
                    font-size: 14px;
                    font-variation-settings: 'wght' 600;
                    padding: 0 1.5rem;
                    transform: translateX(-3px);

                    &::placeholder {
                        opacity: 0.75;
                        transition: opacity 0.2s ease;
                    }

                    &:focus {
                        outline: none;

                        &::placeholder {
                            opacity: 0;
                        }
                    }
                }

                button {
                    @include WnH(5rem, 3rem);
                    @include flex-center-center;
                    border-radius: 0 3rem 3rem 0;
                    background-color: #0d731e;
                    // border: 1px solid #00510E;
                    color: rgb(252, 250, 242);
                    position: absolute;
                    right: 1rem;
                    top: 0;
                    overflow: hidden;
                    transition: background-color 0.3s ease;

                    .wrapper {
                        overflow: hidden;
                    }

                    &:hover {
                        background-color: #A59052;

                        .wrapper>div {
                            animation: rolling 0.5s ease-in-out forwards;
                        }
                    }

                    @keyframes rolling {
                        0% {
                            opacity: 1;
                            transform: translateX(0);
                        }

                        50% {
                            opacity: 0;
                            transform: translateX(100%);
                        }

                        51% {
                            opacity: 0;
                            transform: translateX(-100%);
                        }

                        100% {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }

                    .rightArrow-enter-active,
                    .rightArrow-leave-active {
                        transition: opacity 0.3s ease, transform 0.3s ease;
                    }

                    .rightArrow-enter-from,
                    .rightArrow-leave-to {
                        opacity: 0;
                        transform: translateX(100%);
                    }

                    .rightArrow-enter-to,
                    .rightArrow-leave-from {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            }

        }

        .app {
            @extend %topLayout;

            display: flex;

            .content {
                flex: 1;

                .download {

                    margin-top: 2rem;
                    right: calc(153px + 1rem);
                    transform: translateX(0);

                    button {
                        @include WnH(7rem, 3rem);
                        background-color: #0d731e;
                        border-radius: 3rem;
                        color: rgb(252, 250, 242);
                        transition: background-color 0.3s ease;

                        &:hover {
                            background-color: #A59052;
                        }
                    }
                }
            }

            &::after {
                @include WnH(calc(154px - 48px), calc(294px - 32px));
                background-color: transparent;
                content: '';
                display: inline-block;
            }

            .phone {
                position: absolute;
                top: 0;
                right: 0;

                img {
                    height: 294px;
                }

                .screen {
                    position: absolute;
                    top: 0;
                    right: 0;
                }
            }
        }
    }

    .mid {
        @extend %default;

        flex-direction: column;
        // justify-content: space-around;
        // padding: 2rem 4rem 0 4rem;


        nav {
            padding: 0 0rem 0 4rem;
            font-size: 14px;
            display: flex;
            justify-content: space-between;

            ul {
                display: flex;
                flex-direction: column;

                li {
                    align-self: self-start;
                    overflow: hidden;

                    h2 {
                        font-size: 1.05rem;
                    }

                    &:has(h2) {
                        cursor: default;
                        margin-bottom: 0.75rem;
                    }

                    &:not(:has(h2)) {
                        cursor: pointer;
                        opacity: 0.5;
                        margin-bottom: 0.25rem;
                        display: flex;
                        gap: 0.5rem;
                    }

                    &:hover:not(:has(h2)) {
                        opacity: 1;
                        scale: 1.05;
                    }

                    @keyframes flyOut {
                        to {
                            opacity: 0;
                            transform: translate(100%, -100%);
                        }
                    }

                    @keyframes flyIn {
                        from {
                            opacity: 0;
                            transform: translate(-100%, 100%);
                        }

                        to {
                            opacity: 1;
                            transform: translate(0, 0);
                        }
                    }

                    // &:hover>div {
                    //     animation: flyOut 0.5s ease-in forwards;
                    // }

                    .in {
                        animation: flyIn 0.5s ease-out forwards;
                    }

                    .out {
                        animation: flyOut 0.5s ease-in forwards;
                    }
                }
            }

            .socialLink {
                align-self: self-start;
                display: flex;
                gap: 1rem;

                .linkIcon {
                    color: #FCFAF2;
                    transition: scale 0.3s ease, color 0.3s ease;

                    &:hover {
                        color: #A59052;
                        scale: 1.2;
                    }
                }
            }
        }

        .copyRight {
            cursor: default;
            display: flex;
            font-size: 12px;
            opacity: 0.5;
            margin: 2rem 0.5rem 0 auto;
        }
    }

    .bot {
        text-align: center;
        align-items: flex-start;
        justify-content: center;
        overflow: hidden;
        user-select: none;

        svg {
            width: 95vw;
            font-family: 'Mr Dafoe', 'Noto Sans';
            font-size: 200px;
            fill: #FCFAF2;
            transform: translateY(-13%);
        }
    }
}

.check-enter-active,
.check-leave-active {
    transition: opacity .3s .3s;
}

.check-enter-from,
.check-leave-to {
    opacity: 0;
}

.check-enter-to,
.check-leave-from {
    opacity: 1;
}

@include large {}

@include medium {
    .container {
        &>div {
            padding: 0;
        }

        .top {

            .sub,
            .app {
                padding: 0;
            }
        }

        .mid nav {
            padding: 0;

            .socialLink {
                gap: 0;
            }
        }
    }
}

@include small {
    %topLayout {
        padding: 0;
    }

    .container {
        &>div {
            padding: 0;
        }

        .top>div {
            padding: 0;
        }

        .mid nav {
            padding: 0;

            .socialLink {
                gap: 0;
            }
        }
    }
}
</style>