import { ref, onMounted, onUnmounted } from "vue";
import type { Ref, ComponentPublicInstance } from 'vue';
import { useSwiperItem } from "./useSwiperItem";
import throttle from 'lodash/throttle';
import { nanoid } from 'nanoid';

interface SwiperItem {
    title: string,
}
// 參數: transition-group的ref、swiper數據、間隔時間
export function useSwiper(elementRef: Ref<ComponentPublicInstance | null>, swiper: SwiperItem[], intervalTime: number) {
    let clicking = true;
    let interval: (number | null) = null;
    let currentItem = 2;

    let body = swiper.length >= 2 ? swiper : [...swiper, ...swiper]
    let head = body.slice(0, 2);
    let tail = body.slice(-2);

    let showSwiper = ref([...tail, ...body, ...head].map(item => ({
        id: nanoid(3),
        ...item
    })))

    function changeSwiper(direction: 0 | 1) {
        if (clicking) {
            clicking = false;
            currentItem++;
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
    const { isDown, swiperStyle } = useSwiperItem(elementRef, currentItem, startPlay, stopPlay, throttleChangeSwiper)

    onMounted(() => {
        startPlay();
    })

    onUnmounted(() => {
        stopPlay();
    })

    return { throttleChangeSwiper, showSwiper, isDown, swiperStyle };
}