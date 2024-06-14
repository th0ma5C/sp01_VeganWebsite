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
                <!-- <div class="tab">
                    <ul>
                        <li>
                            <div>
                                頭
                            </div>
                            <div>
                                標籤
                            </div>
                            <div>
                                內文
                            </div>
                        </li>
                        <li>2</li>
                        <li>3</li>
                        <li>4</li>
                        <li>5</li>
                    </ul>
                </div> -->
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
import { onMounted } from 'vue';

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
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 1rem;
    }

    .botBtn {
        @include flex-center-center;
        @include WnH(150px, 50px);
        border: 1px solid black;
        border-radius: 40px;
        font-size: 20px;
        margin: 0 8.5% 0 auto;
    }
}


.tabHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 83%;
    margin-top: 3rem;
    // padding-right: 2rem;

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
    width: 83%;
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

    li {
        // height: 20%;
        display: flex;
        flex: 0 0 20%;
        align-items: center;

        div:nth-child(1) {
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