<template>
    <div class="container relative z-[1]" ref="locationRef"
        :style="[bgSize]"
        @mousedown.prevent="down($event); dragClick = 'grabbing'"
        @mouseup="dragClick = 'grab'">
        <div class="mask"></div>
        <div class="cursor" ref="cursor"
            :style="cursorStyle"
            v-show="setCursorStyle.show"
            @animationend="setCursorStyle.opacity = 0"
            @transitionend="setCursorStyle.show = false;">
            <SvgIcon name="LocationArrow_L" width="100px"
                height="24px" color="white"
                class="cursorArrow">
            </SvgIcon>
            <p>DRAG</p>
            <SvgIcon name="LocationArrow_R" width="100px"
                height="24px" color="white"
                class="cursorArrow">
            </SvgIcon>
        </div>
        <transition name="bgFilter">
            <div class="bgFilter absolute content-none"
                ref="bgFilter" v-show="true">
            </div>
        </transition>
        <SvgIcon name="LocationTW" class="TW" width=""
            height="450" color="white">
        </SvgIcon>
        <div class="mainPart" ref="wrapper"
            :class="{ 'dragging': isDown }"
            :style="branchStyle"
            @transitionend="cloneList();">
            <!-- <transition-group name="carousel" tag="div"
                class="carousel"> -->
            <div class="carousel"
                v-for="(item, index) in showList"
                :key="index">
                <div class="content">
                    <transition name='fadeIn'>
                        <div class="point" :style="delayVar"
                            :class="pointClass[index]"
                            ref="point"
                            v-show="count == index">
                        </div>
                    </transition>
                    <div class="branchName"
                        ref="branchNames">
                        <p>{{ item.position }}</p>
                        <h1>
                            {{ item.branch }}
                        </h1>
                        <!-- <transition name="branch"> -->
                        <h1 :style="branchNameClass[index]"
                            v-show="index == count - 1 || index == count + 1">
                            {{ item.branch }}
                        </h1>
                        <!-- </transition> -->
                        <div @mouseenter="setIconClass($event); dragClick = 'pointer'"
                            @mouseleave="setIconClass($event); dragClick = 'grab'">
                            <a>
                                查看地圖
                            </a>
                            <SvgIcon name="LocationArrow"
                                width="24" height="24"
                                :class="iconClass">
                            </SvgIcon>
                        </div>
                    </div>
                    <transition name="fadeIn">
                        <div class="position"
                            :style="[{ left: `${index * 100 + 15}%` }, delayVar]"
                            v-show="index == count">
                            <SvgIcon name="Location"
                                color="white" width="24"
                                height="24">
                            </SvgIcon>
                            <p>{{ item.addr }}</p>
                        </div>
                    </transition>
                </div>
            </div>
            <!-- </transition-group> -->
        </div>
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
 * * 頭尾兩張clone時會閃爍，不時出現，原因未知
 * ? 封裝游標跟隨
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


//背景
let bg = reactive({
    width: 952,
    height: 460
});
let scrollY = ref();
let deltaY = ref(0);
let ticking = false;
watch(scrollY, (nVal, oVal = 0) => {
    if (bg.width == 1905 || ticking) return;
    deltaY.value = nVal - oVal;
    window.requestAnimationFrame(() => {
        ticking = false;
        if (scrollY.value >= 1400) {
            bg.width = Math.min(Math.max(bg.width + deltaY.value, 952), 1905);
            bg.height = Math.min(Math.max(bg.height + deltaY.value, 460), 920);
        }
    })
    ticking = true;
})
let bgSize = computed(() => ({
    width: `${bg.width}px`,
    'min-height': `${bg.height}px`,
    cursor: dragClick.value
}))
function bgScroll() {
    if (bg.width == 1905 || ticking) return;
    scrollY.value = window.scrollY;
}

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
]

let pointClass = computed(() => {
    return showList.value.map((_, index) => {
        switch (index) {
            case 1:
                return 'cloneSouth';
            case 2:
                return 'north';
            case 3:
                return 'central';
            case 4:
                return 'south';
            case 5:
                return 'cloneNorth';
            default:
                return '';
        }
    })
})

