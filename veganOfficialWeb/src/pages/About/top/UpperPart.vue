<template>
    <div class="upperContainer">
        <div class="left">
            <span>About Us</span>
        </div>

        <div class="right">
            <div class="top">
                <div class="rightText">
                    <h1>
                        Lorem ipsum dolor sit amet.
                    </h1>
                    <p>
                        Lorem ipsum dolor sit amet
                        consectetur, adipisicing elit.
                        Consequuntur, laboriosam
                        repellendus! Consectetur quo fuga
                        excepturi vel maxime dolore at
                        suscipit officia reiciendis atque,
                        odit enim.
                    </p>
                </div>
                <div class="imgBlock1">
                </div>
            </div>

            <div class="mid">
                <div>
                    <div class="starWrapper">
                        <SvgIcon name="Star" width="26px"
                            height="26px" color="#0d731e"
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
                        <SvgIcon name="Star" width="26px"
                            height="26px" color="#0d731e"
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
                        <SvgIcon name="Star" width="26px"
                            height="26px" color="#0d731e"
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

            <div class="bottom">
                <div class="imgBlock2">
                </div>
                <div class="rightText">
                    <h2>
                        <SvgIcon name="Mark" width="24px"
                            height="24px" color="black"
                            class="markIcon1">
                        </SvgIcon>
                        <span>
                            Lorem ipsum
                        </span>
                        <SvgIcon name="Mark" width="24px"
                            height="24px" color="black"
                            class="markIcon1">
                        </SvgIcon>
                    </h2>
                    <p>
                        Lorem ipsum dolor sit amet
                        consectetur adipisicing elit. Neque
                        vel soluta quam numquam
                        reprehenderit modi, quo, ducimus
                        eius illum dignissimos eaque optio
                        nostrum nihil doloremque accusantium
                        maxime minima recusandae doloribus.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";


const showRightPart = ref(false)

onMounted(() => {
})
</script>

<style scoped lang="scss">
* {
    // outline: 1px solid black;
}

.upperContainer {
    height: 100vh;
    // min-height: 920px;
    max-height: 920px;

    margin-top: 100px;
    padding: 1rem;

    display: flex;
    gap: 1rem;

    &>div {
        flex: 1;
    }
}

.left {
    background-image: url('/imgs/about/upper_left.webp');
    background-position: 10% center;
    position: relative;

    border-radius: 1rem;

    span {
        font-family: "EB Garamond", serif;
        font-size: 6rem;
        font-variation-settings: 'wght' 600;
        font-style: italic;
        color: $primaryBacColor ;

        position: absolute;
        bottom: 2.5rem;
        left: 2rem;

        backdrop-filter: blur(1px);
        border-radius: 1rem;

        // overflow: hidden;

        text-shadow:
            3px 1px 0 $secondBacColor,
            4px 2px 0 $secondBacColor,
            6px 3px 5px $btnBacColor;
    }
}

.right {
    // background-image: url('/imgs/about/upper_left.webp');
    // background-position: 65% center;

    display: grid;
    grid-template-rows: 2fr 1fr 2fr;
    gap: 1rem;

    border-radius: 1rem;

    overflow: hidden;
    // text-wrap: balance;

    h1 {
        font-size: 1.75rem;
        margin-bottom: 1rem;
        font-variation-settings: 'wght' 500;
    }

    h2 {
        font-size: 1.5rem;
        font-variation-settings: 'wght' 400;
    }

    &>div {
        display: flex;
        gap: 1rem;

        &>div {
            flex: 1;
            border-radius: 1rem;
            overflow: hidden;
            // background-color: $primaryBacColor;

            &:not(.imgBlock1, .imgBlock2) {
                border: 2px solid $secondBacColor;
            }
        }
    }

    .rightText {
        padding: 2rem;

        h1,
        h2 {
            margin-bottom: 1.25rem;
        }

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

    .imgBlock1 {
        background-image: url('/imgs/about/upper_right_env.webp');
        background-position: top;
        background-size: cover;
    }

    .imgBlock2 {
        background-image: url('/imgs/about/upper_right_chef.webp');
        background-position: top;
        background-size: cover;
    }

    .mid {

        &>div {
            padding: 1rem;

            display: flex;
            flex-direction: column;
            // justify-content: space-evenly;
            align-items: center;
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
}
</style>