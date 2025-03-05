<template>
    <div class="aboutContainer">
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

// home 跳轉
const router = useRouter();
const route = useRoute();
type AnchorTarget = 'CONCEPT' | 'ACCESS' | 'FAQ';
function homeRedirect() {
    if (route.query.scroll) {
        // const { bottom } = positionState.value;
        const y = positionStore.getElPosition(route.query.scroll as AnchorTarget)
        window.scroll({
            top: y || 0,
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

<style scoped lang="scss">
.aboutContainer {
    margin-top: 100px;

}
</style>