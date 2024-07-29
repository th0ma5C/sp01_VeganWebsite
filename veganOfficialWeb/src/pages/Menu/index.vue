<template>
    <div class="container">
        <div class="analystTop">
            <div class="imgWrapper">
                <swiper-container effect="fade" speed="700"
                    autoplay-delay="4000"
                    :fadeEffect="{ crossFade: true }"
                    :allowTouchMove="false" class="test">
                    <swiper-slide>
                        <img src="@assets/img/Menu/doc01.png"
                            alt="doc">
                    </swiper-slide>
                    <swiper-slide
                        data-swiper-autoplay="6000">
                        <img src="@assets/img/Menu/doc02.png"
                            alt="doc">
                    </swiper-slide>
                </swiper-container>
            </div>
            <div class="textWrapper">
                <h1>
                    <span
                        class="subTitle">您做過專屬個人診斷了嗎?</span>
                    <span
                        class="text">Relation-Ship</span>團隊的專業分析，為您打造專屬菜單
                </h1>
            </div>
            <button>開始診斷</button>
        </div>
        <div class="menuWrapper">
            <div class="title">
                <div class="breadCrumb">
                    麵包屑/麵包屑/麵包屑
                </div>
                <div class="titleText">
                    SALADS and SIDES
                </div>
                <div class="filterWrapper">
                    <div class="filter">
                        <span>篩選：</span>
                        <div class="details">
                            <div class="summary"
                                @click="showFilter">
                                <span>
                                    食材種類
                                </span>
                                <SvgIcon
                                    name="ListArrowDown"
                                    width="21px"
                                    height="21px"
                                    class="filterArrow"
                                    :class="{ rotateArrow: filterIsShow }">
                                </SvgIcon>
                            </div>
                            <transition name="filter">
                                <div class="listWrapper"
                                    v-show="filterIsShow">
                                    <SvgIcon name="cancel"
                                        width="20"
                                        height="20"
                                        class="exit">
                                    </SvgIcon>
                                    <div class="listHeader">
                                        <form action="">
                                            <input
                                                type="text"
                                                placeholder="篩選條件">
                                            <SvgIcon
                                                name="Search02"
                                                width="18px"
                                                height="18px"
                                                color="black"
                                                class="searchIcon">
                                            </SvgIcon>
                                        </form>
                                        <div>
                                            已選取幾項
                                        </div>
                                        <div>
                                            <button>重置</button>
                                        </div>
                                    </div>
                                    <div class="fieldset">
                                        <ul>
                                            <li v-for="index in 12"
                                                :key="index"
                                                :class="{ select: index == 1 }">
                                                <label
                                                    :for="`salad${index}`">
                                                    <input
                                                        :id="`salad${index}`"
                                                        type="checkbox">
                                                    {{
                                                        index
                                                    }}
                                                </label>
                                                <span>
                                                    {{
                                                        '維生素A'
                                                    }}
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </transition>
                        </div>
                    </div>
                    <!-- <div>
                        選中
                    </div> -->
                    <div class="sort">
                        <span>排序：</span>
                        <div class="sortWrapper">
                            <div class="header"
                                @click="showSort">
                                <span>{{ sorting }}</span>
                                <SvgIcon name="sortDown"
                                    width='16' height="16"
                                    :style="sortDirIcon">
                                </SvgIcon>
                                <SvgIcon
                                    name="ListArrowDown"
                                    width="21px"
                                    height="21px"
                                    :class="{ sortIcon: !sortIsShow }">
                                </SvgIcon>
                            </div>
                            <transition name="sort">
                                <ul class="sortList"
                                    v-show="sortIsShow">
                                    <li v-for="(item, index) in sortList"
                                        :key="index"
                                        @click="setSortDirection(item)"
                                        @mousedown="">
                                        <button>
                                            {{ item }}
                                        </button>
                                    </li>
                                </ul>
                            </transition>
                        </div>
                        <div class="sortCount">
                            共9項
                        </div>
                    </div>
                </div>
            </div>
            <div class="saladMenu">
                <div class="item"
                    v-for="({ name, description, fileName, price }, index) in saladList"
                    :key="index">
                    <div class="menuImg">
                        <img :src="fileName" alt="商品">
                        <p>{{ price }}元</p>
                        <div class="description">
                            <span>{{ description }}</span>
                        </div>
                    </div>
                    <h3>{{ name }}</h3>
                    <!-- <p>價格</p> -->
                    <div class="ingredients">
                        <span
                            v-for="(item) in saladIngredients![index]"
                            :key="item">
                            {{ item }}
                        </span>
                    </div>
                    <div class="btnWrapper">
                        <button
                            class="cart-btn">加入購物車</button>
                        <button
                            class="info-btn">詳細資訊</button>
                        <div class="btnBackground">
                            <svg width="260" height="48"
                                viewBox="0 0 260 48"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <g id="btnBac"
                                    filter="url('#btn')">
                                    <rect id="center" y="21"
                                        width="117.52"
                                        height="6"
                                        fill="currentColor" />
                                    <path id="left"
                                        d="M0 0H26.5417H53.0833H79.625H117.553L130 48H0V0Z"
                                        fill="currentColor" />
                                    <path id="right"
                                        d="M260 48L233.458 48L206.917 48L180.375 48L142.447 48L130 4.93616e-06L260 1.5864e-05L260 48Z"
                                        fill="currentColor" />
                                </g>
                                <filter id="btn">
                                    <feGaussianBlur
                                        in="SourceGraphic"
                                        result="blur"
                                        stdDeviation="5" />
                                    <feColorMatrix in="blur"
                                        mode="matrix"
                                        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                                        result="btn" />
                                </filter>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="showFullMenuBtn">
                    <span>6 of 9</span>
                    <button>
                        展開
                    </button>
                </div>
            </div>
            <div class="smoothieMenu">
                <div class="title">
                    SMOOTHIES
                </div>
                <div class="itemWrapper">
                    <div class="item"
                        v-for="({ name, description, price, fileName }, index) in smoothieList"
                        :key="index">
                        <div class="imgWrapper">
                            <img :src="fileName" alt="商品">
                            <div class="description">
                                <span>{{ description
                                    }}</span>
                            </div>
                        </div>
                        <h3>{{ name }}</h3>
                        <p>{{ price }}元</p>
                        <div class="ingredients">
                            <span
                                v-for="(item) in smoothieIngredients![index]"
                                :key="item">
                                {{ item }}
                            </span>
                        </div>
                        <div class="btnWrapper">
                            <button
                                class="cart-btn">加入購物車</button>
                            <button
                                class="info-btn">詳細資訊</button>
                            <div class="btnBackground">
                                <svg width="260" height="48"
                                    viewBox="0 0 260 48"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <g id="btnBac"
                                        filter="url('#btn')">
                                        <rect id="center"
                                            y="21"
                                            width="117.52"
                                            height="6"
                                            fill="currentColor" />
                                        <path id="left"
                                            d="M0 0H26.5417H53.0833H79.625H117.553L130 48H0V0Z"
                                            fill="currentColor" />
                                        <path id="right"
                                            d="M260 48L233.458 48L206.917 48L180.375 48L142.447 48L130 4.93616e-06L260 1.5864e-05L260 48Z"
                                            fill="currentColor" />
                                    </g>
                                    <filter id="btn">
                                        <feGaussianBlur
                                            in="SourceGraphic"
                                            result="blur"
                                            stdDeviation="5" />
                                        <feColorMatrix
                                            in="blur"
                                            mode="matrix"
                                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                                            result="btn" />
                                    </filter>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="analystBot">
            <swiper-container effect="fade" speed="700"
                :fadeEffect="{ crossFade: true }" :autoplay="{
                    delay: 4000,
                    pauseOnMouseEnter: true
                }" :allowTouchMove="false">
                <swiper-slide
                    v-for="({ title, name, intro, avatarURL }, index) in docData"
                    :key="index">
                    <div class="analystSwiper">
                        <div class="imgWrapper">
                            <img :src="avatarURL" alt="">
                            <span>
                                {{ title }}
                            </span>
                        </div>
                        <div class="content">
                            <h2>{{ name }}</h2>
                            <p>
                                {{ intro }}
                            </p>
                            <button>
                                開始診斷
                            </button>
                        </div>
                    </div>
                </swiper-slide>
            </swiper-container>
            <div class="analystSwiper cloneSwiper">
                <div class="imgWrapper">
                    <img :src="docData[0].avatarURL" alt="">
                    <span>
                        {{ docData[0].title }}
                    </span>
                </div>
                <div class="content">
                    <h2>{{ docData[0].name }}</h2>
                    <p>
                        {{ docData[0].intro }}
                    </p>
                    <button class="target">
                        開始診斷
                    </button>
                </div>
            </div>
        </div>
        <Skeleton v-show="!isLoaded"></Skeleton>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, reactive, watch, onBeforeMount, watchEffect } from 'vue';
