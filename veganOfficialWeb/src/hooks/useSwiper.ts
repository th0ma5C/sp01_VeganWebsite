import { ref, computed, inject, nextTick, onMounted, onUnmounted, onUpdated } from "vue";
import type { ShallowRef } from 'vue';
import { throttle } from 'lodash-es';
import useListener from './useListener';

interface SwiperItem {
    title: string,
}
// 參數: transition-group的ref、swiper數據、間隔時間
export function useSwiper(elementRef: Readonly<ShallowRef<HTMLDivElement | null>>, swiper: SwiperItem[], intervalTime: number) {
    let nanoid = inject('nanoid') as (n: number) => string,
        clicking = true,
        interval: ReturnType<typeof setInterval> | null = null,
        i = swiper.length >= 2 ? swiper : [...swiper, ...swiper],
        headItem = swiper.slice(0, 2),
        footItem = swiper.slice(-2);

    let showSwiper = ref([...footItem, ...i, ...headItem].map(item => ({
        id: nanoid(3),
        ...item
    })))

    function changeSwiper(direction: 0 | 1) {
        if (clicking) {
            clicking = false;
            stopPlay();
            if (direction) {
                showSwiper.value.push(showSwiper.value.shift()!);
            } else {
                showSwiper.value.unshift(showSwiper.value.pop()!);
            }
            setTimeout(() => {
                clicking = true;
            }, 1000);
            startPlay();
        }
    }

    /**------自動輪播------ */
    function startPlay() {
        stopPlay();
        interval = setInterval(() => throttleChangeSwiper(1), intervalTime);
    }

    function stopPlay() {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
    }

    const throttleChangeSwiper = throttle(changeSwiper, 50);

    /**------拖曳------ */
    let isDown = ref(false),
        isDrag = ref(false),
        divWidth: number,
        breakPoint = 0,
        translateX = ref(0);

    const swiperStyle = computed(() => ({
        left: '-200%',
        transform: `translateX(${translateX.value}px)`,
    }))

    function resize() {
        if (!elementRef.value) return
        divWidth = elementRef.value.clientWidth;
    }

    function down(e: MouseEvent) {
        e.preventDefault();
        stopPlay();
        isDown.value = true;
        breakPoint = 0;

        useListener(window, 'add', dragEvents);
    }

    function move(e: MouseEvent) {
        if (!isDown.value) return;
        isDrag.value = true;
        translateX.value += e.movementX;
        breakPoint += e.movementX;
    }

    function up() {
        if (!isDown.value) return;
        isDown.value = false;
        isDrag.value = false;

        if (breakPoint < -(divWidth / 5)) {
            throttleChangeSwiper(1);
        } else if (breakPoint > (divWidth / 5)) {
            throttleChangeSwiper(0);
        }

        // elementRef.value?.ontransitionend(() => {
        translateX.value = 0;
        // })

        startPlay();
        useListener(window, 'remove', dragEvents);
    }

    // leave browser stop play
    function swiperOnblur() {
        if (document.hidden) {
            stopPlay();
        } else {
            startPlay();
        }
    }

    const dragEvents = [
        { event: 'mousemove', handler: move },
        { event: 'mouseup', handler: up },
    ],
        domEvents = [
            { event: 'mousedown', handler: down },
            { event: 'mouseover', handler: stopPlay },
            { event: 'mouseleave', handler: startPlay },
        ],
        windowEvents = [
            { event: 'resize', handler: resize },
            { event: 'visibilitychange', handler: swiperOnblur },
        ];


    /**------生命週期鉤子------ */

    onMounted(() => {
        const el = elementRef.value;
        if (!el) return
        useListener(el, 'add', domEvents);
        useListener(window, 'add', windowEvents);

        startPlay();
    })

    onUpdated(() => {
        resize();
    })

    onUnmounted(() => {
        const el = elementRef.value;
        if (!el) return
        useListener(el, 'remove', domEvents);
        useListener(window, 'remove', windowEvents);

        stopPlay();
    })

    return { throttleChangeSwiper, showSwiper, isDown, isDrag, swiperStyle };
}