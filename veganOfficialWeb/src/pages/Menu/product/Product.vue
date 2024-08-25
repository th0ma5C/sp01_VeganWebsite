<template>
    <div class="container">
        <div class="breadCrumb">麵包屑/麵包屑/麵包屑</div>
        <div class="productWrapper">
            <div class="imgWrapper">
                <img src="" alt="大圖">
                <div class="thumbnail">
                    <img src="" alt="小圖">
                    <img src="" alt="小圖">
                    <img src="" alt="小圖">
                    <img src="" alt="小圖">
                </div>
            </div>

            <div class="contentWrapper">
                <div class="topContent">
                    <h1>
                        品名
                    </h1>
                    <p>
                        Lorem, ipsum dolor sit amet
                        consectetur
                        adipisicing elit. Ex nostrum laborum
                        tempora reiciendis, perspiciatis
                        delectus sequi dolor sit earum
                        nesciunt
                        suscipit cupiditate ipsa quia
                        reprehenderit dignissimos
                        perferendis
                        molestias inventore repudiandae.
                    </p>
                </div>

                <div class="detailWrapper">
                    <div class="sizeSelector">
                        <h2>要買多少?</h2>
                        <div class="selectWrapper">
                            <label for="">
                                <div>
                                    <img src="" alt=""
                                        style="width: 100px;height: 100px;">
                                </div>
                                <div>
                                    <span>1個</span>
                                    <input type="radio"
                                        name="" id=""
                                        style="display: none;">
                                </div>
                            </label>
                            <label for="">
                                <div>
                                    <img src="" alt=""
                                        style="width: 100px;height: 100px;">
                                </div>
                                <div>
                                    <span>1包</span>
                                    <input type="radio"
                                        name="" id=""
                                        style="display: none;">
                                </div>
                            </label>
                            <label for="">
                                <div>
                                    <img src="" alt=""
                                        style="width: 100px;height: 100px;">
                                </div>
                                <div>
                                    <span>1箱</span>
                                    <input type="radio"
                                        name="" id=""
                                        style="display: none;">
                                </div>
                            </label>
                        </div>
                    </div>
                    <div class="orderCounter">
                        <span>數量</span>
                        <div>
                            <button>-</button>
                            <input type="text">1
                            <button>+</button>
                        </div>
                    </div>
                    <div class="priceCalc">
                        <span>價格</span>
                        <table>
                            <tr>
                                <th>數量</th>
                                <th>單位</th>
                                <th>折扣</th>
                                <th>運費</th>
                                <th>總共</th>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>包</td>
                                <td>0.95</td>
                                <td>60</td>
                                <td>999</td>
                            </tr>
                        </table>
                    </div>

                    <div class="addCart">
                        <button>加入購物車</button>
                    </div>

                    <div class="infoFolder">
                        <div class="Wrapper">
                            <p>title</p>
                            <div>
                                <p>
                                    Lorem ipsum dolor sit
                                    amet consectetur
                                    adipisicing elit.
                                    Doloribus, quaerat
                                    repellat culpa rerum
                                    atque blanditiis ducimus
                                    facere ad quibusdam
                                    magnam.
                                </p>
                            </div>
                        </div>
                        <div class="Wrapper">
                            <p>title</p>
                            <div>
                                <p>
                                    Lorem ipsum dolor sit
                                    amet consectetur
                                    adipisicing elit.
                                    Doloribus, quaerat
                                    repellat culpa rerum
                                    atque blanditiis ducimus
                                    facere ad quibusdam
                                    magnam.
                                </p>
                            </div>
                        </div>
                        <div class="Wrapper">
                            <p>title</p>
                            <div>
                                <p>
                                    Lorem ipsum dolor sit
                                    amet consectetur
                                    adipisicing elit.
                                    Doloribus, quaerat
                                    repellat culpa rerum
                                    atque blanditiis ducimus
                                    facere ad quibusdam
                                    magnam.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <section class="socialMedia">
            <div class="wrapper">
                IG
            </div>
            <div class="wrapper">
                IG
            </div>
            <div class="wrapper">
                IG
            </div>
        </section>

        <section class="buyMore">
            <div class="analyst">
                分析推薦
            </div>
            <div class="recommend">
                推薦搭配
            </div>
            <div class="peopleBuy">
                其他人也會買
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
/**
 * todo: detail區顏色
 * doing: 
 * --------------------
 * 
 * --------------------
 * 
 * --------------------
 * ?價格試算移到結帳頁面
 * ?小圖去掉，改只放一張大圖就好
 * 
 * --------------------
 * 點擊圖片跳出放大圖
 */

import { onMounted } from 'vue';


onMounted(() => {
    console.log(window.innerHeight);
})

</script>

<style scoped lang="scss">
.container {
    @extend %fixContainer;
    @extend %headerPseudo;

    flex-direction: column;
    width: 100%;

    * {
        outline: 1px solid black;
    }

    &>div,
    &>section {
        width: 100%;
        max-width: 1440px;
        margin-top: 2rem;
    }

    .breadCrumb {
        padding-left: 2rem;
    }
}

.productWrapper {
    display: flex;
    justify-content: center;
    padding: 0 2rem;
    height: calc(100vh - 188px);

    &>div {
        flex: 1;
        padding: 1.5rem;
    }
}

.imgWrapper {
    display: flex;
    flex-direction: column;

    &>img {
        @include WnH(100%);
    }

    .thumbnail {
        height: 15%;
        display: flex;
        flex-direction: row;

        &>img {
            @include WnH(100%);
        }
    }
}

.contentWrapper {}

.topContent {}

.detailWrapper {
    background-color: #fff9e2;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 1rem;

    &>div {
        display: flex;
        flex-direction: column;
    }

    .sizeSelector {

        .selectWrapper {
            display: flex;
            margin-top: 1rem;
        }
    }

    .orderCounter {
        flex-direction: row;
    }

    .priceCalc {}

    .addCart {}

    .infoFolder {}
}

.socialMedia {}

.buyMore {}
</style>