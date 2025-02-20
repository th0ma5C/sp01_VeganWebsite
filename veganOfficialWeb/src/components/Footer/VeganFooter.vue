<template>
    <div class="container" v-if="!QNR_IsLoaded">
        <div class="top">
            <div class="sub">
                <h2>訂閱電子報</h2>
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
                            placeholder="E-mail"
                            autocomplete="on">
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
                    <h2>專屬 APP</h2>
                    <p>
                        即刻下載，立即掌握美味的滋味～獨享訂單優惠、專屬菜單推薦，輕鬆預訂、方便外帶，尊享美食新體驗！
                    </p>
                    <div class="download">
                        <button @click="appLinkOnclick">下載
                            APP</button>
                    </div>
                </div>
                <div class="phone">
                    <img src="@assets/img/InfoFooter/app.png"
                        alt="" class="info-phone">
                </div>
                <div class="mobileDownload">
                    <button @click="appLinkOnclick">下載
                        APP</button>
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
                    <!-- <div class="mobileListWrapper"> -->
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
                    <!-- </div> -->
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
            <div class="mobileSocialLink socialLink">
                <a target="_blank"
                    v-for="(item, index) in iconList"
                    :key="index" :href="item">
                    <SvgIcon :name="index" width="20px"
                        height="20px" class="linkIcon">
                    </SvgIcon>
                </a>
            </div>
            <div class="copyRight">
                <SvgIcon name="copyRight" width="17px"
                    height="17px" color="#FCFAF2"></SvgIcon>
                Relation-Ship&nbsp;果漾
            </div>
        </div>
        <div class="bot">
            <span ref="bottomText" :style="{
                fontSize: `${textSize}rem`
            }">
                Relation-Ship
            </span>
        </div>
        <!-- <div class="bot">
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
        </div> -->
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, watchEffect, onMounted, onUnmounted, useTemplateRef, nextTick } from 'vue';
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
import debounce from 'lodash/debounce'



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

// full width text
let currWidth = 0;
const bottomText = useTemplateRef('bottomText')
const textSize = ref(1);
function getViewportWidth() {
    return document.documentElement.clientWidth
}
async function setBottomTextSize() {
    if (currWidth == window.innerWidth) return
    if (!bottomText.value) return
    textSize.value = 1;
    const width = getViewportWidth();
    const threshold = width >= 1920 ? 1920 : width;
    await nextTick();
    let curr = bottomText.value.getBoundingClientRect().width;

    let MAX = 21.75;
    let MIN = 3.25;

    while (MIN <= MAX) {
        const mid = (MAX + MIN) / 2;
        textSize.value = mid;
        await nextTick();
        curr = bottomText.value.getBoundingClientRect().width;

        if (curr <= (threshold - 32)) {
            MIN = mid + .25;
        } else {
            MAX = mid - .25;
        }
    }
    textSize.value -= .25;
    currWidth = window.innerWidth;
}
// async function setBottomTextSize() {
//     if (!bottomText.value) return
//     textSize.value = 1;
//     const width = getViewportWidth();
//     const threshold = width >= 1920 ? 1920 : width;
//     await nextTick();
//     let curr = bottomText.value.getBoundingClientRect().width;
//     while (curr <= (threshold - 32)) {
//         console.log('resize');
//         textSize.value += .25;
//         await nextTick();
//         curr = bottomText.value.getBoundingClientRect().width;
//     }
// }

const debounceSetTextSize = debounce(setBottomTextSize, 500, {
    leading: true
});

onMounted(() => {
    debounceSetTextSize();
    window.addEventListener('resize', debounceSetTextSize);
})
onUnmounted(() => {
    clearAllTimers();
    window.removeEventListener('resize', debounceSetTextSize)
})

</script>

<style scoped lang="scss">
* {
    // outline: 1px solid black;
}

%default {
    // width: calc(80% - 6rem);
    margin: 0 auto;
    width: 85%;
}

