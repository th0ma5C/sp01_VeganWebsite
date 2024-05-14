<template>
    <div class="container" @mouseenter="setImgClass($event)"
        @mouseleave="setImgClass($event)">
        <div class="content">
            <button @mouseenter="setIconClass($event)"
                @mouseleave="setIconClass($event)">
                查看地圖
            </button>
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
 * 
 * *0430: 基本結構、css *0502: icon動畫 背景動畫
 * *0507: 動畫防抖
 */
let iconClass = ref('in'), imgClass = ref('');
let timers: (ReturnType<typeof setTimeout> | null)[] = [];
function debounce(target: Ref<string>) {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let timeStamp: number | null = null;
    return function (e: MouseEvent) {
        if (!timeStamp) {
            timeStamp = Date.now();
            determineClass(target, e.type);
            timer = setTimeout(() => {
                timeStamp = null;
            }, 500 - (Date.now() - timeStamp))
            return
        }
        if (timer) {
            clearTimeout(timer);
            const index = timers.indexOf(timer);
            if (index !== -1) {
                timers.splice(index, 1);
            }
        }
        timeStamp = Date.now();
        timer = setTimeout(() => {
            determineClass(target, e.type);
            timeStamp = null;
        }, 500 - (Date.now() - timeStamp));
        timers.push(timer);
    }
}

function determineClass(target: Ref<string>, type: string) {
    if (target === iconClass) {
        type === 'mouseenter' ? target.value = 'out' : target.value = 'in';
    } else {
        type === 'mouseenter' ? target.value = 'zoomOut' : target.value = '';
    }
}
const setIconClass = debounce(iconClass);
const setImgClass = debounce(imgClass);

onUnmounted(() => {
    timers.forEach(timer => {
        if (timer) clearTimeout(timer);
    })
})
</script>

<style scoped lang="scss">
.container {
    @include flex-center-center;
    @include main-part;
    margin-top: 80px;
    height: 920px;
    overflow: hidden;
    position: relative;
    border-radius: 1rem;

    .content {
        @include flex-center-center;
        flex-direction: column-reverse;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin-top: 1rem;
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
            color: $primaryBacColor;
            font-size: 48px;
        }

        button {
            border: 1px solid $primaryBacColor;
            border-radius: 8px;
            font-size: 24px;
            color: $primaryBacColor;
            background-color: transparent;
            transition: background-color 0.25s ease-out, color 0.25s ease-out;

            &:hover {
                color: $secondBacColor;
                background-color: $primaryBacColor;

                &~.svgWrapper {
                    // animation: flyOut 0.5s ease-in forwards;
                }
            }
        }

    }

    img {
        height: 100%;
        filter: brightness(0.5);
        transform: scale(1.1);
        transition: transform 0.5s ease-out;
        z-index: 0;
    }

    .zoomOut {
        transform: scale(1.2);
    }
}
</style>