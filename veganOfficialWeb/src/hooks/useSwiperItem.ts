// hooks/useDrag.ts
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Ref, ComponentPublicInstance } from 'vue';

export function useSwiperItem(elementRef: Ref<ComponentPublicInstance | null>, currentItem: Ref<number>, swiperCount: number, startPlay: () => void, stopPlay: () => void, throttleChangeSwiper: (direction: 0 | 1) => void) {
    let isDown = ref(false);
    let divWidth: number;
    let breakPoint = 0;
    let translateX = ref(0);


    /**
     * TODO: 正在播放的圖片圓點高亮
     *  ? currentItem如何隨自動輪播+1
     *      因使用computed style，導致換頁衝突
     * !換頁邏輯修改
     *  ? 移入時拿到currentItem
     * 
     *  ? 分頁器原點不會停止動畫
     * 
     * 0305
     *  完成:移入時停止動畫、集中事件監聽器
     *  待讀:接口、泛型
    */

    let left = computed(() => (currentItem.value + 2) * 100);

    const swiperStyle = computed(() => ({
        left: `${-(swiperCount * 100)}%`,
        transform: `translateX(${translateX.value}px)`,
    }))

    function changeItem(index: number) {
        console.log(index, currentItem.value);
        // if (index == currentItem.value) return;
        // let dis = index - currentItem.value;
        // swiperStyle.value.left = `${-(swiperCount + (dis * 100))}%`
    }

    function resize() {
        // if (elementRef.value) {
        divWidth = elementRef.value?.$el.clientWidth;
        // }
        console.log(divWidth);
    }

    function down(e: MouseEvent) {
        e.preventDefault();
        stopPlay();
        isDown.value = true;
        breakPoint = 0;

        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
    }

    function move(e: MouseEvent) {
        if (!isDown.value) return;
        translateX.value += e.movementX;
        breakPoint += e.movementX;
    }

    function up() {
        if (!isDown.value) return;
        isDown.value = false;

        window.removeEventListener('mousemove', move);
        window.removeEventListener('mouseup', up);

        if (breakPoint < -(divWidth / 5)) {
            throttleChangeSwiper(1);
            translateX.value = 0;
        } else if (breakPoint > (divWidth / 5)) {
            throttleChangeSwiper(0);
            translateX.value = 0;
        } else {
            translateX.value = 0;
        }
        startPlay();
    }

    /**
     * *events的類型解決
     *  1. 透過將事件處理函數的類型參數化，並在 EventInfo 介面中使用泛型 <T extends Event> 來限定 handler 函數接收特定類型的事件對象
     *  2. 將事件處理函數的類型定義為 Function 並在調用時使用類型斷言 handler as (e: Event) => void，可以解決類型不匹配的問題，因為你通過將 handler 定義為一個泛型的 Function
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
    /*     interface EventInfo {
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
        } */

    const domEvents = [
        { event: 'mousedown', handler: down },
        { event: 'mouseover', handler: stopPlay },
        { event: 'mouseleave', handler: startPlay },
    ]
    const windowEvents = [
        { event: 'resize', handler: resize },
    ]

    onMounted(() => {
        const el = elementRef.value?.$el;

        eventListener(el, 'add', domEvents);
        eventListener(window, 'add', windowEvents);
    })

    onUnmounted(() => {
        const el = elementRef.value?.$el;

        eventListener(el, 'remove', domEvents);
        eventListener(window, 'remove', windowEvents);
    })

    return { isDown, swiperStyle, changeItem };
}
