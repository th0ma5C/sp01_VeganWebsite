<template>
    <div class="tabContainer">
        <div class="btnContainer">
            <button @click="changeTab(1)">111</button>
            <button @click="changeTab(2)">222</button>
            <button @click="changeTab(3)">333</button>
        </div>
        <div class="tabs">
            <div class="tab"
                :style="'showTab': show == 1 ">
                111</div>
            <div class="tab"
                :style=" 'showTab': show == 2 ">
                222</div>
            <div class="tab"
                :style=" 'showTab': show == 3 ">
                333</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

let showTab = computed(() => ({
    display: 'block',
}))
let show = ref(1)
function changeTab(n: number) {
    show.value = n;
}

</script>

<style scoped lang="scss">
.tabContainer {
    @include flex-center-center;
    @include main-part;

    align-items: normal;
    flex-direction: column;

    .btnContainer {

        button {
            background-color: transparent;
            border-bottom: none;
        }
    }

    .tabs {
        border: 1px solid black;

        .tab {
            display: none;
        }
    }
}
</style>