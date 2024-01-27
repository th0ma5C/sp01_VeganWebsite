<template>
    <div class="container">
        <InfoFooter></InfoFooter>
        <div class="hr"></div>
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
    @include main-part;
    position: relative;

    .hr {
        position: absolute;
        left: 0;
        width: 100%;
        height: 0px;
        margin: 1rem;
        border: 1px solid rgba(120, 120, 120, 0.5);
    }
}
</style>