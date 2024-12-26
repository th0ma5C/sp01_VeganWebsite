import { defineStore } from "pinia";
import { ref } from "vue";

export const useLoaderStore = defineStore('loader', (() => {
    let loaderActivated = ref(true)

    return { loaderActivated }
}))