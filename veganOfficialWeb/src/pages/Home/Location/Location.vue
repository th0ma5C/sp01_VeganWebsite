<template>
    <div class="container">
        <img src="@assets/img/Home/Location/shop.jpg"
            alt="">
        <div class="content"></div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.container {
    @include flex-center-center;
    @include main-part;

    img {
        @include WnH(100%);
    }
}
</style>