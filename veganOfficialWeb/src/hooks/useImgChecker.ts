import type { Ref } from "vue";

export default function (
    ImgRef: Ref<HTMLImageElement>,
    showSkeleton: Ref<Boolean>,
    mainImgIsLoad: Ref<Boolean>) {

    return function checkImgLoaded() {

        const timer = setTimeout(() => {
            if (!ImgRef.value.complete) {
                showSkeleton.value = true;
            }
        }, 1000);

        const watcher = setInterval(() => {
            if (ImgRef.value.complete) {
                showSkeleton.value = false;
                mainImgIsLoad.value = true;
                clearTimeout(timer);
                clearInterval(watcher);
            }
        }, 500)
    }
}