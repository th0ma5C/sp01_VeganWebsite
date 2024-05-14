<template>
    <div class="container">
        <section>
            <div class="textClip">NEWS</div>
            <div class="text"
                @mouseenter="setIconClass($event)"
                @mouseleave="setIconClass($event)">
                <a href="">
                    <h3>
                        最新消息
                        <SvgIcon :name="'ConceptArrow'"
                            width="18" height="18"
                            class="arrow"
                            :class="iconClass">
                        </SvgIcon>
                    </h3>
                    <p>最新消息、限時優惠、當季限量餐點和精彩活動都在這裡！</p>
                </a>
            </div>
        </section>
        <section>
            <div class="textClip">About Us</div>
            <div class="text"
                @mouseenter="setIcon2Class($event)"
                @mouseleave="setIcon2Class($event)">
                <a href="">
                    <h3>
                        關於我們
                        <SvgIcon :name="'ConceptArrow'"
                            width="18" height="18"
                            class="arrow"
                            :class="icon2Class">
                        </SvgIcon>
                    </h3>
                    <p>植物為本,綠色生活，探索我們對永續飲食文化的熱忱與願景。</p>
                </a>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import type { Ref } from 'vue';

let iconClass = ref('in'), icon2Class = ref('in');
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
            }, 200 - (Date.now() - timeStamp))
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
        }, 200 - (Date.now() - timeStamp));
        timers.push(timer);
    }
}

function determineClass(target: Ref<string>, type: string) {
    if (target === iconClass) {
        type === 'mouseenter' ? target.value = 'out' : target.value = 'in';
    } else {
        type === 'mouseenter' ? target.value = 'out' : target.value = 'in';
    }
}
const setIconClass = debounce(iconClass);
const setIcon2Class = debounce(icon2Class);

onUnmounted(() => {
    timers.forEach(timer => {
        if (timer) clearTimeout(timer);
    })
})


</script>

<style scoped lang="scss">
@font-face {
    font-family: 'MrDafoe';
    src: url('@assets/fonts/Mr_Dafoe/MrDafoe-Regular.woff2') format('woff2');
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

.container {
    @include main-part;
    @include flex-center-center;
    height: 840px;
    margin-top: 4rem;
    gap: 3%;

    section {
        @include flex-center-center;
        flex-direction: column;
        position: relative;
        width: 48.5%;

        .textClip {
            @include WnH(100%, 80%);
            // min-width: 612px;
            // min-height: 408px;
            background: url('@assets/img/Home/Concept/fruit.jpg') center / cover no-repeat;
            background-clip: text;
            font-family: 'MrDafoe', 'NotoSans';
            color: transparent;
            font-size: 170px;
            text-align: center;
            line-height: 408px;
            transition: font-size 0.2s ease-out;

            &::before {
                @include WnH(100%, 80%);
                // min-width: 612px;
                max-height: 408px;
                content: '';
                position: absolute;
                left: 0;
                background: linear-gradient(152deg,
                        hsla(72, 67%, 57%, 0.1) 25%, hsla(9, 94%, 45%, 0.1) 80%);
                border-radius: 0.5rem;
                // z-index: 1;
            }
        }

        &:hover {
            .textClip {
                font-size: 150px;
            }
        }

        .text {
            @include flex-center-center;
            background-color: $primaryBacColor;
            cursor: pointer;
            // width: 100%;

            h3 {
                display: inline-flex;
                align-items: center;
                overflow: hidden;

                .arrow {
                    margin-left: 0.25rem;
                }

                .in {
                    animation: flyIn 0.2s ease-out forwards;
                }

                .out {
                    animation: flyOut 0.2s ease-in forwards;
                }
            }
        }
    }

}
</style>