let delaySpeed = ref(1)
let delayVar = computed(() => {
    return {
        '--delaySpeed': `${delaySpeed.value}s`
    }
})

let count = ref(2), translateX = ref(0), transition = ref('transform 0s ease'),
    isDown = ref(false), wrapper = ref<HTMLDivElement | null>(),
    divWidth: number,
    breakPoint: number,
    dragClick = ref('grab'),
    branchStyle = computed(() => ({
        transform: `translateX(calc(-${count.value * 100}% + ${translateX.value}px))`,
        transition: `${transition.value}`
    }));

let frontTag = branchList.slice(0, 2), rearTag = branchList.slice(-2),
    showList = ref([...rearTag, ...branchList, ...frontTag])

function changeSwiper(direction: -1 | 1) {
    // if (count.value == 1 && direction == -1) return
    // if (count.value == 3 && direction == 1) return
    count.value += direction;
    transition.value = 'transform 0.75s ease';
    delaySpeed.value = 1;
}

function cloneList() {
    transition.value = 'transform 0s';
    if (count.value == (showList.value.length - 2)) {
        count.value = 2;
    } else if (count.value == 1) {
        count.value = showList.value.length - 3;
    }
    delaySpeed.value = 0.15;
    isDown.value = false;
}

function resize() {
    if (wrapper.value) {
        divWidth = wrapper.value.clientWidth;
    }
    // ScrollTrigger.killAll();
    // gsap.set(locationRef.value, { scale: 1 })
}

function down(e: MouseEvent) {
    if (isDown.value) return;
    e.preventDefault();
    isDown.value = true;
    breakPoint = 0;
    useListener(window, 'add', events.drag);
}

function move(e: MouseEvent) {
    translateX.value += e.movementX;
    breakPoint += e.movementX;
    branchX.value += e.movementX
}

function up() {
    if (translateX.value == 0) {
        isDown.value = false;
        useListener(window, 'remove', events.drag);
        return
    }
    if (breakPoint < -(divWidth / 5)) {
        changeSwiper(1);
    } else if (breakPoint > (divWidth / 5)) {
        changeSwiper(-1);
    }
    transition.value = 'transform 0.75s ease';
    translateX.value = 0;
    useListener(window, 'remove', events.drag);
}

// 店名靠前
let branchNames = ref()
let branchX = ref(0);
let prevBranch = computed(() => ({
    position: 'absolute',
    top: 'calc(570px)',
    right: `calc(-160px - ${(count.value - 1) * 1905}px)`,
    opacity: '0.5',
}))
let currBranch = computed(() => ({
    display: 'none',
}))
let nextBranch = computed(() => ({
    position: 'absolute',
    top: 'calc(570px)',
    right: `calc(-200px - ${(count.value) * 1905}px)`,
    opacity: '0.5',
}))

let branchNameClass = computed(() => {
    return showList.value.map((_, index) => {
        switch (index) {
            case count.value - 1:
                return prevBranch.value;
            case count.value:
                return currBranch.value;
            case count.value + 1:
                return nextBranch.value;
            default:
                return {};
        }
    })
})

//icon hover
let { iconClass, setIconClass, timers } = useArrowFly();

const locationRef = useTemplateRef('locationRef');
let cursorStyle = computed(() => ({
    transform: `translate3d(calc(${coordinate.X}px - 50%),calc(${coordinate.Y}px - 62px), 0)`,
    opacity: setCursorStyle.opacity,
}))
watchEffect(() => {
    if (bg.width >= 1905) {
        setCursorStyle.enable = true
    }
})

// cursor follow
let { coordinate, setCursorStyle } = useCursorFollow(locationRef)

const events = {
    window: [
        { event: 'resize', handler: resize },
    ],
    dom: [
        { event: 'mousedown', handler: down },
    ],
    drag: [
        { event: 'mousemove', handler: move },
        { event: 'mouseup', handler: up },
    ],
    scroll: [
        { event: 'scroll', handler: bgScroll }
    ],
}

// sticky top
// gsap.registerPlugin(ScrollTrigger);
// ScrollTrigger.config({ autoRefreshEvents: "none" });

