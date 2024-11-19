import { defineStore } from "pinia";
import { ref } from "vue";

export const useLoader = defineStore('loader', (() => {
    let loaderActivated = ref(true)

    return { loaderActivated }
}))