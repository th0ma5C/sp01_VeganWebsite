<template>
    <div class="container" style="font-size: 10rem;">
        會員區
    </div>
    <router-link to="/profile"
        @click="userStore.logout">登出</router-link>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/userStore';



const userStore = useUserStore();

</script>

<style scoped lang="scss">
.container {
    @extend %headerPseudo;
    @extend %fixContainer;

    flex-direction: column;
    justify-content: normal;
    min-height: 80vh;

}
</style>