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
                <!-- <li v-for="({ orderID, purchaseOrder }, index) in showOrderList"
                    :key="orderID">
                    {{ }}
                </li> -->
                <li v-for="(item, index) in 5" :key="index">
                    <div>
                        <h3>
                            訂單編號
                        </h3>

                        <span>時間</span>
                    </div>

                    <div>
                        <span>
                            訂單內容
                        </span>
                    </div>
                </li>
            </ul>
        </div>

        <button @click="logout">登出</button>
        <!-- <router-link to="/profile"
            @click="userStore.logout">登出</router-link> -->
    </div>
</template>

<script setup lang="ts">
/**
 * todo:  引入訂單, 刪、改訂單
 * doing: DB加入訂單編號屬性, 頁面結構、CSS
 */
import { useUserStore } from '@/store/userStore';
import { storeToRefs } from 'pinia';
import { computed, onMounted, watch, ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';

// user store
const userStore = useUserStore();
const { getUserOrderList, logout } = userStore;
const { isAuth, user, userOrderList } = storeToRefs(userStore);

async function fetchOrder() {
    try {
        if (userOrderList.value.length == 0) {
            await getUserOrderList();
        }
    } catch (error) {
        console.log(error);
    }
}

// 訂單數據
const showOrderList = computed(() => {
    if (!userOrderList.value || userOrderList.value.length == 0) return []
    const formatted = userOrderList.value.map((item) => {
        return {
            ...item,
            orderID: item._id.toString().slice(-6),
            createdAt: item.createdAt.split('T')[0],
        }
    })
    return formatted
});
watch(showOrderList, (nVal) => {
    console.log(nVal);
})

// spinner
const isOrderLoaded = computed(() => showOrderList.value?.length !== 0)


// router hook
onBeforeRouteLeave((to, from) => {
    if (to.path == '/profile' && isAuth.value) {
        return { path: '/home' }
    }
})

onMounted(async () => {
    await fetchOrder();
})
</script>

<style scoped lang="scss">
* {
    outline: 1px solid black;
}

.container {
    @extend %headerPseudo;
    @extend %fixContainer;

    @apply flex-col;
    @apply justify-normal;
    @apply min-h-[80vh];


}
</style>