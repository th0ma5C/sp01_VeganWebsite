<template>
    <div class="container relative z-[1]" ref="locationRef">
        <Teleport to=".location" defer>
            <div class="cursor" ref="cursor"
                :style="cursorStyle"
                v-show="setCursorStyle.show"
                @animationend="setCursorStyle.opacity = 0"
                @transitionend="">
                <SvgIcon name="LocationArrow_L"
                    width="100px" height="24px"
                    color="white" class="cursorArrow">
                </SvgIcon>
                <p>DRAG</p>
                <SvgIcon name="LocationArrow_R"
                    width="100px" height="24px"
                    color="white" class="cursorArrow">
                </SvgIcon>
            </div>
        </Teleport>

        <transition name="bgFilter">
            <div class="bgFilter absolute content-none"
                ref="bgFilter">
            </div>
        </transition>
        <SvgIcon name="LocationTW" class="TW" width="300px"
            height="450" color="white">
        </SvgIcon>

        <swiper-container class="mainPart" ref="swiperRef"
            :loop="true" :speed="1000" :parallax="true"
            grab-cursor="true">
            <swiper-slide
                v-for="(item, index) in branchList"
                :key="index" class="carousel">
                <div class="content">
                    <div class="mapWrapper" ref="point">
                        <SvgIcon name="LocationTW"
                            class="TWAnchor" width=""
                            height="450" color="white">
                        </SvgIcon>
                        <div class="point" ref="point"
                            :class="{
                                north: item.position == '北部分店',
                                central: item.position == '中部分店',
                                south: item.position == '南部分店',
                            }"></div>
                    </div>
                    <div class="branchName"
                        ref="branchNames">
                        <p>{{ item.position }}</p>
                        <h1>
                            {{ item.branch }}
                            <span class="prevBranch">
                                {{
                                    previewBranchName(item.branch)[0]
                                }}
                            </span>
                            <span class="nextBranch">
                                {{
                                    previewBranchName(item.branch)[1]
                                }}
                            </span>
                        </h1>
                        <div @mouseenter="handleCheckMapMouserEnter"
                            @mouseleave="setIconClass($event);"
                            @click="mapBtn(item.branch)"
                            class="btnWrapper">
                            <a>
                                查看地圖
                            </a>
                            <SvgIcon name="LocationArrow"
                                width="24" height="24"
                                :class="iconClass">
                            </SvgIcon>
                        </div>
                        <div class="position" v-show="true"
                            data-swiper-parallax="-1000">
                            <SvgIcon name="Location"
                                color="white" width="24"
                                height="24">
                            </SvgIcon>
                            <p>{{ item.addr }}</p>
                        </div>
                    </div>
                </div>
            </swiper-slide>
        </swiper-container>
    </div>
</template>

<script setup lang="ts">
// TODO: 整體代碼優化
/**
 * //無法點按鈕(pointer-event or z-index)
 * //cursor出現、消失動畫(淡化)
 * //左下字用切換顯示
 * //下一分店名靠前、淡化
 * //游標跟隨可以不用requestAnimationFrame，透過不斷移除animation、新增animation達成平滑移動
 * // 頭尾兩張clone時會閃爍，不時出現，原因未知
 * // 封裝游標跟隨
 * ? 取消游標跟隨mouseover，不確定影響
 */



import { reactive, watch, onMounted, onUnmounted, nextTick, ref, computed, onUpdated, watchEffect, useTemplateRef } from 'vue';
import type { Ref } from 'vue';
import debounce from 'lodash/debounce';
import useListener from '@/hooks/useListener';
import { useCursorFollow } from '@/hooks/useCursorFollow';
import useArrowFly from '@/hooks/useArrowFly';
import emitter from '@/utils/eventBus';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SwiperContainer } from 'swiper/element';
import type { Swiper, SwiperEvents } from 'swiper/types';


// location swiper
let branchList = [
    {
        position: '北部分店',
        branch: '台北車站店',
        addr: 'Zhongzheng Dist., Taipei City',
        bacUrl: ''
    },
    {
        position: '中部分店',
        branch: '台中車站店',
        addr: 'Central Dist., Taichung City',
        bacUrl: ''
    },
    {
        position: '南部分店',
        branch: '高雄車站店',
        addr: 'Sanmin Dist., Kaohsiung City',
        bacUrl: ''
    }
] as const;

let swiperRef = useTemplateRef<SwiperContainer>('swiperRef');

// handle window resize

// prevent url bar resize
let currWidth = window.innerWidth;

function resize() {
    if (currWidth == window.innerWidth) return
    if (swiperRef.value) {
        swiperRef.value.swiper.update();
    }
    ScrollTrigger.killAll();
    createScrollTrigger();
    ScrollTrigger.refresh();
    const scaler = ScrollTrigger.getById('scaler');
    if (scaler && scaler.progress !== 1) {
        scaler?.enable();
    }
    currWidth = window.innerWidth;
}

