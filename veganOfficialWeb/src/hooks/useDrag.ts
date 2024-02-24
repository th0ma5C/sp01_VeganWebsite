// hooks/useDrag.ts
import { ref, onMounted, onUnmounted } from 'vue';
import type { Ref, ComponentPublicInstance } from 'vue'

export function useDrag(elementRef: Ref<ComponentPublicInstance | null>, startPlay: () => void, stopPlay: () => void, throttleChangeSwiper: (direction: number) => void) {
    let isDown = ref(false);
    let translateX = ref(0);
    let divWidth: number;
    let breakPoint = 0;

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

    onMounted(() => {
        resize();
        elementRef.value?.$el.addEventListener('mousedown', down);
        window.addEventListener('resize', resize);
    })

    onUnmounted(() => {
        elementRef.value?.$el.removeEventListener('mousedown', down);
        window.removeEventListener('resize', resize);
    })

    return { isDown, down, translateX };
}
