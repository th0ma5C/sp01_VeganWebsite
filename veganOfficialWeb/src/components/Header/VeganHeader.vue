<template>
    <div class="container" :class="{ 'hideNav': hideNav }"
        v-if="!QNR_IsLoaded">
        <header class="header" ref="header">
            <router-link :to="{ name: 'Home' }">
                <SvgIcon name="Logo" height="65px"
                    color="black">
                </SvgIcon>
            </router-link>
            <div>
                <ul class="navLink">
                    <li v-for="{ title, url } in navLink "
                        :key="title">
                        <RouterLink :to="url" href="">
                            <span>
                                {{ title }}
                            </span>
                        </RouterLink>
                    </li>
                </ul>
                <ul class="navIcon">
                    <li v-for="{ icon } in navIcon "
                        :key="icon" ref="iconList">
                        <a href=""
                            @click.prevent="clickCartIcon(icon)">
                            <SvgIcon :name="icon"
                                width="35px" height="35px">
                            </SvgIcon>
                        </a>
                        <CartCounter v-if="icon == 'Cart'"
                            :size="{ width: 18, height: 18 }">
                        </CartCounter>
                    </li>
                </ul>
            </div>
        </header>
    </div>

    <div v-else>
        <header class="QNR_header" ref="header"
            :class="{ 'hideNav': hideNav }">
            <router-link :to="{ name: 'Home' }">
                <SvgIcon name="Logo" height="65px"
                    color="black">
                </SvgIcon>
            </router-link>
            <SvgIcon name="cancel" width="32px"
                class="cancelIcon" height="32px"
                @click="prevPage">
            </SvgIcon>
        </header>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, computed, watch } from 'vue';
import throttle from 'lodash/throttle';
import { useRouter, useRoute } from 'vue-router';
import { useQuestionnaireStore } from '@/store/questionnaireStore';
import { storeToRefs } from 'pinia';
import { useCartStore } from '@/store/cartStore';
import CartCounter from '../popover/cartCounter/CartCounter.vue';
import emitter from '@/utils/eventBus';


let navLink = [
    {

        title: '首頁',
        url: '/'
    },
    {

        title: '專屬分析',
        url: '/questionnaire'
    },
    {

        title: '美味菜單',
        url: '/menu'
    },
    {

        title: '關於果漾',
        url: '/about'
    }
];
let navIcon = [
    { icon: 'Search' }, { icon: 'Cart' }, { icon: 'Person' }
];

let header = ref();
let position = 0;
let hideNav = ref(false);
function onScroll() {
    if (window.scrollY < 100) {
        hideNav.value = false;
        position = window.scrollY;
        return
    }
    hideNav.value = window.scrollY > position;
    position = window.scrollY;
}
const throttledOnScroll = throttle(onScroll, 100);

// QNR_store
const { QNR_IsLoaded } = storeToRefs(useQuestionnaireStore());

const Router = useRouter();
const Route = useRoute()

function prevPage() {
    // console.log(Router);
    // console.log(Route);
    // Router.back();
    const steps = Route.matched.length;
    Router.go(-steps)
}

// 購物車
const cartStore = useCartStore();
const { toggleCartCardOpen, getHeaderCartBtn } = cartStore;

function clickCartIcon(target: string) {
    if (target == 'Cart') toggleCartCardOpen()
}
// iconList
const iconList = ref();

watch(QNR_IsLoaded, (nVal) => {
    if (nVal == false) {
        nextTick(() => {
            getHeaderCartBtn(iconList.value[1]);
        })
    }
})

// emit event
emitter.on('sendIcon', () => {
    if (QNR_IsLoaded.value == false) hideNav.value = false;
})

watch(hideNav, (nVal) => {
    emitter.emit('navEvent', nVal)
})

onMounted(() => {
    window.addEventListener('scroll', throttledOnScroll);
    getHeaderCartBtn(iconList.value[1]); // 暴露cart按鈕元素
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', throttledOnScroll)
})
</script>

<style scoped lang="scss">
%container {
    @extend %fixContainer;

    background-color: $primaryBacColor;
    border-bottom: 1px solid rgba(128, 128, 128, 0.5);
    width: 100%;
    height: 100px;
    position: fixed;
    top: -0.1%;
    transition: all 0.2s linear;
    z-index: 99;
}

.container {
    @extend %container;

    .header {
        @include flex-center-center;
        @include main-part;
        width: 100%;

        &>div {
            @include flex-center-center;
            justify-content: space-between;
            width: 100%;

            ul {
                padding: 0;

                li {
                    display: inline-flex;
                }
            }

            .navLink {
                li {
                    margin-left: 2rem;
                }
            }

            .navIcon {
                cursor: pointer;
                display: flex;

                li {
                    margin-right: 1rem;
                    position: relative;
                }
            }
        }
    }

}

.hideNav {
    border-bottom: none;
    transition: all 0.2s linear;
    transform: translate(0, -100%);
    visibility: hidden;
}


.QNR_header {
    @extend %container;
    border-bottom: none;
    width: 100%;
    transition: all 0.2s linear;

    a {
        display: block;
    }

    .cancelIcon {
        cursor: pointer;
        transition: opacity .2s ease;
        opacity: 0.3;
        position: absolute;
        right: 2rem;

        &:hover {
            opacity: 1;
        }
    }
}
</style>