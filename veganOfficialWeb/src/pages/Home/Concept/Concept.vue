<template>
    <div class="newsContainer">
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
            <div class="tabs">
                <div class="tab"
                    v-for="(tab) in newsList.tabs"
                    v-show="tab == newsList.tab">
                    <ul>
                        <li v-for="(news) in newsList.showNews"
                            :key="news._id"
                            @mouseover="setHover(news._id!)"
                            @mouseout="setHover(null)">
                            <!-- <div class="listWrapper"> -->
                            <div class="date">
                                {{ news.date }}
                            </div>
                            <div class="label">
                                {{ news.label }}
                            </div>
                            <div>
                                <span style="opacity: 1;"
                                    :class="{
                                        hover: hoverItem == news._id,
                                        hideSlide: isHover
                                    }">
                                    {{ news.title }}
                                </span>
                            </div>
                            <!-- </div> -->
                        </li>
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

//TODO: hover高亮圓圈
/**
 * //新聞資料建置、請求資料編寫、換頁邏輯
 * //list比例調整
 * //用observer 控制跑馬燈是否顯示
 * //marquee動畫
 * //底線劃出
 * *btn hover效果、箭頭SVG
 * *內文靠上
 * *news pinia 重寫 https://medium.com/@lovebuizel/vue3-pinia-%E4%B8%AD%E5%A6%82%E4%BD%95%E5%84%AA%E9%9B%85%E7%9A%84%E4%BD%BF%E7%94%A8api-5e2636691d8b
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
        isHover.value = true;
        setTimeout(() => (isHover.value = false), 300)
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
let isHover = ref(false); //控制換頁時不顯示動畫
let hoverItem: Ref<number | string | null> = ref(0);
let currItem = ref(0);

function setHover(index: number | string | null) {
    hoverItem.value = index;
}

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
            @extend %pseudoLine;

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

// hover底線動畫
%pseudoLine {
    &::after {
        @include WnH(100%, 1px);
        animation: lineOut 0.3s ease forwards;
        background-color: black;
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
    }

    &.hover::after {
        animation: lineIn 0.3s ease forwards;
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
                @extend %pseudoLine;

                cursor: pointer;
                display: inline-block;
                position: relative;
                overflow: hidden;
            }
        }
    }
}
</style>