import { defineStore } from "pinia";
import { reqNewsList } from '@/api/news';
import { ref } from "vue";


export const useNewsStore = defineStore('news', (() => {
    let newsList = ref();

    (async () => {
        try {
            newsList.value = await reqNewsList();
        } catch (err) {
            console.log('fetchNews failed', err);
        }
    })()

    return { newsList }
}))