<template>
    <div class="upperContainer">
        <div class="left">
            <div class="page1">
                <h1>
                    About Us
                </h1>

                <div class="navContainer">
                    <div class="nav">
                        <div class="textWrapper">
                            <span>
                                CONCEPT
                            </span>
                            <span>
                                CONCEPT
                            </span>
                        </div>

                        <div class="arrowIcon">
                            <SvgIcon name="rightArrow"
                                width="16px" height="16px"
                                color="#FCFAF2">
                            </SvgIcon>
                        </div>
                    </div>
                    <div class="nav">
                        <div class="textWrapper">
                            <span>
                                ACCESS
                            </span>
                            <span>
                                ACCESS
                            </span>
                        </div>

                        <div class="arrowIcon">
                            <SvgIcon name="rightArrow"
                                width="16px" height="16px"
                                color="#FCFAF2">
                            </SvgIcon>
                        </div>
                    </div>
                    <div class="nav">
                        <div class="textWrapper">
                            <span>
                                FAQ
                            </span>
                            <span>
                                FAQ
                            </span>
                        </div>

                        <div class="arrowIcon">
                            <SvgIcon name="rightArrow"
                                width="16px" height="16px"
                                color="#FCFAF2">
                            </SvgIcon>
                        </div>
                    </div>
                </div>
            </div>

            <div class="page2">
                <div class="top">
                    <div>
                        <div class="starWrapper">
                            <SvgIcon name="Star"
                                width="26px" height="26px"
                                color="#0d731e"
                                v-for="(item, index) in 5"
                                :key="index"></SvgIcon>
                        </div>
                        <div class="middleText">
                            <h2>
                                Lorem, ipsum.
                            </h2>
                            <p>
                                Lorem ipsum dolor sit.
                            </p>
                        </div>
                    </div>
                    <div>
                        <div class="starWrapper">
                            <SvgIcon name="Star"
                                width="26px" height="26px"
                                color="#0d731e"
                                v-for="(item, index) in 5"
                                :key="index"></SvgIcon>
                        </div>
                        <div class="middleText">
                            <h2>
                                Lorem, ipsum.
                            </h2>
                            <p>
                                Lorem ipsum dolor sit amet.
                            </p>
                        </div>
                    </div>
                    <div>
                        <div class="starWrapper">
                            <SvgIcon name="Star"
                                width="26px" height="26px"
                                color="#0d731e"
                                v-for="(item, index) in 5"
                                :key="index"></SvgIcon>
                        </div>
                        <div class="middleText">
                            <h2>
                                Lorem, ipsum.
                            </h2>
                            <p>
                                Lorem ipsum dolor sit.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="content">
                    <div class="text">
                        <h2>
                            <SvgIcon name="Mark"
                                width="24px" height="24px"
                                color="black"
                                class="markIcon1">
                            </SvgIcon>
                            <span>
                                Lorem ipsum
                            </span>
                            <SvgIcon name="Mark"
                                width="24px" height="24px"
                                color="black"
                                class="markIcon1">
                            </SvgIcon>
                        </h2>
                        <p>
                            Lorem ipsum dolor sit amet
                            consectetur adipisicing elit.
                            Neque
                            vel soluta quam numquam
                            reprehenderit modi, quo, ducimus
                            eius illum dignissimos eaque
                            optio
                            nostrum nihil doloremque
                            accusantium
                            maxime minima recusandae
                            doloribus.
                        </p>
                    </div>

                    <div class="text">
                        <h2>
                            <SvgIcon name="Mark"
                                width="24px" height="24px"
                                color="black"
                                class="markIcon1">
                            </SvgIcon>
                            <span>
                                Lorem ipsum
                            </span>
                            <SvgIcon name="Mark"
                                width="24px" height="24px"
                                color="black"
                                class="markIcon1">
                            </SvgIcon>
                        </h2>
                        <p>
                            Lorem ipsum dolor sit amet
                            consectetur adipisicing elit.
                            Neque
                            vel soluta quam numquam
                            reprehenderit modi, quo, ducimus
                            eius illum dignissimos eaque
                            optio
                            nostrum nihil doloremque
                            accusantium
                            maxime minima recusandae
                            doloribus.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="right">
            <swiper-container :loop="true" effect="fade"
                :autoplay="{
                    delay: 3000
                }" :speed="1000"
                :pagination="{ clickable: true }"
                pagination-dynamic-bullets="true"
                :injectStyles="injectStyles">
                <swiper-slide
                    v-for="(item, index) in imgList"
                    :key="index">
                    <div class="imgSlider">
                        <img :src="item.url" alt="">
                    </div>
                </swiper-slide>
            </swiper-container>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';


