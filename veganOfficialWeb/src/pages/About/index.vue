<template>
    <div>
        <UpperPart ref="upper"></UpperPart>
        <MiddleMap ref="middle"></MiddleMap>
        <BottomFAQ ref="bottom"></BottomFAQ>
    </div>
</template>

<script setup lang="ts">
import UpperPart from './top/UpperPart.vue';
import MiddleMap from './mid/MiddleMap.vue';
import BottomFAQ from './bottom/BottomFAQ.vue';
import { onBeforeMount, onMounted, useTemplateRef, computed, nextTick, watch, ref } from 'vue';
import { positionStore } from './store/usePagePosition'
import { useRoute, useRouter } from 'vue-router';

// position store
const positionState = computed(() => {
    return positionStore.getPosition();
})

// home 跳轉
const router = useRouter();
const route = useRoute();

function homeRedirect() {
    if (route.query.scroll) {
        const { bottom } = positionState.value;
        console.log(bottom);
        window.scroll({
            top: bottom,
            behavior: 'smooth'
        })
    }
}

function resetWindowScroll() {
    if (route.query.scroll) {
        window.scroll({
            top: 0,
            behavior: 'instant'
        })
    }
}

onBeforeMount(() => {
    resetWindowScroll();
})
onMounted(() => {
    homeRedirect()
})
</script>

<style scoped lang="scss"></style>