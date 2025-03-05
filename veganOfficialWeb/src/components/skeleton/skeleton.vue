<template>
    <div class="wrapper">
        <div class="imgSkeleton" v-show="true">
            <!-- <img src="@assets/img/Home/Catalog/salad.svg"
                alt=""> -->
            <SvgIcon name="skeletonSalad"
                :width="`${skeletonSize}px`"
                :height="`${skeletonSize}px`"
                color="#00430b" :key="skeletonSize">
            </SvgIcon>
        </div>
        <div class="textSkeleton" v-show="true">
            <div></div>
            <div></div>
        </div>
        <div class="scanner"></div>
    </div>
</template>

<script setup lang="ts">
import debounce from 'lodash/debounce';
import { onMounted, onUnmounted, ref } from 'vue';

const breakpoint = [
    { query: '(max-width: 320px)', size: 100 },
    { query: '(max-width: 430px)', size: 120 },
    { query: '(max-width: 576px)', size: 140 },
    { query: '(max-width: 768px)', size: 160 },
    { query: '(max-width: 1024px)', size: 180 },
    { query: '(max-width: 1440px)', size: 180 },
];

const skeletonSize = ref(180);

function onresize() {
    for (let bp of breakpoint) {
        if (window.matchMedia(bp.query).matches) {
            skeletonSize.value = bp.size;
            break
        }
    }
}
const debounceResize = debounce(onresize, 500);

onMounted(() => {
    window.addEventListener('resize', debounceResize);
    // console.log(window.matchMedia('(max-width: 1440px)'));
})

onUnmounted(() => {
    window.removeEventListener('resize', debounceResize)
})

</script>

<style scoped lang="scss">
@keyframes loadText {
    from {
        background-position: 100%;
    }

    to {
        background-position: 0%;
    }
}

@keyframes loadImg {
    0% {
        translate: -75% 0;
    }

    100% {
        translate: 150% 0;
    }
}

@mixin skeleton {
    @include WnH(300px);
    @include flex-center-center;
    position: relative;
    overflow: hidden;

    img {
        @include WnH(180px);
        filter: none;
        display: block;
    }

    &::after {
        // @include WnH(300%);
        // content: '';
        // pointer-events: none;
        // position: absolute;
        // top: 0;
        // left: 0;
        // background: linear-gradient(115deg, transparent 40%, #FCFAF2 50%, transparent 52%);
        // animation: loadImg 2s infinite ease-in;
    }
}

.wrapper {
    @include flex-center-center;
    flex-direction: row;
    height: max-content;
    background-color: $primaryBacColor;
    position: relative;
}

.imgSkeleton {
    @include skeleton;
}

.scanner {
    pointer-events: none;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: linear-gradient(115deg, transparent 40%, #FCFAF2 50%, transparent 52%);
    animation: loadImg 2.5s infinite ease-in;
}

.textSkeleton {
    color: transparent;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    user-select: none;

    &>* {
        width: 160px;
        height: 24px;
        border-radius: 0.25rem;
        background-color: #036313;
    }
}

@include XLarge {}

@include large {}

@include medium($width: 1024px) {}

@include medium {}

@include small {
    // .imgSkeleton {
    //     @include WnH(180px);
    // }

    // .textSkeleton>div {
    //     width: 120px;
    //     height: 22px;
    // }
}

@include small($width: 430px) {}

@include small($width: 320px) {}
</style>