function createScrollTrigger() {
    // gsap.fromTo(locationRef.value,
    //     {
    //         scale: .5,
    //         transformOrigin: "top",
    //     },
    //     {
    //         scale: 1,
    //         transformOrigin: "top",
    //         scrollTrigger: {
    //             id: 'scaler',
    //             trigger: locationRef.value,
    //             start: 'top-=400 center',
    //             end: 'top-=200 center',
    //             scrub: .5,
    //         },
    //         onComplete: () => {
    //             ScrollTrigger.getById('scaler')?.disable(false);
    //         },
    //     }
    // )
    // ScrollTrigger.create({
    //     trigger: locationRef.value,
    //     pin: locationRef.value,
    //     start: 'top top',
    //     end: '+=100',
    //     onLeave: () => {
    //         // ScrollTrigger.refresh();
    //         nextTick(() => {
    //             // ScrollTrigger.getById('scaler')?.disable(false);
    //         })
    //     },
    // })
}

onMounted(() => {
    scrollY.value = window.scrollY;
    useListener(window, 'add', events.scroll);
    useListener(window, 'add', events.window);
    // createScrollTrigger();
})
onUpdated(() => {
    resize();
})
onUnmounted(() => {
    timers.forEach(timer => {
        if (timer) clearTimeout(timer);
    })
    useListener(window, 'remove', events.scroll);
    useListener(window, 'remove', events.window);
    // ScrollTrigger.killAll();
})

</script>

<style scoped lang="scss">
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
    background: url('@assets/img/Home/Location/shop.jpg') fixed no-repeat center/cover;
    transition: width 0.2s ease, height 0.2s ease;
    cursor: grab;
    margin-inline: auto;

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
            animation: cursor 1.5s 0.5s ease-out forwards;
        }

    }

    .TW {
        position: absolute;
        top: 5rem;
        left: 50%;
        transform: translateX(-50%);
        opacity: 0.6;
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
    display: inline-flex;
    color: $primaryBacColor;
    filter: brightness(2);
    position: relative;
    will-change: transform;


    .carousel {
        // max-width: 1905px;
        // padding-top: calc(530px + 1rem);
        display: flex;
        justify-content: center;
        margin-bottom: 10%;

        .content {
            @include flex-center-center;
            width: calc(100vw - 15px);
            // width: 1905px;
            align-self: flex-end;

            .point {
                @include WnH(8px);
                border-radius: 50%;
                background-color: white;
                position: absolute;
            }

            .cloneSouth {
                top: calc(435px);
                left: calc(870px + 100%);
            }

            .north {
                top: calc(114px);
                left: calc(1012px + 200%);
            }

            .central {
                top: calc(236px);
                left: calc(910px + 300%);
            }

            .south {
                top: calc(435px);
                left: calc(870px + 400%);
            }

            .cloneNorth {
                top: calc(114px);
                left: calc(1012px + 500%);
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
                width: 360px;
                flex-direction: column;

                h1 {
                    font-size: 4rem;
                    font-variation-settings: 'wght' 500;
                    letter-spacing: 0.5rem;
                }

                &>div {
                    @include flex-center-center;
                    align-self: flex-end;
                    margin-right: 0.5rem;
                    font-size: 1.5rem;
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
            }

            @keyframes branchAnimation {
                from {
                    opacity: 0;
                }

                to {
                    opacity: 1;
                }
            }

            .position {
                @include flex-center-center;
                gap: 0.25rem;
                position: absolute;
                bottom: 10%;
                // left: 115%;
                text-wrap: nowrap;
                line-height: 36px;
                padding: .25rem .5rem;
            }
        }
    }

    .dragging {
        transition: none !important;
    }

    // 北
    // 25.047893811483274,
    // 121.51709051510576 top: calc(114px);
    // left: calc(1012px);
    // x 209 y 32

    // 中 24.137131307709268,
    // 120.68668906182916 top: calc(236px);
    // left: calc(910px);
    // x 107 y 154

    // 南 22.639888449163326,
    // 120.30226114031127 top: calc(435px);
    // left: calc(863px);
    // x 60 y 352
}

.mask {
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 50%;
    transform: translateX(-50%);
}
</style>