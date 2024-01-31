<template>
    <div class="container">
        <p>我是跑馬燈</p>
    </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.container {

    &::before {
        content: '';
        display: block;
        height: 107px;
        width: 100%;
    }
}
</style>