// stores/sseStore.js
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSSEStore = defineStore("sse", () => {
    const paymentQueue = ref<Record<string, EventSource>>({});
    const orderQueueId = ref<null | string>();
    const maxRetry = 5;
    let retryCount = 0;
    const timeoutLimit = 60000;
    let timeoutId: ReturnType<typeof setTimeout>;

    const startPaymentQueue = (orderId: string) => {
        if (paymentQueue.value[orderId] || !orderId) return;
        orderQueueId.value = orderId;
        paymentQueue.value[orderId] = new EventSource(`/api/checkout/paymentQueue/${orderId}`);
    };

    const connectionTimeout = (sse: EventSource, onErr: () => void) => {
        timeoutId = setTimeout(() => {
            console.warn("SSE 超時，可能後端未推送資料");
            sse.close();
            onErr();
        }, timeoutLimit);
    }

    const stopPaymentQueue = (orderId: string) => {
        if (paymentQueue.value[orderId]) {
            paymentQueue.value[orderId].close();
            delete paymentQueue.value[orderId];
            console.log(`SSE 連線已關閉 (${orderId})`);
        }
    };

    const paymentNotify = (
        orderId: string,
        onSuccess: (params: string) => void | Promise<void>,
        onError: () => void
    ) => {
        const eventSource = paymentQueue.value[orderId]
        if (!eventSource) return;

        connectionTimeout(eventSource, onError);

        eventSource.onmessage = async (event) => {
            try {
                const { state, message, token } = JSON.parse(event.data);
                clearTimeout(timeoutId);

                if (state === "confirm") {
                    console.log("收到付款確認：", message);
                    retryCount = 0;
                    stopPaymentQueue(orderId);

                    try {
                        await Promise.resolve(onSuccess(token));

                    } catch (err) {
                        console.error("success callback failed:", err);
                        onError();
                    }
                }
            } catch (err) {
                console.error("JSON parse error:", err);
                stopPaymentQueue(orderId);
                onError();
            }
        };

        eventSource.onerror = (error) => {
            retryCount++;
            clearTimeout(timeoutId);
            stopPaymentQueue(orderId)

            console.error(`SSE 錯誤，第${retryCount}次重連中...`);

            if (retryCount >= maxRetry) {
                console.error(`SSE 連線錯誤(orderId: ${orderId}):`, error);
                onError();
            } else {
                setTimeout(() => {
                    startPaymentQueue(orderId)
                    paymentNotify(orderId, onSuccess, onError)
                }, 1000);
            }
        };
    };

    return { orderQueueId, paymentQueue, startPaymentQueue, stopPaymentQueue, paymentNotify };
});