//icon hover
let { iconClass, setIconClass, timers } = useArrowFly();

const locationRef = useTemplateRef('locationRef');
let cursorStyle = computed(() => ({
    transform: `translate3d(calc(${coordinate.X}px - 50%),calc(${coordinate.Y}px - 62px), 0)`,
    opacity: setCursorStyle.opacity,
}))


// cursor follow
let { coordinate, setCursorStyle, cursorLeave } = useCursorFollow(locationRef)
const isScrollerFinish = ref(true);
watchEffect(() => {
    if (isScrollerFinish.value) {
        setCursorStyle.enable = true
    }
})

const events = {
    window: [
        { event: 'resize', handler: resize },
    ]
}
function handleCheckMapMouserEnter(e: MouseEvent) {
    setIconClass(e);
    cursorLeave();
    setCursorStyle.opacity = 0;
}

// sticky top
gsap.registerPlugin(ScrollTrigger);

function createScrollTrigger() {
    gsap.fromTo(locationRef.value,
        {
            scale: .5,
            transformOrigin: "top",
        },
        {
            scale: 1,
            transformOrigin: "top",
            scrollTrigger: {
                id: 'scaler',
                trigger: locationRef.value,
                start: 'top-=50% center',
                end: 'top-=25% center',
                scrub: .5,
            },
            onComplete: () => {
                ScrollTrigger.refresh()
                isScrollerFinish.value = true;

                const scaler = ScrollTrigger.getById('scaler');
                if (scaler && scaler.progress) {
                    scaler.disable(false);
                } else if (scaler) {
                    scaler.enable();
                }
            },
        }
    )
    ScrollTrigger.create({
        id: 'pin',
        trigger: locationRef.value,
        // pin: locationRef.value,
        start: 'top top',
        end: '+=100',
        onLeave: () => {
            // ScrollTrigger.getById('pin')?.disable(false);
        }
    })
}

// refactor with swiper js
function previewBranchName(curr: string) {
    const currIndex = branchList.findIndex((item) => {
        return item.branch == curr
    })

    let preview;
    switch (currIndex) {
        case 0:
            return preview = [branchList[2].branch, branchList[1].branch];
        case 1:
            return preview = [branchList[0].branch, branchList[2].branch];
        default:
            return preview = [branchList[1].branch, branchList[0].branch];
    }
}

// btn on click
function mapBtn(target: typeof branchList[number]['branch']) {
    let url = null;
    switch (target) {
        case '台北車站店':
            url = 'https://maps.app.goo.gl/RzqLDnduTMCyxphr7';
            window.open(url, '_blank')?.focus();
            break;
        case '台中車站店':
            url = 'https://maps.app.goo.gl/R2YvnkB4MHfmwt7t5';
            window.open(url, '_blank')?.focus();
            break;
        default:
            url = 'https://maps.app.goo.gl/uGHbjoCbm5EZq5nB9';
            window.open(url, '_blank')?.focus();
            break;
    }
}

onMounted(() => {
    useListener(window, 'add', events.window);
    createScrollTrigger();
})
onUnmounted(() => {
    timers.forEach(timer => {
        if (timer) clearTimeout(timer);
    })
    useListener(window, 'remove', events.window);
    ScrollTrigger.killAll();
})

</script>

<style scoped lang="scss">
* {
    // outline: 1px solid black;
}

@keyframes cursor {
    0% {
        stroke-dashoffset: 100;
    }

    30% {
        stroke-dashoffset: 0;
    }

    70% {
        stroke-dashoffset: 0;
    }

    100% {
        stroke-dashoffset: -100;
    }


}

