<template>
    <div class="spinner">
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.spinner {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: inline-block;
    border-top: 3px solid $secondBacColor;
    border-right: 3px solid transparent;
    animation: rotation 1s linear infinite;

    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

@keyframes rotation {
    0% {
        transform: translate(-50%, -50%) rotate(0deg);
    }

    100% {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}
</style>