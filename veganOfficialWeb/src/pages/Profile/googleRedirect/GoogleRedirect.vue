<template>
    <div class="spinnerContainer">
        <Spinner></Spinner>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive } from 'vue';
import { useRoute } from 'vue-router';

function toggleOverflow(val: 'hidden' | 'auto') {
    document.documentElement.style.overflow = val
}

const route = useRoute();
const resData = reactive({
    code: route.query.code,
    state: route.query.state,
    error: route.query.error
})

function openerSendData() {
    const isAuthFailed = resData.error || !window.location.search;

    window.opener.postMessage(
        isAuthFailed
            ? { error: resData.error || 'Authorization failed' }
            : { ...resData },
        window.location.origin);

    setTimeout(() => window.close(), 0);
}

onMounted(() => {
    toggleOverflow('hidden');
    openerSendData();
})
onUnmounted(() => {
    toggleOverflow('auto');
})
</script>

<style scoped lang="scss">
.spinnerContainer {
    @include WnH(100%);
    position: fixed;
    top: 0;
    left: 0;
    background-color: $primaryBacColor;
    z-index: 100;
}
</style>