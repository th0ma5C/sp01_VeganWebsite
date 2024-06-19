import { defineStore } from "pinia";
import { reqNewsList } from '@/api/news';
import { ref, readonly } from "vue";
import type { NewsRes } from "@/api/news/type";


export const useNewsStore = defineStore('news', (() => {
    let newsData = ref<NewsRes | null>(null);

    let fetchNews = async () => {
        try {
            newsData.value = await reqNewsList();
        } catch (err) {
            console.log('fetchNews failed', err);
        }
    }

    return { newsData, fetchNews }
}))