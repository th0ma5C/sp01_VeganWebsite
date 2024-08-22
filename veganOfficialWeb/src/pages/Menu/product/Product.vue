<template>
    <div class="container">
        <div class="breadCrumb">麵包屑/麵包屑/麵包屑</div>
        <div class="productWrapper">
            <div class="imgWrapper">
                <img src="" alt="大圖">
                <div>
                    <img src="" alt="小圖">
                    <img src="" alt="小圖">
                    <img src="" alt="小圖">
                    <img src="" alt="小圖">
                </div>
            </div>

            <div class="contentWrapper">
                <div class="topContent">
                    簡短介紹
                </div>
                <div class="sizeSelector">
                    <span>要買多少</span>
                    <div class="selectWrapper">
                        <label for="">1個</label>
                        <label for="">1包</label>
                        <label for="">1箱</label>
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
                    <div>
                        <span>單位</span>
                        <span>數量</span>
                        <span>折扣</span>
                        <span>$999</span>
                        <span>運費試算</span>
                    </div>
                </div>
                <div class="infoFolder">
                    <div class="Wrapper">
                        <p>title</p>
                        <button>打開</button>
                        <div>
                            <p>
                                內容
                            </p>
                        </div>
                    </div>
                    <div class="Wrapper">
                        <p>title</p>
                        <button>打開</button>
                        <div>
                            <p>
                                內容
                            </p>
                        </div>
                    </div>
                    <div class="Wrapper">
                        <p>title</p>
                        <button>打開</button>
                        <div>
                            <p>
                                內容
                            </p>
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

</script>

<style scoped lang="scss">
.container {
    @extend %fixContainer;
    @extend %headerPseudo;

    flex-direction: column;
    width: 1440px;

    * {
        outline: 1px solid black;
    }

    .breadCrumb {}

}


.productWrapper {
    display: flex;
}

.imgWrapper {}

.contentWrapper {}

.socialMedia {}

.buyMore {}
</style>