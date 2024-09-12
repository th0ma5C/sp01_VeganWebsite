import { defineStore } from "pinia";
import { ref } from "vue";
import { reqGetQuestionnaire } from "@/api/questionnaire";
import type { Questionnaire } from '@/api/questionnaire/type'

export const useQuestionnaireStore = defineStore('questionnaire', () => {
    const QNR_IsLoaded = ref(false);

    function QNR_FinishLoading() {
        QNR_IsLoaded.value = true
    }

    const questionnaire = ref<Questionnaire[]>([]);

    async function fetchQuestionnaire() {
        try {
            const data = await reqGetQuestionnaire();
            return questionnaire.value = [...data];
        } catch (error) {
            console.log(fetchQuestionnaire.name, error);
        }
    }

    return {
        QNR_IsLoaded,
        QNR_FinishLoading
    }
})