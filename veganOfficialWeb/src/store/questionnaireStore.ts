import { defineStore } from "pinia";
import { onMounted, ref } from "vue";
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
            questionnaire.value = [...data];
            QNR_FinishLoading();
            return
        } catch (error) {
            console.log(fetchQuestionnaire.name, error);
        }
    }

    // onMounted(() => {
    //     if (!QNR_IsLoaded.value) {
    //         fetchQuestionnaire();
    //     }
    // })

    return {
        QNR_IsLoaded,
        QNR_FinishLoading,
        questionnaire,
        fetchQuestionnaire
    }
})