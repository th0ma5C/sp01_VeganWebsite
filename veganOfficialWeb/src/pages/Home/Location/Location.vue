<template>
    <div class="container">
        <img src="@assets/img/Home/Location/shop.jpg"
            alt="">
        <div class="content">
            <SvgIcon :name="'Location'" width="48"
                height="48" color="#FCFAF2"></SvgIcon>
            <h2>找到我們</h2>
            <button>查看地圖</button>
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * todo:mainBanner圖片位置
 * 
 * *0430: 基本結構、css
 */
</script>

<style scoped lang="scss">
.container {
    @include flex-center-center;
    @include main-part;
    overflow: hidden;
    position: relative;

    img {
        @include WnH(100%);
        filter: brightness(0.5);
        transform: scale(1.1);
    }

    .content {
        @include flex-center-center;
        flex-direction: column;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%)
    }
}
</style>