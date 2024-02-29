// hooks/useDrag.ts
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Ref, ComponentPublicInstance } from 'vue';

// 參數: transition-group之ref、swiper個數、開始及停止播放、換頁功能
export function useDrag(elementRef: Ref<ComponentPublicInstance | null>, currentItem: number, startPlay: () => void, stopPlay: () => void, throttleChangeSwiper: (direction: 0 | 1) => void) {
    let isDown = ref(false);
    let divWidth: number;
    let breakPoint = 0;
    let translateX = ref(0);
    let left = computed(() => currentItem * 100)

    const swiperStyle = computed(() => ({
        left: `-${left.value}%`,
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

    onMounted(() => {
        resize();
        elementRef.value?.$el.addEventListener('mousedown', down);
        window.addEventListener('resize', resize);
    })

    onUnmounted(() => {
        elementRef.value?.$el.removeEventListener('mousedown', down);
        window.removeEventListener('resize', resize);
    })

    return { isDown, swiperStyle };
}
