<template>
    <div class="counter" :style="iconStyle">
        <span v-if="cartCounter && cartCounter < 99">
            {{ cartCounter }}
        </span>
        <span v-else>
            {{ 99 }}+
        </span>
    </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/store/cartStore';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const cartStore = useCartStore();
const { cartCounter } = storeToRefs(cartStore);

interface Props {
    size?: {
        width: number,
        height: number
    };
}
const { size } = defineProps<Props>();

const iconStyle = computed(() => {
    if (size) {
        return {
            width: `${size?.width}px`,
            height: `${size?.height}px`,
            opacity: cartCounter.value ? '1' : '0'
        }
    } else {
        return {
            opacity: cartCounter.value ? '1' : '0'
        }
    }
})

</script>

<style scoped lang="scss">
.counter {
    @include flex-center-center;
    @include absoluteCenterTLXY($top: 0%, $left: 100%);
    @include WnH(24px);
    padding: 2px;
    position: absolute;
    transform: translate(-75%, -25%);
    background-color: red;
    border-radius: 50%;
    transition: opacity .3s ease;

    span {
        aspect-ratio: 1/1;
        color: $primaryBacColor;
        font-variation-settings: 'wght' 500;
        font-size: 12px;
        line-height: 24px;
    }
}
</style>