import { defineStore } from "pinia";
import { ref } from "vue";

export const useQuestionnaireStore = defineStore('questionnaire', () => {
    const QNR_IsLoaded = ref(false);

    function QNR_FinishLoading() {
        QNR_IsLoaded.value = true
    }

    return {
        QNR_IsLoaded,
        QNR_FinishLoading
    }
})