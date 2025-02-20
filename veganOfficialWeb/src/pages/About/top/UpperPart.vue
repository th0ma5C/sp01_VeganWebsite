<template>
    <div class="upperContainer">
        <div class="left">
            <div class="padPage">
                <swiper-container :loop="true" effect="fade"
                    :autoplay="{
                        delay: 3000
                    }" :speed="1000"
                    :allowTouchMove="false"
                    :injectStyles="injectStyles">
                    <swiper-slide
                        v-for="(item, index) in imgList"
                        :key="index">
                        <div class="imgSlider">
                            <img :src="item.url" alt=""
                                :class="{
                                    objTop: item.url == imgList[2].url,
                                    objCenter: item.url == imgList[1].url,
                                    objBottom: item.url == imgList[0].url,
                                }">
                        </div>
                    </swiper-slide>
                </swiper-container>
            </div>

            <div class="page1">
                <h1>
                    About Us
                </h1>

                <div class="navContainer">
                    <button v-for="(item, index) in btnList"
                        :key="index"
                        @click="clickScroll(item)">
                        <div class="cube"
                            :data-cubeBot="item">
                            <span>
                                {{ item }}
                            </span>
                        </div>
                        <div class="wrapper arrowIcon">
                            <SvgIcon class="arrow"
                                name="rightArrow"
                                width="16px" height="16px">
                            </SvgIcon>
                        </div>
                    </button>
                </div>
                <!-- <div class="navContainer">
                    <div class="nav"
                        v-for="(item, index) in btnList"
                        :key="index"
                        @click="clickScroll(item)">
                        <div class="textWrapper">
                            <span>
                                {{ item }}
                            </span>
                            <span>
                                {{ item }}
                            </span>
                        </div>

                        <div class="arrowIcon">
                            <SvgIcon name="rightArrow"
                                width="16px" height="16px"
                                color="#FCFAF2">
                            </SvgIcon>
                        </div>
                    </div>
                </div> -->
            </div>

            <div class="page2" ref="upperContainer">
                <div class="top">
                    <div v-for="(item, index) in 2"
                        :key="index">
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
                    <div class="text"
                        v-for="(item, index) in 2"
                        :key="index">
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
                        <div v-if="index == 0"
                            class="middleStar">
                            <div class="starWrapper">
                                <SvgIcon name="Star"
                                    width="26px"
                                    height="26px"
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
                </div>
            </div>
        </div>

        <div class="right">
            <swiper-container :loop="true" effect="fade"
                :autoplay="{
                    delay: 3000
                }" :speed="1000" :allowTouchMove="false"
                :injectStyles="injectStyles"
                @swiperupdate="console.log('object');">
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
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';
import { positionStore } from '../store/usePagePosition'


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

// position store
const upperContainer = useTemplateRef('upperContainer');
function exposePosition() {
    if (upperContainer.value) {
        const { top } = upperContainer.value.getBoundingClientRect();
        positionStore.setPosition('upper', top);
    }
}

// position store
const positionState = computed(() => {
    return positionStore.getPosition();
})

const btnList = ref(['CONCEPT', 'ACCESS', 'FAQ'] as const)
function clickScroll(target: typeof btnList.value[number]) {
    switch (target) {
        case 'CONCEPT':
            const { upper } = positionState.value;
            window.scroll({
                top: upper,
                behavior: 'smooth'
            })
            break;
        case 'ACCESS':
            const { middle } = positionState.value;
            window.scroll({
                top: middle,
                behavior: 'smooth'
            })
            break;

        default:
            const { bottom } = positionState.value;
            window.scroll({
                top: bottom,
                behavior: 'smooth'
            })
            break;
    }
}

// 


onMounted(() => {
    exposePosition();
})

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
    position: relative;
    top: 100px;

    &>div {
        flex: 1;
        max-width: 50%;
    }
}

.left {
    // background-color: $btnBacColor;

    h1 {
        font-family: "EB Garamond", serif;
        font-size: 5rem;
        font-size: 3rem;
        font-size: clamp(3rem, 2.428571428571429rem + 2.857142857142857vw, 5rem);
        font-variation-settings: 'wght' 800;
        font-style: italic;
        color: $secondBacColor;
    }
}


.page1 {
    // min-height: 100vh;
    height: calc(100vh - 100px);

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding-left: 3rem;
    padding-left: clamp(3rem, -2.7142857142857135rem + 11.904761904761903vw, 8rem);
    translate: 0 -50px;
}

.page2 {
    min-height: 100vh;
    padding-block: 1rem;
    // padding-inline: 1.5rem;
    // padding-inline: clamp(1.5rem, 0.19999999999999996rem + 6.5vw, 8rem);

    h2 {
        margin-bottom: 1.25rem;
        font-size: 1.5rem;
        font-variation-settings: 'wght' 400;
    }
}

