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
                    <li v-for="(tab, tabName, index) in tabs"
                        :key="tabName">
                        <h2 @click="switchTab(tabName)"
                            :class="{ unselected: tabName !== currTab }">
                            <SvgIcon
                                :name="index == 0 ? 'OrderList' : 'Setting'"
                                width="27" height="27"
                                color=black class="tabIcon">
                            </SvgIcon>
                            <span>
                                {{ tabName }}
                            </span>
                        </h2>

                        <div v-for="(section, index) in tab"
                            :key="index"
                            @click="switchBranch(section)"
                            class="branch" :class="{
                                selectedTab: tabName == currTab,
                                unselected: section !== currBranch
                            }">
                            <h3 class="subTab">
                                {{ section }}
                            </h3>
                        </div>

                        <div v-if="index == 0"
                            class="selectedPseudoTrack">
                            <div class="slider"
                                :style="sliderTranslate">
                            </div>
                        </div>
                    </li>
                </ul>
            </nav>

            <div class="tabContainer">
                <section>
                    <Delivering :selectBranch="currBranch">
                    </Delivering>
                </section>

                <section v-show="false">
                    <h2>用戶設定</h2>
                </section>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * todo:  引入訂單, 刪、改訂單
 * doing: DB加入訂單編號屬性, 頁面結構、CSS
 * ! 1440寬下，list數量少時容器會塌陷
 * ------------------------------------
 * //!若先進account後又新增訂單，account不會同步更新
 * 
 */
import { useUserStore } from '@/store/userStore';
import { storeToRefs } from 'pinia';
import { computed, onMounted, watch, ref, type Ref } from 'vue';
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
// watch(showOrderList, (nVal) => {
//     console.log(nVal);
// })

// spinner
const isOrderLoaded = computed(() => showOrderList.value?.length !== 0)

// tabs
const tabs = {
    '購買清單': ['全部', '待付款', '已完成'],
    '用戶設定': []
} as const;

// 切換tab
function switcher(target: Ref) {
    return (val: string) => {
        target.value = val
    }
}

const currTab = ref('購買清單')
const switchTab = switcher(currTab);

// 切換branch
type CurrBranch = typeof tabs['購買清單'][number];
const currBranch = ref<CurrBranch>('全部');
const switchBranch = switcher(currBranch);
const sliderTranslate = computed(() => {
    switch (currBranch.value) {
        case '待付款':
            return {
                transform: 'translateY(41px)'
            }
        case '已完成':
            return {
                transform: 'translateY(82px)'
            }
        default:
            return {
                transform: 'translateY(0px)'
            }
    }
})

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
    @apply min-h-[87vh];

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
        width: 125px;

        li {
            overflow: hidden;
            position: relative;

            h2 {
                font-size: 1.25rem;
                cursor: pointer;
                height: 40px;
                line-height: 40px;
                user-select: none;
                position: relative;

                display: flex;
                align-items: center;
                flex-direction: row;
                gap: .25rem;

                transition: opacity .15s;

                .tabIcon {
                    transform: translateY(-2px);
                }

                &:hover {
                    opacity: 1;
                }
            }

            .selectedPseudoTrack {
                background-color: rgba(0, 0, 0, 0.15);
                width: 2px;
                height: calc(100% - 58px);
                position: absolute;
                top: calc(40px + .5rem);
                left: .75rem;

                .slider {
                    background-color: $btnBacColor;
                    width: 2px;
                    height: 22%;
                    transform: translateY(0px);
                    transition: transform .3s ease-in-out;
                }
            }
        }

        .branch {
            max-height: 0;
            transition: max-height .5s ease-in-out, opacity .5s;

            h3 {
                font-size: 1rem;
                padding: .5rem 0;
                padding-left: 2.5rem;
                cursor: pointer;
                user-select: none;
                // opacity: 0;
                color: transparent;
                // visibility: hidden;
                transition: color .5s;
            }
        }

        .selectedTab {
            max-height: 3rem;

            h3 {
                color: black;
                padding-left: 2.5rem;
                // visibility: visible;
                // opacity: 1;
            }
        }
    }

    .tabContainer {
        flex: 1;
        // border: 1px solid black;
        padding-left: 2rem;
        border-radius: 0 1rem 1rem 1rem;

        section {
            height: 100%;
            // position: relative;
        }
    }

    .unselected {

        &:is(h2) {
            opacity: .5;
        }

        &>h3 {
            opacity: .5;

            &:hover {
                opacity: 1;
            }
        }
    }
}
</style>