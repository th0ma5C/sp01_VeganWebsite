<template>
    <div class="container">
        <div class="content">
            <p>Build our</p>
            <span>Relation-Ship</span>
            <p>有了你的熱情和才華，使餐點更美味！</p>
        </div>
        <div class="imgWrapper">
            <img src="@assets/img/Home/Hiring/hiring.jpg"
                alt="">
            <div class="marker">
                <p>更多資訊</p>
                <SvgIcon :name="'HiringArrow'" width="50"
                    height="50" class="arrow"></SvgIcon>
            </div>
        </div>
        <div class="btnWrapper" @click="btnOnclick">
            <button>Join Us</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

// btn on click
function btnOnclick() {
    let url = null;
    url = 'https://www.104.com.tw/';
    window.open(url, '_blank')?.focus();
}

</script>

<style scoped lang="scss">
.container {
    @include main-part;
    @include flex-center-center;
    min-height: 500px;
    position: relative;
    margin: 200px auto;

    &::before {
        content: '';
        height: 2px;
        width: 70%;
        position: absolute;
        top: 0;
        background-color: $secondBacColor;
    }

    &::after {
        content: '';
        height: 2px;
        width: 70%;
        position: absolute;
        bottom: 0;
        background-color: $secondBacColor;
    }

    .content {
        display: flex;
        flex-direction: column;
        margin-right: 3rem;

        p {
            margin: 0;
        }

        span {
            font-size: 7rem;
            font-family: "Mr Dafoe", cursive;
            font-weight: 400;
            font-style: normal;
        }

    }

    .imgWrapper {
        position: relative;
        margin-right: 1rem;
        z-index: 2;

        img {
            @include WnH(128px);
            display: block;
            transition: transform 0.2s ease-out, box-shadow .2s ease-out;
            will-change: transform;
        }

        &::after {
            @include WnH(100%);
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            z-index: -1;
            background-color: $btnBacColor;
        }

        .marker {
            position: absolute;
            right: -40%;
            top: -50%;
            display: flex;
            flex-direction: column;
            transform: rotate(10deg) translateX(1rem);

            p {
                margin-bottom: 0;
                transform: translateY(8px);
            }

            .arrow {
                transform: rotate(60deg);
            }
        }
    }

    .btnWrapper {
        position: relative;
        z-index: 2;
        transform: translate(40%, -30%) rotateZ(12deg);

        button {
            @include WnH(90px, 60px);
            border: 1px solid black;
            border-radius: 1rem;
            font-size: 1.25rem;
            font-variation-settings: 'wght' 600;
            color: $primaryBacColor;
            background-color: $btnBacColor;
            transition: transform 0.2s ease-out;
        }

        &::after {
            @include WnH(90px, 60px);
            content: '';
            position: absolute;
            top: 4px;
            left: 4px;
            z-index: -1;
            background-color: $btnBacColor;
            border-radius: 1rem;
            box-shadow:
                2px 2px 3px rgba(0, 0, 0, 0.5);
            transition: box-shadow .3s ease-out;
        }
    }

    &:has(button:hover) {
        .imgWrapper>img {
            transform: translate(-4px, -4px);
            box-shadow:
                1px 1px 1px green,
                2px 2px 1px green,
                3px 3px 1px green,
                4px 4px 1px green,
                5px 5px 4px black;

        }

        .btnWrapper {
            button {
                transform: translate(4px, 4px);
            }

            &::after {
                box-shadow: none;
            }
        }
    }
}
</style>