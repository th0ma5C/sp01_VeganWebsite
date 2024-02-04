<template>
    <div>
        <div>
            <div>
                <img src="@assets/img/MainBanner/tomatoes.jpg"
                    alt="" style="max-width: 100%;">
                <img src="@assets/img/MainBanner/tomatoes.jpg"
                    alt="" style="max-width: 100%;">
            </div>
            <div>
                <ul>
                    <li></li>
                </ul>
            </div>
        </div>
        <SubBanner></SubBanner>
    </div>
</template>

<script lang="ts" setup>
import SubBanner from './SubBanner.vue';
import { ref } from 'vue';

let imgs = ref([
    'berry-smoothie',
    'fruit',
    'loaf',
    'tomatoes',
    'strawberry-smoothie',
    'vegetable',
    'water'
])
</script>

<style lang="scss" scoped></style>