%topLayout {
    position: relative;
    flex: 1 1 0;
    // padding: 2rem 3rem 3rem 3rem;

    h2 {
        // text-align: center;
        // padding-left: 1rem;
        // font-size: 2.25rem;
        font-size: 1.25rem;
        font-size: clamp(1.25rem, 1.05rem + 1vw, 2.25rem);
        font-weight: 600;
    }

    p {
        // font-size: 1.25rem;
        font-size: 1rem;
        font-size: clamp(1rem, 0.95rem + 0.25vw, 1.25rem);
        margin-top: 1rem;
        // padding: 1rem;
        text-align: justify;
        line-height: 1.25rem;
        line-height: clamp(1.25rem, 1rem + 1.25vw, 2.5rem);
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
    color: $primaryBacColor;
    display: flex;
    flex-direction: column;
    // min-height: 920px;
    margin: 0 auto;
    position: relative;
    z-index: 1;

    &::after {
        background-color: $secondBacColor;
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        height: 100%;
        max-height: 100%;
        z-index: -1;
    }

    &>div {
        max-width: $primaryWidth;
        margin-inline: auto;
        display: flex;
        // flex: 1;
    }
}

.top {
    @extend %default;
    flex-direction: row;
    position: relative;
    padding-block: 2rem;
    padding-top: 3rem;
    gap: 1rem;
    overflow: hidden;

    &::after {
        @include WnH(calc(100% + 6rem), 2px);
        content: '';
        // width: 100%;
        // height: 2px;
        left: -3rem;
        bottom: 0;
        border-radius: 100%;
        background-color: $primaryBacColor;
        position: absolute;
    }

    &>div {
        padding-inline: 1rem;
    }
}

.sub {
    @extend %topLayout;
    display: flex;
    flex-direction: column;


    input {
        @include WnH(50%, 3rem);
        border-radius: 3rem;
        background-color: #B3D4B9;
        font-size: 14px;
        font-variation-settings: 'wght' 600;
        padding: 0 2.5rem 0 1.5rem;
        transform: translateX(-3rem);
        width: clamp(200px, 50%, 250px);

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
        right: 0;
        top: 0;
        overflow: hidden;
        transition: background-color 0.3s ease;

        &:hover {
            background-color: #A59052;

            .wrapper>div {
                animation: rolling 0.5s ease-in-out forwards;
            }
        }
    }
}

.submitForm {
    color: black;
    // width: calc(100% - 6rem);
    // margin-top: 4rem;
    margin-top: auto;
    position: relative;
    // padding: 0 1rem;
    // padding-right: 1rem;
    text-align: end;
}

.wrapper {
    overflow: hidden;
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

.app {
    @extend %topLayout;
    display: flex;
    gap: 1rem;
}

.content {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.download {
    margin-top: auto;
    align-self: flex-end;

    button {
        @include WnH(7rem, 3rem);
        background-color: #0d731e;
        border-radius: 3rem;
        color: rgb(252, 250, 242);
        transition: background-color 0.3s ease;
        // font-size: 1.25rem;
        font-size: 1rem;
        font-size: clamp(1rem, 0.95rem + 0.25vw, 1.25rem);
        font-variation-settings: 'wght' 500;

        &:hover {
            background-color: #A59052;
        }
    }
}

.phone {
    // height: fit-content;
    // height: clamp(200px, 100%, 300px);
    // width: clamp(100px, 100%, 150px);

    img {
        width: 150px;
        // height: 300px;
        // height: 100%;
    }
}

.screen {
    position: absolute;
    top: 0;
    right: 0;
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

.mid {
    @extend %default;
    flex-direction: column;
    padding-top: 2rem;
    padding-inline: 1rem;
    gap: 2rem;

    nav {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        flex-wrap: wrap;
        text-wrap: nowrap;

        ul {
            display: flex;
            flex-direction: column;
            flex: 1;


            li {
                align-self: self-start;
                overflow: hidden;
                font-variation-settings: 'wght' 500;

                h2 {
                    font-size: 1.25rem;
                    font-weight: 500;
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
            }
        }
    }
}

.in {
    animation: flyIn 0.5s ease-out forwards;
}

.out {
    animation: flyOut 0.5s ease-in forwards;
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

.copyRight {
    cursor: default;
    display: flex;
    font-size: 12px;
    opacity: 0.5;
    // margin: 2rem 0.5rem 0 auto;
    margin-left: auto;
}

.container .bot {
    // font-size: 29rem;
    text-wrap: nowrap;
    font-family: 'Mr Dafoe', 'Noto Sans';
    color: #FCFAF2;
    max-width: none;
    overflow-y: hidden;
    margin: 0;
    justify-content: center;
    user-select: none;

    span {
        line-height: .85;
    }

    // padding-inline: 1rem;
    // text-align: center;
    // align-items: flex-start;
    // justify-content: center;
    // overflow: hidden;
    // user-select: none;

    // svg {
    //     width: 95vw;
    //     font-family: 'Mr Dafoe', 'Noto Sans';
    //     font-size: 200px;
    //     fill: #FCFAF2;
    //     // transform: translateY(-2%);
    // }
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

.mobileSocialLink {
    display: none;
}

.mobileDownload {
    @extend .download;
    display: none;
}

@include XLarge {}

@include large {}

@include medium($width: 1024px) {
    // .top {
    //     flex-direction: column;
    //     gap: 4rem;
    // }


    .phone img {
        width: 125px;
    }
}

@include medium {
    .top {
        flex-direction: column;
        gap: 4rem;

        .sub,
        .app {
            // padding: 0;
        }
    }

    .submitForm {
        margin-top: 2rem;
    }

    .sub input {
        // width: 37%;
    }

    .content .download button {
        // width: 10rem;
    }

    .mid {
        margin-bottom: 1rem;

        nav {
            // flex-direction: column;
            gap: .75rem;
            justify-content: center;

            ul {
                // flex: 1;
                // flex-direction: row;
                // align-items: center;

                // & li:has(h2) {
                //     margin: 0;
                // }
                li {
                    width: 100%;
                }

                & li:not(:has(h2)) {
                    gap: .25rem;
                }
            }

            // li {
            //     height: 100%;
            //     align-items: center;
            // }
        }

    }

    .mobileListWrapper {
        // display: grid;
        // grid-template-rows: 1fr;
        // grid-template-columns: 1fr 1fr 1fr 1fr;
    }

    .socialLink {
        display: none;
    }

    .mobileSocialLink {
        display: flex;
        align-self: center;
    }

    .phone img {
        width: 100px;
    }
}

@include small {
    .top {
        padding-bottom: 1.5rem;
        gap: 3rem;
    }

    .mid {
        padding-top: 1.5rem;

        nav {
            ul {
                & li:has(h2) {
                    margin-bottom: .25rem;
                }

            }

        }
    }

    .sub input {
        width: clamp(200px, 50%, 250px);
        padding-left: 1rem;
    }

    .phone img {
        // width: 80px;
    }

    .mobileListWrapper {
        // display: flex;
        // // align-items: center;
        // padding-left: .75rem;
        // // text-wrap: nowrap;

        // li {
        //     // flex: 1;
        // }
    }

    // %topLayout {
    //     padding: 0;
    // }

    // .container {
    //     &>div {
    //         padding: 0;
    //     }

    //     .top>div {
    //         padding: 0;
    //     }

    //     .mid nav {
    //         padding: 0;

    //         .socialLink {
    //             gap: 0;
    //         }
    //     }
    // }
}

@include small($width: 430px) {
    .top {
        // padding-bottom: 1rem;
        gap: 2rem;
    }

    .app,
    .sub {
        p {
            margin-top: .5rem;
        }
    }

    .app {
        display: grid;
        grid-template:
            'a b' 1fr
            'c c' auto/ 1fr auto;
    }

    .content .download {
        display: none;
    }

    .mobileDownload {
        display: block;
        grid-column: 1 / 3;

        button {
            width: 100%;
        }
    }

    .phone {
        justify-self: center;

        img {
            width: 85px;
        }
    }



    .sub {
        input {
            width: 100%;
            transform: translateX(-1px);

        }

        button {
            width: 3.5rem;
        }
    }

    .mid {
        // padding-top: 1rem;
    }


}

@include small($width: 320px) {
    .mid nav {
        gap: .5rem .25rem;
    }

    .content .download {
        // margin-top: 1rem;
    }
}
</style>