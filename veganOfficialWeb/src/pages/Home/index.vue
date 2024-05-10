<template>
    <div class="banner">
        <Marquee></Marquee>
        <MainBanner></MainBanner>
        <SubBanner></SubBanner>
    </div>
    <div>
        <Catalog></Catalog>
    </div>
    <div>
        <Location></Location>
    </div>
    <div>
        <Concept></Concept>
    </div>
    <div class="hiring">
        <Hiring></Hiring>
    </div>
</template>

<script setup lang="ts">
import Marquee from './Banner/Marquee.vue';
import MainBanner from './Banner/MainBanner.vue';
import SubBanner from './Banner/SubBanner.vue';
import Catalog from './Catalog/Catalog.vue';
import Location from './Location/Location.vue';
import Concept from './Concept/Concept.vue'
import Hiring from './Hiring/Hiring.vue'

</script>

<style scoped lang="scss">
.banner {
    min-height: 1290PX;

    &,
    &~div {
        margin-bottom: 2rem;
    }
}

.hiring {
    @include flex-center-center;
}
</style>