<template>
    <div class="chatBox">
        <div class="mobileBurger">
            <label class="burger" for="chatBurger" :class="{
            }" @click="">
                <input type="checkbox" id="chatBurger"
                    v-model="isNavShow">
                <span></span>
                <span></span>
                <span></span>
            </label>
        </div>

        <aside :class="{
            showAside: isNavShow
        }">
            <div class="title">
                <SvgIcon name="cancel" color="black"
                    height="22px" width="22px"
                    class="closeNav" @click="closeNav">
                </SvgIcon>

                <div class="titleContent">
                    <h2 v-if="isAdmin">
                        客服中心
                    </h2>
                    <h2 v-else>
                        線上客服
                    </h2>
                    <span class="time">
                        服務時間 9:00-18:00
                        <span class="state"
                            :style="isOnDuty"></span>
                    </span>
                </div>
            </div>

            <div class="record">
                <template
                    v-if="Object.keys(showConversationList).length">
                    <div class="chatList"
                        v-for="(state, index) in showConversationList"
                        :key="state._id" :class="{
                            adminConversationList: isAdmin,
                            unread: state.hasUnread
                        }"
                        @click="selectConversation(state._id)">
                        <template v-if="isAdmin">
                            <div class="chatTitle">
                                <div class="username">
                                    {{
                                        state.username
                                    }}
                                </div>
                                <div class="msgPreview">
                                    <span
                                        class="msgContent">
                                        <span>
                                            {{
                                                state.msgPreview.sender
                                            }}
                                            {{
                                                state.msgPreview.content
                                            }}
                                        </span>
                                    </span>
                                    <!-- <span
                                        class="dot"></span> -->
                                    <span class="msgTime">
                                        {{
                                            state.lastMsgTime
                                        }}
                                    </span>
                                </div>
                            </div>

                            <div class="unreadDot"
                                v-show="state.hasUnread">
                            </div>
                        </template>
                        <template v-else>
                            <div class="chatTitle userChat">
                                <div class="msgPreview">
                                    <span
                                        class="msgContent">
                                        {{
                                            state.msgPreview.sender
                                        }}
                                        {{
                                            state.msgPreview.content
                                        }}
                                    </span>
                                    <!-- <span
                                        class="dot"></span> -->
                                    <span class="msgTime">
                                        {{
                                            state.lastMsgTime
                                        }}
                                    </span>
                                </div>
                            </div>

                            <div class="unreadDot"
                                v-show="state.hasUnread">
                            </div>
                        </template>
                    </div>

                </template>

                <template
                    v-else-if="isAdmin && !showConversationList.length">
                    <span>
                        沒有新訊息
                    </span>
                </template>

                <div class="newMsg" v-if="!isAdmin" :class="{
                    disable: !isDraft
                }">
                    <SvgIcon name="NewMsg" color="black"
                        height="24px" width="24px"
                        class="newMsgIcon">
                    </SvgIcon>
                    <button @click="createDraft">
                        聯絡客服
                    </button>
                    <div class="bubble">
                        <span>
                            請先使用已建立的對話
                        </span>
                    </div>
                    <!-- <button @click="createConversation">
                        聯絡客服
                    </button> -->
                </div>
            </div>

        </aside>

        <main :class="{
            chatting: isChatting
        }">
            <div class="msgWrapper" ref="msgWrapperRef">
                <div v-for="(msg, index) in showMsgList"
                    :key="index" ref="msgListRef"
                    :class="msg.sender == role ? 'userMsg' : 'otherMsg'">
                    <template v-if="msg.sender !== role">
                        <SvgIcon v-if="isAdmin"
                            name="Person" height="28px"
                            width="28px" color="#00430b"
                            class="avatarIcon">
                        </SvgIcon>
                        <SvgIcon v-else name="ServiceAvatar"
                            height="28px" width="28px"
                            color="#00430b"
                            class="avatarIcon">
                        </SvgIcon>

                        <div class="content">
                            {{ msg.content }}
                        </div>

                        <div class="timeStamp">
                            {{
                                msg.formattedDate
                            }}
                        </div>
                    </template>

                    <template v-else>
                        <div class="timeStamp">
                            {{
                                msg.formattedDate
                            }}
                        </div>
                        <div class="content">
                            {{ msg.content }}
                        </div>
                    </template>
                </div>

                <button
                    v-if="isAdmin && !isConversationClosed"
                    @click="closeConversation">
                    結束此次服務
                </button>

                <span class="endTag"
                    v-show="isConversationClosed">
                    此次服務已經結束
                </span>
            </div>

            <div class="inputWrapper">
                <textarea name="userMsg" id="userMsg"
                    v-model="inputMsg" type="text"
                    placeholder="輸入訊息..."
                    @keydown.enter.prevent="sendMsg"></textarea>
                <label for="userMsg">

                </label>
                <button @click="sendMsg" :class="{
                    userIsTyping: inputMsg && !isConversationClosed,
                    disable: isConversationClosed
                }">送出</button>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, nextTick, useTemplateRef } from 'vue';
