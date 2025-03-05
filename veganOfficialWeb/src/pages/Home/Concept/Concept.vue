<template>
    <div class="newsContainer" ref="newsContainer">
        <div class="tabContainer" ref="tabContainer">
            <div class="tabHeader">
                <h2>
                    <small>News</small>
                    最新消息
                </h2>
                <ul>
                    <li v-for="(item, index) in newsList.tabs"
                        :key="index"
                        :class="{ hover: hoverItem == index || currItem == index }"
                        @mouseover="setHover(index)"
                        @mouseout="setHover(null)"
                        @click="newsList.changeTab(index, $event)">
                        {{ item }}
                    </li>
                </ul>
            </div>
            <div class="tabs" ref="tabs">
                <transition name="spinner">
                    <Spinner
                        v-show="newsList.showNews.length == 0">
                    </Spinner>
                </transition>

                <div class="tab"
                    v-for="(tab) in newsList.tabs"
                    :key="tab" v-show="tab == newsList.tab">
                    <ul>
                        <transition-group name="tab"
                            @enter="hideSlide = true"
                            @after-enter="hideSlide = false">
                            <li v-for="({ date, label, title, _id }, index) in newsList.showNews"
                                :key="tab" ref="li"
                                v-show="tab == newsList.tab"
                                @mouseenter="setHover(_id!, $event)"
                                @mouseleave="setHover(null, $event)"
                                @mousemove.stop="setStalkerPosition($event)"
                                @click="tabOnclick(index, $el)">
                                <div class="infoWrapper">
                                    <div class="date">
                                        {{ date }}
                                    </div>
                                    <div class="label"
                                        @click.stop="newsList.changeTab(label, $event)">
                                        <span>
                                            {{ label }}
                                            <div
                                                class="dot">
                                            </div>
                                        </span>
                                    </div>
                                </div>

                                <div class="contentWrapper">
                                    <span
                                        style="opacity: 1;"
                                        :class="{
                                            hover: hoverItem == _id,
                                            hideSlide: hideSlide
                                        }">
                                        {{ title }}
                                    </span>
                                </div>
                                <transition name="stalker">
                                    <div class="stalker"
                                        :style="stalkerStyle"
                                        v-show="hoverItem == _id">
                                    </div>
                                </transition>
                            </li>
                        </transition-group>
                    </ul>
                </div>

            </div>
        </div>
        <transition name="marquee">
            <div class="marquee" v-show="enter">
                <span>
                    Information / News &nbsp;&nbsp;&nbsp;
                </span>
                <span class="cloneSpan">
                    Information / News &nbsp;&nbsp;&nbsp;
                </span>
            </div>
        </transition>
    </div>
    <div class="dialogWrapper" ref="dialogRef"
        v-if="dialogContent && isDialogOpen"
        @click="closeDialog">
        <div class="conceptContainer" @click.stop
            ref="dialogContentRef">
            <SvgIcon class="cancelBtn" name="cancel"
                width="24px" height="24px" color="black"
                @click="closeDialog">
            </SvgIcon>

            <div class="title">
                <div class="labelWrapper">
                    <div class="text">
                        <span>
                            {{
                                dialogContent.label
                            }}
                            <div class="dot">
                            </div>
                        </span>
                    </div>

                    <div class="mobileDate">
                        <p>
                            {{
                                dialogContent.date
                            }}
                        </p>
                    </div>
                </div>

                <div class="titleWrapper">
                    <h1>
                        {{ dialogContent.title }}
                    </h1>
                    <p class="desktopDate">
                        {{ dialogContent.date }}
                    </p>
                </div>
            </div>

            <div class="content">
                <p>
                    {{ showNewsLorem }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeMount, onMounted, onUnmounted, reactive, ref, useTemplateRef, watch, watchEffect } from 'vue';
