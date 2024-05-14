<template>
    <div class="container">
        <div>
            <h2>Build our
                &nbsp;<span>Relation-Ship</span>
            </h2>
            <h2>因你的熱情和才華，使餐點更美味！</h2>
            <button>連結</button>
        </div>
        <div>
            <img src="@assets/img/Home/Hiring/hiring.jpg"
                alt=""
                style="width: 200px;height: 200px;display: block;">
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
    @include WnH(605px, 408px);
    margin-top: 90px;
    margin-bottom: 266px;
    justify-content: space-evenly;
    border-top: 1px solid black;
    border-bottom: 1px solid black;

    span {
        font-size: 32px;
        font-family: 'MrDafoe', 'NotoSans';
    }
}
</style>