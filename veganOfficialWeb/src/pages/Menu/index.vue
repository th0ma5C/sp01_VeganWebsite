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
                <div class="filter">
                    篩選：篩選
                </div>
            </div>
            <div class="saladMenu">
                <div>1</div>
                <div>2</div>
                <div>3</div>
            </div>
            <div class="smoothyMenu">
                <div>
                    SMOOTHIES
                </div>
                <div>
                    <div>1</div>
                    <div>2</div>
                    <div>3</div>
                </div>
            </div>
        </div>
        <div class="analystBot">
            <div>
                圖片
            </div>
            <div>
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
            padding: 0 6rem;
        }
    }

    .menuWrapper {
        padding: 0 11rem;
    }
}

.analystTop {
    @include flex-center-center;
    flex-direction: column;

    &>* {
        margin-top: 1rem;
    }
}
</style>