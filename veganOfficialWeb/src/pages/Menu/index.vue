<template>
    <div class="container">
        <div class="analystTop">
            <!-- <div> -->
            <p>您做過專屬個人診斷了嗎?</p>
            <h1>
                讓<span>Relation-Ship</span>團隊的專業分析，為您打造專屬菜單
            </h1>
            <button>開始AI診斷</button>
            <!-- </div> -->
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
                        <details>
                            <summary>
                                食材種類
                                <SvgIcon
                                    name="ListArrowDown"
                                    width="21px"
                                    height="21px">
                                </SvgIcon>
                            </summary>
                            <div class="listWrapper">
                                <div class="listHeader">
                                    <input type="text">
                                    <div>
                                        已選取幾項
                                    </div>
                                    <div>
                                        重設
                                    </div>
                                </div>
                                <fieldset>
                                    <!-- <legend>
                                        食材種類
                                    </legend> -->
                                    <ul>
                                        <li>
                                            <label
                                                for="salad1">
                                                <input
                                                    id="salad1"
                                                    type="checkbox">
                                                1111111111111111
                                            </label>
                                        </li>
                                        <li>
                                            <label
                                                for="salad2">
                                                <input
                                                    id="salad2"
                                                    type="checkbox">
                                                2222222222222222222
                                            </label>
                                        </li>
                                        <li>
                                            <label
                                                for="salad13">
                                                <input
                                                    id="salad13"
                                                    type="checkbox">
                                                33333333333333333
                                            </label>
                                        </li>
                                    </ul>
                                </fieldset>
                            </div>
                        </details>
                    </div>
                    <div style="display: none;">
                        選中
                    </div>
                    <div class="sort">
                        <span>排序：</span>
                        <div class="sortWrapper">
                            <span>名稱</span>
                            <SvgIcon name="ListArrowDown"
                                width="21px" height="21px"
                                class="sortIcon"
                                @click="setShowList">
                            </SvgIcon>
                            <ul class="sortList"
                                v-show="showList">
                                <li>名稱</li>
                                <li>價格</li>
                                <li>人氣</li>
                                <li>日期</li>
                            </ul>
                            <!-- <select id="sortSelect">
                                <option value="name">名稱
                                </option>
                                <option value="price">價格
                                </option>
                            </select> -->
                        </div>
                        <div class="sortCount">
                            共9項
                        </div>
                    </div>
                </div>
            </div>
            <div class="saladMenu">
                <div class="item" v-for="(item, index) in 9"
                    :key="index">
                    <img src="@assets/img/1.jpg" alt="商品">
                    <p>價格</p>
                    <button>加入購物車/詳細資訊</button>
                </div>
                <div class="showListBtn">
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
                        <p>價格</p>
                        <button>加入購物車/詳細資訊</button>
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
</template>

<script setup lang="ts">
import { ref } from 'vue';

//TODO: 
/**
 * 按鈕樣式
 * 篩選、排序箭頭轉場
 * 整理樣式
 * 服務端導入資源
 * api 建構
 * req 編寫 
 * res 導入 pinia
 * bottom 診斷圖片
 * ? 加入購物車改為右上角icon
 */


// 排序
let showList = ref(false);

function setShowList() {
    showList.value = !showList.value;
}

</script>

<style scoped lang="scss">
.container {
    @extend %fixContainer;
    @extend %headerPseudo;

    flex-direction: column;
    position: relative;

    &>div {
        width: 1440px;
        margin: 1rem auto;

        &:nth-child(1),
        &:last-child {
            padding-left: 6rem;
            padding-right: 6rem;
        }
    }

    .menuWrapper {
        padding: 0 11rem;
    }
}

.analystTop {
    @include flex-center-center;
    flex-direction: column;

    &>*:not(:first-child) {
        margin-top: 1rem;
    }

    p {
        // font-size: 1rem;
    }

    h1 {
        font-size: 2rem;

        span {
            margin: 0 0.5rem;
            font-family: "Mr Dafoe", cursive;
        }
    }

    button {
        font-size: 1.5rem;
    }
}

.menuWrapper {
    .title {
        .breadCrumb {
            font-size: 0.75rem;
        }

        .titleText {
            font-size: 1.75rem;
            margin: 1rem 0;
        }

        .filterWrapper {
            width: 100%;
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            position: relative;

            &>div {
                display: flex;
                align-items: center;
            }

            .filter {
                * {
                    // outline: 1px solid black;
                }

                // flex: 1;

                details {
                    margin-left: 14px;

                    summary {
                        font-size: 14px;
                        list-style: none;
                        display: flex;
                        gap: 0.25rem;
                        cursor: pointer;
                        user-select: none;
                    }

                    .listWrapper {
                        background-color: $primaryBacColor;
                        border: 1px solid black;
                        position: absolute;
                        width: 300px;

                        .listHeader {
                            display: flex;
                            padding: 1rem;
                            justify-content: space-between;
                        }

                        fieldset>ul {
                            padding: 1rem;

                            li {
                                padding: 0.5rem 0;
                            }
                        }
                    }
                }
            }

            .sort {
                * {
                    // outline: 1px solid black;
                }

                // gap: 1.5rem;
                user-select: none;

                .sortWrapper {
                    $listWidth: 80px;
                    width: $listWidth;
                    display: flex;
                    justify-content: space-between;

                    &>span {
                        margin: auto;
                    }

                    .sortIcon {
                        cursor: pointer;
                    }

                    .sortList {
                        @include flex-center-center;
                        background-color: $primaryBacColor;
                        border: 1px solid black;
                        flex-direction: column;
                        width: calc($listWidth - 21px);
                        position: absolute;
                        top: 21px;
                    }
                }

                .sortCount {
                    margin-left: 1rem;
                }
            }
        }
    }

    .saladMenu {
        margin-top: 1.5rem;
        display: grid;
        justify-content: space-evenly;
        grid-template-columns: 25% 25% 25%;
        grid-template-rows: auto;
        row-gap: 2rem;

        .item {
            @include flex-center-center;
            flex-direction: column;
            gap: 1rem;
            width: 100%;

            &>img {
                @include WnH(250px);
            }
        }

        .showListBtn {
            grid-column: 2;
            justify-self: center;
            margin: 2rem 0;
            display: flex;
            flex-direction: column;
            gap: 0.5rem
        }
    }

    .smoothyMenu {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .title {
            font-size: 1.75rem;
        }

        .itemWrapper {
            margin-top: 1.5rem;
            margin-left: 1.5rem;
            display: flex;
            flex-direction: row;
            gap: 2rem;

            .item {
                @include flex-center-center;
                flex-direction: column;
                flex-shrink: 0;
                gap: 1rem;

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

    img {
        @include WnH(300px);
        flex-shrink: 0;
        // flex: 1;
    }

    .content {
        padding: 3rem 8rem;
        display: flex;
        flex-direction: column;
        // align-items: start;
        justify-content: center;
        gap: 1rem;

        h2 {
            font-size: 2rem;
        }

        p {
            font-size: 1.25rem;
        }

        button {
            font-size: 1.5rem;
            align-self: center;
        }
    }
}
</style>