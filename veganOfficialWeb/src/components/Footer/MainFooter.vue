<template>
    <div class="mainFooter">
        <nav>
            <div>
                <h2>快速連結</h2>
                <ul>
                    <li>開始專屬分析</li>
                    <li>菜單</li>
                    <li>關於果漾</li>
                    <li>我的帳戶</li>
                </ul>
            </div>
            <div>
                <h2>顧客服務</h2>
                <ul>
                    <li>常見問題</li>
                    <li>付款與寄送流程</li>
                    <li>果漾會員制度</li>
                    <li>聯絡我們</li>
                </ul>
            </div>
            <div>
                <h2>聲明條款</h2>
                <ul>
                    <li>隱私權服務</li>
                    <li>服務條款</li>
                    <li>退貨政策</li>
                    <li>反詐騙公告</li>
                </ul>
            </div>
            <div>
                <h2>果漾蔬食</h2>
                <ul>
                    <li>信箱</li>
                    <li>官方LINE</li>
                    <li>客服專線</li>
                    <li>服務時間</li>
                </ul>
            </div>
        </nav>
        <div>
            <a href="">
                <SvgIcon name="FB"></SvgIcon>
            </a>
            <a href="">
                <SvgIcon name="IG"></SvgIcon>
            </a>
            <a href="">
                <SvgIcon name="LINE"></SvgIcon>
            </a>
            <a href="">
                <SvgIcon name="Twitter"></SvgIcon>
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.mainFooter {
    @include main-part;

    nav {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }
}
</style>