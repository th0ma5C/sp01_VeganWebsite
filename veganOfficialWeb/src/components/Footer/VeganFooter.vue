<template>
    <div class="container">
        <InfoFooter></InfoFooter>
        <hr class="hr">
        <MainFooter></MainFooter>
        <div class="footer-logo">
            <span>
                Relation-ship
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import InfoFooter from './InfoFooter.vue';
import MainFooter from './MainFooter.vue';
</script>

<style lang="scss" scoped>
// @import url('https://fonts.googleapis.com/css2?family=Mr+Dafoe&display=swap');\
@font-face {
    font-family: 'MrDafoe';
    src: url('@assets/fonts/Mr_Dafoe/MrDafoe-Regular.woff2') format('woff2');
}

.container {
    background-color: #00430b;
    color: $primaryBacColor;
    position: relative;
    max-height: 920px;
    overflow: hidden;

    .hr {
        margin: 1rem 2rem;
        border: 1px solid rgba(120, 120, 120, 0.5);
    }

    .footer-logo {
        font-family: 'MrDafoe', sans-serif;
        text-align: center;
        margin: 0;
        font-size: 33vh;
        white-space: nowrap;
        overflow: hidden;

        span {}
    }
}
</style>