import { useField } from 'vee-validate';
import * as yup from 'yup';
import { useChat } from '@/hooks/useSocketIo';
import { useUserStore } from '@/store/userStore';
import { storeToRefs } from 'pinia';
import type { Conversation, Message } from '@/api/chat/chatRequest';

/**
 * //初始化獲得所有訊息 已讀 左側以時間排列
 * // 有未完成訊息隱藏聯絡客服 進入聊天顯示最下方
 * // 調樣式 參考IG
 * // admin 重新進入會顯示無訊息對話 在對話中不會已讀
 * // 左側訊息預覽太小
 * // 若選擇對話，無法創立新對話
 * // RWD
 */

// props
const { role } = defineProps<{
    role: string
}>()

// store
const userStore = useUserStore();
const { userToken } = storeToRefs(userStore);

// user state
const isAdmin = computed(() => role === 'admin')

// user type area
const schema = yup.object({
    msg: yup
        .string()
        .trim()
        .required('請輸入訊息')
        .max(300, '最多只能輸入 300 字'),
});

const { value: inputMsg, validate, errorMessage, resetField, meta } = useField<string>('msg', schema);
const isSubmitted = ref(false);

// off time light class
const isOnDuty = computed(() => {
    const now = new Date().getHours();
    if (now < 9 || now >= 18) {
        return {
            'background-color': 'orange'
        }
    }
    return {
        'background-color': 'greenyellow'
    }
})

// chat
const {
    conversationState,
    msgState,
    initConversationList,
    initMsgList,
    userCreateConversation,
    sendMessage,
    switchConversation,
    readMsg,
    adminCloseConversation
} = useChat();
const isChatting = ref(false);
const msgListRef = useTemplateRef('msgListRef');
const dateOptions = {
    month: '2-digit',
    day: '2-digit'
} as Intl.DateTimeFormatOptions
const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
} as Intl.DateTimeFormatOptions

type ShowConversation = Conversation & {
    msgPreview: {
        sender: string,
        content: string
    },
    lastMsgTime: string | Date,
    hasUnread: boolean
}

// format msg date
const dateFormatter = (date: string | Date) => {
    const today = new Date().toLocaleDateString();
    const msgDate = new Date(date).toLocaleDateString();
    const lastMsgTime = today === msgDate ?
        new Date(date).toLocaleTimeString('zh-Tw', timeOptions) :
        new Date(date).toLocaleDateString('zh-Tw', dateOptions)

    return lastMsgTime
}

