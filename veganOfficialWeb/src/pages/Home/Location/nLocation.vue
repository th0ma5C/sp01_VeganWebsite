<template>
    <div class="container relative" :style="[bgSize]">
        <transition name="bgFilter">
            <div class="bgFilter absolute content-none"
                v-show="bg.width == 1905">
            </div>
        </transition>
        <div class="mainPart">
            <SvgIcon name="LocationTW"
                class="TW absolute top-1/2 left-1/2 -translate-x-1/2"
                width="" height="450" color="white">
            </SvgIcon>
            <div class="content">
                <div class="point"></div>
                <div class="branchName">
                    <p>北</p>
                    <h1>台北車站店</h1>
                    <div>
                        <p>Find us</p>
                        <button>箭頭</button>
                    </div>
                </div>
                <div class="position">
                    <SvgIcon name="Location" color="white"
                        width="24" height="24">
                    </SvgIcon>
                    <p>Zhongzheng Dist., Taipei City</p>
                </div>
            </div>
            <!-- <swiper-container>
                <swiper-slide></swiper-slide>
            </swiper-container> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, watch, onMounted, ref, computed } from 'vue';

let bg = reactive({
    width: 952,
    height: 460
})
let scrollY = ref();
let deltaY = ref(0);
let ticking = false;
watch(scrollY, (nVal, oVal = 0) => {
    if (bg.width == 1905 || ticking) return;
    deltaY.value = nVal - oVal;
    window.requestAnimationFrame(() => {
        ticking = false;
        if (scrollY.value >= 1400) {
            bg.width = Math.min(Math.max(bg.width + deltaY.value, 952), 1905);
            bg.height = Math.min(Math.max(bg.height + deltaY.value, 460), 920);
        }
    })
    ticking = true;
})
let bgSize = computed(() => ({
    width: `${bg.width}px`,
    height: `${bg.height}px`
}))

onMounted(() => {
    scrollY.value = window.scrollY;
    window.addEventListener('scroll', () => {
        if (bg.width == 1905 || ticking) return;
        scrollY.value = window.scrollY;
    })
    window.addEventListener('scroll', () => {
        // console.log(window.scrollY);
    })
})

</script>

<style scoped lang="scss">
.container {
    background: url('@assets/img/Home/Location/shop.jpg') fixed no-repeat center/cover;
    transition: width 0.2s ease, height 0.2s ease;

    .bgFilter {
        @include WnH(100%);
        background-color: rgba(0, 0, 0, 0.5);
    }

    .bgFilter-enter-active {
        transition: opacity 1s ease;
    }

    .bgFilter-enter-from {
        opacity: 0;
    }

    .bgFilter-enter-to {
        opacity: 1;
    }
}

.mainPart {
    @include flex-center-center;
    filter: brightness(2);
    color: $primaryBacColor;

    .TW {}

    .content {
        transform: translateY(538px);
    }

}
</style>