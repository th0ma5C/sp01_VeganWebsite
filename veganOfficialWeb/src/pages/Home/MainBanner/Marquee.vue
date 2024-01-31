<template>
    <div class="container">
        <div class="marquee">
            <button class="btn-prev">&lt;</button>
            <button class="btn-next">&gt;</button>
            <div class="swiper">
                <p v-for="(item, index) in swiper" :key="index"
                    style="width: 1181px;">
                    {{ item.title }} </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const swiper = [
    { title: '最新美味上架！立即探索我們最新的素食餐盒和果昔，品嚐獨特的素食美味。' },
    { title: '最新消息、特別優惠、限量商品和精彩活動都在這裡！。' },
    { title: '過敏原報告，查看我們食物過敏警報，確保您點的安心。' },
    { title: 'APP限定好康：下載我們的APP，即刻獲得專屬優惠及最新活動資訊。' },
    { title: '加入會員，享專屬優待！加入我們的會員計畫，即刻享有限定優惠和會員專屬好康。' },
]

</script>

<style lang="scss" scoped>
.container {

    &::before {
        content: '';
        display: block;
        height: 107px;
        width: 100%;
    }

    .marquee {
        @include flex-center-center;
        @include main-part;

        position: relative;
        justify-content: space-between;

        button {
            position: absolute;
        }

        p {
            margin: 0;
        }

        .btn-prev {
            left: 6rem;
        }

        .btn-next {
            right: 6rem;
        }

        .swiper {
            display: flex;
            text-align: center;
        }
    }
}
</style>