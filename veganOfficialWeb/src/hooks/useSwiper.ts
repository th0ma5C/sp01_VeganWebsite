import { ref, onMounted, onUnmounted } from "vue";
import type { Ref, ComponentPublicInstance } from 'vue';
import { useDrag } from "./useDrag";
import throttle from 'lodash/throttle';

export function useSwiper(elementRef: Ref<ComponentPublicInstance | null>, swiper: Ref, intervalTime: number) {
    let clicking = true;
    let interval: (number | null) = null;
    let swiperCount = swiper.value.length;
    let currentItem = (Math.floor((swiperCount) / 2));

    function changeSwiper(direction: 0 | 1) {
        if (clicking) {
            clicking = false;
            stopPlay();
            if (direction) {
                swiper.value.push(swiper.value.shift()!);
                // if (currentItem < swiperCount) {
                //     currentItem++;
                // } else {
                //     currentItem = 0;
                // }
            } else {
                swiper.value.unshift(swiper.value.pop()!);
                // if (currentItem > 0) {
                //     currentItem--
                // } else {
                //     currentItem = swiperCount - 1;
                // }

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

    const throttleChangeSwiper = throttle(changeSwiper, 50);
    const { isDown, swiperStyle } = useDrag(elementRef, currentItem, startPlay, stopPlay, throttleChangeSwiper)

    onMounted(() => {
        startPlay();
    })

    onUnmounted(() => {
        stopPlay();
    })

    return { changeSwiper, throttleChangeSwiper, currentItem, isDown, swiperStyle };
}