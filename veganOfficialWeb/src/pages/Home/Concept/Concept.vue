<template>
    <div class="newsContainer">
        <div class="tabContainer">
            <div class="tabHeader">
                <h2>
                    <small>News</small>
                    最新消息
                </h2>
                <ul>
                    <li>全部</li>
                    <li>新品</li>
                    <li>活動</li>
                    <li>會員</li>
                </ul>
            </div>
            <div class="tabs">
                <div class="tab">
                    <ul>
                        <li>
                            <div>
                                頭 日期
                            </div>
                            <div>
                                標籤
                            </div>
                            <div>
                                Lorem ipsum dolor sit amet
                                consectetur adipisicing
                                elit. Debitis, praesentium.
                            </div>
                        </li>
                        <li>
                            <div>
                                頭1
                            </div>
                            <div>
                                標籤
                            </div>
                            <div>
                                Lorem ipsum dolor sit amet
                                consectetur adipisicing
                                elit. Debitis, praesentium.
                            </div>
                        </li>
                        <li>
                            <div>
                                頭2
                            </div>
                            <div>
                                標籤
                            </div>
                            <div>
                                Lorem ipsum dolor sit amet
                                consectetur adipisicing
                                elit. Debitis, praesentium.
                            </div>
                        </li>
                        <li>
                            <div>
                                頭3
                            </div>
                            <div>
                                標籤
                            </div>
                            <div>
                                Lorem ipsum dolor sit amet
                                consectetur adipisicing
                                elit. Debitis, praesentium.
                            </div>
                        </li>
                        <li>
                            <div>
                                頭4
                            </div>
                            <div>
                                標籤
                            </div>
                            <div>
                                Lorem ipsum dolor sit amet
                                consectetur adipisicing
                                elit. Debitis, praesentium.
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="botBtn">
            <button>列表-></button>
        </div>
    </div>
    <!-- <div class="conceptContainer">

    </div> -->
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

//TODO: 新聞資料建置、請求邏輯編寫、tab換頁邏輯
/**
 * *標籤SVG、背景跑馬燈、hover高亮圓圈、底線畫出
 * *btn hover效果、箭頭SVG
 * *內文靠上
 */

let news = ref({
    data: [
        {
            id: 1,
            timestamp: "2024-06-16T12:34:56Z",
            category: "活動",
            title: "夏季特別促銷",
            content: "參加我們的夏季促銷活動，享受最高50%的折扣！"
        },
    ]
})



onMounted(() => {

})
</script>

<style scoped lang="scss">
* {
    // border: 1px solid;
}

.newsContainer {
    @include main-part;
    @include flex-center-center;
    flex-direction: column;
    margin-top: 96px;
    height: 888px;

    .tabContainer {
        // @include flex-center-center;
        @include WnH(100%);
        align-items: center;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        // position: relative;

        &>div {
            width: 80%;
        }
    }

    .botBtn {
        @include flex-center-center;
        @include WnH(150px, 50px);
        border: 1px solid black;
        border-radius: 40px;
        font-size: 20px;
        margin: 0 10% 2rem auto;
    }
}


.tabHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 3rem;

    h2 {
        display: inline-flex;
        justify-content: center;
        flex-direction: column;
        font-size: 2.5rem;
        transform: translateY(-13px);

        small {
            transform: translateX(2px);
            font-size: 1rem;
            opacity: 0.5;
        }
    }

    ul {
        display: flex;

        li {
            font-size: 1.25rem;
            margin-left: 2rem;
        }
    }
}

.tabs {
    flex: 1;
}

.tab {
    display: flex;
    height: 100%;

    ul {
        // height: 100%;
        display: flex;
        flex: 1;
        flex-direction: column;
    }

    %pseudo-li-line {
        @include WnH(100vw, 1px);
        // background-color: black;
        background: linear-gradient(to right, hsl(0, 0%, 50%) 33%, rgba(255, 255, 255, 0) 0%);
        background-size: 5px 1px;
        content: '';
        position: absolute;
        left: 0;
        transform: translateX(calc(-1 * (6rem + (100vw - 6rem) * 0.1)));
    }

    li {
        // height: 20%;
        align-items: center;
        display: flex;
        flex: 0 0 20%;
        position: relative;

        &::before {
            @extend %pseudo-li-line;
            top: 0;
        }

        &:last-child::after {
            @extend %pseudo-li-line;
            bottom: 0;
        }

        div:nth-child(1) {
            opacity: 0.5;
            flex: 1;
            text-align: center;
        }

        div:nth-child(2) {
            flex: 1;
            text-align: center;
        }

        div:nth-child(3) {
            flex: 8;
            padding-left: 2rem;
        }
    }
}
</style>