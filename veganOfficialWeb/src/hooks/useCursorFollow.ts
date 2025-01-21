import { onMounted, onUnmounted, reactive } from "vue";
import type { Ref } from "vue";
import useListener from './useListener'

interface coordinate {
    X: null | number,
    Y: null | number,
    targetX: null | number,
    targetY: null | number,
}
interface cursorStyle {
    show: boolean,
    opacity: number,
    enable: boolean
}

export function useCursorFollow(container: Ref) {
    let coordinate: coordinate = reactive({
        X: null,
        Y: null,
        targetX: null,
        targetY: null,
    })
    let setCursorStyle: cursorStyle = reactive({
        show: false,
        opacity: 1,
        enable: false
    })
    let requestAnimationID: number | null = null;
    let containerRect = null;

    function cursorPosition(e: MouseEvent | Event) {
        if (!setCursorStyle.enable) return
        if (!requestAnimationID) { requestAnimationID = requestAnimationFrame(animateCursor); }
        if (e instanceof MouseEvent) {
            containerRect = container.value.getBoundingClientRect()
            const mouseX = e.clientX - containerRect.left
            const mouseY = e.clientY - containerRect.top
            if (mouseX >= 0 && mouseX <= containerRect.width &&
                mouseY >= 0 && mouseY <= containerRect.height) {
                setCursorStyle.show = true;
            } else {
                setCursorStyle.opacity = 1
                setCursorStyle.show = false;
            }
            coordinate.targetX = e.clientX
            coordinate.targetY = e.clientY
        }

        if (e instanceof Event) {
            // coordinate.targetX += e.
        }

    }

    function animateCursor() {
        if (coordinate.targetX !== null && coordinate.targetY !== null) {
            if (coordinate.X === null) coordinate.X = coordinate.targetX;
            if (coordinate.Y === null) coordinate.Y = coordinate.targetY;

            const deltaX = coordinate.targetX - coordinate.X;
            const deltaY = coordinate.targetY - coordinate.Y;

            coordinate.X += Math.round(deltaX * 0.3 * 10) / 10;
            coordinate.Y += Math.round(deltaY * 0.3 * 10) / 10;
        }
        requestAnimationID = requestAnimationFrame(animateCursor);
    }
    function stopAnimation() {
        if (requestAnimationID) {
            cancelAnimationFrame(requestAnimationID);
            requestAnimationID = null;
        }
    }
    function cursorLeave() {
        setCursorStyle.show = false;
        setCursorStyle.opacity = 1;
        stopAnimation();
    }
    const events = {
        cursor: [
            { event: 'mouseenter', handler: cursorPosition },
            { event: 'mousemove', handler: cursorPosition },
            { event: 'mouseover', handler: cursorPosition },
            { event: 'mouseleave', handler: cursorLeave },
        ]
    }

    onMounted(() => {
        useListener(container.value, 'add', events.cursor);
        // useListener(window, 'add', events.cursor)
        requestAnimationID = requestAnimationFrame(animateCursor);
    })

    onUnmounted(() => {
        // useListener(window, 'remove', events.cursor);
        useListener(container.value, 'remove', events.cursor);
        stopAnimation();
    })

    return { coordinate, setCursorStyle, cursorLeave }
}

