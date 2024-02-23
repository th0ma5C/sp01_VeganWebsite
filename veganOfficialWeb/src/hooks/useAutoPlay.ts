// hooks/useAutoPlay.ts
export function useAutoPlay(callback: () => void, intervalTime = 5000) {
    let interval: (number | null) = null;

    function startPlay() {
        stopPlay();
        interval = setInterval(callback, intervalTime);
    }

    function stopPlay() {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
    }

    return { startPlay, stopPlay };
}
