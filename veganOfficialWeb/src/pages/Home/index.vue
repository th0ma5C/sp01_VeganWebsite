<template>
    <div class="banner">
        <Marquee></Marquee>
        <MainBanner></MainBanner>
        <SubBanner></SubBanner>
    </div>
    <div>
        <Catalog></Catalog>
    </div>
</template>

<script setup lang="ts">

import Marquee from './Banner/Marquee.vue';
import MainBanner from './Banner/MainBanner.vue';
import SubBanner from './Banner/SubBanner.vue';
import Catalog from './Catalog/Catalog.vue';

</script>

<style scoped lang="scss">
.banner {
    margin-bottom: 2rem;
}
</style>