<template>
    <div class="container">
        結帳頁
    </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/store/cartStore';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted } from 'vue';

const cartStore = useCartStore();
const { isCheckout, cartMap } = storeToRefs(cartStore)
const { toggleIsCheckout } = cartStore;


onMounted(() => {
    if (!isCheckout.value) toggleIsCheckout();
    console.log(cartMap.value);
})

onUnmounted(() => {
    toggleIsCheckout()
})
</script>

<style scoped lang="scss">
.container {
    @extend %headerPseudo;
    @extend %fixContainer;

    flex-direction: column;
}
</style>