const showConversationList = computed(() => {
    // const list = {} as Record<string, ShowConversation>;
    // for (const [key, value] of conversationState.value) {
    //     // show msg preview
    //     let sender;
    //     if (value.lastMessage) {
    //         const isSelf = role === value.lastMessage.sender;
    //         if (isSelf) {
    //             sender = '您：';
    //         } else {
    //             sender = role === 'admin' ? `${value.username}：` : '客服人員：';
    //         }
    //     }
    //     const lastMsgSender = sender ? sender : '';

    //     const msgPreview = {
    //         sender: lastMsgSender,
    //         content: value.lastMessage ? value.lastMessage.content : '新訊息'
    //     }

    //     // last msg date
    //     const lastMsgTime = dateFormatter(value.updatedAt)

    //     // check unread in conversation
    //     let hasUnread = false;
    //     const msgList = msgState.value.get(value._id);
    //     if (msgList) {
    //         hasUnread = msgList.some((msg) => !msg.read && msg.sender !== role)
    //         console.log(hasUnread);
    //     }

    //     list[key] = {
    //         ...value,
    //         msgPreview,
    //         lastMsgTime,
    //         hasUnread
    //     }
    // }
    // const conversationArr = [...Object.values(list)]
    //     .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    // console.log('@show conversation', conversationArr);
    // return conversationArr
    const list = Array.from(conversationState.value.values())
        .map(conv => {
            // msgPreview
            const last = conv.lastMessage;
            const sender = last
                ? (role === last.sender
                    ? '您：'
                    : (role === 'admin'
                        ? `${conv.username}：`
                        : '客服人員：'))
                : '';
            const content = last?.content ?? '新訊息';

            // hasUnread
            const msgs = msgState.value.get(conv._id) ?? [];
            const hasUnread = msgs.some(m => !m.read && m.sender !== role);

            return {
                ...conv,
                msgPreview: { sender, content },
                lastMsgTime: dateFormatter(conv.updatedAt),
                hasUnread
            } as ShowConversation;
        })
        .sort((a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
    return list
})

const isDraft = computed(() => {
    const conversationAllClosed = showConversationList.value.every((conversation) => {
        return conversation.status === 'closed'
    })
    return showConversationList.value.length == 0 || conversationAllClosed
})
function createDraft() {
    if (isDraft.value) {
        selectedConversation.value = 'new_draft';
        return isChatting.value = true;
    }
}

async function sendMsg() {
    if (isConversationClosed.value) return
    try {
        if (isDraft.value) {
            await createConversation();
            // resetField();
            // return
        }

        console.log(inputMsg.value);
        sendMessage(inputMsg.value);
        resetField();
        isSubmitted.value = true

    } catch (error) {
        console.log(error);
    }
}

async function createConversation() {
    try {
        const newConversation = await userCreateConversation();
        if (newConversation) {
            isChatting.value = true;
            await selectConversation(newConversation._id)
            selectedConversation.value = newConversation._id
        }
    } catch (error) {
        console.log(error);
    }
}

const selectedConversation = ref<string | null>();
const showMsgList = computed(() => {
    if (!selectedConversation.value) return []

    const raw = msgState.value.get(selectedConversation.value)

    // check unread in conversation
    // let hasUnread = false;
    // const msgList = msgState.value.get(selectedConversation.value);
    // if (msgList) {
    //     hasUnread = msgList.some((msg) => !msg.read)
    //     console.log(hasUnread);
    // }

    const list = raw && raw.length
        ? raw.map((msg) => ({
            ...msg,
            formattedDate: dateFormatter(msg.updatedAt),
            // hasUnread
        }))
        : [];

    list.sort((a, b) => String(a.updatedAt).localeCompare(String(b.updatedAt)))
    return list
})

const changingConversation = ref(false);
async function selectConversation(conversationId: string) {
    try {
        changingConversation.value = true
        selectedConversation.value = await switchConversation(conversationId);
        // read message
        // const msgIdList = showMsgList.value
        //     .filter(msg => msg.sender !== role)
        //     .map((msg) => msg._id)
        const msgIdList = showMsgList.value.reduce((acc, msg) => {
            if (msg.sender !== role) acc.push(msg._id);
            return acc
        }, [] as string[]);
        if (msgIdList.length) await readMsg(msgIdList);

        if (selectedConversation.value) {
            await nextTick();
            changingConversation.value = false;
        }
    } catch (error) {
        console.log(error);
    } finally {
        isChatting.value = true;
        closeNav()
    }
}

// scroll when send msg or enter conversation
const msgWrapperRef = useTemplateRef('msgWrapperRef');
const scrollToBottom = () => {
    nextTick(() => {
        if (msgWrapperRef.value) {
            msgWrapperRef.value.scrollTo({
                top: msgWrapperRef.value.scrollHeight,
            })
        }
    })
}
watch(showMsgList, (nVal) => {
    if (nVal) {
        scrollToBottom()
    }
})

// admin close conversation
// const isConversationClosed = ref(false);
const isConversationClosed = computed(() => {
    const conversation = selectedConversation.value
        ? conversationState.value.get(selectedConversation.value)
        : undefined
    if (conversation) {
        return conversation.status === 'closed'
    }
})
const closeConversation = async () => {
    try {
        await adminCloseConversation();
        // isConversationClosed.value = true;
        // scrollToBottom()
    } catch (error) {
        console.log(error);
    }
}

watch(isConversationClosed, (nVal) => {
    if (nVal) {
        scrollToBottom()
    }
})

// mobile nav
const isNavShow = ref(true);

const closeNav = () => {
    isNavShow.value = false
}

onMounted(() => {
    nextTick(() => {
        initConversationList();
    })
})

onUnmounted(() => {
    isChatting.value = false
})

</script>

<style scoped lang="scss">
* {
    // outline: 1px solid black;
}

.chatBox {
    height: 100%;
    border-radius: 1rem;
    display: flex;
    // gap: .5rem;
    position: relative;
    outline: 1px solid black;
    overflow: hidden;
    z-index: 0;
}

aside {
    background-color: $primaryBacColor;
    padding: .5rem .25rem .5rem 1rem;
    overflow-y: scroll;
    overflow-y: auto;
    position: relative;
    z-index: 2;
    // max-width: 30%;
    max-width: min(300px, 40%);

    scrollbar-width: thin;
    scrollbar-gutter: stable;

    &::-webkit-scrollbar {
        translate: 0 1rem;
        width: 0.25rem;
    }

    &::-webkit-scrollbar-thumb {
        // background: transparent;
        background: #c1c1c1;
        border-radius: 10px !important;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
    }
}

.title {
    position: relative;
    display: flex;
    flex-direction: column;
    // align-items: baseline;
    // gap: .25rem;
    padding-right: .5rem;
    text-wrap: nowrap;

    &::after {
        position: absolute;
        bottom: 0;
        left: 0;
        content: '';
        width: 100%;
        height: 1px;
        background-color: black;
    }

    h2 {
        font-size: 1.5rem;
        font-size: clamp(1.5rem, 1.3571428571428572rem + 0.7142857142857143vw, 2rem);
        font-variation-settings: 'wght' 450;
    }

    .time {
        font-size: 80%;
        display: inline-flex;
        gap: .25rem;
    }

    .state {
        @include WnH(6px);
        display: inline-block;
        // background-color: greenyellow;
        // background-color: orange;
        border-radius: 50%;
        margin-block: auto;
    }
}

.mobileBurger {
    // display: none;
    cursor: pointer;
    position: absolute;
    top: 24px;
    left: 28px;
    transform: translateY(-50%);
    z-index: 1;
    opacity: .5;
    transition: opacity .3s;

    &:hover {
        opacity: 1;
    }

    .burger {
        width: 22px;
        height: 14px;
        background: transparent;
        cursor: pointer;
        display: block;
        transform-origin: center;
        transition: scale .15s, opacity .15s;

        &:hover {
            scale: 1.05;
        }
    }

    .burger input {
        display: none;
    }

    .burger span {
        display: block;
        position: absolute;
        height: 2px;
        width: 100%;
        // background-color: $secondBacColor;
        background-color: black;
        border-radius: 9px;
        opacity: 1;
        left: 0;
        transform: rotate(0deg);
        transition: all .25s .6s, background-color .25s;
    }

    .foldBurgerBac span {
        background-color: $primaryBacColor;
    }

    .burger span:nth-of-type(1) {
        top: 0px;
        transform-origin: left center;
    }

    .burger span:nth-of-type(2) {
        top: 50%;
        transform: translateY(-50%);
        transform-origin: left center;
    }

    .burger span:nth-of-type(3) {
        top: 100%;
        transform-origin: left center;
        transform: translateY(-100%);
    }

    // .burger input:checked~span:nth-of-type(1) {
    //     transform: rotate(45deg);
    //     top: -1px;
    //     left: 5px;
    // }

    // .burger input:checked~span:nth-of-type(2) {
    //     width: 0%;
    //     opacity: 0;
    // }

    // .burger input:checked~span:nth-of-type(3) {
    //     transform: rotate(-45deg);
    //     top: 20px;
    //     left: 5px;
    // }

    .hideBurger {
        opacity: 0;
        pointer-events: none;
    }
}

.closeNav {
    display: none;
    align-self: flex-end;
    cursor: pointer;
    transition: opacity .2s;
    opacity: .5;

    &:hover {
        opacity: 1;
    }
}

.titleContent {
    display: flex;
    align-items: baseline;
    gap: .25rem;
}

.record {
    margin-top: 1rem;
    display: flex;
    gap: .5rem;
    flex-direction: column;

    &>span {
        text-align: center;
        font-size: 90%;
        opacity: .5;
        user-select: none;
    }
}

.chatList {
    display: flex;
    align-items: center;
    padding-block: .25rem;
    outline: 1px solid black;
    border-radius: .25rem;
    padding-inline: .5rem;
    cursor: pointer;
    transition: box-shadow .15s;
    user-select: none;
    gap: .25rem;

    // span {}

    // small {
    //     font-size: 60%;
    //     display: inline-block;
    //     max-width: 120px;
    //     overflow: hidden;
    //     text-overflow: ellipsis;
    //     white-space: nowrap;
    //     line-height: 36px;
    //     margin-inline: auto;
    // }

    &:hover {
        outline: 1px solid rgba(0, 0, 0, 1);
        box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.3);
    }

    &:active {
        box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 0.3);
    }
}

