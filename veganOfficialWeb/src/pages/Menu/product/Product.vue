<template>
    <div class="container">
        <div class="breadCrumb">麵包屑/麵包屑/麵包屑</div>
        <div class="productWrapper">
            <div class="imgWrapper">
                <img src="@assets/img/saladTemp.png"
                    alt="大圖">
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
                            <label for=""
                                @click="setSelectAmount(index)"
                                :class="{ selected: selectedIndex == index }"
                                v-for="({ size, amount, icon }, index) in selectOptions"
                                :key="index">
                                <SvgIcon class="amountIcon"
                                    :name="`productAmount${icon}`"
                                    width="125px"
                                    height="100px">
                                </SvgIcon>
                                <div class="selector">
                                    <input type="radio"
                                        name="" id="">
                                    <span
                                        class="marker"></span>
                                    <div class="mount">
                                        <span>
                                            {{ size }}
                                        </span>
                                        <span>
                                            {{ amount }}
                                        </span>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div class="orderCounter">
                        <span>數量</span>
                        <div class="counterControl">
                            <button>
                                <SvgIcon name="productMinus"
                                    width="24" height="24">
                                </SvgIcon>
                            </button>
                            <input type="text" value="1">
                            <button>
                                <SvgIcon name="productPlus"
                                    width="24" height="24">
                                </SvgIcon>
                            </button>
                        </div>
                    </div>
                    <div class="price">
                        <h2>價格</h2>
                        <span>999</span>
                        <span>/1包</span>
                    </div>

                    <div class="addCart">
                        <button>加入購物車</button>
                    </div>

                    <div class="infoFolder">
                        <div class="Wrapper"
                            v-for="({ title, content, classState }, index) in infoData"
                            :key="index">
                            <h2 @click="setInfoOpen(index)">
                                <SvgIcon
                                    name="ListArrowDown"
                                    width="28px"
                                    height="28px"
                                    color="black"
                                    :class="{ folderIcon: classState }">
                                </SvgIcon>
                                {{ title }}
                            </h2>
                            <div class="folder"
                                :class="{ folderText: classState }">
                                <p>
                                    {{ content }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <section class="socialMedia">
            <div class="wrapper" v-for="(item, index) in 5"
                :key="index">
                <img src="@assets/img/IG temp.jpg" alt="">
            </div>
        </section>

        <section class="buyMore">
            <h1>
                為您推薦
            </h1>

            <div class="hot">
                <h2>
                    同款熱門
                </h2>

                <!-- <Product_template></Product_template> -->

            </div>

            <div class="analyze">
                <h2>
                    專屬推薦
                </h2>
                <ul>
                    <li>
                        1
                    </li>
                    <li>
                        1
                    </li>
                    <li>
                        1
                    </li>
                    <li>
                        1
                    </li>
                </ul>
            </div>

            <div class="new">
                <h2>
                    熱門新品
                </h2>
                <ul>
                    <li>
                        1
                    </li>
                    <li>
                        1
                    </li>
                    <li>
                        1
                    </li>
                    <li>
                        1
                    </li>
                </ul>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
/**
 * todo: 推薦菜單架構(分頁形式)
 * doing: 數量 字體寬度 樣式完成
 * --------------------
 * *
 * --------------------
 * !取消大圓圈，overflow會使圖片sticky失效
 * --------------------
 * ?價格試算移到結帳頁面
 * //?小圖去掉，改只放一張大圖就好
 * 
 * --------------------
 * 骨架屏
 * 點擊圖片跳出放大圖
 * 推薦菜單架構
 * 麵包屑
 * 大圖JPG
 * //尺寸選擇
 * //折疊icon(可否重用menu的折疊)
 * //營養Tag
 * //IG假圖*5
 * //加入購物車按鈕寬度
 * //包裝圖片長寬
 * //+-按鈕
 * //摺疊區塊底線
 * //detail區顏色
 */

import { onMounted, reactive, ref } from 'vue';
import Product_template from '@/components/Product/Product_template.vue';
import { useRoute } from 'vue-router';
import { useMenuStore } from '@/store/menuStore';
import type { MenuItem } from '@/api/menu/type';
import { storeToRefs } from 'pinia';
import { LoremIpsum } from "lorem-ipsum";

// store數據
let productInfo = ref<MenuItem>();

function initProductInfo(init: boolean) {
    if (init) {
        productInfo.value = getInfoByName(name);
    }
}

// 路由props
const { name } = defineProps(['name']);

const menuStore = useMenuStore();
const { isLoaded } = storeToRefs(useMenuStore());
const { getInfoByName } = useMenuStore();

menuStore.$subscribe((mutation, state) => {
    initProductInfo(state.isLoaded);
})

// 選擇尺寸
const selectOptions = [
    {
        size: 'S"',
        amount: '一入',
        icon: ''
    },
    {
        size: 'M"',
        amount: '七入',
        icon: '7'
    },
    {
        size: 'L"',
        amount: '十四入',
        icon: '14'
    },

];

const selectedIndex = ref(0);

function setSelectAmount(index: number) {
    selectedIndex.value = index
}


// info摺疊
const lorem = new LoremIpsum();
const infoData = reactive([
    {
        title: '宅配資訊',
        content: lorem.generateWords(30),
        classState: true
    },
    {
        title: '食材清單',
        content: lorem.generateWords(20),
        classState: false
    },
    {
        title: '卡路里&營養標示',
        content: lorem.generateWords(30),
        classState: false
    },
]);

function setInfoOpen(index: number) {
    infoData[index].classState = !infoData[index].classState;
}

// 生命週期
onMounted(() => {
    initProductInfo(isLoaded.value);
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
        // @include WnH(50%);
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
            background-color: $secondBacColor;
            border-radius: 0 6px 6px 0;
            color: $primaryBacColor;
            padding-right: 6px;
            margin-right: 1rem;
            position: relative;
            z-index: 0;

            &:first-of-type {
                margin-left: 14px;
            }

            &::after {
                @include WnH(100%, 0px);
                content: '';
                border-top: 12px solid transparent;
                border-right: 13px solid $secondBacColor;
                border-bottom: 12px solid transparent;
                position: absolute;
                top: 0;
                left: -100%;
                z-index: -1;
            }

            &::before {
                @include WnH(3px);
                @include absoluteCenterTLXY($left: -6px, $X: 0);
                content: '';
                border-radius: 100%;
                background-color: white;
            }
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
    margin-top: 2rem;
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
                width: 30%;
                cursor: pointer;

                .amountIcon {
                    padding: .5rem;
                    border: 1px solid rgba(0, 0, 0, 0.5);
                    border-radius: .5rem;
                    opacity: .5;
                    transition: opacity 0.3s ease;
                }

                .selector {
                    display: flex;
                    justify-content: center;
                    margin-top: 1rem;

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

                &:hover .amountIcon {
                    opacity: 1;
                }
            }

            .selected {
                .amountIcon {
                    opacity: 1;
                }

                .marker::after {
                    @include WnH(6px);
                    @include absoluteCenterTLXY;
                    content: '';
                    background-color: $secondBacColor;
                    border-radius: 3px;
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
        margin-top: 1rem;

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
                // border: 1px solid black;
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
        margin-top: .5rem;

        & span:nth-of-type(1) {
            font-size: 20px;
            margin-left: auto;
        }

        & span:nth-of-type(2) {
            font-size: 12px;
            margin-left: 8px;
            margin-right: calc(5rem - 48px);
        }
    }

    .addCart {
        margin-top: 1rem;
        justify-content: center;
        align-items: center;

        button {
            @include WnH(95%, 46px);
            background-color: #3EA350;
            border: 1px solid rgba(0, 0, 0, 0.5);
            border-radius: 23px;
            box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.5);
            color: #FCFAF2;
            font-size: 20px;
            line-height: 46px;
            transition: box-shadow 0.15s ease;

            &:hover {
                box-shadow: 3px 4px 6px rgba(0, 0, 0, 0.75);
            }

            &:active {
                transform: translate(1px, 1px);
            }
        }
    }

    %divideLine {
        @include WnH(100%, 1px);
        content: '';
        background-color: rgba(0, 0, 0, .25);
        display: block;
        margin: .5rem 0 .5rem 0;
    }

    .infoFolder>.Wrapper {

        h2 {
            cursor: pointer;
            display: flex;
            color: rgba(0, 0, 0, 0.5);
            transition: color 0.3s ease;
            user-select: none;

            &>div {
                // outline: 1px solid black;
                transform: rotate(-90deg);
                transition: transform .2s linear;
            }

            .folderIcon {
                transform: rotate(0deg);
            }

            &:has(.folderIcon) {
                color: black;
            }
        }

        .folder {
            padding-left: 1.5rem;
            overflow: hidden;
            max-height: 0;
            opacity: 0;
            transition: max-height 0.5s ease, opacity 0.3s ease;

            p {
                color: rgba(0, 0, 0, 0.5);
                padding: .5rem 1rem .5rem 24px;
                text-align: justify;
                transition: color 0.3s ease;
            }
        }

        .folderText {
            max-height: min(300px);
            opacity: 1;

            p {
                color: black;
            }
        }

        &::before {
            @extend %divideLine;
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

.buyMore {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    h1 {
        font-size: 36px;
    }

    &>div {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 0 2rem;

        ul {
            display: flex;
        }
    }
}
</style>