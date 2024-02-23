// hooks/useDrag.ts
import { ref, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue'


export function useDrag(elementRef: Ref<HTMLElement | null>, onDragEnd: (direction: 'left' | 'right') => void) {
    let isDown = ref(false);
    let startX = 0;
    let moveX = 0;

    function down(e: MouseEvent) {
        isDown.value = true;
        startX = e.pageX;
        moveX = 0;

        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
    }

    function move(e: MouseEvent) {
        if (!isDown.value) return;
        moveX = e.pageX - startX;
    }

    function up() {
        if (!isDown.value) return;
        isDown.value = false;

        window.removeEventListener('mousemove', move);
        window.removeEventListener('mouseup', up);

        if (moveX < -50) { // 閾值判斷
            onDragEnd('right');
        } else if (moveX > 50) {
            onDragEnd('left');
        }
    }

    onMounted(() => {
        const el = elementRef.value;
        if (el) {
            el.addEventListener('mousedown', down);
        }
    });

    onUnmounted(() => {
        const el = elementRef.value;
        if (el) {
            el.removeEventListener('mousedown', down);
        }
    });

    return { isDown };
}
