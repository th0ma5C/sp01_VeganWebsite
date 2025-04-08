// stores/sseStore.js
import { defineStore } from "pinia";
import { ref } from "vue";


export const useSSEStore = defineStore("sse", () => {
    const paymentQueue = ref<Record<string, EventSource>>({});
    const orderQueueId = ref<null | string>();

    const startPaymentQueue = (orderId: string, stage?: 'line') => {
        if (paymentQueue.value[orderId]) return;
        if (!stage) {
            orderQueueId.value = orderId;
            paymentQueue.value[orderId] = new EventSource(`/api/checkout/paymentQueue/${orderId}`);
        } else {
            orderQueueId.value = orderId;
            paymentQueue.value[orderId] = new EventSource(`/api/LinePayStatus?orderId=${orderId}`);
        }
    };

    const stopPaymentQueue = (orderId: string) => {
        if (paymentQueue.value[orderId]) {
            paymentQueue.value[orderId].close();
            delete paymentQueue.value[orderId];
            // console.log(`SSE 連線已關閉 (${orderId})`);
        }
    };

    const paymentNotify = (orderId: string, callback: () => void | Promise<void>) => {
        if (!paymentQueue.value[orderId]) return;

        paymentQueue.value[orderId].onmessage = async (event) => {
            try {
                const { state, message } = JSON.parse(event.data);

                if (state === "confirm") {
                    console.log(message);
                    stopPaymentQueue(orderId);
                    await Promise.resolve(callback());
                }
            } catch (error) {
                console.error("SSE error:", error);
            }
        };
        paymentQueue.value[orderId].onerror = (error) => {
            console.error(`SSE 連線錯誤(orderId: ${orderId}):`, error);
            stopPaymentQueue(orderId);
        };
    }

    return { orderQueueId, paymentQueue, startPaymentQueue, stopPaymentQueue, paymentNotify };
});
