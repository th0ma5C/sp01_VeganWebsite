<template>
    <div class="payingContainer">
        <DotLottieVue :src="lottieFilePath"
            style="height:  125px; width: 125px;" autoplay
            loop>
        </DotLottieVue>
        <p>
            付款中，請勿關閉頁面...
        </p>
    </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSSEStore } from '@/store/SSEStore';
import { storeToRefs } from 'pinia';
import { useToastStore } from '@/store/toastStore';
import { useLoaderStore } from '@/store/loader';
import { fetchLinePayResult } from '@/api/checkout/checkout';

const DotLottieVue = defineAsyncComponent(async () => {
    const mod = await import('@lottiefiles/dotlottie-vue')
    return mod.DotLottieVue
})

const lottieFilePath = new URL('/src/assets/lottie/payment.json', import.meta.url).href

// router
const router = useRouter();
const route = useRoute();
const orderId = route.query.orderId as string;
const paymentType = route.query.paymentType as 'ec' | 'linePay';
const transactionId = route.query.paymentType as string | undefined;
// const token = route.query.token as string;

// toast
const toastStore = useToastStore();
const { addNotification } = toastStore;

// loader
const loaderStore = useLoaderStore();
loaderStore.$subscribe(async (_, state) => {
    try {
        if (!state.loaderActivated) {
            startSSEConnect();
            await getLinePayResult()
        }
    } catch (error) {
        console.log(error);
    }
})

// start SSE
const SSEStore = useSSEStore();
const { startPaymentQueue, paymentNotify, stopPaymentQueue } = SSEStore;
const { paymentQueue } = storeToRefs(SSEStore)

function startSSEConnect() {
    if (paymentType == 'linePay') return
    startPaymentQueue(orderId);
    paymentNotify(orderId, sseSuccess, sseError)
}

async function sseSuccess(token: string) {
    try {
        addNotification('付款成功，明細請至信箱確認');
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
        // query: {
        //     token
        // }
    })
}

// line pay result
const getLinePayResult = async () => {
    if (paymentType !== 'linePay') return
    if (!transactionId) throw new Error('missing transactionId')
    try {
        const params = {
            transactionId,
            orderId
        }
        const res = await fetchLinePayResult(params);
        if (res.state == 'confirm' && res.token) {
            await sseSuccess(res.token)
        } else {
            sseError()
        }
    } catch (error) {
        console.log('get line pay result error');
    }
}

onMounted(() => {
    // startSSEConnect();
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