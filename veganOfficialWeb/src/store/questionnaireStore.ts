import { defineStore, storeToRefs } from "pinia";
import { onMounted, reactive, ref, watch, computed } from "vue";
import { reqGetQuestionnaire, reqGetSavedResult, reqSaveSurveyResult } from "@/api/questionnaire"
import type { Questionnaire } from '@/api/questionnaire/type'
import type { Birth, Info, Form } from '@/store/type/QNR_type'
import { useUserStore } from "./userStore";
import { reqGetUser } from "@/api/userAuth";


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
    }, { immediate: true })

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

    // async function initQNR_() {
    //     return new Promise<void>(async (resolve, reject) => {
    //         let result;
    //         const data = getDataFromStorage() as typeof QNR_state.value;
    //         const cloudSurveyResult = await memberGetResult();
    //         if (!data && !cloudSurveyResult) {
    //             // currPage.value = 1;
    //             formPageTranslateX.value = (currPage.value - 1) * -100;
    //             // setQNR_result(QNR_result);
    //             return reject(`${getDataFromStorage.name}failed`);
    //         }
    //         ({
    //             currPage: currPage.value,
    //             result: result,
    //             completed: QNR_isDone.value,
    //         } = data);
    //         formPageTranslateX.value = (currPage.value - 1) * -100;
    //         if (isAuth.value) {
    //             result = cloudSurveyResult;
    //         }
    //         // setQNR_result(result);
    //         Object.assign(QNR_result, { ...result });
    //         setQNRtoStorage();
    //         resolve();
    //     }).catch((err) => {
    //         console.log(err);
    //     })
    // }

    async function initQNR() {
        try {
            let storageResult;
            const localStorage = getDataFromStorage();
            if (localStorage) {
                ({
                    currPage: currPage.value,
                    result: storageResult,
                    completed: QNR_isDone.value,
                } = localStorage);
            }
            formPageTranslateX.value = (currPage.value - 1) * -100;

            const cloudResult = await memberGetResult();
            if (isAuth.value && cloudResult) {
                const cloudStamp = new Date(cloudResult.createdAt).getTime();
                if (cloudStamp > localStorage.timeStamp || !QNR_isDone.value) {
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
            if (result) surveyHasCompleted.value = true
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
            surveyHasCompleted.value = false;
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
        clearSurveyData
    }
})