import { useNewsStore } from '@/store/newsStore';
import type { Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { LoremIpsum, loremIpsum } from 'lorem-ipsum';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import debounce from 'lodash/debounce';

//
/**
 * //新聞資料建置、請求資料編寫、換頁邏輯
 * //list比例調整
 * //用observer 控制跑馬燈是否顯示
 * //marquee動畫
 * //底線劃出
 * //hover高亮圓圈
 * //標籤hover
 * //!隱藏線條時間不夠，換頁動畫抖動
 * //btn hover效果、箭頭SVG
 * //內文靠上
 * *news pinia 重寫 google:Vue3 Pinia 中如何優雅的使用API
 * !把路由api請求改到onMounted
 */


// list 數據
const NewsStore = useNewsStore();
const { fetchNews } = useNewsStore();
const { newsData } = storeToRefs(useNewsStore());

NewsStore.$subscribe((_, state) => {
    if (state.newsData) {
        newsList.showNews = state.newsData.slice(0, 5);
    }
})

interface newsItem {
    date: Date,
    title: string,
    content: string,
    label: string,
    _id?: string
}

let newsList = reactive({
    tabs: ['最新', '活動', '優惠', '會員'],
    tab: '最新',
    showNews: [] as newsItem[],
    changeTab(index: number | string, e: MouseEvent | null) {
        if (typeof index == 'number') {
            const target = e?.target as HTMLElement
            this.tab = target.innerHTML.trim();
            currItem.value = index;
        } else {
            this.tab = index;
            currItem.value = this.tabs.indexOf(index);
        }
    }
})

watchEffect(() => {
    if (!newsData.value) return

    if (newsList.tab === '最新') {
        newsList.showNews = newsData.value.slice(0, 5)
    } else {
        newsList.showNews = newsData.value.filter((news) => {
            if (news.label == newsList.tab) return news
        })
    }
});

// 背景跑馬燈顯示/隱藏
let tabContainer = ref()
let enter = ref(false)

let showBac = (entries: IntersectionObserverEntry[] | undefined) => {
    if (entries) {
        entries.forEach(entry => {
            enter.value = entry.isIntersecting;
            if (!entry.isIntersecting) {
                isDialogOpen.value = entry.isIntersecting;
            }
        })
    }
}

const observer = new IntersectionObserver(showBac, {
    root: null,
    rootMargin: '-50% 0px',
    threshold: [0]
});

// 底線動畫
let hideSlide = ref(false); //控制換頁時不顯示動畫
let hoverItem: Ref<number | string | null> = ref(0);
let currItem = ref(0);

function setHover(index: number | string | null, e?: MouseEvent) {
    hoverItem.value = index;
    if (!e) return
    setStalkerPosition(e);
    // setDialogPosition(e)
}

// 游標高亮
let stalkerX = ref(0)
let stalkerStyle = computed(() => ({
    transform: `translateX(calc(${stalkerX.value}px - 50%))`
}))
const tabs = useTemplateRef('tabs');
const tabsLeft = ref(0);
// prevent url bar resize
let currWidth = 0;

function initTabsLeft() {
    if (currWidth == window.innerWidth) return
    tabsLeft.value = tabs.value?.getBoundingClientRect().left || 0;
    currWidth = window.innerWidth;
}
const debounceGetLeft = debounce(initTabsLeft, 500);

function setStalkerPosition(e: MouseEvent) {
    let X = e.clientX - tabsLeft.value;
    stalkerX.value = X;
}

// 彈出視窗
const showNewsIndex = ref<null | number>(null);
const showNewsLorem = ref('');
const isDialogOpen = ref(false);
const dialogPosition = reactive<Record<string, null | number>>({
    x: null,
    y: null
})
// const dialogStyle = computed(() => ({
//     top: `${dialogPosition.y}px`,
//     left: `${dialogPosition.x}px`,
// }))

const dialogContent = computed(() => {
    if (showNewsIndex.value == null) return
    return newsList.showNews[showNewsIndex.value]
})

watch(showNewsIndex, (nVal) => {
    if (typeof nVal == 'number') {
        showNewsLorem.value = lorem.generateParagraphs(1)
    }
})

function tabOnclick(index: number, el: HTMLElement) {
    showNewsIndex.value = index;
    isDialogOpen.value = true;

    nextTick(() => {
        setDialogGsap();
    })
}

function closeDialog() {
    gsap.to(dialogContentRef.value,
        {
            xPercent: -50,
            yPercent: -50,
            scale: .5,
            opacity: 0,
            duration: .3,
            onComplete: () => {
                isDialogOpen.value = false;
            }
        }
    )
}

function setDialogPosition(e: MouseEvent) {
    const target = e.target as HTMLLIElement;
    const { top, left, width, height } = target.getBoundingClientRect();
    dialogPosition.x = left + width / 2;
    dialogPosition.y = top + height / 2;
}

// gsap
const dialogContentRef = useTemplateRef('dialogContentRef');
function setDialogGsap() {
    gsap.fromTo(dialogContentRef.value,
        {
            xPercent: -50,
            yPercent: -50,
            scale: .5,
            opacity: 0.5,
        },
        {
            xPercent: -50,
            yPercent: -50,
            scale: 1,
            opacity: 1,
            duration: .3,
        }
    )
}

// 隨機字數lorem
const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    }
})

