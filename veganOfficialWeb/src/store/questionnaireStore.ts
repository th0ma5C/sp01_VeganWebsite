import { defineStore } from "pinia";
import { onMounted, reactive, ref, watch } from "vue";
import { reqGetQuestionnaire } from "@/api/questionnaire"
import type { Questionnaire } from '@/api/questionnaire/type'
import type { Birth, Info, Form } from '@/store/type/QNR_type'


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
        // QNR_result = {...QNR_result, ...obj}
        Object.assign(QNR_result, obj);
        // console.log(QNR_result);
    }

    // 進度存放webStorage
    const localStorageKey = ref('mockResult');
    function setQNRtoStorage(form: Form) {

    }



    return {
        QNR_IsLoaded,
        QNR_FinishLoading,
        questionnaire,
        fetchQuestionnaire,
        QNR_isDone,
        QNR_result,
        setQNR_result,
        localStorageKey
    }
})