import type { Ref } from 'vue';
import { reqMenu } from '@/api/menu';
import Skeleton from '@components/skeleton/skeleton.vue';
import useConcatImgPath from '@/hooks/useConcatImgPath';
import { useMenuStore } from '@/store/menuStore';
import type { MenuItem } from '@/api/menu/type'
import { storeToRefs } from 'pinia';

//TODO:res 導入 pinia
//DOING  localStorage、ETag緩存 菜單摺疊
/**
 * !整理樣式
 * --------------
 * ? 初始化轉場
 * ? 加入購物車改為右上角icon
 * ? 骨架屏
 * ? mongodb 聚合管道
 * --------------
 * 菜單摺疊區塊
 * 果昔跑馬燈
 * 篩選、排序邏輯
 * 圖片縮放比例
 * --------------
 * //篩選、排序箭頭轉場
 * //縮畫面會有白邊->max width: 100%
 * //menu改4行 WrapperMargin調整 grid space around
 * //top分析改排版
 * //menu 按鈕樣式
 * //服務端導入資源
 * //api 建構
 * //req 編寫 
 * //bottom 診斷圖片 用頭貼輪播
 * //圖片路徑
 */

// 排序
function handleShowList() {
    let isShow = ref(false);

    function setShow() {
        isShow.value = !isShow.value;
    }

    return { isShow, setShow }
}