// 離開關閉dialog
// const dialogRef = useTemplateRef('dialogRef');

onMounted(() => {
    debounceGetLeft();
    window.addEventListener('resize', debounceGetLeft);
    observer.observe(tabContainer.value);
    fetchNews();
})

onUnmounted(() => {
    window.removeEventListener('resize', debounceGetLeft)
    observer.disconnect();
})
</script>

<style scoped lang="scss">
* {
    // outline: 1px solid black;
}

%tabHeader_fontSize {
    h2 {
        font-size: 1.25rem;
        font-size: clamp(1.25rem, 0.892rem + 1.785vw, 2.5rem);

        small {
            font-size: 0.75rem;
            font-size: clamp(0.75rem, 0.678rem + 0.357vw, 1rem);
        }
    }

    ul>li {
        font-size: 1rem;
        font-size: clamp(1rem, 0.857rem + 0.714vw, 1.5rem);
    }
}

%tab_fontSize {
    li>div:nth-child(2) {
        font-size: 1rem;
        font-size: clamp(1rem, 0.928rem + 0.357vw, 1.25rem);
    }
}

%conceptContainer_fontSize {
    h1 {
        font-size: 1.25rem;
        font-size: clamp(1.25rem, 1.107rem + 0.714vw, 1.75rem);
    }

    .content {
        font-size: 1rem;
        font-size: clamp(1rem, 0.928rem + 0.357vw, 1.25rem);
    }
}

// %h2_fontSize {}

// hover畫底線
@mixin pseudoLine($speed) {
    &::after {
        @include WnH(100%, 1px);
        animation: lineOut $speed ease forwards;
        background-color: black;
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        transform: translateX(-100%);
    }

    &.hover::after {
        animation: lineIn $speed forwards;
    }

    &:not(.hover) {
        opacity: 0.5;
    }

    &.hideSlide::after {
        opacity: 0;
    }
}

// 底線動畫
@keyframes lineIn {
    from {
        transform: translateX(-100%);
    }

    to {
        transform: translateX(0%);
    }
}

@keyframes lineOut {
    from {
        transform: translateX(0%);
    }

    to {
        transform: translateX(100%);
    }
}

// 跑馬燈動畫
@keyframes marquee {
    from {
        transform: translateX(100%)
    }

    to {
        transform: translateX(-100%)
    }
}

@keyframes cloneMarquee {
    from {
        transform: translateX(0)
    }

    to {
        transform: translateX(-200%)
    }
}

// 分隔虛線
%pseudo-li-line {
    @include WnH(100vw, 1px);
    background: linear-gradient(to right, hsl(0, 0%, 50%) 33%, rgba(255, 255, 255, 0) 0%);
    background-size: 5px 1px;
    content: '';
    position: absolute;
    left: 0;
    z-index: 1;
}

.newsContainer {
    @include main-part;
    @include flex-center-center;
    // margin: 1rem auto;
    max-width: none;
    margin-inline: 0;
    flex-direction: column;
    margin-top: 1rem;
    margin-top: clamp(1rem, 0rem + 5vw, 6rem);
    height: 100vh;
    max-height: 920px;
    position: relative;
    overflow: hidden;
}

.marquee {
    @include flex-center-center;
    @include WnH(100%, 100%);

    opacity: 0.05;
    position: fixed;
    pointer-events: none;
    top: 0;
    left: 0;
    justify-content: flex-start;
    z-index: 0;

    span {
        animation: marquee 450s -225s linear infinite;
        background: linear-gradient(0deg, transparent 25%, black 50%);
        background-clip: text;
        color: transparent;
        font-family: "EB Garamond", serif;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
        font-size: 11.62vw;
        white-space: nowrap;
    }

    .cloneSpan {
        animation: cloneMarquee 450s linear infinite;
    }
}

.marquee-enter-active,
.marquee-leave-active {
    transition: opacity 0.3s ease;
}

.marquee-enter-from,
.marquee-leave-to {
    opacity: 0;
}

.marquee-enter-to,
.marquee-leave-from {
    opacity: 0.03;
}

.tabContainer {
    @include WnH(100%);

    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    overflow: hidden;
    z-index: 1;

    &>div {
        width: 100%;
    }
}

.cursor {
    background-color: black;
    @include WnH(100px);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 2;
    transition: opacity 0.75s ease;
    pointer-events: none;

    p {
        color: $primaryBacColor;
        text-align: center;
        margin: 0.5rem auto;
    }

    .cursorArrow {
        stroke-dasharray: 100;
        stroke-dashoffset: 100;
        animation: cursor 1.5s 0.5s ease-out forwards;
    }
}

