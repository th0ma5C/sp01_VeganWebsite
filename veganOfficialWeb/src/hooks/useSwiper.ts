import { onMounted, onUnmounted } from "vue";
import type { Ref } from "vue";
import throttle from 'lodash/throttle';

export function useSwiper(swiper: Ref, intervalTime: number) {
    let clicking = true;

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
    const throttleChangeSwiper = throttle(changeSwiper, 1000);

    let interval: (number | null) = null;

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

    onMounted(() => {
        startPlay();
    })

    onUnmounted(() => {
        stopPlay();
    })

    return { throttleChangeSwiper, startPlay, stopPlay };
}