let { isShow: filterIsShow, setShow: showFilter } = handleShowList();
let { isShow: sortIsShow, setShow: showSort } = handleShowList();

// 篩選
let sortList = ref(['名稱', '價格', '人氣', '日期']),
    sorting: Ref<null | string> = ref('名稱'),
    sortIconRotate = ref(0);

function setSortDirection(n: string) {
    if (sorting.value == n) {
        sortIconRotate.value = sortIconRotate.value == 0 ? -180 : 0;
        return
    }
    sorting.value = n;
    sortIconRotate.value = 0;
}

let sortDirIcon = computed(() => ({
    transform: `rotateZ(${sortIconRotate.value}deg)`
}))


// menu btn

// bot swiper

let docAvatarUrl = useConcatImgPath(['doc01.png', 'doc02.png'], 'Menu');
let docData = [
    {
        title: '營養分析',
        name: '李醫師',
        intro: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque ipsa eveniet similique tenetur laboriosam culpa maxime aspernatur incidunt aut saepe.',
        avatarURL: docAvatarUrl[0]
    },
    {
        title: '配方分析',
        name: '張營養師',
        intro: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maxime velit totam, nulla dicta ea accusamus.',
        avatarURL: docAvatarUrl[1]
    }
];

// menu
const menuStore = useMenuStore()
const { saladList, smoothieList, isLoaded } = storeToRefs(menuStore);

let saladIngredients = computed(() => {
    if (!saladList.value) return
    let arr = saladList.value.map((item) => {
        return item.ingredients
    });
    arr.forEach(el => {
        if (el.length < 6) {
            for (let i = el.length; i < 6; i++) {
                el.push('')
            }
        }
    });
    return arr
})
let smoothieIngredients = computed(() => {
    if (!smoothieList.value) return
    let arr = smoothieList.value.map((item) => {
        return item.ingredients
    });
    arr.forEach(el => {
        if (el.length < 6) {
            for (let i = el.length; i < 6; i++) {
                el.push('')
            }
        }
    });
    return arr
})

