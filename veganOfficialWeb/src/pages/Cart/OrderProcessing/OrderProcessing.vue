<template>
    <div class="payingContainer">
        <Vue3Lottie :animationData="paymentJson"
            :height="125" :width="125">
        </Vue3Lottie>
        <p>
            付款中，請勿關閉頁面...
        </p>
    </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, onUnmounted } from 'vue';
import paymentJson from '@assets/lottie/payment.json'
import { useRoute, useRouter } from 'vue-router';
import { useSSEStore } from '@/store/SSEStore';
import { storeToRefs } from 'pinia';
import { useToastStore } from '@/store/toastStore';

const Vue3Lottie = defineAsyncComponent(async () => {
    const mod = await import('vue3-lottie')
    return mod.Vue3Lottie
})

// router
const router = useRouter();
const route = useRoute();
const orderId = route.query.orderId as string;
const token = route.query.token as string;

// toast
const toastStore = useToastStore();
const { addNotification } = toastStore;

// start SSE
const SSEStore = useSSEStore();
const { startPaymentQueue, paymentNotify, stopPaymentQueue } = SSEStore;
const { paymentQueue } = storeToRefs(SSEStore)

function startSSEConnect() {
    startPaymentQueue(orderId);
    paymentNotify(orderId, sseSuccess, sseError)
}

async function sseSuccess() {
    try {
        addNotification('付款成功');
        await router.push({
            path: '/profile',
            query: {
                token
            }
        })
    } catch (error) {
        console.log(error);
    }
}

function sseError() {
    addNotification('付款失敗，請重試');
    router.push({
        path: '/profile',
        query: {
            token
        }
    })
}

onMounted(() => {
    startSSEConnect();
})

onUnmounted(() => {
    stopPaymentQueue(orderId)
})

</script>

<style scoped lang="scss">
.payingContainer {
    @extend %headerPseudo;
    min-height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding-top: 8%;

    p {
        font-size: 1.25rem;
    }
}
</style>