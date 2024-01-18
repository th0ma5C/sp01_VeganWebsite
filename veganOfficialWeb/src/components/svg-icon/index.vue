<template>
    <div>
        <svg :style="{ width, height }">
            <use :href="symbolID" :fill="color"></use>
        </svg>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
    },

})

const symbolID = computed(() => `#${prefix}-${name}`)
</script>

<style scoped></style>