onBeforeMount(() => {
})
onMounted(() => {
})

</script>

<style scoped lang="scss">
.container {
    @extend %fixContainer;
    @extend %headerPseudo;

    flex-direction: column;
    position: relative;
    overflow: hidden;

    * {
        // outline: 1px solid black;
    }

    &>div {
        max-width: 100%;
        width: 1440px;
        padding: 0 6rem;
        // margin: 1rem auto;
        margin-top: 4rem;

        // &:nth-child(1),
        // &:last-child {
        //     padding-left: 6rem;
        //     padding-right: 6rem;
        // }
    }

    // .menuWrapper {
    //     padding: 0 6rem;
    // }

    &:deep(.wrapper) {
        flex-direction: column;

        // background-color: red;
    }
}

%analystBtn {
    background-color: $btnBacColor;
    border-radius: 1.5rem;
    color: $primaryBacColor;
    font-size: 1.5rem;
    padding: 0.25rem 0.75rem;
    transition: box-shadow 0.2s linear;

    &:hover {
        box-shadow: 0 0 0 2px $btnBacColor;
    }
}

.analystTop {
    // @include flex-center-center;
    display: flex;
    // justify-content: space-around;
    flex-direction: row;
    // margin-top: 4rem;
    // border: 1px solid black;
    border-radius: 1rem;
    // background-color: white;
    // box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
    position: relative;

    & * {
        // outline: 1px solid black;
    }

    &::after {
        @include WnH(calc(100% - 12rem), 100%);
        content: '';
        box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
        border-radius: 1rem;
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 6rem;
    }

    .imgWrapper {
        @include WnH(125px);
        margin: 1rem 1rem 1rem 2rem;
        // margin-left: 2rem;
        border-radius: 100%;
        overflow: hidden;
        box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
        background-color: white;

        img {
            @include WnH(100%);
            // background-color: white;
        }
    }



    .textWrapper {
        margin-left: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: center;

        p {
            // font-size: 1rem;

        }

        h1 {
            font-size: 2rem;
            margin-top: 0.5rem;
            line-height: 2rem;
            position: relative;

            .subTitle {
                font-size: 1rem;
                line-height: 24px;
                position: absolute;
                top: -100%;
            }

            .text {
                font-size: 2.5rem;
                margin-right: 0.5rem;
                font-family: "Mr Dafoe", cursive;
            }
        }
    }

    button {
        @include WnH(9rem, 3rem);
        @extend %analystBtn;
        // margin-top: 1rem;
        margin: 0 auto;
        align-self: center;
    }
}

%hoverBotLine {
    &::before {
        @include WnH(100%, 1px);
        background-color: black;
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
    }

    &:hover {
        &::before {
            transform: translateX(0);
        }
    }
}

