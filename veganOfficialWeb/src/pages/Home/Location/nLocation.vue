<template>
    <div class="container relative" ref="container"
        :style="[bgSize]"
        @mousedown.prevent="down($event); dragClick = 'grabbing'"
        @mouseleave=" handleCursorStyle.show(); handleCursorStyle.opacity(1);"
        @mouseup="dragClick = 'grab'">
        <div class="cursor" ref="cursor"
            :style="cursorStyle" v-show="cursorShow"
            @animationend="handleCursorStyle.opacity(0)"
            @transitionend="cursorShow = false;">
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
                v-show="bg.width == 1905">
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
                        ref="branchNames"
                        :style="branchNameStyle"
                        :class="branchNameClass[index]">
                        <p>{{ item.position }}</p>
                        <h1>{{ item.branch }}</h1>
                        <div>
                            <a @mouseenter="setIconClass($event);"
                                @mouseleave="setIconClass($event);">
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

// TODO: 下一分店名靠前、淡化
/**
 * //無法點按鈕(pointer-event or z-index)
 * //cursor出現、消失動畫(淡化)
 * //左下字用切換顯示
 * doing: 前一張、下一張樣式
 * * 頭尾兩張clone時會閃爍，不時出現，原因未知
 * ? 整體代碼優化
 * ? 封裝游標跟隨
 * ? 游標跟隨可以e不用requestAnimationFrame
 */




import { reactive, watch, onMounted, onUnmounted, nextTick, ref, computed, onUpdated, watchEffect } from 'vue';
import type { Ref } from 'vue';
import debounce from 'lodash/debounce';
import useListener from '@/hooks/useListener';


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
    height: `${bg.height}px`,
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
            case 0:
                return 'cloneSouth';
            case 1:
                return 'north';
            case 2:
                return 'central';
            case 3:
                return 'south';
            case 4:
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

let count = ref(1), translateX = ref(0), transition = ref('transform 0s ease'),
    isDown = ref(false), wrapper = ref<HTMLDivElement | null>(),
    divWidth: number,
    breakPoint: number,
    dragClick = ref('grab'),
    branchStyle = computed(() => ({
        transform: `translateX(calc(-${count.value * 100}% + ${translateX.value}px))`,
        transition: `${transition.value}`
    }));

let frontTag = branchList.slice(0, 1), rearTag = branchList.slice(-1),
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
    if (count.value == (showList.value.length - 1)) {
        count.value = 1;
    } else if (count.value == 0) {
        count.value = showList.value.length - 2;
    }
    delaySpeed.value = 0.15;
    isDown.value = false;
}

function resize() {
    if (wrapper.value) {
        divWidth = wrapper.value.clientWidth;
    }
}
// let dragTimer: (number | null | NodeJS.Timeout);
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
let branchX = ref(0)
let branchNameStyle = computed(() => {
    //   
    return {
        // transform: `translateX(calc(${translateX.value * -0.5}px))`,
        // transition: `${transition.value}`
    }
})
let branchNameClass = computed(() => {
    return showList.value.map((_, index) => {
        switch (index) {
            case count.value - 1:
                return 'prevBranch';
            case count.value:
                return 'currBranch';
            case count.value + 1:
                return 'nextBranch';
            default:
                return '';
        }
    })
})

//icon hover
let iconClass = ref('in');
let timers: (ReturnType<typeof setTimeout> | null)[] = [];

function hoverDebounce(target: Ref<string>) {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let timeStamp: number | null = null;
    return function (e: MouseEvent) {
        e.type === 'mouseenter' ? dragClick.value = 'pointer' : dragClick.value = 'grab';
        if (!timeStamp) {
            timeStamp = Date.now();
            e.type === 'mouseenter' ? target.value = 'out' : target.value = 'in';
            timer = setTimeout(() => {
                timeStamp = null;
            }, 500 - (Date.now() - timeStamp))
            return
        }
        if (timer) {
            clearTimeout(timer);
            const index = timers.indexOf(timer);
            if (index !== -1) {
                timers.splice(index, 1);
            }
        }
        timeStamp = Date.now();
        timer = setTimeout(() => {
            e.type === 'mouseenter' ? target.value = 'out' : target.value = 'in';
            timeStamp = null;
        }, 500 - (Date.now() - timeStamp));
        timers.push(timer);
    }
}

const setIconClass = hoverDebounce(iconClass);

