<template>
    <div class="infoFooter">
        <section class="info-email">
            <h2>訂閱第一手消息！</h2>
            <p>成為我們的VIP！訂閱我們的電子報，即刻獲得獨家優惠、新菜品消息和特別活動邀請。
                每週精選的美味直送到您的信箱！
            </p>
            <form action="" class="submit">
                <input type="text">
                <button type="submit">訂閱</button>
            </form>
        </section>
        <section class="info-app">
            <h2>立即下載App！</h2>
            <p>即刻下載，掌握美味的滋味！獨享訂單優惠、獨家菜單推薦，輕鬆預訂、方便外帶。下載APP
                ，尊享美食新體驗！</p>
            <button>下載App</button>
        </section>
        <img src="@assets/img/InfoFooter/phone.jpg" alt=""
            class="info-phone">
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.infoFooter {
    @include flex-center-center;
    @include main-part;
    align-items: stretch;
    gap: 1rem;

    section {
        flex: 2;
        text-align: left;
        position: relative;

        .submit {
            max-width: 100%;
            position: relative;

            input {
                border: 1px solid black;
                border-radius: 3rem;
                padding-left: 2rem;
                width: 100%;
                height: 3rem;
            }

            button {
                height: 3rem;
                width: 5rem;
                border-radius: 3rem;
                position: absolute;
                right: 0;

            }
        }
    }

    .info-app>button {
        height: 3rem;
        width: 5rem;
        border-radius: 3rem;
        position: absolute;
        left: 50%;
        transform: translate(-50%, 0);
    }

    .info-app>*:not(button),
    .info-email>*:not(form) {
        padding: 1rem 0;
    }

    .info-phone {
        flex: 1;
        min-width: 150px;
        margin-top: 35px;
    }
}
</style>