<template>
    <div class="infoFooter">
        <section class="info-email">
            <h2>訂閱第一手消息！</h2>
            <p>成為我們的VIP！訂閱我們的電子報，即刻獲得獨家優惠、新菜品消息和特別活動邀請。
                每週精選的美味直送到您的郵箱，讓您永遠不錯過任何精彩時刻。填寫您的郵箱，開啟美食之旅的新一頁！
            </p>
            <form action="">
                <input type="text">
                <button type="submit">訂閱</button>
            </form>
        </section>
        <section class="info-app">
            <h2>立即下載App！</h2>
            <p>掌握美味的滋味，即刻下載我們的
                APP！獨享訂單優惠、獨家菜單推薦，輕鬆預訂、方便外帶。APP
                下載，尊享美食新體驗！</p>
            <button>下載App</button>
        </section>
        <div class="info-phone">手機示意圖</div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.infoFooter {
    @include main-part;
    @include flex-center-center;
    align-items: stretch;
    gap: 1rem;

    section {
        flex: 2;
        text-align: left;
        position: relative;

        &>button {
            position: absolute;
            bottom: 0;
        }
    }

    .info-app>*:not(button),
    .info-email>*:not(form) {
        padding: 1rem 0;
    }

    .info-phone {
        flex: 1;
    }
}
</style>