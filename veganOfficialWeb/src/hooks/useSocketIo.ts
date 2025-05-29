import { reqCloseConversation, reqCreateConversation, reqGetConversationList, reqGetMessageList, reqReadMessage } from '@/api/chat/chatRequest';
import type { ConversationListRes, Conversation, Message } from '@/api/chat/chatRequest';
import { useUserStore } from '@/store/userStore';
import { storeToRefs } from 'pinia';
// import { io, type Socket } from 'socket.io-client'
import { onMounted, onUnmounted, ref, reactive } from 'vue';
import getSocket, { socketEvents } from '@/utils/socket'

type ConversationState = Map<string, Conversation>
type MsgListState = Map<string, Message[]>
interface SendMsgRes {
    updatedConversation: Conversation,
    newMsg: Message,
}

export const useChat = () => {
    const userStore = useUserStore();
    const { user, userToken } = storeToRefs(userStore);
    const userId = user.value.userID;
    const userRole = user.value.role;

    const socket = getSocket(userToken.value ?? '');
    if (!socket.connected) socket.connect();

    let currConversationId = ref<null | string>();
    const conversationState = ref<ConversationState>(new Map());
    const msgState = ref<MsgListState>(new Map());

    // send msg
    const sendMessage = (message: string) => {
        if (!currConversationId.value) return
        const nMsg = {
            conversationId: currConversationId.value,
            sender: userRole,
            senderId: userId,
            content: message,
            recipientId: userRole == 'admin' ?
                conversationState.value.get(currConversationId.value)?.userId :
                null
        };
        socket.emit('sendMessage', nMsg);
    }

    // socket.on('sendMsgSuccess', ({ updatedConversation, newMsg }: SendMsgRes) => {
    //     console.log(updatedConversation._id);
    //     const list = msgState.value.get(updatedConversation._id) ?? [];
    //     list.push(newMsg);

    //     let conversation = conversationState.value.get(updatedConversation._id);
    //     if (conversation) {
    //         conversation = { ...updatedConversation };
    //     }
    // })

    socket.on('receiveMessage', async ({ updatedConversation, newMsg }: SendMsgRes) => {
        try {
            if (!userToken.value) throw new Error('unauthorized user')
            const receivedMsg = { ...newMsg };
            const inConversation = currConversationId.value === updatedConversation._id;

            // read if in current conversation
            if (inConversation) {
                receivedMsg.read = true;
                await reqReadMessage({ token: userToken.value, msgIdList: [newMsg._id] })
            }

            // refresh conversation list
            const conversation = conversationState.value.get(updatedConversation._id);
            if (conversation) {
                Object.assign(conversation, updatedConversation);
            } else {
                conversationState.value.set(updatedConversation._id, reactive(updatedConversation));
            }

            // refresh msg list
            const msglist = msgState.value.get(updatedConversation._id);
            if (msglist) {
                msglist.push(receivedMsg);
            } else {
                msgState.value.set(updatedConversation._id, [receivedMsg]);
            }
            console.log('#receiveMessage', msgState.value);
        } catch (error) {
            console.log(error);
        }
    })

    socket.on('closeConversation', (closedConversation: Conversation) => {
        console.log('socket on close conversation');
        // refresh conversation list
        const conversation = conversationState.value.get(closedConversation._id);
        if (conversation) {
            Object.assign(conversation, closedConversation);
        } else {
            conversationState.value.set(closedConversation._id, reactive(closedConversation));
        }
    })

    // admin join admin lobby
    const adminJoinLobby = () => {
        if (userRole === 'admin') socket.emit('joinAdminLobby', userId)
    }

    socket.on('newUserConversation', async ({ conversationId }) => {
        try {
            // new user chat invitation
            socket.emit('adminJoinUserRoom', conversationId);
        } catch (error) {
            console.log(error);
        }
    })

    // user create new conversation
    const userCreateConversation = async () => {
        try {
            if (!userToken.value) return
            const { state, savedConversation } = await reqCreateConversation(userToken.value);
            if (state === 'confirm') {
                currConversationId.value = savedConversation._id;

                socket.emit('userCreateConversation', currConversationId.value);
                socket.once('conversationReady', async () => {
                    try {
                        conversationState.value.set(savedConversation._id, reactive(savedConversation));
                        msgState.value.set(savedConversation._id, []);
                        // await initMsgList();
                    } catch (error) {
                        console.log(error);
                    }
                });
                return savedConversation
            } else {
                throw new Error('create conversation failed please retry')
            }
        } catch (error) {
            console.log(error);
        }
    }

    // user join conversation
    const joinConversation = (roomId: string) => {
        socket.emit('joinConversation', roomId);
    }

    // user init conversation list
    const initConversationList = async () => {
        try {
            if (!userToken.value) return
            const res = await reqGetConversationList(userToken.value);
            if (res.state !== 'confirm') throw new Error('init conversation list error');

            // conversationState.value = [...res.conversationList]
            res.conversationList.forEach((conversation) => {
                conversationState.value.set(conversation._id, reactive(conversation));
                joinConversation(conversation._id)
            })
            await initMsgList();
        } catch (error) {
            console.log(error);
        }
    }

    // gen msg id list
    const genMsgIdList = (msgList: Message[]) => {
        return msgList.reduce((acc, msg) => {
            if (msg.sender !== userRole) acc.push(msg._id);
            return acc
        }, [] as string[]);
    }

    // req read msg
    const readMsg = async (msgIdList: string[]) => {
        try {
            if (!userToken.value) throw new Error('unauthorized user')
            const res = await reqReadMessage({ token: userToken.value, msgIdList })
            console.log(res);
            if (res.state == 'confirm' && currConversationId.value) {
                const state = msgState.value.get(currConversationId.value) || [];
                state.forEach((msg) => {
                    if (msg.sender !== userRole) {
                        msg.read = true
                    }
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    // select conversation room
    const switchConversation = async (conversationId: string) => {
        try {
            currConversationId.value = conversationId;
            return currConversationId.value
        } catch (error) {
            console.log(error);
        }
    }

    // init message list
    const initMsgList = async () => {
        try {
            // const list = await reqGetMessageList(conversationId);
            // if (list.state === 'confirm') return list.msgList
            if (!userToken.value) return
            const res = await reqGetMessageList(userToken.value);
            if (res.state !== 'confirm') throw new Error('init conversation list error');
            res.msgList.forEach((msg) => {
                const list = msgState.value.get(msg.conversationId);
                if (list) {
                    list.push(msg)
                } else {
                    msgState.value.set(msg.conversationId, [msg]);
                }
            })

        } catch (error) {
            throw new Error(String(error));
        }
    }

    // admin close conversation
    const adminCloseConversation = async () => {
        try {
            if (!currConversationId.value || !userToken.value) throw new Error('unauthorized user')
            const res = await reqCloseConversation({
                token: userToken.value,
                conversationId: currConversationId.value
            });
            if (res.state === 'confirm') {
                socket.emit('adminCloseConversation', res.closedConversation)
            }
            return res
        } catch (error) {
            throw new Error(String(error));
        }
    }

    onMounted(() => {
        adminJoinLobby();
    });

    onUnmounted(() => {
        socket.off('receiveMessage');
        socket.off('newUserConversation');
        socket.off('closeConversation');
        socket.disconnect();
    });

    return {
        conversationState,
        msgState,
        initConversationList,
        initMsgList,
        userCreateConversation,
        switchConversation,
        sendMessage,
        readMsg,
        adminCloseConversation
    }
}