.container {
    @extend %fixContainer;
    --TW_position: 37%;
    background: url('@assets/img/Home/Location/shop.jpg') fixed no-repeat center/cover;
    transition: width 0.2s ease, height 0.2s ease;
    margin-inline: auto;

    .mapWrapper {
        position: absolute;
        top: var(--TW_position);
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 1;

        .TWAnchor {
            opacity: 0;
        }
    }

    .TW {
        position: absolute;
        // top: 37%;
        top: var(--TW_position);
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0.6;
        // background-color: wheat
    }

    .bgFilter {
        @include WnH(100%);
        background-color: rgba(0, 0, 0, 0.6);
    }

    .bgFilter-enter-active {
        transition: opacity 1s ease;
    }

    .bgFilter-enter-from {
        opacity: 0;
    }

    .bgFilter-enter-to {
        opacity: 1;
    }
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

.mainPart {
    @include WnH(100%);
    height: 100vh;
    // height: 920px;
    max-height: 920px;
    display: inline-flex;
    color: $primaryBacColor;
    filter: brightness(2);
    position: relative;
    will-change: transform;
}

.carousel {
    display: flex;
    justify-content: center;
    margin-bottom: 10%;
}

.content {
    @include flex-center-center;
    width: 100%;
}

.point {
    @include WnH(8px);
    border-radius: 50%;
    background-color: white;
    position: absolute;
    top: -4px;
    left: -4px;
    transition: opacity .3s 1s;
}

.north {
    transform: translate(210px, 32.5px);
}

.central {
    transform: translate(108px, 154.5px);
}

.south {
    transform: translate(70px, 360px);
}

.fadeIn-enter-active,
.fadeIn-leave-active {
    transition: opacity 0.5s var(--delaySpeed);
}

.fadeIn-enter-to,
.fadeIn-leave-from {
    opacity: 1;
}

.fadeIn-enter-from,
.fadeIn-leave-to {
    opacity: 0;
}

.branchName {
    @include flex-center-center;
    // width: 100%;
    // width: 360px;
    flex-direction: column;
    position: absolute;
    top: calc(37% + 225px + 2rem);
    // top: calc(7rem + 450px);
    left: 50%;
    transform: translate(-50%, 0);

    p {
        font-size: 0.75rem;
        font-size: clamp(0.75rem, 0.67rem + 0.35vw, 1rem);
    }

    h1 {
        // font-size: 4rem;
        font-size: 1.5rem;
        font-size: clamp(1.5rem, 0.78rem + 3.57vw, 4rem);
        font-variation-settings: 'wght' 500;
        letter-spacing: 0.5rem;
        position: relative;

        span {
            position: absolute;
            text-wrap: nowrap;
            opacity: .5;
        }
    }
}

.prevBranch {
    right: 50vw;
}

.nextBranch {
    left: 50vw;
}

.btnWrapper {
    @include flex-center-center;
    align-self: flex-end;
    cursor: pointer;
    // font-size: 1.5rem;
    font-size: 0.75rem;
    font-size: clamp(0.75rem, 0.53rem + 1.07vw, 1.5rem);
    font-variation-settings: 'wght' 600;
    gap: 0.5rem;
    position: relative;

    .in {
        animation: flyIn 0.5s ease-out forwards;
    }

    .out {
        animation: flyOut 0.5s ease-in forwards;
    }

    &:hover a {
        outline-color: $primaryBacColor ;
        opacity: 1;
    }

    a {
        padding: .25rem .5rem;
        border-radius: 1rem;
        position: relative;
        outline: 1px solid transparent;
        opacity: .75;
        transition: outline-color .3s, opacity .3s;
    }
}

.position {
    @include flex-center-center;
    gap: 0.25rem;
    position: absolute;
    bottom: 0%;
    left: -100%;
    translate: 50% 100%;
    text-wrap: nowrap;
    line-height: 36px;
    padding: .25rem .5rem;

    p {
        font-size: 0.75rem;
        font-size: clamp(0.75rem, 0.678rem + 0.357vw, 1rem);
    }
}

.dragging {
    transition: none !important;
}



@keyframes branchAnimation {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

swiper-slide:not(.swiper-slide-active) {

    .prevBranch,
    .nextBranch {
        opacity: 0 !important;
    }

    .point {
        opacity: 0;
    }
}

swiper-slide:is(.swiper-slide-active) {

    .point {
        opacity: 1;
    }
}

.cursor {
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
        animation: cursor 1s 0.5s ease-out forwards;
    }

}

@include XLarge {
    .prevBranch {
        right: 960px;
    }

    .nextBranch {
        left: 960px;
    }
}

@include large {}

@include medium {

    .container {
        // --TW_position: 4rem;
    }

    .branchName {
        top: calc(37% + 225px + 1.75rem);
        // top: calc(5.5rem + 450px);
    }

    .position {
        bottom: 5%;
    }
}

@include small {
    .container {
        // --TW_position: 3rem;
    }

    .prevBranch {
        right: 55vw;
    }

    .branchName {
        top: calc(37% + 225px + 1.5rem);
        // top: calc(4rem + 450px);
    }

    .nextBranch {
        left: 55vw;
    }
}

@include small($width: 320px) {
    .prevBranch {

        right: 60vw;
    }

    .nextBranch {
        left: 60vw;
    }
}

// 北
// 25.047893811483274,
// 121.51709051510576 top: calc(114px);
// left: calc(1012px);
// x 210 y 32.5

// 中 24.137131307709268,
// 120.68668906182916 top: calc(236px);
// left: calc(910px);
// x 108 y 154.5

// 南 22.639888449163326,
// 120.30226114031127 top: calc(435px);
// left: calc(863px);
// x 61 y 353</style>