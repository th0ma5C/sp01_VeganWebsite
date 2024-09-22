<template>
    <div class="resultContainer">
        <div class="restart">
            <button>重新測驗</button>
        </div>

        <div class="topText">
            <h1>
                您的專屬分析完成了！
            </h1>

            <div class="content">
                根據
                請從以下挑選
            </div>
        </div>

        <div class="recommendList">
            <!-- <Product_template></Product_template> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import Product_template from '@/components/Product/Product_template.vue';

</script>

<style scoped lang="scss">
* {
    outline: 1px solid black;
}

.resultContainer {
    @include WnH(100%, calc(100% - 100px));
}

.topText {
    margin-top: 3rem;
    text-align: center;
}
</style>