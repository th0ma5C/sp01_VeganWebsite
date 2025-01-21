<template>
    <div class="svgWrapper" ref="iconRef">
        <svg :style="{ width, height, color }">
            <use :href="symbolID"></use>
        </svg>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, useTemplateRef, type Ref } from 'vue'
const { prefix, name, color } = defineProps({
    prefix: {
        type: String,
        default: 'icon',
    },
    name: String,
    color: {
        type: String,
        default: ''
    },
    width: {
        type: String,
        default: '100px'
    },
    height: {
        type: String,
        default: '100px'
    }
})

const symbolID = computed(() => `#${prefix}-${name}`);

// 暴露 DOM
const iconRef = useTemplateRef('iconRef');

defineExpose<{
    iconRef: Ref<HTMLElement | null>;
}>({
    iconRef,
});

</script>

<style scoped lang="scss">
div {
    @include flex-center-center;
}
</style>