.chatTitle {
    flex: 1;
    overflow: hidden;
}

.unread {
    font-weight: 600;
    font-variation-settings: 'wght' 600;
}

.username {
    font-size: 1.25rem;
}

.msgPreview {
    display: flex;
    align-items: center;
    gap: .5rem;
    // min-width: 0;
    // width: 100%;
    // max-width: 100%;
    // overflow: hidden;
}

.msgContent {
    font-size: 80%;
    display: inline-block;
    // width: 100%;
    // max-width: 100%;
    // max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    // line-height: 36px;
    // margin-right: auto;
}

.dot {
    display: inline-block;
    width: 4px;
    height: 4px;
    background-color: rgb(167, 167, 167);
    border-radius: 50%;

}

.msgTime {
    font-size: 80%;
    margin-left: auto;
}

.unreadDot {
    display: inline-block;
    width: 6px;
    height: 6px;
    background-color: $secondBacColor;
    border-radius: 50%;
    // margin-inline: auto .5rem;
}

.userChat {
    .msgContent {
        font-size: 1.25rem;
    }
}

// .record .adminConversationList {
//     padding-block: .25rem;
//     flex-direction: column;

//     &>small {
//         margin-left: 0;
//         line-height: normal;
//     }
// }

// .record .conversationTitle {
//     display: flex;
//     align-items: baseline;

