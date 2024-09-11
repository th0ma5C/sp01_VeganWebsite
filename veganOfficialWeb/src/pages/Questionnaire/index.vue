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
                        1/5
                    </div>
                </div>
            </div>

            <div class="QNR_content">
                <h2>
                    您的基本資訊
                </h2>

                <div class="page1">
                    <form action="">
                        <!-- <fieldset> -->
                        <!-- <legend></legend> -->

                        <div>
                            <h3>稱呼</h3>
                            <div>
                                <label
                                    for="userName"></label>
                                <input type="text"
                                    autocomplete="off"
                                    id="userName">
                            </div>
                        </div>
                        <div>
                            <h3>生理性別</h3>
                            <div>
                                <input type="radio"
                                    name="gender" id="male">
                                <label for="male">男</label>
                                <input type="radio"
                                    name="gender"
                                    id="female">
                                <label
                                    for="female">女</label>
                            </div>
                        </div>
                        <div>
                            <h3>生日</h3>
                            <div>
                                <label
                                    for="birthday"></label>
                                <input type="date"
                                    min="1923-09-01"
                                    max="2023-09-01"
                                    id="birthday">
                            </div>
                        </div>
                        <div>
                            <h3>飲食習慣</h3>
                            <div>
                                <input type="radio"
                                    name="habit" id="vegan">
                                <label
                                    for="vegan">完全素食</label>
                                <input type="radio"
                                    name="habit"
                                    id="halfVegan">
                                <label
                                    for="halfVegan">蛋奶素</label>
                                <input type="radio"
                                    name="habit"
                                    id="healthy">
                                <label
                                    for="healthy">健康飲食但非素食</label>
                                <input type="radio"
                                    name="habit"
                                    id="normal">
                                <label
                                    for="normal">無特別偏好</label>
                            </div>
                        </div>
                        <!-- </fieldset> -->

                    </form>
                </div>

                <button>
                    NEXT
                </button>
            </div>
            <Questions></Questions>
        </div>
    </div>
</template>

<script setup lang="ts">
import Questions from './questions/Questions.vue';
import { computed, onMounted, onUnmounted, ref } from 'vue';
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
const { QNR_FinishLoading } = useQuestionnaireStore();
const { QNR_IsLoaded } = storeToRefs(useQuestionnaireStore());

function leaveQNR_page() {
    QNR_IsLoaded.value = false;
}

onMounted(() => {
    QNR_FinishLoading();
})

onUnmounted(() => {
    leaveQNR_page();
})
</script>

<style scoped lang="scss">
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

.QNR_content {
    @include flex-center-center;

    flex-direction: column;
    margin-top: 2rem;

    &>h2 {
        font-size: 2.5rem;
        margin-bottom: 2rem;
    }

    .page1>form {
        margin-bottom: 3rem;

        // display: flex;
        // flex-direction: column;
        h3 {
            font-size: 1.5rem;
            margin-bottom: .5rem;
        }

        &>div {
            display: flex;
            flex-direction: column;
            // gap: 1rem;
            margin-bottom: 1rem;
        }
    }
}
</style>