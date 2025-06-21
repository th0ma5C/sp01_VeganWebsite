<template>
    <div class="orderContainer">
        <div class="username">
            <h1>
                {{ showUsername }} {{ welcomeWords }}
            </h1>

            <button v-show="showUsername !== '您好'"
                @click="userLogout">登出</button>
        </div>

        <div class="listContainer">
            <nav>
                <ul>
                    <li v-for="(tab, tabName, index) in tabs"
                        :key="tabName" :class="{
                            orderList: index == 0
                        }">
                        <h2 @click="switchTab(tabName)"
                            :class="{
                                unselected: tabName !== currTab,
                            }">
                            <SvgIcon
                                :name="index == 0 ?
                                    'OrderList' :
                                    (index == 1 ? 'Setting' : 'Service')"
                                width="27px" height="27px"
                                color='black'
                                class="tabIcon">
                            </SvgIcon>
                            <span>
                                {{ tabName }}
                            </span>
                        </h2>

                        <div class="collapseWrapper">
                            <div v-for="(section, index) in tab"
                                :key="index"
                                @click="switchBranch(section)"
                                class="branch" :class="{
                                    selectedTab: tabName == currTab,
                                    unselected: section !== currBranch
                                }">
                                <h3 class="subTab" :class="{
                                    emptyList: (index == 1 || index == 2) && userOrderList.length == 0
                                }">
                                    {{ section }}
                                </h3>
                            </div>
                            <div v-if="index == 0"
                                class="mobilePseudoTrack">
                                <div class="mobileSlider"
                                    :style="mobileSliderTranslate">
                                </div>
                            </div>
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
                <transition name="switchTab" mode="out-in">
                    <section v-if="currTab == '購買清單'"
                        key="購買清單" class="scrollSection">
                        <Delivering v-model="currBranch"
                            @switch-to-service="switchTab('聯絡客服')">
                        </Delivering>
                    </section>

                    <section v-else-if="currTab == '用戶設定'"
                        key="用戶設定" class="scrollSection">
                        <Setting></Setting>
                    </section>

                    <section v-else-if="currTab == '聯絡客服'"
                        key="聯絡客服">
                        <Service
                            :role="user.role ?? 'user'">
                        </Service>
                    </section>
                </transition>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/userStore';
import { storeToRefs } from 'pinia';
import { computed, onMounted, watch, ref, type Ref, shallowRef } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import Delivering from './tab1/Delivering.vue';
import Setting from './tab2/Setting.vue';
import Service from './CS/Service.vue';
// import Admin from './admin/Admin.vue';
import { jwtDecode } from 'jwt-decode';
import { useToastStore } from '@/store/toastStore';

// user store
const userStore = useUserStore();
const { getUserOrderList, logout, clearExpiredUserData } = userStore;
const { isAuth, user, userOrderList, userToken } = storeToRefs(userStore);

const showUsername = computed(() => {
    if (user.value.username == 'anonymous') {
        return '您好'
    }
    return user.value.username
})

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
    '用戶設定': [],
    '聯絡客服': []
} as const;

// 切換tab
function switcher(target: Ref) {
    return (val: string) => {
        target.value = val
    }
}

const currTab = ref('購買清單');
const switchTab = switcher(currTab);

// 切換branch
type CurrBranch = typeof tabs['購買清單'][number];
const currBranch = ref<CurrBranch>('全部');
const switchBranch = (target: string) => {
    if (userOrderList.value.length == 0) return
    switcher(currBranch)(target);
};
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
const mobileSliderTranslate = computed(() => {
    switch (currBranch.value) {
        case '待付款':
            return {
                left: 'calc((100% - 2rem)/3 + 1rem)'
            }
        case '已完成':
            return {
                left: 'calc((100% - 2rem)/3*2 + 2rem)'
            }
        default:
            return {
                left: '0'
            }
    }
})

// welcome words
const welcomeWords = computed(() => {
    const now = new Date().getHours();
    let word = '';

    if (now < 12 && now >= 5) {
        word = '早安'
    } else if (now >= 12 && now < 18) {
        word = '午安'
    } else {
        word = '晚安'
    }

    return word
})

// 登出
async function userLogout() {
    const toastStore = useToastStore();
    try {
        await logout();
        toastStore.addNotification('登出成功！')
    } catch (error) {
        console.log(error);
    }
}

