<template>
    <div class="container">
        <div class="analystTop">
            <div class="imgWrapper">
                <swiper-container effect="fade" speed="700"
                    autoplay-delay="4000">
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
                <!-- <p>您做過專屬個人診斷了嗎?</p> -->
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
                                @click="setFilter">
                                <span>
                                    食材種類
                                </span>
                                <SvgIcon
                                    name="ListArrowDown"
                                    width="21px"
                                    height="21px"
                                    class="filterArrow"
                                    :class="{ rotateArrow: showFilter }">
                                </SvgIcon>
                            </div>
                            <transition name="filter">
                                <div class="listWrapper"
                                    v-show="showFilter">
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
                                            <li
                                                class="select">
                                                <label
                                                    for="salad1">
                                                    <input
                                                        id="salad1"
                                                        type="checkbox">
                                                    1111111111111111
                                                </label>
                                                <span>111111111111</span>

                                            </li>
                                            <li>
                                                <label
                                                    for="salad2">
                                                    <input
                                                        id="salad2"
                                                        type="checkbox">
                                                    2222222222222222222
                                                </label>
                                                <span>2222222222222222222</span>
                                            </li>
                                            <li>
                                                <label
                                                    for="salad13">
                                                    <input
                                                        id="salad13"
                                                        type="checkbox">
                                                    33333333333333333
                                                </label>
                                                <span>33333333333333333</span>
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
                                @click="setSort">
                                <span>名稱</span>
                                <SvgIcon
                                    name="ListArrowDown"
                                    width="21px"
                                    height="21px"
                                    :class="{ sortIcon: !showSort }">
                                </SvgIcon>
                            </div>
                            <transition name="sort">
                                <ul class="sortList"
                                    v-show="showSort">
                                    <li>名稱</li>
                                    <li>價格</li>
                                    <li>人氣</li>
                                    <li>日期</li>
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
                    v-for="(item, index) in 16"
                    :key="index">
                    <div class="menuImg">
                        <img src="@assets/img/Menu/crisp.png"
                            alt="商品">
                        <p>120元</p>
                        <div class="description">
                            <span>Lorem ipsum dolor sit
                                amet.</span>
                        </div>
                    </div>
                    <h3>品名</h3>
                    <!-- <p>價格</p> -->
                    <div class="ingredients">
                        <span>維生素A</span>
                        <span>維生素A</span>
                        <span>維生素A</span>
                        <span></span>
                        <span></span>
                        <span></span>
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
            <div class="smoothyMenu">
                <div class="title">
                    SMOOTHIES
                </div>
                <div class="itemWrapper">
                    <div class="item"
                        v-for="(item, index) in 6"
                        :key="index">
                        <img src="@assets/img/1.jpg"
                            alt="商品">
                        <h3>品名</h3>
                        <p>價格</p>
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
            <img src="" alt="商品">
            <div class="content">
                <h2>標題</h2>
                <p>
                    Lorem ipsum dolor sit, amet consectetur
                    adipisicing elit. Provident quis
                    doloribus illo explicabo architecto
                    deserunt aliquam autem officiis vel
                    dicta?
                </p>
                <button>
                    開始診斷
                </button>
            </div>
        </div>
    </div>
    <!-- <Skeleton></Skeleton> -->
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { reqMenu } from '@/api/menu';
import Skeleton from '@components/skeleton/skeleton.vue'

//TODO:res 導入 pinia
//DOING menu 按鈕樣式
/**
 * //篩選、排序箭頭轉場
 * !整理樣式
 * //縮畫面會有白邊->max width: 100%
 * //menu改4行 WrapperMargin調整 grid space around
 * //top分析改排版
 * 服務端導入資源
 * api 建構
 * req 編寫 
 * bottom 診斷圖片 用頭貼輪播
 * 菜單摺疊區塊
 * 圖片縮放比例
 * ? 初始化轉場
 * ? 加入購物車改為右上角icon
 * ? 骨架屏
 * 
 */

// 排序
function handleShowList() {
    let isShow = ref(false);

    function setShow() {
        isShow.value = !isShow.value;
    }

    return { isShow, setShow }
}

let { isShow: showFilter, setShow: setFilter } = handleShowList();
let { isShow: showSort, setShow: setSort } = handleShowList();


// menu btn

const query = `
    query {
  menu {
    name
    items {
      name
      description
      ingredients
      price
      category
      fileName
    }
  }
}

`

onMounted(() => {
    // (async () => {
    //     try {
    //         let res = await reqMenu({ query });
    //         console.log(res.data);
    //     } catch (error) {
    //         console.log(error);
    //     }

    // })()
})

</script>

<style scoped lang="scss">
.container {
    @extend %fixContainer;
    @extend %headerPseudo;

    flex-direction: column;
    position: relative;

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
                        background-color: $primaryBacColor;
                        // border: 1px solid black;
                        border-radius: 1rem;
                        box-shadow: 1px 1px 4px black;
                        position: absolute;
                        top: 150%;
                        width: 350px;
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
                                    // transition: background-color 0.3s ease, opacity 0.3s ease;

                                    &:focus {
                                        // border: 2px solid gray;
                                        transition: background-color 0.15s ease;
                                        outline: none;
                                        background-color: white;

                                        &::placeholder {
                                            transition: opacity 0.15s ease;
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
                            }

                            li {
                                cursor: pointer;
                                padding: 0.25rem 0.25rem;
                                margin: 6px 0;
                                border: 2px outset rgba(0, 0, 0, 1);
                                border-radius: 0.25rem;
                                box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.5);
                                position: relative;
                                // // color: white;
                                // background-color: green;

                                label {
                                    display: none;
                                }

                                span {}

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
                        width: 53px;
                        position: relative;

                        span {
                            // padding-left: 14px;
                            text-align: center;
                            position: relative;
                            @extend %hoverBotLine;
                        }

                        div {
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
                        border: 1px solid black;
                        flex-direction: column;
                        width: calc(63px + 0.25rem);
                        position: absolute;
                        top: 150%;
                        z-index: 3;

                        &::before {
                            @include WnH(100%);
                            content: '';
                            position: absolute;
                            top: -12%;
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
                background-color: rgba(62, 163, 80);
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
            box-shadow: 2px 2px 5px rgb(0, 0, 0, 0.5);
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
                transform: translateY(-17%);
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
        display: grid;
        justify-content: space-around;
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
            gap: 0.5rem;
        }
    }

    .smoothyMenu {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .title {
            font-size: 1.75rem;
            font-family: "EB Garamond", 'Noto Sans';
            font-variation-settings: 'wght' 750;
            margin-bottom: 1rem;
        }

        .itemWrapper {
            margin-top: 1.5rem;
            margin-left: 1.5rem;
            display: flex;
            flex-direction: row;
            gap: 2rem;

            .item {
                @extend %menuItem;
                flex-shrink: 0;
                width: auto;

                &>img {
                    @include WnH(225px);
                }

            }
        }
    }
}

.analystBot {
    display: flex;
    padding-top: 2rem;
    padding-bottom: 2rem;
    margin-top: 1rem;

    img {
        @include WnH(300px);
        flex-shrink: 0;
    }

    .content {
        padding: 3rem 8rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1rem;

        h2 {
            font-size: 2rem;
        }

        p {
            font-size: 1.25rem;
        }

        button {
            @extend %analystBtn;
            font-size: 1.5rem;
            align-self: center;
        }
    }
}
</style>