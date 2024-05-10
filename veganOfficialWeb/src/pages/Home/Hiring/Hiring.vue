<template>
    <div class="container">
        <div>
            <h2>Build our RelationShip！</h2>
            <h2>我們需要你的熱情和才華！</h2>
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
.container {
    @include main-part;
    @include flex-center-center;
    @include WnH(605px, 408px);
    justify-content: space-evenly;
}
</style>