.tabHeader {
    @extend %tabHeader_fontSize;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-top: 3rem;
    padding: 0 calc(10% + 6rem);

    h2 {
        display: inline-flex;
        justify-content: center;
        flex-direction: column;
        font-variation-settings: 'wght' 450;
        // font-size: 2.5rem;
        // transform: translateY(-13px);

        small {
            transform: translateX(4px);
            // font-size: 1rem;
            opacity: 0.5;
        }
    }

    ul {
        display: flex;

        li {
            cursor: pointer;
            // font-size: 1.5rem;
            margin-left: 2rem;
            user-select: none;
            position: relative;
            overflow: hidden;
            transition: opacity 0.3s ease;

            @include pseudoLine(0.3s);
        }
    }
}



.tabs {
    flex: 1;
}

.tab {
    @extend %tab_fontSize;
    display: flex;
    height: 100%;

    ul {
        display: flex;
        flex: 1;
        flex-direction: column;
    }

    li {
        // min-height: 90px;
        // height: calc((100vh - 90px) / 5);
        align-items: center;
        cursor: pointer;
        display: flex;
        flex: 0 0 20%;
        position: relative;
        padding: 0 calc(12% + 6rem);

        &::before {
            @extend %pseudo-li-line;
            top: 0;
        }

        &:last-child::after {
            @extend %pseudo-li-line;
            bottom: 0;
        }

        &>div {
            // border: 1px solid black;
            // transform: translateY(-25%);
        }
    }
}

.date {
    cursor: default;
    opacity: 0.5;
    font-size: 12px;
    // flex: 1;
    text-align: center;
    text-wrap: nowrap;
    margin-right: 4rem;
    z-index: 1;
}

.label {
    // background: url('@assets/icons/ConceptLabel.svg') no-repeat center;
    font-size: 12px;
    // flex: 1;
    opacity: 0.5;
    transition: opacity 0.3s ease;
    text-align: center;
    margin-right: 4rem;
    z-index: 1;
    // margin-inline: 1rem 4rem;

    &:hover {
        opacity: 1;
    }

    span {
        // border: 1px solid black;
        font-variation-settings: 'wght' 600;
        position: relative;
        padding: 0 2px;
        user-select: none;

        &::before {
            content: '';
            height: 100%;
            width: 100%;
            border: 1px solid $secondBacColor;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 0;
        }

        &::after {
            content: '';
            border-top: 8px solid transparent;
            border-bottom: 9px solid transparent;
            border-left: 10px solid $secondBacColor;
            display: block;
            height: 0%;
            width: 0%;
            position: absolute;
            top: 0;
            left: 100%;
            z-index: 0;
        }
    }
}

.dot {
    position: absolute;
    top: 50%;
    left: 110%;
    transform: translate(-50%, -50%);
    z-index: 1;
    width: 3px;
    height: 3px;
    background-color: $primaryBacColor;
    border-radius: 50%;
}

.contentWrapper {
    display: flex;
    flex: 8;
    // padding-left: 4rem;
    // font-size: 20px;
    z-index: 1;

    span {
        @include pseudoLine(0.5s);
        // text-wrap: nowrap;
        display: inline-block;
        position: relative;
        overflow: hidden;
        height: max-content // transform: translateY(5px);
    }
}

.stalker {
    @include WnH(100%);
    background: linear-gradient(90deg, transparent 25%, rgb(0, 67, 11, 0.1) 50%, transparent 75%);
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
}

.stalker-enter-active,
.stalker-leave-active {
    transition: opacity 0.5s ease;
}

.stalker-enter-from,
.stalker-leave-to {
    opacity: 0;
}

.stalker-enter-to,
.stalker-leave-from {
    opacity: 1;
}

.tab-enter-active,
// .tab-leave-active,
.tab-move {
    transition: opacity 0.5s ease-in;
}

// .tab-leave-active {
//     transition: opacity 0.5s ease;
// }

.tab-enter-from,
.tab-leave-to {
    opacity: 0;
}

.tab-enter-to,
.tab-leave-from {
    opacity: 1;
}

.dialogWrapper {
    @include flex-center-center;
    // @include WnH(100vw, 100vh);
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    z-index: 99;

    &::before {
        @include WnH(100%);
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;
        cursor: pointer;
        backdrop-filter: blur(2px)
    }
}