.menuWrapper {
    // margin-top: 4rem;

    .title {
        .breadCrumb {
            font-size: 0.75rem;
        }

        .titleText {
            font-size: 1.75rem;
            font-family: "EB Garamond", 'Noto Sans';
            font-variation-settings: 'wght' 750;
            margin-bottom: 1rem;
        }

        .filterWrapper {
            width: 100%;
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            position: relative;

            * {
                // outline: 1px solid black;
            }

            &>div {
                display: flex;
                align-items: center;
            }

            .filter {
                * {
                    // outline: 1px solid black;
                }

                .details {
                    margin-left: 1rem;

                    .summary {
                        cursor: pointer;
                        font-size: 14px;
                        display: flex;
                        gap: 0.25rem;
                        user-select: none;
                        position: relative;
                        overflow: hidden;

                        span {
                            position: relative;
                            @extend %hoverBotLine;
                        }

                        .filterArrow {
                            transform: rotateZ(-90deg);
                            transition: transform 0.3s ease;
                        }

                        .rotateArrow {
                            transform: rotateZ(0deg);
                        }


                    }

                    &:hover .summary>span::before {
                        transform: translateX(0);
                    }

                    .listWrapper {
                        @include WnH(375px, 400px);
                        background-color: $primaryBacColor;
                        // border: 1px solid black;
                        // border-radius: 1rem;
                        box-shadow: 1px 1px 4px black;
                        position: absolute;
                        top: 150%;
                        overflow-y: scroll;
                        z-index: 3;
                        transition: transform 0.3s ease;

                        .exit {
                            cursor: pointer;
                            position: absolute;
                            z-index: 1;
                            top: 5px;
                            right: 5px;
                            color: gray;

                            &:hover {
                                scale: 1.1;
                                color: black;
                            }
                        }

                        .listHeader {
                            display: flex;
                            margin: 8px 14px 0 14px;
                            padding: 1rem 0.5rem;
                            justify-content: space-between;
                            align-items: center;
                            // box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.552);
                            border-radius: calc(1rem - 12px);
                            position: relative;

                            form {
                                position: relative;
                                display: flex;
                                justify-content: center;
                                align-items: center;

                                input {
                                    // box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.551);
                                    // border: 2px inset rgba(0, 0, 0, 0.45);
                                    border-radius: 1rem;
                                    padding-left: 0.75rem;
                                    box-shadow: 1px 1px 4px inset rgba(0, 0, 0, 0.5);
                                    background-color: $primaryBacColor;
                                    line-height: 32px;
                                    transition: background-color 0.15s ease;

                                    &::placeholder {
                                        transition: opacity 0.15s ease;
                                    }

                                    &:focus {
                                        // border: 2px solid gray;
                                        transition: background-color 0.15s ease;
                                        outline: none;
                                        background-color: white;

                                        &::placeholder {
                                            opacity: 0;
                                        }
                                    }
                                }

                                .searchIcon {
                                    cursor: pointer;
                                    position: absolute;
                                    top: 50%;
                                    right: 8px;
                                    transform: translateY(-50%);
                                }
                            }

                            &::after {
                                @include WnH(100%, 2px);
                                content: '';
                                position: absolute;
                                left: 0;
                                bottom: 0;
                                background-color: rgba(0, 0, 0, 0.25);
                            }
                        }

                        .fieldset>ul {
                            margin: 1rem calc(20px + 0.75rem);

                            .select {
                                border: 2px inset rgba(0, 0, 0, 1);
                                box-shadow: inset 2px 2px 3px rgba(0, 0, 0, 0.5);
                                background-color: $btnBacColor_light;

                                span {
                                    color: white;
                                    // text-shadow: 0px 0px 0px white;
                                    // -webkit-text-stroke: 1px white;
                                    // text-shadow: 1px white;
                                }
                            }

                            li {
                                cursor: pointer;
                                padding: 0.25rem 0.25rem;
                                margin: 6px 0;
                                border: 2px outset rgba(0, 0, 0, 1);
                                border-radius: 0.25rem;
                                box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.5);
                                position: relative;
                                text-align: center;
                                // // color: white;
                                // background-color: green;

                                label {
                                    display: none;
                                }

                                span {
                                    font-size: 1rem;
                                    font-variation-settings: 'wght' 500;
                                }

                                // &:nth-of-type(1):after {
                                //     @include WnH(100%);
                                //     border-radius: 0.25rem;
                                //     content: '';
                                //     position: absolute;
                                //     background-color: green;
                                //     top: 3px;
                                //     left: 3px;
                                //     z-index: -1;
                                // }
                            }
                        }

                        &::before {
                            @include WnH(30%);
                            content: '';
                            position: absolute;
                            top: -6%;
                            left: 0;
                            z-index: -1;
                        }
                    }

                    .filter-enter-active,
                    .filter-leave-active {
                        transition: transform 0.3s ease, opacity 0.3s ease;
                    }

                    .filter-enter-from,
                    .filter-leave-to {
                        opacity: 0;
                        transform: translateY(-5%);
                    }

                    .filter-enter-to,
                    .filter-leave-from {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            }

            .sort {
                user-select: none;

                &>span {
                    margin-right: 1rem;
                }

                .sortWrapper {
                    // $listWidth: 80px;
                    position: relative;
                    cursor: pointer;
                    // width: $listWidth;
                    // display: flex;
                    // gap: 0.25rem;

                    .header {
                        display: flex;
                        gap: 0.25rem;
                        overflow: hidden;
                        width: 74px;
                        position: relative;

                        span {
                            // padding-left: 14px;
                            text-wrap: nowrap;
                            text-align: center;
                            position: relative;
                            @extend %hoverBotLine;
                        }

                        div {
                            transition: transform 0.3s ease;
                        }

                        .sortDirIcon {
                            // transform: rotate();
                            transition: transform 0.3s ease;
                        }

                        .sortIcon {
                            transform: rotateZ(-90deg);
                        }
                    }

                    &:hover .header>span::before {
                        transform: translateX(0);
                    }

                    .sortList {
                        @include flex-center-center;
                        background-color: $primaryBacColor;
                        // border: 1px solid black;
                        box-shadow: 1px 1px 4px black;
                        flex-direction: column;
                        // width: calc(63px + 0.25rem);
                        width: 100%;
                        position: absolute;
                        top: 150%;
                        z-index: 3;

                        li {
                            @include flex-center-center;
                            width: 100%;
                            margin-top: 0.5rem;
                            text-align: center;
                            text-wrap: nowrap;
                            transition: box-shadow 0.15s ease;



                            &:last-of-type {
                                margin-bottom: 0.5rem;
                            }

                            button {
                                border-radius: 4px;
                                width: 80%;
                                position: relative;
                                // text-align: center;

                                &:hover {
                                    box-shadow: 0 0 3px black;
                                }

                                &:active {
                                    outline: 1px solid black;
                                }

                                &::after {
                                    @include WnH(100%, 1px);
                                    background-color: gray;
                                    content: '';
                                    position: absolute;
                                    left: 0;
                                    bottom: -4px;
                                }
                            }

                            &:last-of-type>button::after {
                                display: none;
                            }
                        }

                        &::before {
                            @include WnH(100%);
                            content: '';
                            position: absolute;
                            top: -5%;
                            left: 0;
                            z-index: -1;
                            // background-color: black;
                        }
                    }

                    .sort-enter-active,
                    .sort-leave-active {
                        transition: transform 0.3s ease, opacity 0.3s ease;
                    }

                    .sort-enter-from,
                    .sort-leave-to {
                        opacity: 0;
                        transform: translateY(-5%);
                    }

                    .sort-enter-to,
                    .sort-leave-from {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .sortCount {
                    margin-left: 1rem;
                }
            }
        }
    }

    %menuItem {
        @include flex-center-center;
        flex-direction: column;
        // gap: 1rem;
        width: 100%;

        .menuImg {
            @include flex-center-center;
            @include WnH(250px);
            background: no-repeat url('@assets/img/Menu/bac_wood.jpg') center/contain;
            // border-radius: 3rem 40% 1rem 1rem;
            cursor: pointer;
            border-radius: 2.5rem;
            position: relative;
            // margin-top: 1rem;
            // overflow: hidden;

            img {
                @include WnH(70%);
                filter: drop-shadow(4px 4px 4px black);
                transition: scale 0.3s ease;
            }

            p {
                @include WnH(60px, 35px);
                background: $primaryBacColor;
                border-radius: 0.5rem 0 0 0;
                // display: block;
                position: absolute;
                right: -1px;
                bottom: -1px;
                z-index: 2;
                text-align: center;
                line-height: 35px;
                font-variation-settings: 'wght' 900;
                color: $secondBacColor;
            }

            .description {
                @include WnH(100%);
                @include flex-center-center;
                color: $primaryBacColor;
                position: absolute;
                top: 0;
                left: 0;
                background-color: rgba(0, 0, 0, 0.5);
                border-radius: 2.5rem;
                opacity: 0;
                transition: opacity 0.3s ease;

                span {
                    padding: 1rem;
                }
            }

            &:hover {
                img {
                    scale: 1.1;
                }

                .description {
                    opacity: 1;
                }
            }
        }

        &>h3 {
            font-size: 1.5rem;
            font-variation-settings: 'wght' 600;
            color: $secondBacColor;
            margin-top: 0.5rem;
        }

        .ingredients {
            width: 90%;
            display: grid;
            grid-template-columns: 30% 30% 30%;
            justify-content: center;
            justify-items: center;
            gap: 3px;
            border-radius: 8px;
            overflow: hidden;
            margin-top: 0.5rem;


            span {
                @include WnH(100%, 24px);
                // border: 2px solid $primaryBacColor;
                background-color: $btnBacColor_light;
                color: $primaryBacColor;
                display: inline-block;
                font-size: 14px;
                font-variation-settings: 'wght' 500;
                line-height: 24px;
                text-align: center;

                &:nth-of-type(1) {
                    border-radius: 0.5rem 0 0 0;
                }

                &:nth-of-type(3) {
                    border-radius: 0 0.5rem 0 0;
                }

                &:nth-last-of-type(3) {
                    border-radius: 0 0 0 0.5rem;
                }

                &:last-of-type {
                    border-radius: 0 0 0.5rem 0;
                }
            }


        }

        .btnWrapper {
            display: flex;
            justify-content: center;
            white-space: nowrap;
            width: 100%;
            height: 32px;
            overflow: hidden;
            position: relative;
            // border: 1px solid rgb(0, 0, 0, 0.25);
            border-radius: 8px;
            box-shadow: 2px 2px 8px rgb(0, 0, 0, 0.5);
            z-index: 0;
            margin-top: 1.25rem;

            * {
                // border: 1px solid black;
            }

            &>button {
                width: 50%;
                overflow: hidden;
                transition: color 0.3s ease;
                font-variation-settings: 'wght' 500;

                &:hover {
                    color: $primaryBacColor;
                }
            }

            .cart-btn {
                color: $primaryBacColor;
            }

            &:has(.info-btn:hover) {

                &>.cart-btn {
                    color: black;
                }

                &>.btnBackground {

                    #center {
                        transform: translateX(137px);
                    }

                    #left {
                        scale: 0;
                    }

                    #right {
                        scale: 1;
                    }
                }
            }

            .btnBackground {
                transform: translateY(-15%);
                position: absolute;
                z-index: -1;


                g>* {
                    fill: $btnBacColor;
                    // transition: scale 0.5s ease, transform 0.5s ease;
                    transform-origin: center;
                }

                #right {
                    scale: 0;
                    transition: scale 0.4s ease-in-out;
                }

                #center {
                    transition: transform 0.5s ease-in-out;
                }

                #left {
                    transition: scale 0.4s ease-in-out;
                }

            }
        }
    }

    .saladMenu {
        margin-top: 1.5rem;
        padding: 0 1rem;
        display: grid;
        justify-content: space-between;
        grid-template-columns: 20% 20% 20% 20%;
        // grid-template-columns: repeat(4, 1fr);
        grid-template-rows: auto;
        row-gap: 2rem;

        .item {
            @extend %menuItem;
        }

        .showFullMenuBtn {
            // grid-column: 2;
            grid-column: 2 / span 2;
            justify-self: center;
            margin: 2rem 0;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            font-variation-settings: 'wght' 500;

            span {
                text-align: center
            }

            button {
                @include WnH(75px, 40px);
                border: 1px solid rgba(0, 0, 0, 0.5);
                border-radius: 40px;
                position: relative;
                z-index: 0;
                overflow: hidden;
                transition: box-shadow 0.2s ease;
                box-shadow: 1px 1px 3px black;
                // background-color: black;
                // background-clip: text;

                &:hover {
                    box-shadow: 1px 1px 6px black;
                }

                &:active {
                    // transform: translateY(1px);
                    box-shadow: 0px 0px 3px black;
                }

                // &::after {
                //     @include WnH(150%);
                //     content: '';
                //     position: absolute;
                //     top: 50%;
                //     left: calc(50%);
                //     z-index: -1;
                //     transform: translate(-50%, -50%) scale(1);
                //     // background-color: $primaryBacColor;
                //     background-color: transparent;
                //     border-radius: 40px;
                //     transition: transform 0.5s ease;
                //     transform-origin: center;
                // }
            }
        }
    }

    .smoothieMenu {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        position: relative;
        z-index: 0;
        // overflow: hidden;

        &::after {
            @include WnH(100vw, 100%);
            content: '';
            position: absolute;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            z-index: -1;
            // background-color: #FFEDA4;
        }

        .title {
            font-size: 1.75rem;
            font-family: "EB Garamond", 'Noto Sans';
            font-variation-settings: 'wght' 750;
            // margin-bottom: 1rem;
        }

        .itemWrapper {
            margin: 1.5rem 0;
            // padding: 0 1rem;
            padding-left: 1rem;
            display: flex;
            flex-direction: row;
            gap: 2rem;

            .item {
                @extend %menuItem;
                @include WnH(300px, 100%);
                // flex-shrink: 0;
                // width: auto;
                flex: 0 0 auto;
                padding: 1rem;
                padding-top: 28px;
                border: 1px solid black;
                border-radius: 150px 150px 1rem 1rem;
                box-shadow: 8px -5px 0px $secondBacColor;
                overflow: hidden;

                .btnWrapper {
                    box-shadow: 1px 0px 5px black;

                    .btnBackground {
                        transform: translateY(-10%);
                        scale: 1.5;
                    }
                }

                .imgWrapper {
                    @include WnH(250px);
                    @include flex-center-center;
                    position: relative;
                    overflow: hidden;
                    border-radius: 134px 134px 1rem 1rem;
                    box-shadow: 1px 0px 10px black;
                    // padding: 1rem;

                    img {
                        @include WnH(100%);
                        transition: scale 0.3s ease;
                        // border-radius: 7rem 7rem 1rem 1rem;
                        // box-shadow: 2px 2px 3px black;
                    }

                    .description {
                        @include WnH(100%);
                        @include flex-center-center;
                        color: $primaryBacColor;
                        position: absolute;
                        top: 0;
                        left: 0;
                        background-color: rgba(0, 0, 0, 0.5);
                        border-radius: 7rem 7rem 1rem 1rem;
                        opacity: 0;
                        transition: opacity 0.3s ease;

                        span {
                            transform: translateY(20%);
                            padding: 1rem
                        }
                    }

                    &:hover {
                        img {
                            scale: 1.05;
                        }

                        .description {
                            opacity: 1;
                        }
                    }
                }
            }
        }
    }
}

