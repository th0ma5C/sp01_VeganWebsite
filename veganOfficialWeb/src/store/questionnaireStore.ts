import { defineStore } from "pinia";
import { onMounted, reactive, ref, watch, computed } from "vue";
import { reqGetQuestionnaire } from "@/api/questionnaire"
import type { Questionnaire } from '@/api/questionnaire/type'
import type { Birth, Info, Form } from '@/store/type/QNR_type'

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

    const QNR_isDone = ref(false)
    const QNR_result = reactive<Form>({
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

    function setQNR_result(obj: Form) {
        Object.assign(QNR_result, obj);
    }

    // 進度存放webStorage
    const localStorageKey = ref('mockResult');
    const stamp = ref();
    const expiredTime = 1000 * 60 * 60 * 24 * 2; // 2天
    const currPage = ref(0);
    const formPageTranslateX = ref(0);
    const QNR_state = computed(() => {
        return {
            currPage: currPage.value,
            result: mockData,
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

    async function initQNR() {
        return new Promise<void>((resolve, reject) => {
            const data = getDataFromStorage() as typeof QNR_state.value;
            if (!data) {
                return reject(`${getDataFromStorage.name}failed`);
            }
            let result;
            ({
                currPage: currPage.value,
                result: result,
                completed: QNR_isDone.value,
            } = data);
            formPageTranslateX.value = (currPage.value - 1) * -100;
            setQNR_result(result);
            Object.assign(QNR_result, { ...result });
            resolve();
        }).catch((err) => {
            console.log(err);
        })
    }

    watch(currPage, (nVal) => {
        if (nVal) {
            setQNRtoStorage();
        }
    })


    return {
        QNR_IsLoaded,
        questionnaire,
        QNR_isDone,
        QNR_result,
        currPage,
        formPageTranslateX,
        setQNR_result,
        QNR_FinishLoading,
        fetchQuestionnaire,
        setQNRtoStorage,
        getDataFromStorage,
        initQNR
    }
})