<template>
    <div class="container">
        <div class="top">
            <div class="sub">
                <h2>訂閱第一手消息！</h2>
                <p>成為我們的VIP！訂閱我們的電子報，即刻獲得獨家優惠、新菜品消息和特別活動邀請。
                    每週精選的美味直送到您的信箱！
                </p>
                <form action="" class="submit">
                    <input type="text">
                    <button type="submit">訂閱</button>
                </form>
            </div>
            <div class="app">
                <h2>立即下載App！</h2>
                <p>即刻下載，掌握美味的滋味！獨享訂單優惠、獨家菜單推薦，輕鬆預訂、方便外帶。下載APP
                    ，尊享美食新體驗！</p>
                <button>下載App</button>
            </div>
            <div class="phone">
                <img src="@assets/img/InfoFooter/phone.png"
                    alt="" class="info-phone">
            </div>
        </div>
        <div class="mid">
            <nav>
                <div v-for="({ title, content }, index) in footerList"
                    :key="title">
                    <h2>
                        {{ title }}

                    </h2>
                    <li v-for="(item, index) in content"
                        :key="item">
                        {{ item }}
                    </li>
                </div>
            </nav>
            <div class="socialLink">
                <a href="" v-for="(item, index) in iconList"
                    :key="index">
                    <SvgIcon :name="item" width="30px"
                        color="#FCFAF2"></SvgIcon>
                </a>
            </div>
        </div>
        <div class="bot">
            <span>
                Relation-ship
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';


let footerList = reactive([
    {
        title: '快速連結',
        content: ['開始專屬分析', '菜單', '關於果漾', '我的帳戶']
    },
    {
        title: '顧客服務',
        content: ['常見問題', '付款與寄送流程', '果漾會員制度', '聯絡我們']
    },
    {
        title: '聲明條款',
        content: ['隱私權服務', '服務條款', '退貨政策', '反詐騙公告']
    },
    {
        title: '果漾蔬食',
        content: ['信箱', '官方LINE', '客服專線', '服務時間']
    },
]);

let iconList = reactive(['Fb', 'Ig', 'LINE', 'Twitter']);

</script>

<style scoped lang="scss">
// DOING:切版
.container {
    max-width: $primaryWidth;
    background-color: $secondBacColor;
    color: $primaryBacColor;

    position: relative;
    max-height: 920px;
    overflow: hidden;

    // .top,
    // .mid {
    //     padding: 1rem 6rem;
    // }
}

.top {
    @include flex-center-center;
    align-items: stretch;
    gap: 1rem;
    position: relative;

    &::after {
        @include WnH(1201px, 1px);
        position: absolute;
        bottom: 0;
        content: '';
        background-color: $primaryBacColor;
        margin: auto 6rem;
    }

    .phone {
        @include WnH(142px, 284px);
        margin-bottom: 35px;
    }
}

.mid {
    nav {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;

        ul {
            padding: 0;
        }
    }

    .socialLink {
        display: flex;
        gap: 2rem;
        justify-content: center;
    }
}

.bot {
    font-family: 'Mr Dafoe', cursive;
    font-weight: 400;
    font-style: normal;
    text-align: center;
    margin: 0;
    font-size: 33vh;
    white-space: nowrap;
    overflow: hidden;
}
</style>