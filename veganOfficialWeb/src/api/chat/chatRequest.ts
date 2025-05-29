import request from '@/utils/request/requests';

interface Message {
    _id: string;
    conversationId: string,
    sender: 'user' | 'admin',
    senderId: string,
    content: string,
    read: boolean,
    createdAt: string | Date,
    updatedAt: string | Date,
}

interface MessageListRes {
    state: string,
    msgList: Message[]
}

interface Conversation {
    _id: string,
    userId: string,
    username: string,
    status: 'open' | 'closed',
    createdAt: string | Date,
    updatedAt: string | Date,
    lastMessage: Message
}

interface ConversationRes {
    state: string,
    savedConversation: Conversation
}

interface CloseConversationRes {
    state: string,
    closedConversation: Conversation
}

interface ConversationListRes {
    state: string,
    conversationList: Conversation[]
}

interface ReqReadMessage {
    token: string,
    msgIdList: string[]
}
interface ReqCloseMessage {
    token: string,
    conversationId: string
}
interface ReqReadRes {
    state: string;
    updateCount: number
}

// 建立對話
const reqCreateConversation = (token: string) => {
    return request.post<any, ConversationRes>(`/service/conversation/${token}`);
}

// 獲取對話列表
const reqGetConversationList = (token: string) => {
    return request.get<any, ConversationListRes>(`/service/conversation/${token}`);
}

// admin close conversation
const reqCloseConversation = (params: ReqCloseMessage) => {
    return request.patch<any, CloseConversationRes>(`/service/conversation/close/${params.token}`,
        {
            conversationId: params.conversationId
        }
    );
}

// get msg list
const reqGetMessageList = (token: string) => {
    return request.get<any, MessageListRes>(`/service/message/${token}`);
}

// read msg 
const reqReadMessage = ({ token, msgIdList }: ReqReadMessage) => {
    return request.patch<any, ReqReadRes>(`/service/message/read/${token}`,
        {
            token,
            msgIdList
        },
        {
            headers: {
                Authorization: token
            }
        })
}

export {
    reqCreateConversation,
    reqGetConversationList,
    reqCloseConversation,
    reqGetMessageList,
    reqReadMessage
}

export type {
    ConversationListRes,
    Conversation,
    Message,
    ReqReadMessage,
    ReqReadRes,
    CloseConversationRes
}