//     span {}

//     small {
//         line-height: normal;
//     }
// }

.newMsg {
    // cursor: pointer;
    width: max-content;
    display: flex;
    align-items: center;
    gap: .25rem;
    margin-inline: auto;
    margin-top: .5rem;
    padding: .25rem .5rem;
    background-color: $primaryBacColor;
    border-radius: .25rem;
    transition: box-shadow .15s;
    outline: 1px solid rgba(0, 0, 0, 1);
    position: sticky;
    left: 50%;
    bottom: .25rem;
    translate: -50% 0;
    z-index: 9;

    &:not(.disable):hover {
        outline: 1px solid rgba(0, 0, 0, 1);
        box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.3);
    }

    &:not(.disable):active {
        box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 0.3);
    }

    &:is(.disable):hover .bubble {
        visibility: visible;
        opacity: 1;
    }
}

.bubble {
    visibility: hidden;
    cursor: default;
    position: absolute;
    left: 50%;
    bottom: 120%;
    translate: -50% 0%;
    outline: 1px solid black;
    border-radius: .25rem;
    background-color: $primaryBacColor;
    text-wrap: nowrap;
    padding: .5rem .25rem;
    opacity: 0;
    transition: opacity .3s;
}

.disable {
    cursor: not-allowed;
    outline: 1px solid rgba(0, 0, 0, 0.5);

    .newMsgIcon,
    button {
        opacity: .5;
        cursor: not-allowed;
    }
}

main {
    margin-inline: initial;
    display: flex;
    flex-direction: column;
    flex: 1;
    position: relative;
    // margin-left: .5rem;

    &::before {
        content: '';
        position: absolute;
        left: 0rem;
        height: 100%;
        width: 1px;
        background-color: black;
    }

    &>div {
        transition: opacity .15s;
        opacity: 0;
    }

    &:is(.chatting)>div {
        opacity: 1;
    }
}

