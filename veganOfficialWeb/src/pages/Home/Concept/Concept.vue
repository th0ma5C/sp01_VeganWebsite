<template>
    <div class="container">
        <section>
            <div class="textClip">NEWS</div>
            <div class="text">
                <h3>理念1</h3>
                <p>111</p>
            </div>
        </section>
        <section>
            <div class="textClip">About Us</div>
            <div class="text">
                <h3>理念2</h3>
                <p>222</p>
            </div>
        </section>
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
    gap: 24px;

    section {
        @include WnH(612px, 408px);
        background: linear-gradient(152deg,
                hsla(72, 67%, 57%, 0.15) 25%, hsla(9, 94%, 45%, 0.15) 80%);

        .textClip {
            @include WnH(100%);
            background: url('@assets/img/Home/Concept/fruit.jpg') center / cover no-repeat;
            background-clip: text;
            font-family: 'MrDafoe', 'NotoSans';
            color: transparent;
            font-size: 150px;
            text-align: center;
            line-height: 408px;
            transition: all 0.5s ease;
        }

        &:hover {
            .textClip {
                font-size: 175px;
            }
        }

        .text {
            background-color: $primeBacColor;

            &::after {
                content: '';
            }
        }
    }

}
</style>