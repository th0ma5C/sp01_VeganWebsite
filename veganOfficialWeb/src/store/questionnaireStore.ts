import { defineStore, storeToRefs } from "pinia";
import { onMounted, reactive, ref, watch, computed, toRaw } from "vue";
import { reqGetQuestionnaire, reqGetSavedResult, reqSaveSurveyResult, resetSurveyResult } from "@/api/questionnaire"
import type { GPT_RES, Questionnaire } from '@/api/questionnaire/type'
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
interface Gpt_Data {
    gpt_user: string,
    gpt_content: GPT_RES['result'],
    gpt_stamp: number
}


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
        if (!obj) return
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

    function resetQNR_result() {
        QNR_result.value = structuredClone(toRaw(QNR_empty.value));
        localStorage.removeItem(localStorageKey.value);
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

    async function getDataFromStorage() {
        const now = Date.now();
        const raw = (localStorage.getItem(localStorageKey.value));
        if (!raw) return
        const data = JSON.parse(raw);
        return data
    }

    function checkResultIsExpired() {
        try {
            if (Date.now() < QNR_state.value.timeStamp) return
            return clearSurveyData()
        } catch (error) {
            console.log(error);
        }
    }

    function arrayIsSame<T>(arr1: T[], arr2: T[]) {
        if (arr1.length !== arr2.length) return false
        return arr1.every((item, index) => item === arr2[index])
    }

    async function initQNR() {
        try {
            checkResultIsExpired()
            let storageResult;
            let localTimeStamp;
            const localStorage = await getDataFromStorage();
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
                const localBirth = storageResult?.info.birth || [];
                const localUsername = storageResult?.info.userName || '';
                if ((cloudUsername !== localUsername ||
                    !arrayIsSame(cloudBirth, localBirth)) &&
                    localHasFinished) {
                    storageResult = cloudResult;
                }
                if (!localHasFinished) {
                    storageResult = cloudResult;
                }
                surveyHasCompleted.value = true;
            }
            QNR_result.value = storageResult ?? structuredClone(toRaw(QNR_empty.value));
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
            const result = await reqSaveSurveyResult(QNR_result.value, userToken.value, 'survey');
        } catch (error) {
            console.log(error);
        }
    }

    async function memberGetResult() {
        if (!userToken.value) return
        try {
            const { result } = await reqGetSavedResult('survey');
            if (result) {
                surveyHasCompleted.value = true;
                QNR_isDone.value = true;
                return result
            }
        } catch (error) {
            // console.log(error);
        }
    }

    async function memberClearResult() {
        try {
            const userId = user.value.userID;
            return await resetSurveyResult(userId);
        } catch (error) {
            console.log(error);
        }
    }

    // clear data when logout
    async function clearSurveyData() {
        try {
            // await setQNR_result()
            resetQNR_result();
            resetGPTStorage();
            QNR_isDone.value = false;
            surveyHasCompleted.value = false;
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

    // gpt response

    const gpt_localstorageKey = 'GPT_Result';
    const gpt_response = computed(() => {
        return {
            gpt_user: gpt_user.value,
            gpt_content: gpt_content.value,
            gpt_stamp: gpt_stamp.value
        }
    })
    const gpt_user = ref<string>();
    const gpt_content = ref<GPT_RES['result']>();
    const gpt_stamp = ref<number>();

    function initGPT_res(data: Gpt_Data) {
        gpt_user.value = data.gpt_user;
        gpt_content.value = data.gpt_content;
        gpt_stamp.value = data.gpt_stamp;
    }

    async function saveGptDataToStorage() {
        try {
            const data = JSON.stringify(gpt_response.value);
            localStorage.setItem(gpt_localstorageKey, data);
            if (isAuth.value) {
                await memberSaveGPTResult();
            }
            return
        } catch (error) {
            console.log(error);
        }
    }

    function loadGptDataFromStorage() {
        const rawData = localStorage.getItem(gpt_localstorageKey);
        if (!rawData) return
        const data = JSON.parse(rawData);
        initGPT_res(data);
    }

    function resetGPTStorage() {
        localStorage.removeItem(gpt_localstorageKey);
    }

    function getStorageGptData() {
        return gpt_response.value
    }

    async function memberSaveGPTResult() {
        try {
            if (!userToken.value) return
            const data = getStorageGptData()
            const result = await reqSaveSurveyResult(data, userToken.value, 'gpt');
            return
        } catch (error) {
            console.log(error);
        }
    }

    async function memberGetGPTResult() {
        if (!userToken.value) return
        try {
            const { result } = await reqGetSavedResult('gpt') as unknown as { result: Gpt_Data };
            return result
        } catch (error) {
            // console.log(error);
        }
    }

    async function loadGPTStorage() {
        try {
            if (!isAuth.value) {
                return loadGptDataFromStorage();
            }
            const result = await memberGetGPTResult();
            if (!result) return
            initGPT_res(result)
            return
        } catch (error) {
            console.log(error);
        }
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
        checkQuestionIsAnswered,
        initGPT_res,
        saveGptDataToStorage,
        loadGptDataFromStorage,
        getStorageGptData,
        memberGetGPTResult,
        loadGPTStorage,
        checkResultIsExpired,
        memberClearResult
    }
})