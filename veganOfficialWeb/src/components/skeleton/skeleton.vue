<template>
    <div class="wrapper">
        <div class="imgSkeleton" v-show="true">
            <!-- <img src="@assets/img/Home/Catalog/salad.svg"
                alt=""> -->
            <SvgIcon name="skeletonSalad" width="180"
                height="180" color="#00430b"></SvgIcon>
        </div>
        <div class="textSkeleton" v-show="true">
            <div></div>
            <div></div>
        </div>
    </div>
</template>

<script setup lang="ts">

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
        left: -250%;
    }

    100% {
        left: -50%;
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
        @include WnH(300%);
        content: '';
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(115deg, transparent 40%, #FCFAF2 50%, transparent 52%);
        animation: loadImg 2s infinite ease-in;
    }
}

.wrapper {
    @include flex-center-center;
    flex-direction: row;
}

.imgSkeleton {
    @include skeleton;
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
        background: linear-gradient(115deg,
                #036313 40%,
                transparent 50%,
                #036313 52%);
        background-size: 300%;
        animation: 2s infinite ease-in loadText;
    }
}
</style>