<template>
    <div class="container">
        <div class="content"
            @mouseenter="debounce(imgClass, 'zoomOut')"
            @mouseleave="">
            <button @mouseover="" @mouseout="">查看地圖</button>
            <h2>找到我們</h2>
            <SvgIcon :name="'Location'" width="48"
                height="48" color="#FCFAF2"
                :class="iconClass">
            </SvgIcon>
        </div>
        <img src="@assets/img/Home/Location/shop.jpg" alt=""
            :class="imgClass">
    </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import type { Ref } from 'vue';

/**
 * todo:mainBanner圖片在大解析度時width不自然
 * todo:限制動畫播放
 * 
 * *0430: 基本結構、css *0502: icon動畫 背景動畫
 */
// let iconClass = ref('in');
// let timer: ReturnType<typeof setTimeout> | null;
// function debounce(n: string) {
//     if (!timer) {
//         iconClass.value = n;
//         timer = setTimeout(() => {
//             timer = null;
//         }, 500)
//         return
//     }
//     clearTimeout(timer);
//     timer = setTimeout(() => {
//         iconClass.value = n;
//         timer = null;
//     }, 500)
// }
// let imgClass = ref('');
// let lastRan: number;
// let lastFunc: ReturnType<typeof setTimeout> | null;
// function throttle(n: string = '') {
//     if (!lastFunc) {
//         imgClass.value = n;
//         lastRan = Date.now();
//         lastFunc = setTimeout(() => {
//             lastFunc = null;
//         }, 500)
//         return
//     }
//     clearTimeout(lastFunc);
//     lastFunc = setTimeout(() => {
//         if ((Date.now() - lastRan) >= 500) {
//             imgClass.value = n;
//             lastRan = Date.now();
//             lastFunc = null;
//         }
//     }, 500 - (Date.now() - lastRan))
// }
let iconClass = ref('out'), imgClass = ref('');
function debounce(target: Ref<string>, value: string) {
    let timer: ReturnType<typeof setTimeout> | null;
    return function () {
        if (!timer) {
            target.value = value
            timer = setTimeout(() => {
                timer = null;
            }, 500);
            return
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
            target.value = value
            timer = null;
        }, 500);
    }
}

function clearTimers(...timers: (ReturnType<typeof setTimeout> | null)[]) {
    timers.forEach(item => {
        if (item) {
            clearTimeout(item);
            console.log(item);
        }
    })
}

onUnmounted(() => {
    // clearTimers(timer, lastFunc)
})
</script>

<style scoped lang="scss">
.container {
    @include flex-center-center;
    @include main-part;
    overflow: hidden;
    position: relative;

    .content {
        @include flex-center-center;
        flex-direction: column-reverse;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin-top: 1.5rem;
        z-index: 1;

        &:hover~img {
            // transform: scale(1);
        }

        @keyframes flyOut {
            to {
                opacity: 0;
                transform: translate(100%, -100%);
            }
        }

        @keyframes flyIn {
            from {
                opacity: 0;
                transform: translate(-100%, 100%);
            }

            to {
                opacity: 1;
                transform: translate(0, 0);
            }
        }

        & .svgWrapper {
            transition: transform 0.5s ease;
            transform-origin: bottom left;
            // animation: flyIn 0.5s ease-out forwards;
        }

        .in {
            animation: flyIn 0.5s ease-out forwards;
        }

        .out {
            animation: flyOut 0.5s ease-in forwards;
        }

        h2 {
            color: $primeBacColor;
            font-size: 48px;
        }

        button {
            border: 1px solid $primeBacColor;
            border-radius: 8px;
            font-size: 24px;
            color: $primeBacColor;
            background-color: transparent;
            transition: background-color 0.25s ease-out, color 0.25s ease-out;

            &:hover {
                color: $secondBacColor;
                background-color: $primeBacColor;

                &~.svgWrapper {
                    // animation: flyOut 0.5s ease-in forwards;
                }
            }
        }

    }

    img {
        @include WnH(100%);
        filter: brightness(0.5);
        transform: scale(1.05);
        transition: transform 0.5s ease-out;
        z-index: 0;
    }

    .zoomOut {
        transform: scale(1);
    }
}
</style>