.top {
    display: flex;
    gap: 1rem;
    width: min-content;
    margin-inline: auto;

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

.middleStar {
    width: min-content;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 1rem;
    overflow: hidden;
    border: 2px solid $secondBacColor;
    border-radius: 1rem;
    margin-inline: auto;
    margin-top: 3rem;

    .middleText p {
        text-align: center;
    }
}


.content {
    height: 100%;
    padding: 3rem 2rem;
    margin-inline: auto;

    display: flex;
    flex-direction: column;
    gap: 3rem;

    p {
        text-align: justify;
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


.navContainer {
    @include flex-center-center;
    gap: 2rem;
    transition: border-color 0.5s ease;

    button {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: .5rem;
        // font-size: 0.75rem;
        // font-size: clamp(0.75rem, 0.5714285714285714rem + 0.8928571428571428vw, 1rem);

        .cube {
            backface-visibility: hidden;
            position: relative;
            transform-style: preserve-3d;
            transition: transform 0.4s ease-out;
            transform-origin: top;

            position: relative;

            span {
                transform: translateZ(5px);
                opacity: 1;
                transition: opacity 0.3s ease-out, transform 0.4s ease;

                display: block;
                color: $btnBacColor;
                font-variation-settings: 'wght' 600;
                user-select: none;
            }

            &::after {
                content: attr(data-cubeBot);
                position: absolute;
                left: 0px;
                top: 0;
                transform: rotateX(-90deg) translateZ(5px) translateY(50%);
                opacity: 0;
                transition: opacity 0.3s ease-out, transform 0.4s ease;

                color: $btnBacColor;
                font-variation-settings: 'wght' 600;
                user-select: none;
            }
        }

        .wrapper {
            @include flex-center-center;
            position: relative;

            .arrow {
                color: $btnBacColor;
                transition: color 0.5s ease;
                position: absolute;
                z-index: 2;
            }

            &::after {
                @include WnH(100%);
                content: '';
                background-color: $btnBacColor;
                border-radius: 36px;
                scale: 0;
                transition: scale 0.5s ease;
                position: absolute;
                left: 0px;
                top: 0px;
                z-index: 1;
            }
        }

        .arrowIcon {
            @include WnH(18px);
            transform: rotate(90deg);

            display: flex;
            justify-content: center;
            border-radius: 100%;
            transition: transform .3s;
        }

        &:hover {
            border-color: $secondBacColor;

            .wrapper {
                .arrow {
                    color: white;
                }

                &::after {
                    scale: 1;
                }
            }

            .cube {
                transform: rotateX(90deg);

                span {
                    opacity: 0;
                }

                &::after {
                    opacity: 1;
                }
            }
        }
    }

    // display: flex;
    // gap: 2rem;

    // .nav {
    //     cursor: pointer;
    //     display: flex;
    //     align-items: center;
    //     gap: .5rem;
    //     // overflow: hidden;

    //     span {
    //         display: block;
    //         color: $btnBacColor;
    //         font-variation-settings: 'wght' 600;
    //         user-select: none;
    //         transition: transform .3s;
    //     }

    //     span:nth-of-type(2) {
    //         position: absolute;
    //         top: 100%;
    //         left: 0;
    //     }

    //     .textWrapper {
    //         position: relative;
    //         overflow: hidden;
    //     }

    //     &:hover {
    //         .textWrapper span {
    //             transform: translateY(-100%)
    //         }

    //         .arrowIcon {
    //             transform: scale(1.2) rotate(90deg);
    //         }
    //     }
    // }

    // .arrowIcon {
    //     @include WnH(18px);
    //     background-color: $btnBacColor;
    //     transform: rotate(90deg);

    //     display: flex;
    //     justify-content: center;

    //     border-radius: 100%;

    //     transition: transform .3s;
    // }
}

.right {
    max-height: calc(100vh);
    // height: calc(100vh - 100px);

    position: sticky;
    top: 0;

    // margin-top: 100px;
    overflow: hidden;

    swiper-container {
        height: 100%;
    }
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

.padPage {
    display: none;
}

// @keyframes

@include XLarge {}

@include large {}

@include medium($width: 1024px) {
    .navContainer {
        // gap: 1.25rem;
    }
}

.objTop {
    object-position: top;
}

.objCenter {
    object-position: center;
}

.objBottom {
    object-position: bottom;
}

@include medium {
    .navContainer {}

    .padPage {
        display: block;

        swiper-container {
            width: 100%;
            height: 40vh;
        }

        .imgSlider {
            // width: 100%;
            // height: 100%;
        }

        img {
            width: 100%;
            max-width: 100%;
            object-fit: cover;

        }
    }

    .page1 {
        height: calc(60vh - 100px);
        translate: 0;
        width: max-content;
    }

    .upperContainer>div {
        max-width: 100%;
    }

    .right {
        display: none;
    }
}

@include small {
    .page1 {
        padding-left: 2rem;
    }

    .content {
        gap: 2rem;
        padding-top: 2rem;
    }

    .middleStar {
        margin-top: 2rem;
    }
}

@include small($width: 430px) {
    .navContainer {
        gap: 1rem;
    }

    .top {
        gap: .5rem;
    }

    .top>div,
    .middleStar {
        padding: .5rem;
    }
}

@include small($width: 320px) {
    .page1 {
        padding-left: 1rem;
    }
}
</style>