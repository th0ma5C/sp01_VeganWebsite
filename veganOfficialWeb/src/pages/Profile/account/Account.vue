<template>
    <div class="orderContainer">
        <div class="username">
            <h1>
                {{ user.username }} 您好
            </h1>

            <button @click="logout">登出</button>
        </div>


        <div class="userOrder">
            <h2>
                訂單紀錄
            </h2>

            <ul class="listContainer">
                <li v-for="({ orderID, shippingInfo, purchaseOrder, createdAt }, index) in showOrderList"
                    :key="orderID">
                    <div class="orderTitle">
                        <h3>
                            {{ orderID }}
                        </h3>

                        <span>{{ createdAt }}</span>
                    </div>

                    <div class="orderContent"
                        v-show="false">
                        <div class="progressBar">
                            訂單進度條
                        </div>

                        <div class="content">
                            <div>
                                {{ shippingInfo }}
                            </div>

                            <div>
                                <ul>
                                    <li v-for="(item, index) in purchaseOrder.orderList"
                                        :key="index">
                                        {{ item }}
                                    </li>
                                </ul>

                                <div>
                                    {{
                                        purchaseOrder.total
                                    }}
                                </div>
                            </div>
                        </div>

                        <div class="editBtn">
                            修改按鈕
                        </div>
                    </div>
                </li>
            </ul>
        </div>
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
    // outline: 1px solid black;
}

.orderContainer {
    @extend %headerPseudo;
    @extend %fixContainer;

    @apply flex-col;
    @apply justify-normal;
    @apply min-h-[80vh];

    padding-top: 4rem;

    &>div {
        width: 100%;
        max-width: 1440px;
        padding: 0 6rem;
    }
}

.username {
    display: flex;
    align-items: baseline;
    gap: 2rem;
    margin-bottom: 3rem;

    h1 {
        font-size: 2rem;
        font-variation-settings: 'wght' 500;
    }

    button {
        font-size: small;
        text-align: end;
        text-decoration: underline;
        text-underline-offset: 3px;
        opacity: .5;
        transition: color .2s, opacity .2s;

        &:hover {
            color: $btnBacColor_light;
            opacity: 1;
        }
    }
}

.userOrder {

    &>* {
        padding-left: 1.5rem;
    }
}

.listContainer>li {
    display: flex;
    flex-direction: column;


    .orderTitle {}

    .orderContent {

        .content {
            display: flex;

            &>div {
                flex: 1;
            }
        }
    }
}
</style>