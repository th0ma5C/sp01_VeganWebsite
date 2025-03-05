<template>
    <div class="botContainer" ref="botContainer">
        <h1>
            FAQ
        </h1>

        <main>
            <div class="group"
                v-for="({ title, content }, list_index) in list"
                :key="list_index">
                <h2>
                    {{ title }}
                </h2>

                <ul>
                    <template
                        v-for="({ question, answer, isOpen }, content_index) in content"
                        :key="content_index">
                        <li class="question" :class="{
                            open: isOpen
                        }"
                            @click="toggleAnsOpen(list_index, content_index)">
                            {{ question }}
                        </li>
                        <li class="answer">
                            <span>
                                {{ answer }}
                            </span>
                        </li>
                    </template>
                </ul>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, useTemplateRef } from 'vue';
import { positionStore } from '../store/usePagePosition';


const list = reactive([
    {
        title: '產品與成分',
        content: [
            {
                question: 'Q：沙拉和果昔的食材都是新鮮的嗎？',
                answer: '是的，我們所有的沙拉和果昔均選用當日新鮮採購的蔬果，並在下單後立即製作，確保食材新鮮度與品質。',
                isOpen: false
            },
            {
                question: 'Q：你們的沙拉或果昔是否含有過敏原（如堅果、乳製品）？',
                answer: '部分產品可能含有堅果或乳製品。我們會在每個產品頁面詳細標示成分，如有特殊需求，請於訂單備註或聯繫我們訂製專屬沙拉。',
                isOpen: false
            },
        ]
    },
    {
        title: '配送與保存',
        content: [
            {
                question: 'Q：蔬食沙拉與果昔多久可以送達？',
                answer: '一般配送時間為下單後的 7 天內。若需特定時間送達，請於結帳時選擇配送時段或提前一天預訂。',
                isOpen: false
            },
            {
                question: 'Q：沙拉和果昔如何保存？保存期限是多久？',
                answer: '請將沙拉和果昔置於冷藏 4°C 以下保存，並在開封後 24 小時內食用完畢，以確保最佳口感與安全。',
                isOpen: false
            },
        ]
    },
    {
        title: '訂購與客製化',
        content: [
            {
                question: 'Q：可以客製化沙拉或果昔嗎？',
                answer: '可以！您可以在客製化專區選擇您喜愛的蔬菜、蛋白質和醬料，搭配出專屬的健康沙拉或果昔。',
                isOpen: false
            },
            {
                question: 'Q：如果訂單有問題，可以修改或取消嗎？',
                answer: '訂單在製作前可進行修改或取消，請在下單後的 30 分鐘內聯繫客服。若已付款且已進入製作流程，則無法進行修改或取消。',
                isOpen: false
            },
        ]
    },
])

function toggleAnsOpen(list_index: number, content_index: number) {
    const open = list[list_index].content[content_index].isOpen;
    list[list_index].content[content_index].isOpen = !open;
}

// position store
const botContainer = useTemplateRef('botContainer');

onMounted(() => {
    positionStore.exposeElCoord('FAQ', botContainer.value)
})

</script>

<style scoped lang="scss">
* {
    // outline: 1px solid black;
}

%pseudo_line {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0rem;
    width: 100%;
    height: 2px;
    background-color: $secondBacColor;
}

.botContainer {
    padding-inline: 1.5rem;
    padding-inline: clamp(1.5rem, 0.19999999999999996rem + 6.5vw, 8rem);
    margin-bottom: 4rem;
    margin-top: 4rem;
    min-height: 100vh;
    position: relative;

    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: min-content 1fr;

    max-width: 1920px;
    margin-inline: auto;

    h1 {
        font-size: 3rem;
        font-size: 2.5rem;
        font-size: clamp(2.5rem, 2.4rem + 0.5vw, 3rem);
        font-family: "EB Garamond", serif;
        font-variation-settings: 'wght' 450;
        position: relative;
        height: fit-content;
        width: fit-content;

        &::after {
            @extend %pseudo_line;
        }
    }

    h2 {
        font-size: 1.75rem;
        padding-bottom: 1rem;
        font-variation-settings: 'wght' 500;
        position: relative;

        &::after {
            @extend %pseudo_line;
            height: 1px;
        }
    }
}

main {
    display: flex;
    flex-direction: column;
    padding-top: 1rem;
    grid-column: 2 / 3;
    grid-row: 2 / 3;

    li {
        font-size: 1.25rem;
        margin-bottom: 2rem;
    }
}

.question {
    cursor: pointer;
    font-variation-settings: 'wght' 450;
    transition: transform .3s;

    &:is(:first-child) {
        margin-top: 2rem;
    }

    &:hover {
        transform: translateX(1.25rem);
    }


}

.open+.answer {
    grid-template-rows: 1fr;
    margin-bottom: 2rem;
}

.answer {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows .3s, margin-bottom .3s;
    margin-bottom: 0;

    span {
        overflow: hidden;
    }
}

@include XLarge {}

@include large {}

@include medium($width: 1024px) {}

@include medium {
    .botContainer {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    main {
        grid-column: auto;
        padding-left: 1rem;
    }

    main li {
        margin-bottom: 1.5rem;
    }

    .open+.answer {
        margin-bottom: 1.5rem;
    }

    .question:is(:first-child) {
        margin-top: 1.5rem;
    }

    .question {
        &:hover {
            transform: none;
        }

        &:active {
            backdrop-filter: brightness(.95);
        }
    }
}

@include small {}

@include small($width: 430px) {
    .question:is(:first-child) {
        margin-top: 1rem;
    }

    main li {
        margin-bottom: 1rem;
    }

    .open+.answer {
        margin-bottom: 1rem;
    }
}

@include small($width: 320px) {}
</style>