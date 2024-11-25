<template>
    <div class="orderContainer">
        <div class="username">
            <h1>
                {{ user.username }} 您好
            </h1>

            <button @click="logout">登出</button>
        </div>

        <div class="listContainer">
            <nav>
                <ul>
                    <li v-for="(tab, tabName) in tabs"
                        :key="tabName">
                        <h2 @click="switchTab(tabName)">
                            {{ tabName }}
                        </h2>

                        <div v-for="(section, index) in tab"
                            :key="index" class="branch"
                            :class="{
                                selectedTab: tabName == currTab
                            }">
                            <h3>
                                {{ section }}
                            </h3>
                        </div>
                    </li>
                </ul>
            </nav>

            <div class="tabContainer">
                <section>
                    <Delivering>
                    </Delivering>
                </section>

                <section v-show="false">
                    <h2>歷史訂單</h2>
                </section>

                <section v-show="false">
                    <h2>用戶設定</h2>
                </section>
            </div>
        </div>


        <!-- <div class="userOrder">
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
        </div> -->
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
import Delivering from './tab1/Delivering.vue';

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

// tabs
const tabs = {
    '購買清單': ['全部', '待付款', '已完成'],
    '用戶設定': []
}

// 切換tab
const currTab = ref('購買清單')
function switchTab(tab: string) {
    currTab.value = tab;
}

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

    padding-top: 2rem;

    &>div {
        width: 100%;
        max-width: 1440px;
        padding: 0 6rem;
    }

    .listContainer {
        // padding: 1rem 6rem;
    }
}

.username {
    display: flex;
    align-items: baseline;
    gap: 2rem;
    margin-bottom: 1.5rem;

    h1 {
        // padding-left: 1rem;
        font-size: 3rem;
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

.listContainer {
    display: flex;
    flex: 1;
    margin-bottom: 2rem;

    &>* {
        // border: 1px solid black;
    }

    nav {
        width: 175px;

        li {
            overflow: hidden;
            border: 1px solid black;
            border-right: none;
            text-align: center;

            h2 {
                font-size: 1.25rem;
                cursor: pointer;
                height: 50px;
                line-height: 50px;
                user-select: none;
                position: relative;

                &::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    bottom: -1px;
                    width: 100%;
                    height: 1px;
                    background-color: black;
                }
            }

            &:first-of-type {
                border-radius: 1rem 0 0 0;
            }

            &:last-of-type {
                border-top: none;
                border-radius: 0 0 0 1rem;
            }
        }

        .branch {
            max-height: 0;
            transition: max-height .5s ease-in-out;

            h3 {
                padding: .5rem 0;
                cursor: pointer;
                user-select: none;
                opacity: 0;
                transition: opacity .5s;
            }

            &:first-of-type>h3 {
                padding-top: 1rem;
            }

            &:last-of-type>h3 {
                padding-bottom: 1rem;
            }
        }

        .selectedTab {
            max-height: 4rem;

            h3 {
                opacity: 1;
            }
        }
    }

    .tabContainer {
        flex: 1;
        border: 1px solid black;
        padding-left: 2rem;
        border-radius: 0 1rem 1rem 1rem;

        section {
            height: 100%;
        }
    }
}

// .userOrder {

//     &>* {
//         padding-left: 1.5rem;
//     }
// }

// .listContainer>li {
//     display: flex;
//     flex-direction: column;


//     .orderTitle {}

//     .orderContent {

//         .content {
//             display: flex;

//             &>div {
//                 flex: 1;
//             }
//         }
//     }
// }</style>