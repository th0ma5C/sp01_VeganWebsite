// import * as v8 from 'v8';
// import * as fs from 'fs';
// import * as path from 'path';

// // 定義 HeapSnapshot 接口
// interface HeapSnapshot {
//   getNodesCount(): number;
//   getRootNodesCount(): number;
// }

// class MemoryMonitor {
//   private threshold: number;
//   private interval: NodeJS.Timeout | null;
//   private reportPath: string;

//   constructor(threshold: number = 1) { // 默認閾值為1GB
//     this.threshold = threshold * 1024 * 1024 * 1024;
//     this.interval = null;
//     this.reportPath = path.join(__dirname, 'memory-report.txt');
//   }

//   start(checkInterval: number = 1) { // 默認每1分鐘檢查一次
//     console.log('start monitoring');
//     this.interval = setInterval(() => this.checkMemory(), checkInterval * 60000);
//   }

//   stop() {
//     if (this.interval) {
//       console.log('stop monitoring');
//       clearInterval(this.interval);
//     }
//   }

//   private checkMemory() {
//     const memoryUsage = process.memoryUsage();
//     if (memoryUsage.heapUsed > this.threshold) {
//       this.generateReport(memoryUsage);
//     }
//   }

//   private generateReport(memoryUsage: NodeJS.MemoryUsage) {
//     const heapStats = v8.getHeapStatistics();
//     const heapSnapshot = v8.getHeapSnapshot() as unknown as HeapSnapshot;

//     let report = `Memory Usage Report (${new Date().toISOString()})\n`;
//     report += `Heap Used: ${this.formatBytes(memoryUsage.heapUsed)}\n`;
//     report += `Heap Total: ${this.formatBytes(memoryUsage.heapTotal)}\n`;
//     report += `External: ${this.formatBytes(memoryUsage.external)}\n`;
//     report += `Array Buffers: ${this.formatBytes(memoryUsage.arrayBuffers)}\n\n`;

//     report += `Heap Statistics:\n${JSON.stringify(heapStats, null, 2)}\n\n`;

//     report += `Heap Snapshot Summary:\n`;
//     report += `Total Nodes: ${heapSnapshot.getNodesCount()}\n`;
//     report += `Root Nodes: ${heapSnapshot.getRootNodesCount()}\n`;

//     fs.writeFileSync(this.reportPath, report);
//     console.log(`Memory usage exceeded threshold. Report generated at ${this.reportPath}`);

//     this.analyzeHeapSnapshot(heapSnapshot);
//   }

//   private analyzeHeapSnapshot(snapshot: HeapSnapshot) {
//     // 這裡可以添加更詳細的堆快照分析邏輯
//     console.log('Analyzing heap snapshot...');
//     // 例如，你可以遍歷快照中的節點，尋找佔用內存最多的對象
//     // 注意：這可能是一個耗時的操作，應謹慎使用
//   }

//   private formatBytes(bytes: number): string {
//     if (bytes < 1024) return bytes + " bytes";
//     else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
//     else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + " MB";
//     else return (bytes / 1073741824).toFixed(2) + " GB";
//   }
// }

// export default MemoryMonitor;

// // 使用示例
// // const monitor = new MemoryMonitor(); // 使用默認閾值1GB
// // monitor.start(); // 使用默認間隔1分鐘

// // 在您的應用程序代碼中使用
// // 記得在應用程序結束時調用 monitor.stop();