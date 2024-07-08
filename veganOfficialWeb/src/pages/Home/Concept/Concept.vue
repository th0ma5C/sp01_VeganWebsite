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
                            <li v-for="({ date, label, title, _id }) in newsList.showNews"
                                :key="tab" ref="li"
                                v-show="tab == newsList.tab"
                                @mouseenter="setHover(_id!, $event)"
                                @mouseleave="setHover(null, $event)"
                                @mousemove="setStalkerPosition($event)">
                                <div class="date">
                                    {{ date }}
                                </div>
                                <div class="label">
                                    {{ label }}
                                </div>
                                <div>
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
        <div class="botBtn">
            <button>
                <div class="cube" data-cubeBot="更多資訊">
                    <span>
                        More
                    </span>
                </div>
                <div class="wrapper">
                    <Svg-icon name="ConceptArrow" width="24"
                        height="24" class="arrow">
                    </Svg-icon>
                </div>
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
    </div>
    <!-- <div class="conceptContainer">

    </div> -->
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeMount, onMounted, onUnmounted, reactive, ref, watch, watchEffect } from 'vue';
import { useNewsStore } from '@/store/newsStore';
import type { Ref } from 'vue';

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

// 背景跑馬燈顯示/隱藏
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
}

// 游標高亮
let stalkerX = ref(0)
let stalkerStyle = computed(() => ({
    transform: `translateX(calc(${stalkerX.value}px - 50%))`
}))
function setStalkerPosition(e: MouseEvent) {
    let X = e.clientX;
    stalkerX.value = X;
    // console.log(e);
}


onMounted(() => {
    observer.observe(tabContainer.value);
})

onUnmounted(() => {
    observer.disconnect();
})
</script>

<style scoped lang="scss">
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
        animation: lineIn $speed ease forwards;
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
    margin: 1rem auto;
    flex-direction: column;
    margin-top: 96px;
    height: 888px;
    position: relative;
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
        @include WnH(100%);


        align-items: center;
        display: flex;
        flex-direction: column;
        gap: 1rem;
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
}

.botBtn {
    @include flex-center-center;
    @include WnH(160px, 52px);
    border: 1px solid rgba(0, 0, 0, 0.25);
    border-radius: 45px;
    font-size: 20px;
    margin: 2rem 15% 2rem auto;
    transition: border-color 0.5s ease;

    button {
        @include flex-center-center;
        justify-content: space-around;
        width: 100%;


        .cube {
            @include WnH(92px, 30px);
            backface-visibility: hidden;
            position: relative;
            transform-style: preserve-3d;
            transition: transform 0.4s ease-out;
            transform-origin: top;

            span {
                margin-left: 12px;
                transform: translateZ(15px);
                opacity: 1;
                transition: opacity 0.3s ease-out, transform 0.4s ease;
            }

            &::after {
                content: attr(data-cubeBot);
                position: absolute;
                left: 12px;
                top: 0;
                transform: rotateX(-90deg) translateZ(13px) translateY(50%);
                opacity: 0;
                transition: opacity 0.3s ease-out, transform 0.4s ease;

            }

        }

        .wrapper {
            @include flex-center-center;
            @include WnH(30px);
            position: relative;


            .arrow {
                color: black;
                transition: color 0.5s ease;
                position: absolute;
                z-index: 2;
            }

            &::after {
                @include WnH(36px);
                background-color: $secondBacColor;
                border-radius: 36px;
                content: '';
                scale: 0;
                transition: scale 0.5s ease;
                position: absolute;
                left: -3px;
                top: -3px;
                z-index: 1;
            }
        }
    }
}

.botBtn:hover {
    border-color: $secondBacColor;

    .wrapper {
        .arrow {
            color: white;
        }

        &::after {
            scale: 1;
        }
    }

    .cube {
        transform: rotateX(90deg);

        span {
            opacity: 0;
        }

        &::after {
            opacity: 1;
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
            transform: translateX(4px);
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

    ul {
        display: flex;
        flex: 1;
        flex-direction: column;
    }



    li {
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
            transform: translateY(-50%);
        }

        .date {
            cursor: default;
            opacity: 0.5;
            font-size: 12px;
            flex: 1;
            text-align: center;
            z-index: 1;
        }

        .label {
            background: url('@assets/icons/ConceptLabel.svg') no-repeat center;
            font-size: 12px;
            flex: 1;
            opacity: 0.5;
            transition: opacity 0.3s ease;
            text-align: center;
            z-index: 1;

            &:hover {
                opacity: 1;
            }
        }

        div:nth-child(3) {
            display: flex;
            flex: 8;
            padding-left: 4rem;
            font-size: 20px;
            z-index: 1;

            span {
                @include pseudoLine(0.5s);

                display: inline-block;
                position: relative;
                overflow: hidden;
                transform: translateY(5px);
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