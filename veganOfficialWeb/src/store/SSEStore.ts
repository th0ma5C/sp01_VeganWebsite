// stores/sseStore.js
import { defineStore } from "pinia";
import { ref } from "vue";


export const useSSEStore = defineStore("sse", () => {
    const paymentQueue = ref<Record<string, EventSource>>({});

    const startPaymentQueue = (userId: string) => {
        if (paymentQueue.value[userId]) return;

        paymentQueue.value[userId] = new EventSource(`/api/checkout/paymentQueue/${userId}`);

    };

    const stopPaymentQueue = (userId: string) => {
        if (paymentQueue.value[userId]) {
            paymentQueue.value[userId].close();
            delete paymentQueue.value[userId];
            // console.log(`SSE 連線已關閉 (${userId})`);
        }
    };

    const paymentNotify = (userId: string, callback: () => void | Promise<void>) => {
        if (!paymentQueue.value[userId]) return;

        paymentQueue.value[userId].onmessage = async (event) => {
            try {
                const { state, message } = JSON.parse(event.data);

                if (state === "confirm") {
                    console.log(message);
                    stopPaymentQueue(userId);
                    await Promise.resolve(callback());
                }
            } catch (error) {
                console.error("SSE error:", error);
            }
        };
        paymentQueue.value[userId].onerror = (error) => {
            console.error(`SSE 連線錯誤(userId: ${userId}):`, error);
            stopPaymentQueue(userId);
        };
    }

    return { paymentQueue, startPaymentQueue, stopPaymentQueue, paymentNotify };
});
