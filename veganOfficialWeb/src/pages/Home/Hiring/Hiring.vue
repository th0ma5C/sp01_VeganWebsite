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
        <div class="btnWrapper">
            <button>Join Us</button>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
@font-face {
    font-family: 'MrDafoe';
    src: url('@assets/fonts/Mr_Dafoe/MrDafoe-Regular.woff2') format('woff2');
}

.container {
    @include main-part;
    @include flex-center-center;
    @include WnH(1201px, 500px);
    margin-top: 35px;
    margin-bottom: 309px;
    position: relative;

    // gap: 3rem;
    // justify-content: space-evenly;
    // border-top: 1px solid black;
    // border-bottom: 1px solid black;
    &::before {
        content: '';
        height: 1px;
        width: 1201px;
        position: absolute;
        top: 0;
        background-color: black;
    }

    &::after {
        content: '';
        height: 1px;
        width: 1201px;
        position: absolute;
        bottom: 0;
        background-color: black;
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
            font-family: 'MrDafoe', 'NotoSans';
        }

    }

    .imgWrapper {
        position: relative;

        img {
            @include WnH(128px);
            display: block;
            // transform: rotateZ(8deg);
            margin-right: 1rem;
            filter: drop-shadow(2px 2px 2px black);
        }

        .marker {
            position: absolute;
            right: -40%;
            top: -50%;
            display: flex;
            flex-direction: column;
            transform: rotate(10deg);

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
            background-color: $secondBacColor;
            transition: transform 0.2s ease-out;

            &:hover {
                transform: translate(4px, 4px);
            }

        }

        &::after {
            @include WnH(90px, 60px);
            content: '';
            position: absolute;
            top: 4px;
            left: 4px;
            z-index: -1;
            background-color: $secondBacColor;
            border-radius: 1rem;
        }
    }

}
</style>