.analystBot {
    // display: flex;
    // margin-bottom: 4rem;
    position: relative;
    z-index: 0;

    swiper-container {
        width: 100%;
    }

    .analystSwiper {
        display: flex;
        // margin-bottom: 4rem;
        margin: 4rem 1rem 8rem 1rem;

        .imgWrapper {
            @include WnH(300px);
            flex-shrink: 0;
            // border: 1px solid black;
            box-shadow: 1px 1px 5px black;
            border-radius: 100%;
            // overflow: hidden;
            position: relative;
            z-index: 0;

            img {
                // @include WnH(100%);
                // filter: drop-shadow(4px 0px 8px gray);
                border-radius: 100%;
            }

            span {
                @include WnH(140px, 40px);
                background-color: #FFEDA4;
                border: 1px solid black;
                border-radius: 30px;
                font-size: 1.5rem;
                font-variation-settings: 'wght' 600;
                position: absolute;
                left: 50%;
                bottom: -5%;
                transform: translateX(-50%);
                text-align: center;
                line-height: 40px;
                z-index: 1;
            }
        }

        .content {
            * {
                // outline: 1px solid black;
            }

            // padding: 3rem 8rem 0 8rem;
            margin: auto 5rem;
            padding: 2rem 3rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            // align-items: center;
            // gap: 1.5rem;
            border-radius: 2rem;
            box-shadow: 1px 1px 5px black;

            h2 {
                font-variation-settings: 'wght' 600;
                font-size: 2rem;
            }

            p {
                font-size: 1.25rem;
                margin-top: 0.75rem;
                // min-height: 90px;
                height: 120px;
                overflow: hidden;
            }

            button {
                @include WnH(9rem, 3rem);
                @extend %analystBtn;
                font-size: 1.5rem;
                align-self: center;
                margin-top: 1rem;
                // visibility: hidden;
            }
        }
    }

    .cloneSwiper {
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        pointer-events: none;

        .imgWrapper,
        .content {
            box-shadow: none;
        }

        &>div *:not(.target) {
            visibility: hidden;
        }
    }


}
</style>