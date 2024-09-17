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
                                <label for="userName">
                                    姓名 / 暱稱
                                </label>
                                <input type="text"
                                    autocomplete="off"
                                    spellcheck="false"
                                    id="userName" required
                                    v-model.trim.lazy="QNR_form.info.userName">
                            </div>
                        </fieldset>

                        <fieldset>
                            <h3>生理性別</h3>
                            <div class="gender">
                                <select name="gender" id=""
                                    v-model.lazy="QNR_form.info.gender">
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
                                        required
                                        v-model.trim.number.lazy="QNR_form.info.birth[0]">
                                    <label for="birthYear">
                                        年<small>(西元)</small>
                                    </label>
                                </div>

                                <div class="birthInput">
                                    <label
                                        for="birthMonth">月</label>
                                    <select name=""
                                        id="birthMonth"
                                        required
                                        v-model.number.lazy="QNR_form.info.birth[1]">
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
                                        required
                                        v-model.number.lazy="QNR_form.info.birth[2]">
                                    <label
                                        for="birthDate">日</label>
                                </div>

                            </div>
                        </fieldset>

                        <!-- <fieldset>
                            <h3>飲食習慣</h3>
                            <div class="habit">
                                <select name="habit" id=""
                                    v-model.lazy="QNR_form.info.habit">
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
                        </fieldset> -->
                    </form>

                    <button
                        @click="verifyInfoForm(QNR_form)">
                        NEXT
                    </button>
                </div>

                <div class="page_Q"
                    v-for="({ question, options, tag }, index) in showQuestionnaire"
                    :key="index" :class="`Q${index + 1}`">
                    <h2>{{ question }}</h2>

                    <div class="questionWrapper">
                        <div class="question"
                            v-for="(option, index) in options"
                            :key="index"
                            :class="{ answer: setSelectedClass(tag as QNRFormKeys, option) }"
                            @click="sentQNR_Ans(tag as QNRFormKeys, option)">
                            {{ option }}
                        </div>
                    </div>

                    <button>
                        NEXT
                    </button>
                </div>
            </div>
            <Questions></Questions>
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * todo: NEXT功能 表單結果頁面 會員 購物車 關於
 * doing: 驗證輸入
 * --------------------
 * *
 * //單選多選樣式
 */

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
        // console.log(showQuestionnaire.value);
    }
})

const showQuestionnaire = computed(() => {
    return questionnaire.value
})

// 表單數據
// userInfo
type Birth = [number | null, number | null, number | null];
interface Info {
    userName: string;
    gender: string;
    birth: Birth;
}
interface Form {
    info: Info,
    habit: null | string,
    flavor: null | string,
    ingredients: string[],
    food: string[],
    calories: null | string
}

const QNR_form = reactive<Form>({
    info: {
        userName: '',
        gender: '',
        birth: [null, null, null],
    },
    habit: null,
    flavor: null,
    ingredients: [],
    food: [],
    calories: null
});

watch(QNR_form, (nVal) => {
    // console.log(nVal);
})

// 問卷答案蒐集
type QNRFormKeys = keyof Omit<Form, 'info'>;
const ansMap: QNRFormKeys[] = ['habit', 'flavor', 'ingredients', 'food', 'calories'];

function sentQNR_Ans(tag: QNRFormKeys, ans: string) {
    if (tag == 'ingredients' || tag == 'food') {
        if (QNR_form[tag].includes(ans)) {
            QNR_form[tag] = [...QNR_form[tag].filter(item => item !== ans)];

        } else {
            QNR_form[tag].push(ans);
        }
    } else {
        QNR_form[tag] = ans;
    }
    console.log(QNR_form[tag]);
}

function setSelectedClass(tag: QNRFormKeys, option: string) {
    return (tag === 'ingredients' || tag === 'food')
        ? QNR_form[tag].includes(option)
        : QNR_form[tag] === option;
}

// 表單驗證
const isFormVerified = ref(false);

