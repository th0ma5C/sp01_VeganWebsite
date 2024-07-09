<template>
    <div class="container">
        <div class="analystTop">
            <!-- <div> -->
            <p>您做過專屬個人診斷了嗎?</p>
            <h1>
                讓<span>Relation-Ship</span>的專業分析，為您打造專屬菜單
            </h1>
            <button>開始免費AI診斷</button>
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
                        <input type="text" list="sort" />
                        <datalist id="sort"
                            style="background-color: red;">
                            <option value="1"
                                style="background-color: red;">
                                1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </datalist>
                    </div>
                    <div class="sort">
                        <div>
                            <span>排序：</span>
                            <select id="sortSelect">
                                <option value="name">名稱
                                </option>
                                <option value="price">價格
                                </option>
                            </select>
                        </div>
                        <div>
                            共幾項
                        </div>
                    </div>
                </div>
            </div>
            <div class="saladMenu">
                <div class="item" v-for="(item, index) in 9"
                    :key="index">
                    <img src="" alt="商品">
                    <p>價格</p>
                    <button>加入購物車/詳細資訊</button>
                </div>
            </div>
            <div class="smoothyMenu">
                <div>
                    SMOOTHIES
                </div>
                <div class="itemWrapper">
                    <div class="item"
                        v-for="(item, index) in 6"
                        :key="index">
                        <img src="" alt="商品">
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
            font-size: 1.5rem;
            margin: 1rem 0;
        }

        .filterWrapper {
            width: 100%;
            display: flex;
            justify-content: space-between;
            font-size: 0.75rem;

            &>div {
                display: flex;
                align-items: center;
            }

            .filter {
                // flex: 1;

            }

            .sort {
                // flex: 1;
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
                @include WnH(200px);
            }
        }
    }

    .smoothyMenu {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .itemWrapper {
            margin-top: 1.5rem;
            display: flex;
            flex-direction: row;

            .item {
                @include flex-center-center;
                flex-direction: column;
                gap: 1rem;
                // width: 25%;

                &>img {
                    @include WnH(200px);
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
        justify-content: center;
        gap: 1rem;
    }
}
</style>