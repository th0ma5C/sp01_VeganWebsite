<template>
    <router-view></router-view>
</template>

<script setup lang="ts">
import emitter from '@/utils/eventBus';
import { onMounted, onUnmounted } from 'vue';


// emit on enter
function onQNREnter() {
    emitter.emit('QNR_enter', true);
}
function onQNRLeave() {
    emitter.emit('QNR_enter', false);
}

onMounted(() => {
    onQNREnter()
})

onUnmounted(() => {
    onQNRLeave();
})
</script>

<style scoped lang="scss"></style>