const imgList = ref([
    {
        url: '/imgs/about/upper_left.webp'
    },
    {
        url: '/imgs/about/upper_right_env.webp'
    },
    {
        url: '/imgs/about/upper_right_chef.webp'
    },
]);

let injectStyles = [
    `
    :host{
        --swiper-pagination-bullet-width: 10px;
        --swiper-pagination-bullet-height: 10px;
        --swiper-pagination-color: #FCFAF2;    
    }
    `
];

</script>

<style scoped lang="scss">
* {
    // outline: 1px solid black;
}

.upperContainer {
    // height: 100vh;
    // // min-height: 920px;
    // max-height: 920px;

    // // margin-top: 100px;
    // // padding: 1rem;

    display: flex;
    // gap: 1rem;

    &>div {
        flex: 1;
    }
}

.left {


    // background-color: $btnBacColor;

    h1 {
        font-family: "EB Garamond", serif;
        font-size: 5rem;
        font-variation-settings: 'wght' 800;
        font-style: italic;
        color: $secondBacColor;
    }

    .page1 {
        min-height: 100vh;

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;


        padding-left: 8rem;
    }

    .page2 {
        min-height: 100vh;
        padding: 1rem 6rem;

        h2 {
            margin-bottom: 1.25rem;
            font-size: 1.5rem;
            font-variation-settings: 'wght' 400;
        }

        .top {
            display: flex;
            gap: 1rem;

            &>div {
                padding: 1rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                flex: 1;
                border-radius: 1rem;
                overflow: hidden;
                border: 2px solid $secondBacColor;
                border-radius: 1rem;
            }

            .starWrapper {
                display: flex;
                justify-content: center;
                margin: 1rem 0 .75rem 0;
            }

            .middleText {
                text-align: center;

                p {
                    font-size: .9rem;
                }
            }
        }

        .content {
            height: 100%;
            padding: 3rem 2rem;

            display: flex;
            flex-direction: column;
            gap: 3rem;

            p {
                line-height: 2;
            }

            h2:has(.markIcon1) {
                display: flex;
                justify-content: center;
                align-items: center;

                .markIcon1 {
                    margin-right: 1rem;
                    transform: translateY(2px);
                }

                .markIcon1:nth-of-type(2) {
                    margin-left: 1rem;
                    transform: rotate(180deg) translateY(-2px);
                }
            }
        }
    }
}

.navContainer {
    display: flex;
    gap: 2rem;

    .nav {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: .5rem;
        // overflow: hidden;

        span {
            display: block;
            color: $btnBacColor;
            font-variation-settings: 'wght' 600;
            user-select: none;
            transition: transform .3s;
        }

        span:nth-of-type(2) {
            position: absolute;
            top: 100%;
            left: 0;
        }

        .textWrapper {
            position: relative;
            overflow: hidden;
        }

        &:hover {
            .textWrapper span {
                transform: translateY(-100%)
            }

            .arrowIcon {
                transform: scale(1.2) rotate(90deg);
            }
        }
    }

    .arrowIcon {
        @include WnH(18px);
        background-color: $btnBacColor;
        transform: rotate(90deg);

        display: flex;
        justify-content: center;

        border-radius: 100%;

        transition: transform .3s;
    }
}

.right {
    max-height: calc(100vh);

    position: sticky;
    top: 0;

    // margin-top: 100px;
    overflow: hidden;

    swiper-container {
        height: 100%;
    }

    .imgSlider {
        display: flex;
        justify-content: center;
        align-items: center;

        height: 100%;

        overflow: hidden;

        img {
            max-width: none;
            height: 100%;
        }
    }
}
</style>