<template>
    <section class="buyMore_container">
        <div class="main">
            <div class="slide">

            </div>
        </div>
    </section>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.buyMore_container {
    @extend %fixContainer;
    height: 460px;
    // overflow: hidden;
    position: relative;
    z-index: 0;
}

.main {
    width: 3840px;
    height: 3840px;
    background-color: $primaryBacColor;
    // border: 1px solid black;
    box-shadow: 1px -1px 8px black;
    border-radius: 100%;
    position: absolute;
    left: -1200px;
    top: 0;
    z-index: -1;
}
</style>