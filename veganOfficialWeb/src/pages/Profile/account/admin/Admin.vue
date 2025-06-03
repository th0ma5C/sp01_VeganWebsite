<template>
    <div class="chatBox">
        <aside>
            <div class="title">
                <h2>
                    客服中心
                </h2>
                <span class="time">
                    服務時間 9:00-18:00
                    <span class="state"
                        :style="isOnDuty"></span>
                </span>
            </div>


            <div class="record">
                <template
                    v-if="showConversationList.length">
                    <h3 v-for="(state, index) in showConversationList"
                        :key="index"
                        @click="selectConversation(state._id)">
                        <span>
                            {{
                                new
                                    Date(state.updatedAt).toLocaleDateString()
                            }}
                        </span>
                        <small>
                            {{
                                state.lastMessage
                            }}
                        </small>
                    </h3>
                </template>
                <template v-else>
                    <span>
                        沒有新訊息
                    </span>
                </template>
            </div>

        </aside>

        <main :class="{
            chatting: isChatting
        }">
            <div class="msgWrapper">
                <template
                    v-for="(msg, index) in showMsgList"
                    :key="index">
                    <div v-if="msg.sender == 'user'"
                        class="otherMsg">
                        <SvgIcon name="Person"
                            color="#00430b" height="28px"
                            width="28px" class="avatarIcon">
                        </SvgIcon>

                        <div class="content">
                            {{ msg.content }}
                        </div>

                        <div class="timeStamp">
                            {{
                                new
                                    Date(msg.updatedAt).toLocaleTimeString()
                            }}
                        </div>
                    </div>

                    <div v-else class="userMsg">
                        <div class="timeStamp">
                            {{
                                new
                                    Date(msg.updatedAt).toLocaleTimeString()
                            }}
                        </div>
                        <div class="content">
                            {{ msg.content }}
                        </div>
                    </div>
                </template>
                <button>
                    結束此次服務
                </button>
                <!-- <div class="otherMsg">
                    <SvgIcon name="Person" color="#00430b"
                        height="28px" width="28px"
                        class="avatarIcon">
                    </SvgIcon>

                    <div class="content">
                        Lorem ipsum dolor, sit amet
                        consectetur adipisicing elit.
                        eveniet eius quasi veniam
                        voluptatibus earum odit
                        accusantium
                        soluta quisquam vel.
                    </div>

                    <div class="timeStamp">
                        時間戳
                    </div>
                </div>

                <div class="userMsg">
                    <div class="timeStamp">
                        時間戳
                    </div>
                    <div class="content">
                        Lorem ipsum dolor, sit amet
                        consectetur adipisicing elit.
                        Cumque
                    </div>
                </div> -->
            </div>

            <div class="inputWrapper">
                <textarea name="userMsg" id="userMsg"
                    v-model="inputMsg" type="text"
                    placeholder="輸入訊息..."></textarea>
                <label for="userMsg">

                </label>
                <button>送出</button>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useField } from 'vee-validate';
import * as yup from 'yup';
import { useChat } from '@/hooks/useSocketIo';

// user type area
const schema = yup.object({
    msg: yup
        .string()
        .trim()
        .required('請輸入訊息')
        .max(300, '最多只能輸入 300 字'),
});

const { value: inputMsg, validate, errorMessage, resetField } = useField<string>('msg', schema);

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
    conversationStateList,
    msgState,
    initConversationList,
    userCreateConversation,
    sendMessage,
    switchConversation
} = useChat();
const isChatting = ref(false);

const showConversationList = computed(() => {
    return [...conversationStateList.value]
})

async function sendMsg() {
    try {
        console.log(inputMsg.value);
        sendMessage(inputMsg.value);
    } catch (error) {
        console.log(error);
    }
}

const selectedConversation = ref<string | null>();
const showMsgList = computed(() => {
    return selectedConversation.value ?
        msgState.value.get(selectedConversation.value) :
        []
})

async function selectConversation(conversationId: string) {
    try {
        selectedConversation.value = await switchConversation(conversationId);
    } catch (error) {
        console.log(error);
    }
}

onMounted(() => {
    nextTick(() => {
        initConversationList();
    })
})


const recordWidth = ref(0)
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
}

aside {
    padding: .5rem .25rem .5rem 1rem;
    overflow-y: scroll;

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
    align-items: baseline;
    gap: .5rem;

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
        background-color: greenyellow;
        border-radius: 50%;
        margin-block: auto;
    }
}


.record {
    margin-top: 1rem;
    display: flex;
    gap: .5rem;
    flex-direction: column;

    h3 {
        font-size: 1.5rem;
        outline: 1px solid black;
        border-radius: .25rem;
        padding-left: .5rem;
        display: flex;
        flex-direction: column;

        span {}

        small {
            font-size: 60%;
            display: inline-block;
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-inline: auto;
        }
    }

    &>span {
        text-align: center;
        font-size: 90%;
        opacity: .5;
        user-select: none;
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
    padding-inline: .5rem;
    display: flex;
    gap: 1rem;
    flex-direction: column;
    padding-block: .5rem;
    position: relative;

    &>div {
        display: flex;
        gap: .5rem;
        max-width: 80%;
    }

    .content {
        outline: 1px solid black;
        padding: .25rem .5rem;
        border-radius: .25rem;
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
        position: absolute;
        bottom: .5rem;
        left: 50%;
        translate: -50% 0;
        padding: .25rem .5rem;
        outline: 1px solid black;
        border-radius: .25rem;
        background-color: $error_color;
        color: $primaryBacColor;
        font-variation-settings: 'wght' 500;
        opacity: .5;
        transition: opacity .15s;

        &:hover {
            opacity: 1;
        }
    }
}

.otherMsg {}

.avatarIcon {
    padding: .25rem;
    border-radius: 50%;
    outline: 1px solid black;
    height: max-content;
    // align-self: center;
    // margin-top: .5rem;
}

.userMsg {
    margin-left: auto;
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

        &:hover {
            opacity: 1;
        }
    }
}
</style>