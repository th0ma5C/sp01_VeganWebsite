import { defineStore, storeToRefs } from "pinia";
import { computed, nextTick, reactive, ref, watch } from "vue";

interface Notification {
    content: string,
    show: boolean,
    countdownBar_width: number,
    index: number
}

export const useToastStore = defineStore('toast', () => {
    const notificationList = ref<Notification[]>([]);
    const count = ref(0);

    function addNotification(str: string) {

        const notification = {
            content: str,
            show: true,
            countdownBar_width: 100,
            index: count.value
        }
        count.value += 1
        notificationList.value.push(notification);
        notificationCountdown(notificationList.value.length);
    }

    function notificationCountdown(target: number) {
        const index = target - 1;
        // if (notificationList.value[index].countdownBar_width > 0) {
        //     notificationList.value[index].countdownBar_width -= .5;
        //     requestAnimationFrame(() => {
        //         notificationCountdown(target);
        //     });
        //     return
        // }
        setTimeout(() => {
            notificationList.value[index].show = false;
        }, 3000);
    }

    function pop() {
        const target = notificationList.value.find(e => e.show);
        target!.show = false;
        count.value -= 1
    }

    function clearNotification(index: number) {
        const clearing = notificationList.value.find(e => e.index == index);
        if (!clearing) return
        clearing.show = false;
    }

    return {
        notificationList,
        addNotification,
        clearNotification
    }
})