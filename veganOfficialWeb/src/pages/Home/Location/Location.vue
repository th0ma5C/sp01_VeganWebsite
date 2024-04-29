<template>
    <div class="container">
        <img src="@assets/img/Home/Location/shop.jpg"
            alt="">
    </div>
</template>

<script setup lang="ts">
/**
 * todo:檢查main-part scss換margin的影響
 */
</script>

<style scoped lang="scss">
.container {
    @include flex-center-center;
    @include main-part;
    overflow: hidden;

    img {
        @include WnH(100%);
        filter: brightness(0.75);
        transform: scale(1.1);
    }
}
</style>