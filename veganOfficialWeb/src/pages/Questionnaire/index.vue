<template>
    <div class="container">
        <div class="loading" v-if="false">
            <div class="iconMask" :style="loadingProgress">
            </div>
        </div>

        <div class="questionnaire">
            <div class="processBar">
                <div class="bar">
                    <div class="progressPercent"></div>
                </div>

                <div class="content">
                    <div class="prev">
                        上一頁
                    </div>

                    <div class="state">
                        1/6
                    </div>
                </div>
            </div>

            <div class="QNR_content">
                <div class="page_info">
                    <h2>
                        您的基本資訊
                    </h2>

                    <form action="">
                        <fieldset>
                            <h3>稱呼</h3>
                            <div class="userName">
                                <label
                                    for="userName">姓名</label>
                                <input type="text"
                                    autocomplete="off"
                                    spellcheck="false"
                                    id="userName"
                                    v-model="QNR_form.userName">
                            </div>
                        </fieldset>

                        <fieldset>
                            <h3>生理性別</h3>
                            <div class="gender">
                                <select name="gender" id=""
                                    v-model="QNR_form.gender">
                                    <option value="">
                                    </option>
                                    <option value="male">男
                                    </option>
                                    <option value="female">女
                                    </option>
                                </select>
                            </div>
                        </fieldset>

                        <fieldset>
                            <h3>生日</h3>
                            <div class="birthday">
                                <div class="birthInput">
                                    <input id="birthYear"
                                        type="tel"
                                        spellcheck="false"
                                        autocomplete="off"
                                        maxlength="4"
                                        v-model="QNR_form.birth[0]">
                                    <label
                                        for="birthYear">年</label>
                                </div>

                                <div class="birthInput">
                                    <label
                                        for="birthMonth">月</label>
                                    <select name=""
                                        id="birthMonth"
                                        v-model="QNR_form.birth[1]">
                                        <option value="">
                                        </option>
                                        <option
                                            :value="index + 1"
                                            v-for="(item, index) in 12"
                                            :key="index">
                                            {{ index + 1
                                            }}月
                                        </option>
                                    </select>
                                </div>


                                <div class="birthInput">
                                    <input id="birthDate"
                                        type="tel"
                                        spellcheck="false"
                                        autocomplete="off"
                                        maxlength="2"
                                        v-model="QNR_form.birth[2]">
                                    <label
                                        for="birthDate">日</label>
                                </div>

                            </div>
                        </fieldset>

                        <fieldset>
                            <h3>飲食習慣</h3>
                            <div class="habit">
                                <select name="habit" id=""
                                    v-model="QNR_form.habit">
                                    <option value="">
                                    </option>
                                    <option value="full">
                                        全素
                                    </option>
                                    <option value="half">
                                        蛋奶素
                                    </option>
                                    <option value="like">
                                        健康飲食但非素食
                                    </option>
                                    <option value="normal">
                                        無特別偏好
                                    </option>
                                </select>
                            </div>
                        </fieldset>
                    </form>

                    <button>
                        NEXT
                    </button>
                </div>

                <div class="page_Q"
                    v-for="({ question, options }, index) in showQuestionnaire"
                    :key="index" :class="`Q${index + 1}`">
                    <h2>{{ question }}</h2>

                    <div class="questionWrapper">
                        <div v-for="(option, index) in options"
                            :key="index">
                            {{ option }}
                        </div>
                    </div>

                    <button>NEXT</button>
                </div>
            </div>
            <Questions></Questions>
        </div>
    </div>
</template>

<script setup lang="ts">
import Questions from './questions/Questions.vue';
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useQuestionnaireStore } from '@/store/questionnaireStore';
import { storeToRefs } from 'pinia';

// loading overlay
const loadingProgress = computed(() => ({
    background: `linear-gradient(to top, #00430b 0 ${loadingPercent.value}%, transparent ${loadingPercent.value + 1}%)`
}));
const loadingPercent = ref(50);

function loadingTimer() {
    const looper = () => {
        const timer = setInterval(() => {
            if (loadingPercent.value >= 100) {
                clearInterval(timer);
                loadingPercent.value = 0;
                looper();
            }

            loadingPercent.value += 0.1;
            // console.log(loadingPercent.value);
        }, 10)
    }
    looper();
};

