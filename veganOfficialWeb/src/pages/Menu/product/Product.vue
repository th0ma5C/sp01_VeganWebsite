<template>
    <div class="container">
        <div class="breadCrumb">麵包屑/麵包屑/麵包屑</div>
        <div class="productWrapper">
            <div class="imgWrapper">
                <img src="" alt="大圖">
                <!-- <div class="thumbnail">
                    <img src="" alt="小圖">
                    <img src="" alt="小圖">
                    <img src="" alt="小圖">
                    <img src="" alt="小圖">
                </div> -->
            </div>

            <div class="contentWrapper">
                <div class="topContent">
                    <h1>
                        {{ productInfo?.name }}
                    </h1>
                    <div class="ingredientWrapper">
                        <span
                            v-for="(item, index) in productInfo?.ingredients"
                            :key="index"
                            v-show="item !== ''">
                            {{ item }}
                        </span>
                    </div>
                    <p>
                        {{ productInfo?.description }}
                    </p>
                </div>

                <div class="detailWrapper">
                    <div class="sizeSelector">
                        <h2>包裝尺寸</h2>
                        <div class="selectWrapper">
                            <label for="">
                                <div>
                                    <img src="" alt=""
                                        style="width: 100px;height: 100px;">
                                </div>
                                <div class="selector">
                                    <input type="radio"
                                        name="" id="">
                                    <span
                                        class="marker"></span>
                                    <div class="mount">
                                        <span>S"</span>
                                        <span>三入</span>
                                    </div>
                                </div>
                            </label>
                            <label for="">
                                <div>
                                    <img src="" alt=""
                                        style="width: 100px;height: 100px;">
                                </div>
                                <div class="selector">
                                    <input type="radio"
                                        name="" id="">
                                    <span
                                        class="marker"></span>
                                    <div class="mount">
                                        <span>M"</span>
                                        <span>十五入</span>
                                    </div>
                                </div>
                            </label>
                            <label for="">
                                <div>
                                    <img src="" alt=""
                                        style="width: 100px;height: 100px;">
                                </div>
                                <div class="selector">
                                    <input type="radio"
                                        name="" id="">
                                    <span
                                        class="marker"></span>
                                    <div class="mount">
                                        <span>L"</span>
                                        <span>三十入</span>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div class="orderCounter">
                        <span>數量</span>
                        <div class="counterControl">
                            <button>-</button>
                            <input type="text" value="1">
                            <button>+</button>
                        </div>
                    </div>
                    <div class="price">
                        <h2>價格</h2>
                        <span>999</span>
                        <span>/1包</span>
                        <!-- <span>價格</span>
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
                        </table> -->
                    </div>

                    <div class="addCart">
                        <button>加入購物車</button>
                    </div>

                    <div class="infoFolder">
                        <div class="Wrapper">
                            <h2>宅配資訊</h2>
                            <div class="folder">
                                <p>
                                    Lorem ipsum dolor sit
                                    amet consectetur
                                    adipisicing elit.
                                    Doloribus, quaerat
                                    repellat culpa rerum
                                    atque blanditiis ducimus
                                    facere ad quibusdam
                                    magnam.
                                    atque blanditiis ducimus
                                    facere ad quibusdam
                                    magnam.
                                    facere ad quibusdam
                                    magnam.
                                    atque blanditiis ducimus
                                    facere ad quibusdam
                                    magnam.
                                </p>
                            </div>
                        </div>
                        <div class="Wrapper">
                            <h2>食材清單</h2>
                            <div class="folder">
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
                            <h2>卡路里&營養標示</h2>
                            <div class="folder">
                                <p>
                                    Lorem ipsum dolor sit
                                    amet consectetur
                                    adipisicing elit.
                                    Doloribus, quaerat
                                    repellat culpa rerum
                                    atque blanditiis ducimus
                                    facere ad quibusdam
                                    magnam.
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
                <img src="@assets/img/IG temp.jpg" alt="">
            </div>
            <div class="wrapper">
                <img src="@assets/img/IG temp.jpg" alt="">
            </div>
            <div class="wrapper">
                <img src="@assets/img/IG temp.jpg" alt="">
            </div>
            <div class="wrapper">
                <img src="@assets/img/IG temp.jpg" alt="">
            </div>
            <div class="wrapper">
                <img src="@assets/img/IG temp.jpg" alt="">
            </div>
        </section>

        <!-- <Recommend class="buyMore"></Recommend> -->
    </div>
</template>