.conceptContainer {
    @extend %conceptContainer_fontSize;
    width: fit-content;
    max-width: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    // margin: 2rem calc(12% + 6rem);
    padding: 1rem 2rem;
    background-color: $primaryBacColor;
    border: 1px solid $secondBacColor;
    border-radius: 1rem;
    box-shadow: 2px 2px 6px 2px gray;
    position: fixed;
    z-index: 1;
    top: 50%;
    left: 50%;
    transform-origin: center;
    // transform: translate(-50%, -50%);

    h1 {
        // font-size: 1.75rem;
        font-variation-settings: 'wght' 500;
    }
}

.labelWrapper {
    display: flex;
    align-items: center;
    gap: 1.5rem;

    p {
        font-size: .8rem;
        font-variation-settings: 'wght' 500;
    }
}

.bac {
    position: absolute;
    width: 100%;
    height: 100%;
    max-width: 3rem;
}

.text {
    font-size: .75rem;
    // padding-left: .5rem;
    // text-wrap: nowrap;

    span {
        // border: 1px solid black;
        font-variation-settings: 'wght' 600;
        position: relative;
        padding: 0 2px;

        &::before {
            content: '';
            height: 100%;
            width: 100%;
            border: 1px solid $secondBacColor;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 0;
        }

        &::after {
            content: '';
            border-top: 8px solid transparent;
            border-bottom: 9px solid transparent;
            border-left: 10px solid $secondBacColor;
            display: block;
            height: 0%;
            width: 0%;
            position: absolute;
            top: 0;
            left: 100%;
            z-index: 0;
        }
    }
}

.mobileDate {
    display: none;
}

.title {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    padding-inline: 2rem;
    margin-bottom: 1.5rem;
    position: relative;
    text-wrap: nowrap;

    &::after {
        @include WnH(100%, 2px);
        background-color: $secondBacColor;
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        // transform: translateX(-100%);
    }
}

.titleWrapper {
    display: flex;
    align-items: baseline;
    gap: .5rem;

    p {
        font-size: .8rem;
        font-variation-settings: 'wght' 500;
    }
}

.content {
    // font-size: 1.25rem;
    text-indent: 1.75rem;
    margin-bottom: 4rem;
    padding-inline: 2rem;

    p {
        text-align: justify;
        text-wrap: pretty;
    }
}

.cancelBtn {
    align-self: flex-end;
    cursor: pointer;
    opacity: .5;
    transition: opacity .15s, box-shadow .15s;
    border-radius: .5rem;

    &:hover {
        opacity: 1;
        box-shadow: 0 0 0 1px black;
    }
}

.infoWrapper {
    display: flex;
    // flex: 1;
    align-items: center;
    padding-left: 2px;
    // width: 100%;
    // align-items: center;
    // justify-content: center;
}

.spinner-enter-active,
.spinner-leave-active {
    transition: opacity .3s;
}

.spinner-enter-from,
.spinner-leave-to {
    opacity: 0;
}

.spinner-enter-to,
.spinner-leave-from {
    opacity: 1;
}

@include XLarge {}

@include large {}

@include medium($width: 1024px) {
    .tabHeader {
        padding-inline: calc(12% + 3rem);
    }

    .date,
    .label {
        margin-right: 3rem;
    }

    .tab li {
        padding-inline: calc(12% + 3rem);
        flex-basis: 17%;
    }

}

@include medium {

    .tabHeader {
        padding-inline: calc(12%);
    }

    .date,
    .label {
        margin-right: 2.5rem;
    }

    .tab li {
        padding-inline: calc(12%);
        // flex-basis: 15%;
    }

    .conceptContainer {
        width: 100%;
        border-inline: 0;
        border-radius: 0;
    }

}

@include small {

    .tabContainer {
        gap: 1rem;
    }

    .tabHeader {
        align-items: start;
        flex-direction: column;
        gap: .5rem;

        ul li:first-child {
            margin: 0;
        }
    }

    .tab li {
        flex-direction: column;
    }

    .date,
    .label {
        margin-right: 1.5rem;
    }

    .infoWrapper {
        flex: 1;
        width: 100%;
    }

    .contentWrapper {
        flex: 1;
        width: 100%;
    }


    .tab li>div {
        transform: none;
    }

    .mobileDate {
        display: block;
    }

    .desktopDate {
        display: none;
    }

    .title {
        text-wrap: wrap;
    }
}

@include small($width: 430px) {
    .tabHeader {
        padding-inline: calc(6%);
        // flex-direction: column;
        // align-items: start;
    }

    .tab li {
        padding-inline: calc(6%);
        // flex-basis: 11%;
    }

    .contentWrapper {
        margin-bottom: .5rem;
    }

    .content p {
        text-align: start
    }

    ;
}
</style>