// loadingTimer();


// QNR_store
const QuestionnaireStore = useQuestionnaireStore();
const { QNR_IsLoaded, questionnaire } = storeToRefs(QuestionnaireStore);
const { QNR_FinishLoading, fetchQuestionnaire } = QuestionnaireStore;

function leaveQNR_page() {
    QNR_IsLoaded.value = false;
}

QuestionnaireStore.$subscribe((mutation, state) => {
    if (state.QNR_IsLoaded) {
        console.log(showQuestionnaire.value);
    }
})

const showQuestionnaire = computed(() => {
    return questionnaire.value
})

// 表單數據
const QNR_form = reactive(
    {
        userName: null,
        gender: null,
        birth: [null, null, null],
        habit: null
    }
)

watch(QNR_form, (nVal) => {
    console.log(nVal);
})

// 生命週期
onMounted(() => {
    fetchQuestionnaire();
    console.log(window.innerHeight);
})

onUnmounted(() => {
    leaveQNR_page();
})
</script>

<style scoped lang="scss">
* {
    outline: 1px solid black;
}

.container {
    @extend %headerPseudo;
    @extend %fixContainer;

    flex-direction: column;
    justify-content: normal;
    min-height: 100vh;
}

.loading {
    @include WnH(100%, calc(100vh - 100px));
    position: relative;
    background-color: $primaryBacColor;

    .iconMask {
        @include absoluteCenterTLXY($top: 0, $Y: 0px);
        @include WnH(600px);
        mask-image: url('@assets/icons/Logo.svg');
        // background: linear-gradient(to top, blue 0 49%, transparent 50%);
        // background-color: red;
    }
}

.questionnaire {
    // display: flex;
    // flex-direction: column;
    width: 100%;
    height: calc(100vh - 100px);
    overflow: scroll;
}

.processBar {
    flex: 1;

    .bar {
        @include WnH(100%, 6px);

        background-color: rgb(200, 200, 200);
        border-radius: 6px;
        position: relative;

        .progressPercent {
            @include WnH(10%, 6px);

            background-color: $btnBacColor_light;
            border-radius: 6px;
            position: absolute;
            top: 0;
            left: 0;
        }
    }

    .content {
        display: flex;
        justify-content: space-between;
        margin-top: .5rem;
        padding: 0 1rem;
    }
}

%inputTextLabel {
    position: relative;

    label {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
    }
}

%QNR_nextButton {
    @include WnH(90px, 48px);
    position: absolute;
    bottom: 15%;
    border: 1px solid gray;
    border-radius: 24px;
    margin: 0 auto;
}

.QNR_content {
    // @include flex-center-center;
    display: flex;
    margin-top: 2rem;
    height: calc(100% - 70px);
    // transform: translateX(-100%);

    &>div {
        @include flex-center-center;
        justify-content: normal;
        // height: 100%;
        min-width: 100vw;
        position: relative;

        h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 2.5rem;
        }
    }

    .page_info {
        flex-direction: column;

        h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 2.5rem;
        }

        button {
            @extend %QNR_nextButton;
        }
    }

    .page_info>form {
        margin-bottom: 3rem;

        fieldset {
            display: flex;
            align-items: center;
            margin-bottom: 2rem;

            &>div {
                margin-left: 2rem;
            }

            h3 {
                font-size: 1.5rem;
                width: 100px;
                text-align: center;
            }
        }

        select,
        input {
            @include WnH(110px, 45px);
            border: 1px solid gray;
            border-radius: .5rem;
            padding-left: 1rem;
        }

        .userName {
            @extend %inputTextLabel;
            position: relative;

            input {
                width: 189px;
            }
        }

        .birthday {
            display: flex;
            gap: 1.5rem;

            .birthInput {
                @extend %inputTextLabel;
            }
        }

        .habit>select {
            width: 189px;
        }
    }

    .page_Q {
        flex-direction: column;
        position: relative;
        z-index: 0;

        button {
            @extend %QNR_nextButton;
        }
    }

    .Q1 {}
}
</style>