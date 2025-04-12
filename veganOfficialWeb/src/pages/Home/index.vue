<template>
    <div class="home">
        <div class="banner" ref="bannerRef">
            <Marquee></Marquee>
            <MainBanner></MainBanner>
            <SubBanner></SubBanner>
        </div>
        <div>
            <Catalog></Catalog>
        </div>
        <div class="location relative">
            <Location></Location>
        </div>
        <div>
            <Concept ref="conceptRef"></Concept>
        </div>
        <div class="hiring" ref="hiringRef">
            <Hiring></Hiring>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import Marquee from './Banner/Marquee.vue';
import MainBanner from './Banner/MainBanner.vue';
import SubBanner from './Banner/SubBanner.vue';
import Catalog from './Catalog/Catalog.vue';
import Location from './Location/Location.vue';
import Concept from './Concept/Concept.vue';
import Hiring from './Hiring/Hiring.vue';

// const Marquee = defineAsyncComponent(() => import('./Banner/Marquee.vue'));
// const MainBanner = defineAsyncComponent(() => import('./Banner/MainBanner.vue'));
// const SubBanner = defineAsyncComponent(() => import('./Banner/SubBanner.vue'));
// const Catalog = defineAsyncComponent(() => import('./Catalog/Catalog.vue'));
// const Location = defineAsyncComponent(() => import('./Location/Location.vue'));
// const Concept = defineAsyncComponent(() => import('./Concept/Concept.vue'));
// const Hiring = defineAsyncComponent(() => import('./Hiring/Hiring.vue'));
</script>

<style scoped lang="scss">
.banner {
    overflow: hidden;

    &,
    &~div {
        overflow: hidden;
    }
}

.location {}

.hiring {
    // @include flex-center-center;
}
</style>
