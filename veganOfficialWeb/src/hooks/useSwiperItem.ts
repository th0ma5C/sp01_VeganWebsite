// hooks/useDrag.ts
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Ref, ComponentPublicInstance } from 'vue';

export function useSwiperItem(elementRef: Ref<ComponentPublicInstance | null>, currentItem: Ref<number>, startPlay: () => void, stopPlay: () => void, throttleChangeSwiper: (direction: 0 | 1) => void) {
    let isDown = ref(false);
    let divWidth: number;
    let breakPoint = 0;
    let translateX = ref(0);


    /**
     * TODO: 正在播放的圖片圓點高亮、集中事件監聽器
     * ? currentItem如何隨自動輪播+1
     *      因使用computed style，導致換頁衝突
     * ? 移入時拿到currentItem
     * 
     * ? 移入時停止動畫
     */

    let left = computed(() => (currentItem.value + 2) * 100);

    const swiperStyle = {
        left: '-200%',
        transform: `translateX(${translateX.value}px)`,
    }

    function changeItem(index: number) {
        if (currentItem) {

        }
        else if (index == currentItem) return
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

    function up(e: MouseEvent) {
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
     * ! events的類型待解決
     */
    function eventListener(element: Window | Document | HTMLElement, action: string, events) {
        if (action == 'add') {
            events.forEach(({ event, handler }) => {
                element.addEventListener(event, handler);
            });
        } else {
            events.forEach(({ event, handler }) => {
                element.removeEventListener(event, handler);
            });
        }
    }

    const domEvents = [
        { event: 'mousedown', handler: down },
        { event: 'mouseenter', handler: stopPlay },
        { event: 'mouseleave', handler: startPlay },
        { event: 'resize', handler: resize },
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

    return { isDown, swiperStyle };
}
