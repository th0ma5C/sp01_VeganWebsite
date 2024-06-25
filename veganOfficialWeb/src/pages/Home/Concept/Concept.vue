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
                <div class="tab"
                    v-for="(tab) in newsList.tabs"
                    :key="tab" v-show="tab == newsList.tab">
                    <ul>
                        <transition-group name="tab"
                            @enter="hideSlide = true"
                            @after-enter="hideSlide = false">
                            <li v-for="(news) in newsList.showNews"
                                :key="tab" ref="li"
                                v-show="tab == newsList.tab"
                                @mouseenter="setHover(news._id!)"
                                @mouseleave="setHover(null)">
                                <div class="date">
                                    {{ news.date }}
                                </div>
                                <div class="label">
                                    {{ news.label }}
                                </div>
                                <div>
                                    <span
                                        style="opacity: 1;"
                                        :class="{
                                            hover: hoverItem == news._id,
                                            hideSlide: hideSlide
                                        }">
                                        {{ news.title }}
                                    </span>
                                </div>
                            </li>
                        </transition-group>
                    </ul>
                </div>

            </div>
        </div>
        <div class="botBtn">
            <button>
                列表
                <Svg-icon name="ConceptArrow" width="27"
                    height="27"></Svg-icon>
            </button>
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
        <!-- <div class="cursor" ref="cursor"
            :style="cursorStyle"
            v-show="setCursorStyle.show"
            @animationend="setCursorStyle.opacity = 0"
            @transitionend="setCursorStyle.show = false;">
            <p>DRAG</p>
        </div> -->
    </div>
    <!-- <div class="conceptContainer">

    </div> -->
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeMount, onMounted, onUnmounted, reactive, ref, watch, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useNewsStore } from '@/store/newsStore';
import type { Ref, ComputedRef } from 'vue';
import moment from 'moment';
import { useCursorFollow } from '@/hooks/useCursorFollow';

//TODO: hover高亮圓圈
/**
 * //新聞資料建置、請求資料編寫、換頁邏輯
 * //list比例調整
 * //用observer 控制跑馬燈是否顯示
 * //marquee動畫
 * //底線劃出
 * *btn hover效果、箭頭SVG
 * *內文靠上
 * *news pinia 重寫 google:Vue3 Pinia 中如何優雅的使用API
 * *標籤hover
 * //!隱藏線條時間不夠，換頁動畫抖動
 */


// list 數據
let { newsData } = useNewsStore();

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
    changeTab(index: number, e: MouseEvent | null) {
        const target = e?.target as HTMLElement
        this.tab = target.innerHTML.trim();

        currItem.value = index;
    }
})

watchEffect(() => {
    if (!newsData) return

    if (newsList.tab == '最新') {
        newsList.showNews = newsData.slice(0, 5)
        return
    }
    newsList.showNews = newsData.filter((news) => {
        if (news.label == newsList.tab) {
            return news
        }
    })
});

// 背景跑馬燈顯示
let tabContainer = ref()
let enter = ref(false)

let showBac = (entries: IntersectionObserverEntry[] | undefined) => {
    if (entries) {
        entries.forEach(entry => {
            enter.value = entry.isIntersecting;
        })
    }
}

const observer = new IntersectionObserver(showBac, {
    root: null,
    rootMargin: '-460px 0px',
    threshold: [0]
});

// 底線動畫
let hideSlide = ref(false); //控制換頁時不顯示動畫
let hoverItem: Ref<number | string | null> = ref(0);
let currItem = ref(0);

function setHover(index: number | string | null, e?: MouseEvent) {
    hoverItem.value = index;
}

// 游標高亮
// let tabs = ref()
// let { coordinate, setCursorStyle } = useCursorFollow(tabs)
// setCursorStyle.enable = true;
// let cursorStyle = computed(() => ({
//     transform: `translate3d(calc(${coordinate.X}px),calc(${coordinate.Y}px), 0)`,
//     opacity: setCursorStyle.opacity,
// }))
onMounted(() => {
    observer.observe(tabContainer.value);
})

onUnmounted(() => {
    observer.disconnect();
})
</script>

<style scoped lang="scss">
* {
    // border: 1px solid;
}

// hover底線動畫
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
        // transition: transform $speed ease;
    }

    &.hover::after {
        animation: lineIn $speed ease forwards;
    }

    &:not(.hover) {
        opacity: 0.5;
    }

    &.hideSlide::after {
        opacity: 0;
    }
}

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

.newsContainer {
    @include main-part;
    @include flex-center-center;
    margin: 1rem 0;
    flex-direction: column;
    margin-top: 96px;
    height: 888px;
    position: relative;
    // padding: 0 6rem;
    overflow: hidden;

    .marquee {
        @include flex-center-center;
        @include WnH(100%, 100%);

        opacity: 0.03;
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
        // @include flex-center-center;
        @include WnH(100%);


        align-items: center;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        // position: relative;
        overflow: hidden;
        z-index: 1;

        &>div {
            width: 100%;
        }
    }

    .botBtn {
        @include flex-center-center;
        @include WnH(120px, 52px);
        border: 1px solid rgba(0, 0, 0, 0.5);
        border-radius: 40px;
        font-size: 20px;
        margin: 2rem 15% 2rem auto;

        button {
            @include flex-center-center;
            gap: 0.5rem;
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
        // background-color: black;

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
}


.tabHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 3rem;
    padding: 0 calc(10% + 6rem);

    h2 {
        display: inline-flex;
        justify-content: center;
        flex-direction: column;
        font-size: 2.5rem;
        transform: translateY(-13px);

        small {
            transform: translateX(2px);
            font-size: 1rem;
            opacity: 0.5;
        }
    }

    ul {
        display: flex;

        li {
            @include pseudoLine(0.3s);

            cursor: pointer;
            font-size: 1.5rem;
            margin-left: 2rem;
            user-select: none;
            position: relative;
            overflow: hidden;
            transition: opacity 0.3s ease;
        }
    }
}



.tabs {
    flex: 1;
}

.tab {
    display: flex;
    height: 100%;
    // padding: 0 4rem;

    ul {
        // height: 100%;
        display: flex;
        flex: 1;
        flex-direction: column;
    }

    %pseudo-li-line {
        @include WnH(100vw, 1px);
        // background-color: black;
        background: linear-gradient(to right, hsl(0, 0%, 50%) 33%, rgba(255, 255, 255, 0) 0%);
        background-size: 5px 1px;
        content: '';
        position: absolute;
        left: 0;
        // transform: translateX(calc(-1 * (10rem + (100vw - 6rem) * 0.1)));
    }

    li {
        // height: 20%;
        align-items: center;
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

        .listWrapper {
            // padding: 0 10%;
        }

        .date {
            opacity: 0.5;
            font-size: 12px;
            flex: 1;
            text-align: center;
        }

        .label {
            // color: rgb(0, 0, 0, 0.5);
            font-size: 12px;
            flex: 1;
            text-align: center;
            background: url('@assets/icons/ConceptLabel.svg') no-repeat center;
            opacity: 0.5;
        }

        div:nth-child(3) {
            flex: 8;
            padding-left: 4rem;
            font-size: 20px;

            span {
                @include pseudoLine(0.5s);

                cursor: pointer;
                display: inline-block;
                position: relative;
                overflow: hidden;
            }
        }
    }
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
</style>