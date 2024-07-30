// import { onMounted, onUnmounted } from 'vue';

// interface PerformanceMemory extends Performance {
//     memory: {
//         usedJSHeapSize: number;
//         totalJSHeapSize: number;
//         jsHeapSizeLimit: number;
//     };
// }

// const isPerformanceMemory = (performance: Performance): performance is PerformanceMemory => {
//     return (performance as PerformanceMemory).memory !== undefined;
// };

// // 定義內存監控邏輯
// export default function useMemoryMonitor(threshold: number = 0.8, interval: number = 60000) {
//     let intervalId: number;

//     const checkMemoryUsage = () => {
//         if (isPerformanceMemory(performance)) {
//             const { usedJSHeapSize, totalJSHeapSize } = performance.memory;
//             const usageRatio = usedJSHeapSize / totalJSHeapSize;
//             console.log(`Memory usage: ${(usageRatio * 100).toFixed(2)}%`);

//             if (usageRatio > threshold) {
//                 console.warn('Memory usage exceeded threshold!');
//                 captureDiagnosticInfo();
//             }
//         } else {
//             console.log('The performance.memory API is not supported in this browser.');
//         }
//     };

//     const captureDiagnosticInfo = () => {
//         // 捕捉並記錄內存快照
//         console.log('Capturing heap snapshot...');
//         // 捕捉內存快照代碼
//         // 可以使用 performance.memory 或者其他工具進行捕捉
//     };

//     onMounted(() => {
//         intervalId = window.setInterval(checkMemoryUsage, interval);
//     });

//     onUnmounted(() => {
//         clearInterval(intervalId);
//     });

//     return {
//         checkMemoryUsage,
//     };
// }
