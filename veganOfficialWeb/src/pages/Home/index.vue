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


onMounted(() => {
});

onUnmounted(() => {
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