//游標跟隨
let container = ref(), cursor = ref();
let cursorX = ref<number | null>(null), cursorY = ref<number | null>(null);
let targetX = ref<number | null>(null), targetY = ref<number | null>(null);
let requestAnimationID: number | null = null;
let cursorShow = ref(false), enable = ref(false);
let cursorStyle = computed(() => ({
    transform: `translate3d(calc(${cursorX.value}px - 50%),calc(${cursorY.value}px - 62px), 0)`,
    opacity: cursorOpacity.value,
}))

let containerRect = null;
let cursorTimer: (number | null | NodeJS.Timeout) = null, cursorOpacity = ref(1)

watchEffect(() => {
    if (bg.width >= 1905) {
        enable.value = true
    }
})

let handleCursorStyle = (function () {

    function opacity(n: number) {
        cursorOpacity.value = n
    }
    function show() {
        cursorShow.value = false
    }
    return { opacity, show }
})();

function cursorPosition(e: MouseEvent) {
    if (!enable.value) return
    containerRect = container.value.getBoundingClientRect()
    const mouseX = e.clientX - containerRect.left
    const mouseY = e.clientY - containerRect.top
    if (mouseX >= 0 && mouseX <= containerRect.width &&
        mouseY >= 0 && mouseY <= containerRect.height) {
        cursorShow.value = true;
    } else {
        cursorOpacity.value = 1
        cursorShow.value = false;
    }
    targetY.value = e.clientY - containerRect.top;
    targetX.value = e.clientX - containerRect.left;
}

function animateCursor() {
    if (targetX.value !== null && targetY.value !== null) {
        if (cursorX.value === null) cursorX.value = targetX.value;
        if (cursorY.value === null) cursorY.value = targetY.value;

        const deltaX = targetX.value - cursorX.value;
        const deltaY = targetY.value - cursorY.value;

        cursorX.value += Math.round(deltaX * 0.3 * 10) / 10;
        cursorY.value += Math.round(deltaY * 0.3 * 10) / 10;
    }
    requestAnimationID = requestAnimationFrame(animateCursor);
}
function stopAnimation() {
    if (requestAnimationID) {
        cancelAnimationFrame(requestAnimationID);
        requestAnimationID = null;
    }
}

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
    cursor: [
        { event: 'mouseenter', handler: cursorPosition },
        { event: 'mousemove', handler: cursorPosition },
        { event: 'mouseover', handler: cursorPosition }
    ]
}

onMounted(() => {
    scrollY.value = window.scrollY;
    useListener(window, 'add', events.scroll);
    useListener(window, 'add', events.window);
    useListener(container.value, 'add', events.cursor)
    nextTick(() => {

    })

    requestAnimationID = requestAnimationFrame(animateCursor);
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
    stopAnimation();
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
    background: url('@assets/img/Home/Location/shop.jpg') fixed no-repeat center/cover;
    transition: width 0.2s ease, height 0.2s ease;
    cursor: grab;

    .cursor {
        @include WnH(100px);
        position: absolute;
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

    .TW {
        // padding-top: 5rem;
        position: absolute;
        top: 5rem;
        left: 50%;
        transform: translateX(-50%);
        opacity: 0.8;
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
    display: inline-flex;
    color: $primaryBacColor;
    filter: brightness(2);
    position: relative;
    will-change: transform;


    .carousel {
        max-width: 1905px;
        padding-top: calc(530px + 1rem);

        .content {
            @include flex-center-center;
            width: 1905px;
            // flex: none;

            .point {
                @include WnH(8px);
                border-radius: 50%;
                background-color: white;
                position: absolute;
            }

            .cloneSouth {
                top: calc(435px);
                left: calc(870px);
            }

            .north {
                top: calc(114px);
                left: calc(1012px + 100%);
            }

            .central {
                top: calc(236px);
                left: calc(910px + 200%);
            }

            .south {
                top: calc(435px);
                left: calc(870px + 300%);
            }

            .cloneNorth {
                top: calc(114px);
                left: calc(1012px + 400%);
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
                // position: absolute;
                // transition: transform 0.5s;

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
                }
            }

            // .prevBranch {
            //     transform: translateX(50vw)
            // }

            // .currBranch {
            //     transform: translateX(0)
            // }

            // .nextBranch {
            //     transform: translateX(-50vw)
            // }

            .position {
                @include flex-center-center;
                gap: 0.25rem;
                position: absolute;
                bottom: 5%;
                // left: 115%;
                text-wrap: nowrap
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
    // 中 24.137131307709268,
    // 120.68668906182916 top: calc(236px);
    // left: calc(910px);
    // 南 22.639888449163326,
    // 120.30226114031127 top: calc(435px);
    // left: calc(863px);
}
</style>