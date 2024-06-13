<template>
    <div class="banner" ref="bannerRef">
        <Marquee></Marquee>
        <MainBanner></MainBanner>
        <SubBanner></SubBanner>
    </div>
    <div>
        <Catalog></Catalog>
    </div>
    <div class="location" ref="locationRef">
        <Location></Location>
    </div>
    <div>
        <Concept></Concept>
    </div>
    <div class="hiring" ref="hiringRef">
        <Hiring></Hiring>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Marquee from './Banner/Marquee.vue';
import MainBanner from './Banner/MainBanner.vue';
import SubBanner from './Banner/SubBanner.vue';
import Catalog from './Catalog/Catalog.vue';
import Location from './Location/Location.vue';
import Concept from './Concept/Concept.vue';
import Hiring from './Hiring/Hiring.vue';

// const bannerRef = ref(null);
// const locationRef = ref(null);
// const hiringRef = ref(null);

// let observer: IntersectionObserver | null;
// let spot: number;
// let active = false;

// const observerCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
//     entries.forEach(entry => {
//         console.log(entry, 'observer');
//         // console.log(`${entry.target.className} is ${entry.isIntersecting ? 'inside' : 'outside'} the viewport with offset: ${entry.boundingClientRect.top}`);
//         if (entry.isIntersecting) {
//             console.log('觸發');
//             window.addEventListener('scroll', () => {
//                 if (active) return;
//                 spot = entry.target.getBoundingClientRect().top;
//                 if (spot < 100) {
//                     console.log('object');
//                     window.scrollTo({
//                         top: entry.target.offsetTop,
//                         behavior: "smooth",
//                     })
//                     active = true;
//                 }
//             })
//         }
//     });
// };

onMounted(() => {
    // observer = new IntersectionObserver(observerCallback, {
    //     root: null,
    //     // threshold: 0.1, // 触发回调的阈值
    //     rootMargin: "0px 0px 0px 0px" // 调整触发回调的时机，提早或延后
    // });

    // if (locationRef.value) observer.observe(locationRef.value);
});

onUnmounted(() => {
    // if (observer) {
    //     if (locationRef.value) observer.unobserve(locationRef.value);
    // }
});
</script>

<style scoped lang="scss">
.banner {
    overflow: hidden;
    min-height: 1290px;

    &,
    &~div {
        overflow: hidden;
    }
}

.location {
    @include flex-center-center;
    scroll-snap-align: start;
}

.hiring {
    @include flex-center-center;
}
</style>