// router hook
interface RedirectResTokenDecoded {
    email: string,
    userID: string,
    isGuest: boolean
}
onBeforeRouteLeave(async (to, from) => {
    if (to.path == '/profile' && isAuth.value) {
        return { path: '/home' }
    }

    const JWT = userToken.value as string;
    if (!JWT) return true
    const decoded = jwtDecode<RedirectResTokenDecoded>(JWT);
    if (user.value.userID !== decoded.userID && decoded.isGuest) {
        clearExpiredUserData()
        return true
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
    // position: relative;

    padding-top: 2rem;

    &>div:not(.chatBox) {
        width: 100%;
        max-width: 1440px;
        // padding: 0 6rem;
        padding-inline: 1.5rem;
        padding-inline: clamp(1.5rem, 0.2142857142857144rem + 6.428571428571428vw, 6rem);
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
        font-size: 2rem;
        font-size: clamp(2rem, 1.7142857142857144rem + 1.4285714285714286vw, 3rem);
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
}

.listContainer nav {
    width: 125px;

    li {
        overflow: hidden;
        position: relative;
        user-select: none;
        border: 1px solid transparent;
        border-radius: .25rem;

        h2 {
            font-size: 1.25rem;
            cursor: pointer;
            height: 40px;
            line-height: 40px;
            user-select: none;
            position: relative;

            display: grid;
            grid-template-columns: auto 1fr;
            grid-template-rows: 1fr;
            text-wrap: nowrap;
            justify-items: start;
            // display: flex;
            // align-items: center;
            // flex-direction: row;
            gap: .25rem;

            transition: opacity .15s;

            padding-inline: .25rem;

            .tabIcon {
                transform: translateY(-1px);
                // background-color: $primaryBacColor;
            }

            &:hover {
                opacity: 1;
            }

            span {
                max-width: 80px;
                transition: max-width .3s, opacity .3s;
                opacity: 1;
                // background-color: $primaryBacColor;
            }
        }
    }

    & li:has(.selectedTab) {

        .collapseWrapper {
            grid-template-rows: 1fr 1fr 1fr;
            opacity: 1;
        }
    }
}

.selectedPseudoTrack {
    background-color: rgba(0, 0, 0, 0.15);
    width: 2px;
    height: calc(100% - 58px);
    position: absolute;
    top: calc(40px + .5rem);
    left: .75rem;
}

.slider {
    background-color: $btnBacColor;
    width: 2px;
    height: 22%;
    transform: translateY(0px);
    transition: transform .3s ease-in-out;
}

.branch {

    h3 {
        font-size: 1rem;
        padding: .5rem 0;
        padding-left: 2.5rem;
        user-select: none;
        color: transparent;
        transition: color .5s;

        &:not(.emptyList) {
            cursor: pointer;
        }
    }
}

.emptyList {
    // pointer-events: none;
    cursor: not-allowed;
}

.selectedTab {
    // max-height: 3rem;

    h3 {
        color: black;
        padding-left: 2.5rem;
        // visibility: visible;
        // opacity: 1;
    }
}

.collapseWrapper {
    display: grid;
    opacity: 0;
    grid-template-rows: 0fr 0fr 0fr;
    transition: grid-template-rows .5s, opacity .3s;

    &>div {
        overflow: hidden;
    }
}

.tabContainer {
    flex: 1;
    // border: 1px solid black;
    padding-left: 2rem;
    border-radius: 0 1rem 1rem 1rem;
    // position: relative;
    max-height: 540px;
    max-width: calc(100% - 125px);

    section {
        height: 100%;
        position: relative;

    }
}

.scrollSection {
    overflow-y: scroll;
    overflow-y: auto;
    scrollbar-gutter: stable;
    padding-inline: .25rem;

    &::-webkit-scrollbar {
        translate: 0 1rem;
        width: 0.25rem;
    }

    &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 10px;

    }

    &::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
    }
}

.listContainer nav li h2 {
    // background-color: transparent;
}

.unselected {

    &:is(h2) {
        opacity: .5;
    }

    &>h3 {
        opacity: .5;

        &:not(.emptyList):hover {
            opacity: 1;
        }
    }
}

.switchTab-enter-active,
.switchTab-leave-active {
    // position: absolute;
    // width: calc(100% - 2rem);
    transition: opacity .15s;
}

.switchTab-leave-active {}

.switchTab-enter-from,
.switchTab-leave-to {
    opacity: 0;
}

.switchTab-enter-to,
.switchTab-leave-from {
    opacity: 1;
}

.mobilePseudoTrack {
    display: none;
}

.mobileSlider {
    position: relative;
    width: calc((100% - 2rem)/3);
    height: 100%;
    background-color: $btnBacColor;
    transition: left .3s;
}



@include XLarge {}

@include large {}

@include medium($width: 1024px) {}

@include medium {
    .tabContainer {
        padding-left: 0;
        display: flex;
        flex-direction: column;
        max-width: 100%;

        section {
            display: flex;
            flex: 1;
            flex-direction: column;
        }


    }

    .listContainer {
        flex-direction: column;
        gap: .75rem;

        nav {
            width: 100%;

            ul {
                display: flex;
                flex-direction: row;
                gap: 2rem;
            }

            li {
                // display: flex;
                transition: background-color .3s;

                &:active {
                    scale: .98;
                    // background-color: rgba(128, 128, 128, 0.1);
                    // border-color: $btnBacColor;
                }

                &:not(:has(h2:is(.unselected))) {
                    border-color: $btnBacColor;
                }

                h2 {
                    display: flex;
                    flex-direction: column;
                    font-size: 1.25rem;
                    gap: 0;
                    // justify-items: center;
                    // grid-template-columns: 1fr;
                    // grid-template-rows: auto 1fr;
                    line-height: normal;
                    height: auto;
                    padding-top: .25rem;
                }
            }
        }

        .selectedPseudoTrack {
            display: none;
        }

        .collapseWrapper {
            display: none;
            // grid-template-columns: 0fr 0fr 0fr;
            // // grid-template-columns: 1fr 1fr 1fr;
            // grid-template-rows: 1fr;
            // opacity: 1;
            // gap: 1rem;
            // margin-inline: 1rem;
            // justify-items: center;
            // position: relative;
            // text-align: center;
            // transition: grid-template-columns .3s, margin-inline .3s;

            // &>div {
            //     width: 100%;
            // }

            // &:not(:has(.selectedTab)) {
            //     margin-inline: 0rem;
            //     gap: 0;

            //     .mobilePseudoTrack {
            //         opacity: 0;
            //     }
            // }
        }

        .branch h3 {
            padding-left: 0;
            color: black;
            text-wrap: nowrap;
        }

        nav li:has(.selectedTab) .collapseWrapper {
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 1fr;
        }
    }

    .collapseWrapper>div:not(.selectedTab) h3 {
        opacity: .5;
    }

    .selectedTab h3 {
        padding-left: 0;
    }

    .listContainer .collapseWrapper .mobilePseudoTrack {
        display: block;
        width: 100%;
        height: 2px;
        background-color: rgba(0, 0, 0, 0.15);
        position: absolute;
        left: 0;
        bottom: 0;
        border-radius: 2px;
        transition: opacity .3s;
    }

    .switchTab-enter-active,
    .switchTab-leave-active {
        width: 100%;
    }
}

@include small {
    .listContainer {
        nav {

            ul {
                gap: .5rem;
            }

            li {
                // flex: 1;
                position: relative;
                overflow: visible;
                min-height: 40px;
                transition: min-height .3s .15s;

                // &:has(.collapseWrapper>div:is(.selectedTab)) {
                //     min-height: 90px;
                // }

                // h2:is(.unselected)>span {
                //     display: inline-block;
                //     max-width: 0;
                //     overflow: hidden;
                //     opacity: 0;
                // }
                h2 {
                    font-size: 1rem;
                }
            }

            .orderList {
                // flex: 1;
            }
        }


        .collapseWrapper {
            grid-template-columns: 1fr 1fr 1fr;
            position: absolute;
            top: 50%;
            left: 27px;
            z-index: 2;
            margin-inline: 0;
            visibility: hidden;
            opacity: 0;

            // grid-template-rows: 0fr;
            grid-template-rows: 1fr;
            transition: opacity .3s;
            width: max-content;

            &:not(:has(.selectedTab)) {
                gap: 1rem;

                .mobilePseudoTrack {
                    opacity: 0;
                }
            }
        }

        nav li:has(.selectedTab) .collapseWrapper {
            // grid-template-rows: 1fr;
            visibility: visible;
            opacity: 1;
        }
    }
}

@include small($width: 430px) {}

@include small($width: 320px) {}
</style>