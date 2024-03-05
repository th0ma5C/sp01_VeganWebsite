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
    let currentItem = ref(0);
    let swiperCount = swiper.length

    let i = swiper.length >= 2 ? swiper : [...swiper, ...swiper]

    let showSwiper = ref([...i, ...i, ...i].map(item => ({
        id: nanoid(3),
        ...item
    })))

    function changeSwiper(direction: 0 | 1) {
        if (clicking) {
            clicking = false;
            currentItem.value == swiperCount ? currentItem.value = 0 : currentItem.value++;
            // console.log(currentItem.value);
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
    const { isDown, swiperStyle, changeItem } = useSwiperItem(elementRef, currentItem, swiperCount, startPlay, stopPlay, throttleChangeSwiper)

    onMounted(() => {
        startPlay();
    })

    onUnmounted(() => {
        stopPlay();
    })

    return { throttleChangeSwiper, showSwiper, isDown, swiperStyle, changeItem };
}