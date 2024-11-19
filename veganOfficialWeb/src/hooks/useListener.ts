// import { getCurrentInstance } from 'vue';

interface EventInfo<T extends Event> {
    event: string;
    handler: (e: T) => void;
}

export default function useListener<T extends Event>(
    element: Window | Document | HTMLElement,
    action: 'add' | 'remove',
    events: EventInfo<T>[],
    options?: boolean | EventListenerOptions) {
    // console.log(getCurrentInstance()?.type);
    if (action == 'add') {
        events.forEach(({ event, handler }) => {
            element.addEventListener(event, handler as (e: Event) => void, options);
        });
    } else {
        events.forEach(({ event, handler }) => {
            if (element) {
                element.removeEventListener(event, handler as (e: Event) => void, options);
            }
        });
    }
}
/** events的類型解決
 *  1. 將事件處理函數的類型定義為 Function 並在調用時使用類型斷言 handler as (e: Event) => void，可以解決類型不匹配的問題，因為你通過將 handler 定義為一個泛型的 Function
 *  2. 透過將事件處理函數的類型參數化，並在 EventInfo 介面中使用泛型 <T extends Event> 來限定 handler 函數接收特定類型的事件對象
    
    interface EventInfo {
     event: string;
     handler: Function;
    }
 
    function useListener(element: Window | Document | HTMLElement, action: 'add' | 'remove', events: EventInfo[]) {
        if (action == 'add') {
            events.forEach(({ event, handler }) => {
                element.addEventListener(event, handler as (e: Event) => void);
            });
        } else {
            events.forEach(({ event, handler }) => {
                element.removeEventListener(event, handler as (e: Event) => void);
            });
        }
    }
*/
