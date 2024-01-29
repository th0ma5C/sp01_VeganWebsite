<template>
    <div class="container">
        <InfoFooter></InfoFooter>
        <!-- <div class="hr"></div> -->
        <hr class="hr">
        <MainFooter></MainFooter>
        <div>footer LOGO</div>
    </div>
</template>

<script setup lang="ts">
import InfoFooter from './InfoFooter.vue';
import MainFooter from './MainFooter.vue';

</script>

<style lang="scss" scoped>
.container {
    position: relative;

    .hr {
        margin: 1rem;
        border: 1px solid rgba(120, 120, 120, 0.5);
    }
}
</style>