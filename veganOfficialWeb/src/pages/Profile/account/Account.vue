<template>
    <div class="container">
        <h1>
            {{ user.username }} 您好
        </h1>

        <div>
            <h2>
                訂單紀錄
            </h2>

            <ul>
                <li>訂單</li>
            </ul>
        </div>

        <router-link to="/profile"
            @click="userStore.logout">登出</router-link>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/userStore';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

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