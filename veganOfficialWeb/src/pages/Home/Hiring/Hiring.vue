<template>
    <div class="container">
        <div>
            <h2>招募</h2>
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
    justify-content: space-evenly;
}
</style>