.msgWrapper {
    flex: 8;
    max-height: 80%;
    overflow-y: scroll;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    gap: 1rem;
    flex-direction: column;
    padding: 1rem 1.5rem;
    position: relative;

    &>div {
        display: flex;
        gap: .5rem;
        max-width: 80%;
    }

    .content {
        outline: 1px solid black;
        padding: 4px 12px;
        border-radius: 1rem;
        overflow-wrap: break-word;
        word-break: break-all;
        // text-wrap: balance;
        // white-space: normal;
    }

    .timeStamp {
        font-size: 80%;
        text-wrap: nowrap;
        align-self: flex-end;
    }

    &::-webkit-scrollbar {
        translate: 0 1rem;
        width: 0.25rem;
    }

    &::-webkit-scrollbar-thumb {
        // background: transparent;
        background: #c1c1c1;
        border-radius: 10px !important;

    }

    &::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
    }

    // &::-webkit-scrollbar-track {
    //     background: #e6e6e6;
    //     // border-left: 1px solid transparent;
    //     border-radius: 10px !important;
    // }

    &>button {
        // position: relative;
        // bottom: .5rem;
        // left: 50%;
        // translate: -50% 0;
        padding: .25rem .5rem;
        outline: 1px solid black;
        border-radius: .25rem;
        background-color: $error_color;
        color: $primaryBacColor;
        font-variation-settings: 'wght' 500;
        opacity: .5;
        transition: opacity .15s;
        width: max-content;
        align-self: center;

        &:hover {
            opacity: 1;
        }
    }
}

.chatting {}

.otherMsg {
    // display: flex;
    // gap: .5rem;
    // max-width: 80%;

    .content {
        padding: 4px 12px;
    }
}

.avatarIcon {
    padding: 2px;
    border-radius: 50%;
    outline: 1px solid black;
    height: max-content;
    // align-self: center;
    // margin-top: .5rem;
}

.userMsg {
    margin-left: auto;
    // display: flex;
    // justify-content: flex-end;
    // gap: .5rem;
    // max-width: 80%;
}

.endTag {
    // display: inline-block;
    text-align: center;
    width: max-content;
    margin-inline: auto;
    position: relative;
    // overflow: hidden;

    &::after {
        content: '';
        position: absolute;
        left: 110%;
        top: 50%;
        translate: 0 -50%;
        width: 100%;
        height: 1px;
        background-color: black;
    }

    &::before {
        content: '';
        position: absolute;
        right: 110%;
        top: 50%;
        translate: 0 -50%;
        width: 100%;
        height: 1px;
        background-color: black;
    }
}

.inputWrapper {
    flex: 2;
    border-top: 1px solid black;
    padding-inline: .5rem;
    position: relative;

    textarea {
        resize: none;
        background-color: $primaryBacColor;
        width: 100%;
        height: 100%;
        padding-inline: .5rem;
        padding-top: .25rem;

        &:focus {
            outline: none;
        }
    }

    label {
        position: absolute;
        left: 1.5rem;
        top: .25rem;
    }

    button {
        position: absolute;
        right: 2rem;
        bottom: .5rem;
        padding: .25rem .5rem;
        outline: 1px solid black;
        border-radius: .25rem;
        background-color: $btnBacColor;
        color: $primaryBacColor;
        font-variation-settings: 'wght' 500;
        opacity: .5;
        transition: opacity .15s;

        &:not(.disable):hover {
            opacity: 1;
        }
    }

    .userIsTyping {
        opacity: 1;
    }
}

* {
    // outline: 1px solid black;
}



@include XLarge {}

@include large {}

@include medium($width: 1024px) {
    .closeNav {
        display: flex;
    }

    .showAside {
        translate: 0% 0;
    }

    aside {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        border-right: 1px solid;
        border-color: black;
        translate: -100% 0;
        transition: translate .5s;
        max-width: min(280px, 55%);
        padding: 0.5rem 0.25rem 0.5rem .5rem;
    }

    aside+main::before {
        width: 0;
    }

    .msgWrapper {
        margin-top: 26px;
    }
}

@include medium {
    .chatBox {
        flex: 1;
        max-height: 540px;
    }
}

@include small {
    .showAside {
        // border-right: none;
    }

    aside {
        border-color: transparent;
        width: 100%;
        max-width: 100%;
    }
}

@include small($width: 430px) {
    .msgTime {
        // margin-left: auto;
    }

    .msgContent {
        max-width: 250px;
    }
}

@include small($width: 320px) {}
</style>