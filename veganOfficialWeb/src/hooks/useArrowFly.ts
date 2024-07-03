import { ref } from "vue";
import type { Ref } from "vue";

export default function () {
    let iconClass = ref('in');
    let timers: (ReturnType<typeof setTimeout> | null)[] = [];

    function hoverDebounce(target: Ref<string>) {
        let timer: ReturnType<typeof setTimeout> | null = null;
        let timeStamp: number | null = null;
        return function (e: MouseEvent) {
            // e.type === 'mouseenter' ? dragClick.value = 'pointer' : dragClick.value = 'grab';
            if (!timeStamp) {
                timeStamp = Date.now();
                e.type === 'mouseenter' ? target.value = 'out' : target.value = 'in';
                timer = setTimeout(() => {
                    timeStamp = null;
                }, 500 - (Date.now() - timeStamp))
                return
            }
            if (timer) {
                clearTimeout(timer);
                const index = timers.indexOf(timer);
                if (index !== -1) {
                    timers.splice(index, 1);
                }
            }
            timeStamp = Date.now();
            timer = setTimeout(() => {
                e.type === 'mouseenter' ? target.value = 'out' : target.value = 'in';
                timeStamp = null;
            }, 500 - (Date.now() - timeStamp));
            timers.push(timer);
        }
    }
    const setIconClass = hoverDebounce(iconClass);

    return { iconClass, setIconClass, timers }
}


