<template>
    <div class="container">
        <InfoFooter></InfoFooter>
        <!-- <div class="hr"></div> -->
        <hr class="hr">
        <MainFooter></MainFooter>
        <div class="footer-logo">
            Relation-Ship
        </div>
    </div>
</template>

<script setup lang="ts">
import InfoFooter from './InfoFooter.vue';
import MainFooter from './MainFooter.vue';

</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Mr+Dafoe&display=swap');

.container {
    position: relative;

    .hr {
        margin: 1rem;
        border: 1px solid rgba(120, 120, 120, 0.5);
    }

    .footer-logo {
        font-family: 'Mr Dafoe', sans-serif;
        font-size: 20rem;
        text-align: center;
        margin: 0;
    }
}
</style>