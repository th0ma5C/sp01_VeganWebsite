import { io, type Socket } from 'socket.io-client'
import { reactive } from 'vue';

type EventHandler<T = void> = T extends void ? () => void : (payload: T) => void;

interface SocketEvents {
    connect: void;
    disconnect: string;
};

let socket: Socket | null = null;

export const socketEvents = reactive<{
    [K in keyof SocketEvents]: EventHandler<SocketEvents[K]>[];
}>({
    connect: [],
    disconnect: []
});


export default (token?: string) => {
    if (!socket) {
        socket = io(import.meta.env.VITE_API_BASE_URL, {
            autoConnect: false,
            auth: {
                userToken: token
            },
        });

        socket.on('connect', () => {
            // console.log(socket);
            for (const fn of socketEvents.connect) {
                fn()
            }
        });

        socket.on('disconnect', (reason) => {
            // console.log('Socket 已斷線，原因:', reason);
            for (const fn of socketEvents.disconnect) {
                fn(reason)
            }
        });

        socket.on('connect_error', (err) => {
            // console.error('連線錯誤:', err.message);
        });
    }
    return socket;
};