<script setup lang="ts">
/**
 * todo: 推薦菜單架構(分頁形式)
 * doing: 摺疊區塊 按鈕顏色 陰影 包裝圖片大小 營養tag icon 字體寬度 樣式完成
 * --------------------
 * *
 * --------------------
 * !取消大圓圈，overflow會使圖片sticky失效
 * --------------------
 * ?價格試算移到結帳頁面
 * //?小圖去掉，改只放一張大圖就好
 * 
 * --------------------
 * 加入購物車按鈕寬度
 * 骨架屏
 * 折疊icon(可否重用menu的折疊)
 * 點擊圖片跳出放大圖
 * 營養Tag
 * IG假圖*5
 * 推薦菜單架構
 * //detail區顏色
 */

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useMenuStore } from '@/store/menuStore';
import type { MenuItem } from '@/api/menu/type';
import Recommend from './recommend/Recommend.vue';
import { storeToRefs } from 'pinia';

// store數據
let productInfo = ref<MenuItem>();

function initProductInfo() {
    productInfo.value = getInfoByName(name);
}

// 路由props
const { name } = defineProps(['name']);

const menuStore = useMenuStore();
const { isLoaded } = storeToRefs(useMenuStore());
const { getInfoByName } = useMenuStore();

menuStore.$subscribe((mutation, state) => {
    if (state.isLoaded) {
        initProductInfo()
    }
})


onMounted(() => {
    if (isLoaded.value) {
        initProductInfo()
    }
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

    &>section {
        margin-top: 4rem;
    }

    .breadCrumb {
        padding-left: 2rem;
    }
}

.productWrapper {
    display: flex;
    justify-content: center;
    padding: 0 2rem;
    // height: calc(100vh - 188px);

    &>div {
        flex: 1;
        padding: 1.5rem;
    }
}

.imgWrapper {
    display: flex;
    flex-direction: column;

    &>img {
        @include WnH(50%);
        position: sticky;
        top: 188px;
        // width: 80%;
        // margin: auto;
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

.contentWrapper {
    h2 {
        margin-left: 0.75rem;
        font-size: 20px;
    }
}

.topContent {
    // padding: 0 1rem;

    h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
    }

    .ingredientWrapper {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;

        span {
            padding: 0 4px;
        }
    }

    p {
        font-size: 1.25rem;
        text-indent: 2rem;
        text-align: justify;
    }
}

.detailWrapper {
    background-color: #FFE8C0;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
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
            justify-content: space-evenly;
            margin-top: 1rem;

            label {

                .selector {
                    display: flex;

                    input {
                        display: none;
                    }

                    .marker {
                        @include WnH(12px);
                        background-color: $primaryBacColor;
                        border: 1px solid black;
                        border-radius: 8px;
                        margin: 9px 5px 4px 4px;
                        position: relative;

                        &::after {
                            @include WnH(6px);
                            @include absoluteCenterTLXY;
                            content: '';
                            background-color: $secondBacColor;
                            border-radius: 3px;
                        }
                    }

                    .mount {
                        display: flex;
                        flex-direction: column;

                        span {
                            flex: 1;
                            display: block;
                            font-size: 0.75rem;

                            &:first-of-type {
                                font-size: 1.25rem;
                            }
                        }
                    }
                }
            }
        }
    }

    .orderCounter {
        @include WnH(100%, 42px);
        background-color: $primaryBacColor;
        border-radius: 0.5rem;
        flex-direction: row;
        position: relative;

        span {
            @include absoluteCenterTLXY($left: 0.75rem, $X: 0);
            font-size: 20px;
        }

        .counterControl {
            @include absoluteCenterTLXY($left: calc(100% - 1rem), $X: -100%);
            display: flex;
            align-items: center;

            button {
                @include WnH(24px, 20px);
                @include flex-center-center;
                border: 1px solid black;
                border-radius: 6px;
            }

            input {
                background-color: $primaryBacColor;
                text-align: center;
                line-height: 24px;
                width: 80px;
            }
        }
    }

    .price {
        flex-direction: row;
        line-height: 30px;

        & span:nth-of-type(1) {
            font-size: 20px;
            margin-left: auto;
        }

        & span:nth-of-type(2) {
            font-size: 12px;
            margin-right: calc(5rem - 40px);
        }
    }

    .addCart>button {
        @include WnH(100%, 46px);
        background-color: #3EA350;
        border: 1px solid black;
        border-radius: 23px;
        color: #FCFAF2;
        font-size: 20px;
        line-height: 46px;
    }

    .infoFolder>.Wrapper {
        .folder {
            overflow: hidden;
            // height: 0;
        }
    }
}

.socialMedia {
    // @include flex-center-center;
    display: flex;
    flex-direction: row;
    // gap: 4rem;

    .wrapper {
        @include WnH(300px, 430px);
        box-shadow: 3px 3px 6px gray;
        flex: 1 0 auto;

        img {}
    }
}

.buyMore {}
</style>