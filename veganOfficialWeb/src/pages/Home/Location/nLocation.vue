<template>
    <div class="container relative" :style="[bgSize]"
        @mousedown="down($event)">

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
                    <!-- <button @click="changeSwiper(1)">test{{
                        index }}</button> -->
                    <div class="branchName">
                        <p>{{ item.position }}</p>
                        <h1>{{ item.branch }}</h1>
                        <div>
                            <a @mouseenter="setIconClass($event)"
                                @mouseleave="setIconClass($event)">
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
            <!-- <div class="content">
                <div class="point"></div>
                <div class="branchName">
                    <p>北部分店</p>
                    <h1>台北車站店</h1>
                    <div>
                        <a @mouseenter="setIconClass($event)"
                            @mouseleave="setIconClass($event)">
                            查看地圖
                        </a>
                        <SvgIcon name="LocationArrow"
                            width="24" height="24"
                            :class="iconClass">
                        </SvgIcon>
                    </div>
                </div>
                <div class="position">
                    <SvgIcon name="Location" color="white"
                        width="24" height="24">
                    </SvgIcon>
                    <p>Zhongzheng Dist., Taipei City</p>
                </div>
            </div> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, watch, onMounted, onUnmounted, nextTick, ref, computed, onUpdated } from 'vue';
import type { Ref } from 'vue';
import useListener from '@/hooks/useListener'


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
    height: `${bg.height}px`
}))
function bgScroll() {
    if (bg.width == 1905 || ticking) return;
    scrollY.value = window.scrollY;
}

// location swiper
/**
 * todo: 最後一張閃爍、連點防斗
 */
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
    branchStyle = computed(() => ({
        transform: `translateX(calc(-${count.value * 100}% + ${translateX.value}px))`,
        transition: `${transition.value}`
    }));

let frontTag = branchList.slice(0, 1), rearTag = branchList.slice(-1),
    showList = ref([...rearTag, ...branchList, ...frontTag])

function changeSwiper(direction: -1 | 1) {
    // if(count == branchList.value.length)
    count.value += direction;
    // translateX.value -= (direction * 1905);
    transition.value = 'transform 1s ease';
}
function cloneList() {
    if (count.value == (showList.value.length - 1)) {
        console.log(1);
        transition.value = 'transform 0s';
        count.value = 1;
    } else if (count.value == 0) {
        console.log(2);
        transition.value = 'transform 0s';
        count.value = showList.value.length - 2;
    }
    nextTick(() => {
        transition.value = 'transform 0s ease';
    })
}

function resize() {
    if (wrapper.value) {
        divWidth = wrapper.value.clientWidth;
    }
}
function down(e: MouseEvent) {
    e.preventDefault();
    isDown.value = true;
    breakPoint = 0;

    useListener(window, 'add', events.drag);
}

function move(e: MouseEvent) {
    if (!isDown.value) return;
    translateX.value += e.movementX;
    breakPoint += e.movementX;
}

function up() {
    if (!isDown.value) return;
    isDown.value = false;

    if (breakPoint < -(divWidth / 5)) {
        changeSwiper(1);
        translateX.value = 0;
    } else if (breakPoint > (divWidth / 5)) {
        changeSwiper(-1);
        translateX.value = 0;
    } else {
        translateX.value = 0;
    }
    useListener(window, 'remove', events.drag);
}


//icon hover
let iconClass = ref('in');
let timers: (ReturnType<typeof setTimeout> | null)[] = [];

function debounce(target: Ref<string>) {
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

const setIconClass = debounce(iconClass);

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

onMounted(() => {
    scrollY.value = window.scrollY;
    useListener(window, 'add', events.scroll);
    useListener(window, 'add', events.window);
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
})

</script>

<style scoped lang="scss">
.container {
    background: url('@assets/img/Home/Location/shop.jpg') fixed no-repeat center/cover;
    transition: width 0.2s ease, height 0.2s ease;

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