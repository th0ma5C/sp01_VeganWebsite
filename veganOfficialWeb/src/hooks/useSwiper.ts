import { ref, onMounted, onUnmounted } from "vue";
import type { Ref, ComponentPublicInstance } from 'vue';
import { useDrag } from "./useDrag";
import throttle from 'lodash/throttle';

export function useSwiper(elementRef: Ref<ComponentPublicInstance | null>, swiper: Ref, intervalTime: number) {
    let clicking = true;
    let interval: (number | null) = null;
    let swiperCount = ref(swiper.value.length);

    function changeSwiper(direction: 0 | 1) {
        if (clicking) {
            clicking = false;
            stopPlay();
            if (direction) {
                swiper.value.push(swiper.value.shift()!);
            } else {
                swiper.value.unshift(swiper.value.pop()!);
            }
            setTimeout(() => {
                clicking = true;
            }, 1000);
            startPlay();
        }
    }

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

    const throttleChangeSwiper = throttle(changeSwiper, 1000);
    const { isDown, swiperStyle } = useDrag(elementRef, swiperCount, startPlay, stopPlay, throttleChangeSwiper)

    onMounted(() => {
        startPlay();
    })

    onUnmounted(() => {
        stopPlay();
    })

    return { throttleChangeSwiper, isDown, swiperStyle };
}