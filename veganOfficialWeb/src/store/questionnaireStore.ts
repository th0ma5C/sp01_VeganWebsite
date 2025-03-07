import { defineStore, storeToRefs } from "pinia";
import { onMounted, reactive, ref, watch, computed } from "vue";
import { reqGetQuestionnaire, reqGetSavedResult, reqSaveSurveyResult } from "@/api/questionnaire"
import type { Questionnaire } from '@/api/questionnaire/type'
import type { Birth, Info, Form } from '@/store/type/QNR_type'
import { useUserStore } from "./userStore";
import { reqGetUser } from "@/api/userAuth";
import { useAnalysisResult } from "@/hooks/useAnalysisResult";
import type { MenuItem } from "@/api/menu/type";
import { useMenuStore } from "./menuStore";


const mockData = reactive({
    info: {
        userName: '鷹村',
        gender: 'male',
        birth: [1969, 7, 7] as Birth,
    },
    habit: '完全素食',
    flavor: '清爽',
    ingredients: ['Omega-3', '抗氧化物', '維生素'],
    food: ['香蕉', '生菜', '巧克力'],
    calories: '1800卡'
})


export const useQuestionnaireStore = defineStore('questionnaire', () => {
    // user store
    const userStore = useUserStore();
    const { userToken, isAuth, user } = storeToRefs(userStore);


    const QNR_IsLoaded = ref(false);

    function QNR_FinishLoading() {
        QNR_IsLoaded.value = true
    }

    const questionnaire = ref<Questionnaire[]>([]);
    async function fetchQuestionnaire() {
        try {
            const data = await reqGetQuestionnaire();
            questionnaire.value = [...data];
            QNR_FinishLoading();
            return
        } catch (error) {
            console.log(fetchQuestionnaire.name, error);
        }
    }

    const QNR_empty = ref({
        info: {
            userName: '',
            gender: '',
            birth: [null, null, null] as Birth,
        },
        habit: null,
        flavor: null,
        ingredients: [],
        food: [],
        calories: null
    })

    const QNR_isDone = ref(false)
    const QNR_result = ref<Form>({
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
    })

    watch(() => user.value.username, (nVal) => {
        if (nVal !== 'anonymous') {
            QNR_result.value.info.userName = nVal
        } else {
            QNR_result.value.info.userName = ''
        }
    }, { immediate: true });

    function checkQuestionIsAnswered(question: keyof Omit<Form, 'info'>) {
        if (Array.isArray(QNR_result.value[question]) && QNR_result.value[question]) {
            return QNR_result.value[question]!.length !== 0
        } else if (QNR_result.value[question]) {
            return true
        }
        return false
    }

    async function setQNR_result(obj?: Form) {
        if (!obj) {
            QNR_result.value = { ...QNR_empty.value }
            return
        }
        try {
            QNR_result.value = { ...obj }
            if (isAuth.value) {
                await memberSaveResult();
                surveyHasCompleted.value = true
            }
        } catch (error) {
            console.log(error);
        }
    }

    // 進度存放webStorage
    const localStorageKey = ref('SurveyResult');
    const stamp = ref();
    const expiredTime = 1000 * 60 * 60 * 24 * 2; // 2天
    const currPage = ref(1);
    const formPageTranslateX = ref(0);

    const QNR_state = computed(() => {
        return {
            currPage: currPage.value,
            result: QNR_result.value,
            timeStamp: stamp.value,
            completed: QNR_isDone.value
        }
    })

    function setQNRtoStorage() {
        stamp.value = Date.now() + expiredTime;
        const data = JSON.stringify(QNR_state.value);
        localStorage.setItem(localStorageKey.value, data);
    }

    function getDataFromStorage() {
        const now = Date.now();
        const raw = (localStorage.getItem(localStorageKey.value));
        if (!raw) return
        const data = JSON.parse(raw);
        if (now > data.timeStamp) return localStorage.removeItem(localStorageKey.value);
        return data
    }

    function arrayIsSame<T>(arr1: T[], arr2: T[]) {
        if (arr1.length !== arr2.length) return false
        return arr1.every((item, index) => item === arr2[index])
    }

    async function initQNR() {
        try {

            let storageResult;
            let localTimeStamp;
            const localStorage = getDataFromStorage();
            if (localStorage) {
                ({
                    currPage: currPage.value,
                    result: storageResult,
                    completed: QNR_isDone.value,
                    timeStamp: localTimeStamp
                } = localStorage);
            }
            formPageTranslateX.value = (currPage.value - 1) * -100;
            const localHasFinished = QNR_isDone.value;

            const cloudResult = await memberGetResult();
            if (isAuth.value && cloudResult) {
                // const cloudStamp = new Date(cloudResult.createdAt).getTime();
                const cloudUsername = cloudResult.info.userName;
                const cloudBirth = cloudResult.info.birth;
                const localBirth = storageResult.info.birth;
                if ((cloudUsername !== storageResult.info.userName ||
                    !arrayIsSame(cloudBirth, localBirth)) &&
                    localHasFinished) {
                    storageResult = cloudResult;
                }
                if (!localHasFinished) {
                    storageResult = cloudResult;
                }
                surveyHasCompleted.value = true;
            }

            QNR_result.value = storageResult ?? { ...QNR_empty.value };
            setQNRtoStorage();
            return
        } catch (error) {
            console.log(error);
        }
    }

    watch(currPage, (nVal) => {
        if (nVal) {
            setQNRtoStorage();
        }
    })

    // member save result
    const surveyHasCompleted = ref(false);
    async function memberSaveResult() {
        if (!userToken.value || !QNR_isDone.value) return
        try {
            const result = await reqSaveSurveyResult(QNR_result.value, userToken.value);
        } catch (error) {
            console.log(error);
        }
    }

    async function memberGetResult() {
        if (!userToken.value) return
        try {
            const { result } = await reqGetSavedResult();
            if (result) {
                surveyHasCompleted.value = true;
                QNR_isDone.value = true;
            }
            return result
        } catch (error) {
            console.log(error);
        }
    }

    // clear data when logout
    async function clearSurveyData() {
        try {
            await setQNR_result()
            localStorage.removeItem(localStorageKey.value);
            QNR_isDone.value = false;
            currPage.value = 1;
            formPageTranslateX.value = (currPage.value - 1) * -100;

        } catch (error) {
            console.log(error);
        }
    }

    // analysis hook
    const recommendList = ref<MenuItem[]>([]);
    watch(() => QNR_result.value.habit, (nVal) => {
        if (nVal) {
            const { saladRank, smoothiesRank } = useAnalysisResult(QNR_result);
            recommendList.value = [...saladRank.value.slice(0, 3), ...smoothiesRank.value.slice(0, 3)]
        }
    })

    function getRecList() {
        return recommendList.value
    }

    return {
        QNR_IsLoaded,
        questionnaire,
        QNR_isDone,
        QNR_result,
        currPage,
        formPageTranslateX,
        surveyHasCompleted,
        setQNR_result,
        QNR_FinishLoading,
        fetchQuestionnaire,
        setQNRtoStorage,
        getDataFromStorage,
        initQNR,
        memberSaveResult,
        memberGetResult,
        clearSurveyData,
        getRecList,
        checkQuestionIsAnswered
    }
})