function verifyUserName(userName: string) {
    if (userName) return true
}
function verifyGender(gender: string) {
    if (gender) return true
}
function verifyBirth(birth: Birth) {
    const [year, month, date] = birth;

    if (!year || !month || !date) return

    const validDay = new Date(year, month - 1, date);
    const yearScope = new Date().getFullYear();

    if (year !== validDay.getFullYear() ||
        year < yearScope - 100 ||
        year > yearScope ||
        month !== validDay.getMonth() + 1 ||
        date !== validDay.getDate()) {
        return
    }

    return true
}

function verifyInfoForm(form: typeof QNR_form) {
    const { userName, gender, birth } = form.info;
    // if (!userName || !gender || !birth || birth.length != 3) return

    if (verifyUserName(userName) &&
        verifyGender(gender) &&
        verifyBirth(birth)
    ) {
        console.log('passed');
    } else {
        console.log('failed');
    }

}


// 生命週期
onMounted(() => {
    fetchQuestionnaire();
})

onUnmounted(() => {
    leaveQNR_page();
})
</script>

<style scoped lang="scss">
* {
    // outline: 1px solid black;
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
    overflow-x: scroll;

    // &::-webkit-scrollbar {
    //     width: 0;
    // }
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
        transition: transform .3s ease;
        transform-origin: left;
    }
}

@mixin btn_rwd {
    @media (max-width:1440px) {
        @content
    }
}

$btn_position: 15%;

%QNR_nextButton {
    @include WnH(90px, 48px);
    background-color: $primaryBacColor;
    border: 1px solid rgba(128, 128, 128, 0.5);
    border-radius: 23rem;
    box-shadow: 1px 1px 2px gray;
    margin: 0 auto;
    position: sticky;
    bottom: calc($btn_position / 2);
    min-height: 48px;
    transition: border-color .2s ease, box-shadow .2s ease;

    @include btn_rwd {
        bottom: calc($btn_position / 4);
    }

    &:hover {
        border: 1px solid black;
        box-shadow: 1px 1px 2px black;
    }
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
        height: 100%;
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
                // text-align: center;
            }
        }

        select,
        input {
            @include WnH(110px, 45px);
            border: 1px solid gray;
            border-radius: .5rem;
            padding-left: 1rem;
            background-color: $primaryBacColor;

            option:empty {
                display: none;
            }
        }

        .userName {
            @extend %inputTextLabel;
            position: relative;

            input {
                width: 189px;
            }

            label {
                user-select: none;
            }

        }

        .birthday {
            display: flex;
            gap: 1.5rem;

            .birthInput {
                @extend %inputTextLabel;

                label {
                    user-select: none;
                }
            }
        }

        .habit>select {
            width: 189px;
        }

        // :is(.userName, .birthInput):focus-within>label,
        // :is(.userName, .birthInput):has(input:valid)>label {
        //     transform: translateY(calc(-100% - 10px)) scale(0.8);
        //     background-color: $primaryBacColor;
        // }

        :is(.userName, .birthInput):is(:focus-within, :has(input:valid, select:valid))>label {
            transform: translateY(calc(-100% - 10px)) scale(0.8);
            background-color: $primaryBacColor;
        }
    }



    .page_Q {
        flex-direction: column;
        position: relative;
        z-index: 0;
        overflow-y: scroll;

        &::-webkit-scrollbar {
            width: 0;
        }

        button {
            @extend %QNR_nextButton;
        }
    }

    :not(.Q3, .Q4)>.questionWrapper {
        height: 100%;
    }

    .questionWrapper {
        width: 15%;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        margin-bottom: 6rem;

        @include btn_rwd {
            // margin-bottom: 50px;
        }

        .question {
            $height: 50px;

            height: $height;
            text-align: center;
            line-height: $height;

            border: 1px solid gray;
            border-radius: 10px;
            cursor: pointer;
            transition: box-shadow .2s ease
        }

        .question:not(.answer):hover {
            box-shadow: 1px 1px 3px black;
        }

        .question:hover:active {
            transform: translate(1px, 1px);
            box-shadow: 1px 1px 3px black inset;
        }


        .answer {
            cursor: pointer;
            box-shadow: 1px 1px 3px black inset;
            background-color: $btnBacColor_light;
            color: $primaryBacColor;
            transform: translate(1px, 1px);
        }
    }
}
</style>