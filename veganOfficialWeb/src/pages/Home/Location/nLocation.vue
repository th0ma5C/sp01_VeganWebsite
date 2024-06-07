<template>
    <div class="container relative" ref="container"
        :style="[bgSize]" :class="{ 'grabbing': true }"
        @mousedown.prevent="down($event); dragClick = true"
        @mouseleave=" handleCursorStyle.show(); handleCursorStyle.opacity(1)"
        @mouseup="dragClick = false"
        @transitionend="cursorShow = false">
        <div class="cursor" ref="cursor"
            :style="cursorStyle" v-show="cursorShow"
            @animationend="handleCursorStyle.opacity(0)">
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
            :style="branchStyle" @transitionend="cloneList">
            <!-- <transition-group name="carousel" tag="div"
                class="carousel"> -->
            <div class="carousel"
                v-for="(item, index) in showList"
                :key="index">
                <div class="content">
                    <div class="point"
                        :class="pointClass(index)">
                    </div>
                    <div class="branchName">
                        <p>{{ item.position }}</p>
                        <h1>{{ item.branch }}</h1>
                        <div>
                            <a @mouseover="setIconClass($event)"
                                @mouseout="setIconClass($event)">
                                查看地圖
                            </a>
                            <SvgIcon name="LocationArrow"
                                width="24" height="24"
                                :class="iconClass">
                            </SvgIcon>
                        </div>
                    </div>
                    <div class="position"
                        :style="{ left: (index * 100 + 15) + '%' }">
                        <SvgIcon name="Location"
                            color="white" width="24"
                            height="24">
                        </SvgIcon>
                        <p>{{ item.addr }}</p>
                    </div>
                </div>
            </div>
            <!-- </transition-group> -->
        </div>
    </div>
</template>

<script setup lang="ts">
// TODO: 下一分店名靠前、淡化，是否一段時間取消動畫
/**
 * //cursor出現、消失動畫(淡化)
 * * 封裝游標跟隨
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
    cursor: dragClick.value ? 'grabbing' : 'grab'
}))
function bgScroll() {
    if (bg.width == 1905 || ticking) return;
    scrollY.value = window.scrollY;
}

// location swiper
let branchList = [
    {
        pointClass: '',
        position: '北部分店',
        branch: '台北車站店',
        addr: 'Zhongzheng Dist., Taipei City',
        bacUrl: ''
    },
    {
        pointClass: '',
        position: '中部分店',
        branch: '台中車站店',
        addr: 'Central Dist., Taichung City',
        bacUrl: ''
    },
    {
        pointClass: '',
        position: '南部分店',
        branch: '高雄車站店',
        addr: 'Sanmin Dist., Kaohsiung City',
        bacUrl: ''
    }
]

let pointClass = (index: number) => {
    return {
        cloneSouth: index == 0,
        north: index == 1,
        central: index == 2,
        south: index == 3,
        cloneNorth: index == 4,
    }
}

let count = ref(1), translateX = ref(0), transition = ref('transform 0s ease'),
    isDown = ref(false), wrapper = ref<HTMLDivElement | null>(),
    divWidth: number,
    breakPoint: number,
    dragClick = ref(false),
    branchStyle = computed(() => ({
        transform: `translateX(calc(-${count.value * 100}% + ${translateX.value}px))`,
        transition: `${transition.value}`
    }));

let frontTag = branchList.slice(0, 1), rearTag = branchList.slice(-1),
    showList = ref([...rearTag, ...branchList, ...frontTag])

function changeSwiper(direction: -1 | 1) {
    count.value += direction;
    transition.value = 'transform 1s ease';
}
function cloneList() {
    transition.value = 'transform 0s';
    if (count.value == (showList.value.length - 1)) {
        count.value = 1;
    } else if (count.value == 0) {
        count.value = showList.value.length - 2;
    }
    nextTick(() => {
        isDown.value = false;
    })
}

function resize() {
    if (wrapper.value) {
        divWidth = wrapper.value.clientWidth;
    }
}
let dragTimer: (number | null | NodeJS.Timeout);
function down(e: MouseEvent) {
    if (isDown.value) return;
    e.preventDefault();
    isDown.value = true;
    breakPoint = 0;
    if (dragTimer) {
        clearTimeout(dragTimer);
    }
    useListener(window, 'add', events.drag);
}

function move(e: MouseEvent) {
    translateX.value += e.movementX;
    breakPoint += e.movementX;
}

function up() {
    if (breakPoint < -(divWidth / 5)) {
        changeSwiper(1);
    } else if (breakPoint > (divWidth / 5)) {
        changeSwiper(-1);
    }
    translateX.value = 0;
    transition.value = 'transform 1s ease';
    dragTimer = setTimeout(() => {
        isDown.value = false;
    }, 1000);
    useListener(window, 'remove', events.drag);
}


//icon hover
let iconClass = ref('in');
let timers: (ReturnType<typeof setTimeout> | null)[] = [];

function hoverDebounce(target: Ref<string>) {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let timeStamp: number | null = null;
    return function (e: MouseEvent) {
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
    if (enable.value == false) return
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
            flex: none;

            .point {
                @include WnH(8px);
                border-radius: 50%;
                background-color: white;
                position: absolute;
            }

            .north {
                top: calc(114px);
                left: calc(1012px + 100%);
            }

            .cloneNorth {
                top: calc(114px);
                left: calc(1012px + 400%);
            }

            .central {
                top: calc(236px);
                left: calc(910px + 200%);
            }

            .south {
                top: calc(435px);
                left: calc(870px + 300%);
            }

            .cloneSouth {
                top: calc(435px);
                left: calc(870px);
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
                }
            }

            .position {
                @include flex-center-center;
                gap: 0.25rem;
                position: absolute;
                bottom: 5%;
                // left: 15%;
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