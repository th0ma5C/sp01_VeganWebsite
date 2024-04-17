import { ref, computed, inject, nextTick, onMounted, onUnmounted, onUpdated } from "vue";
import type { Ref, ComponentPublicInstance } from 'vue';
import throttle from 'lodash/throttle';

interface SwiperItem {
    title: string,
}
// 參數: transition-group的ref、swiper數據、間隔時間
export function useSwiper(elementRef: Ref<ComponentPublicInstance | null>, swiper: SwiperItem[], intervalTime: number) {
    let nanoid = inject('nanoid') as (n: number) => string,
        clicking = true,
        interval: (number | null | NodeJS.Timeout) = null,
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
        divWidth: number,
        breakPoint = 0,
        translateX = ref(0);

    const swiperStyle = computed(() => ({
        left: '-200%',
        transform: `translateX(${translateX.value}px)`,
    }))

    function resize() {
        // if (elementRef.value) {
        divWidth = elementRef.value?.$el.clientWidth;
        // }
    }

    function down(e: MouseEvent) {
        e.preventDefault();
        stopPlay();
        isDown.value = true;
        breakPoint = 0;

        eventListener(window, 'add', dragEvents);
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
            throttleChangeSwiper(1);
            translateX.value = 0;
        } else if (breakPoint > (divWidth / 5)) {
            throttleChangeSwiper(0);
            translateX.value = 0;
        } else {
            translateX.value = 0;
        }

        // console.log(divWidth);
        startPlay();
        eventListener(window, 'remove', dragEvents);
    }

    /**------事件監聽------ */
    /** events的類型解決
     *  1. 將事件處理函數的類型定義為 Function 並在調用時使用類型斷言 handler as (e: Event) => void，可以解決類型不匹配的問題，因為你通過將 handler 定義為一個泛型的 Function
     *  2. 透過將事件處理函數的類型參數化，並在 EventInfo 介面中使用泛型 <T extends Event> 來限定 handler 函數接收特定類型的事件對象
        
        interface EventInfo {
         event: string;
         handler: Function;
        }
 
        function eventListener(element: Window | Document | HTMLElement, action: 'add' | 'remove', events: EventInfo[]) {
            if (action == 'add') {
                events.forEach(({ event, handler }) => {
                    element.addEventListener(event, handler as (e: Event) => void);
                });
            } else {
                events.forEach(({ event, handler }) => {
                    element.removeEventListener(event, handler as (e: Event) => void);
                });
            }
        }
    */

    interface EventInfo<T extends Event> {
        event: string;
        handler: (e: T) => void;
    }

    function eventListener<T extends Event>(element: Window | Document | HTMLElement, action: 'add' | 'remove', events: EventInfo<T>[]) {
        if (action == 'add') {
            events.forEach(({ event, handler }) => {
                element.addEventListener(event, handler as (e: Event) => void);
            });
        } else {
            events.forEach(({ event, handler }) => {
                element.removeEventListener(event, handler as (e: Event) => void);
            });
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
        ];


    /**------生命週期鉤子------ */

    onMounted(() => {
        const el = elementRef.value?.$el;

        eventListener(el, 'add', domEvents);
        eventListener(window, 'add', windowEvents);

        startPlay();
    })

    onUpdated(() => {
        resize();
    })

    onUnmounted(() => {
        const el = elementRef.value?.$el;

        eventListener(el, 'remove', domEvents);
        eventListener(window, 'remove', windowEvents);

        stopPlay();
    })

    return { throttleChangeSwiper, showSwiper, isDown, swiperStyle };
}