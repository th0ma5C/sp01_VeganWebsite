<template>
    <div ref="header" class="container"
        :class="{ 'hideNav': hideNav }" :style="{
            paddingRight: isCartCardOpen ? `${scrollbarWidth}px` : 0
        }" v-if="!QNR_IsLoaded && !isCheckout">
        <div class="burgerWrapper">
            <label class="burger" for="burger" :class="{
                foldBurgerBac: isBehind,
                hideBurger: isSwitching
            }" @click="burgerOnclick">
                <input type="checkbox" id="burger"
                    v-model="isBehind">
                <span></span>
                <span></span>
                <span></span>
            </label>
        </div>

        <div class="foldNavLink behind" :class="{
            foldNav: !isBehind,
            openNav: isBehind,
            initAnimate: isInit
        }">
            <div class="mobileSearch" :class="{
                searchShow: isSearchShow
            }">
                <transition name="search_transition">
                    <a href="" class="icon"
                        @click.prevent="clickNavIcon('Search')"
                        v-show="!isSearchShow">
                        <SvgIcon :name="'Search'"
                            width="35px" height="35px"
                            color="#FCFAF2">
                        </SvgIcon>
                    </a>
                </transition>
                <!-- <Search v-if="isSearchShow"
                    :showSearch="isSearchShow"
                    @close="clickNavIcon('Search')">
                </Search> -->
                <Search v-if="isSearchShow"
                    v-model="isSearchShow">
                </Search>
            </div>
            <ul class="">
                <li v-for="{ title, url } in navLink"
                    :key="title">
                    <RouterLink :to="url" href="">
                        <span>
                            {{ title }}
                        </span>
                    </RouterLink>
                </li>
                <li class="mobileNavList"
                    v-for="{ title, url } in navLink"
                    :key="title" ref="combineListRef">
                    <RouterLink :to="url" href="">
                        <span>
                            {{ title }}
                        </span>
                    </RouterLink>
                </li>

                <!-- <li class="mobileNavList"
                    v-for="(item, index) in navLink"
                    :key="index"> -->
                <!-- <template v-if="index !== 1">
                        <router-link :to="item.url ?? ''">
                            <span>
                                {{ item.title }}
                            </span>
                        </router-link>
                    </template> -->

                <!-- <template v-else>
                        <span
                            @click.prevent="clickNavIcon(item.title)">
                            {{ item.title }}
                        </span>
                        <Search
                            v-if="item.title == 'Search' && isSearchShow"
                            :showSearch="isSearchShow"
                            @close="clickNavIcon('Search')">
                        </Search>
                    </template> -->
                <!-- </li> -->
            </ul>
        </div>

        <div class="front" :class="{
            foldNav: isBehind,
            openNav: !isBehind,
            initAnimate: isInit
        }">
            <router-link :to="{ name: 'Home' }"
                class="logoRoute" :class="{
                    hideLogo: isSearchShow
                }">
                <SvgIcon name="Logo" height="65px"
                    color="#00430b">
                </SvgIcon>
            </router-link>
            <div class="navIconWrapper">
                <ul class="navLink" @click.stop>
                    <li v-for="{ title, url } in navLink"
                        :key="title">
                        <RouterLink :to="url" href="">
                            <span>
                                {{ title }}
                            </span>
                        </RouterLink>
                    </li>
                </ul>
                <ul class="navIcon" @click.stop>
                    <li v-for="{ icon } in navIcon"
                        :key="icon" ref="iconList" :class="{
                            searchIcon: icon == 'Search'
                        }">
                        <template v-if="icon == 'Search'">
                            <transition
                                name="search_transition">
                                <a href=""
                                    @click.prevent="clickNavIcon(icon)"
                                    v-show="!isSearchShow">
                                    <SvgIcon :name="icon"
                                        width="35px"
                                        height="35px"
                                        color="#00430b">
                                    </SvgIcon>
                                </a>
                            </transition>
                        </template>
                        <template v-else>
                            <transition>
                                <a href=""
                                    @click.prevent="clickNavIcon(icon)">
                                    <SvgIcon :name="icon"
                                        width="35px"
                                        height="35px"
                                        color="#00430b">
                                    </SvgIcon>
                                </a>
                            </transition>
                        </template>

                        <CartCounter v-if="icon == 'Cart'"
                            :size="{ width: 20, height: 20 }">
                        </CartCounter>
                        <Search
                            v-if="icon == 'Search' && isSearchShow"
                            v-model="isSearchShow">
                        </Search>
                        <!-- <Search
                            v-if="icon == 'Search' && isSearchShow"
                            :showSearch="isSearchShow"
                            @close="clickNavIcon('Search')">
                        </Search> -->
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <!-- <header class="header" ref="header">
            <router-link :to="{ name: 'Home' }">
                <SvgIcon name="Logo" height="65px"
                    color="#00430b">
                </SvgIcon>
            </router-link>
            <div @click.stop>
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
                        :key="icon" ref="iconList" :class="{
                            searchIcon: icon == 'Search'
                        }">
                        <template v-if="icon == 'Search'">
                            <transition
                                name="search_transition">
                                <a href=""
                                    @click.prevent="clickNavIcon(icon)"
                                    v-show="!isSearchShow">
                                    <SvgIcon :name="icon"
                                        width="35px"
                                        height="35px"
                                        color="#00430b">
                                    </SvgIcon>
                                </a>
                            </transition>
                        </template>
                        <template v-else>
                            <transition>
                                <a href=""
                                    @click.prevent="clickNavIcon(icon)">
                                    <SvgIcon :name="icon"
                                        width="35px"
                                        height="35px"
                                        color="#00430b">
                                    </SvgIcon>
                                </a>
                            </transition>
                        </template>

                        <CartCounter v-if="icon == 'Cart'"
                            :size="{ width: 20, height: 20 }">
                        </CartCounter>
                        <Search
                            v-if="icon == 'Search' && isSearchShow"
                            :showSearch="isSearchShow"
                            @close="clickNavIcon('Search')">
                        </Search>
                    </li>
                </ul>
            </div>
        </header> -->

    <div class="QNR_header" v-else
        :class="{ 'hideNav': hideNav }">
        <main>
            <router-link :to="{ name: 'Home' }">
                <SvgIcon name="Logo" height="65px"
                    color="#00430b">
                </SvgIcon>
            </router-link>
            <SvgIcon name="cancel" width="32px"
                class="cancelIcon" height="32px"
                @click="prevPage">
            </SvgIcon>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, computed, watch, reactive, useTemplateRef, watchEffect } from 'vue';
import throttle from 'lodash/throttle';
import { useRouter, useRoute } from 'vue-router';
import { useQuestionnaireStore } from '@/store/questionnaireStore';
import { storeToRefs } from 'pinia';
import { useCartStore } from '@/store/cartStore';
import CartCounter from '../popover/cartCounter/CartCounter.vue';
import Search from './Search/Search.vue';
import emitter from '@/utils/eventBus';
import gsap from 'gsap';


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

const combineList = reactive([
    {
        title: '首頁',
        url: '/'
    },
    {
        icon: 'Search',
        title: '搜尋'
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
])

let header = ref();
let position = 0;
let hideNav = ref(false);
function onScroll() {
    if (window.scrollY < 80) {
        hideNav.value = false;
        position = window.scrollY;
        return
    }
    hideNav.value = window.scrollY > position;
    position = window.scrollY;
    if (isSearchShow.value) {
        clickNavIcon('Search');
    }
}
const throttledOnScroll = throttle(onScroll, 100);

// QNR_store
const { QNR_IsLoaded } = storeToRefs(useQuestionnaireStore());

const Router = useRouter();
const Route = useRoute()

function prevPage() {
    const steps = Route.matched.length;
    Router.go(-steps)
}

// 購物車
const cartStore = useCartStore();
const { isCheckout, isCartCardOpen, scrollbarWidth } = storeToRefs(cartStore);
const { toggleCartCardOpen, getHeaderCart } = cartStore;

function clickNavIcon(target: string) {
    if (isSearchShow.value && target !== 'Search') clickNavIcon('Search');

    switch (target) {
        case 'Cart':
            toggleCartCardOpen()
            break;
        case 'Person':
            Router.push('/profile/account')
            break;
        default:
            isSearchShow.value = !isSearchShow.value
            break;
    }
}
// iconList
const iconList = ref();

watch([QNR_IsLoaded, isCheckout], (nVal) => {
    if (nVal.some(val => val == false)) {
        nextTick(() => {
            getHeaderCart(iconList.value[1]);
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

// Search
const isSearchShow = ref(false);

// switch front behind
const isBehind = ref(false);
const isSwitching = ref(false);
const isInit = ref(true);

function burgerOnclick() {
    isInit.value = false
}

// combineList gsap
const combineListRef = useTemplateRef('combineListRef');

function showCombineList() {
    if (!combineListRef.value) return
    const tl = gsap.timeline();

    tl.fromTo(combineListRef.value,
        { autoAlpha: 0, y: 50 },
        {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.05,
            delay: .3,
            clearProps: 'opacity',
        }
    )
}

watchEffect(() => {
    if (isBehind.value) {
        nextTick(() => {
            showCombineList();
            if (isSearchShow.value) {
                clickNavIcon('Search');
            }
        })
    }
})

// router
const router = useRouter();
router.beforeEach(() => {
    if (isBehind.value) isBehind.value = false;
    return true
})

// prevent url bar resize
let currWidth = 0;

// scroll bar width
// const scrollbarWidth = ref(window.innerWidth - document.documentElement.clientWidth)

onMounted(() => {
    window.addEventListener('scroll', throttledOnScroll);
    // 暴露cart按鈕元素
    getHeaderCart(iconList.value[1]);
    window.addEventListener('resize', () => {
        if (currWidth == window.innerWidth) return
        isInit.value = true;
        isSearchShow.value = false;
        currWidth = window.innerWidth;
        scrollbarWidth.value = window.innerWidth - document.documentElement.clientWidth
    })
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', throttledOnScroll)
})
</script>

<style scoped lang="scss">
* {
    // outline: 1px solid black
}

%container {
    @extend %fixContainer;

    background-color: $primaryBacColor;
    border-bottom: 1px solid rgba(128, 128, 128, 0.5);
    width: 100%;
    height: 100px;
    position: fixed;
    top: -0.1%;
    transition: all 0.2s linear,
        padding-right 0s;
    z-index: 99;
}

.container {
    @extend %container;
    // justify-content: center;
    // margin-inline: auto;

    &>div {
        max-width: $primaryWidth;
        margin-inline: auto;
    }

    .front {
        @include flex-center-center;
        // @include main-part;
        padding-inline: 6rem;
        margin-block: 0;
        width: 100%;
        height: 100%;
        background-color: $primaryBacColor;
        // transition: translate .3s, scale .3s;
        // animation: switchCard .5s forwards;
        // box-shadow: 0px 1px 2px black;

    }
}

.navIconWrapper {
    @include flex-center-center;
    justify-content: space-between;
    width: 100%;

    ul {
        padding: 0;

        li {
            display: inline-flex;
        }
    }
}

.navLink {
    display: flex;

    li {
        margin-left: 2rem;
        font-variation-settings: 'wght' 600;
        color: $secondBacColor;
        letter-spacing: 1px;
        text-wrap: nowrap;
        transition: opacity .3s .1s;
    }

    &:has(li:hover) {
        li:not(:hover) {
            opacity: .5;
        }
    }
}



.navIcon {
    cursor: pointer;
    display: flex;

    li {
        margin-right: 1rem;
        position: relative;
        transition: opacity .3s;

        &:last-of-type {
            margin: 0;
        }
    }

    &:has(li:hover) {
        li:not(:hover) {
            opacity: .5;
        }
    }
}

.hideNav {
    border-bottom: none;
    transition: all 0.2s linear;
    transform: translate(0, -100%);
    // visibility: hidden;
    opacity: 0;
}


.QNR_header {
    @extend %container;
    position: relative;

    main {
        width: 100%;
        max-width: 1920px;
        margin-inline: auto;
        transition: all 0.2s linear;
        position: relative;
    }

    a {
        display: block;
    }

    .cancelIcon {
        cursor: pointer;
        transition: opacity .2s ease;
        opacity: 0.3;
        position: absolute;
        right: 2rem;
        top: 1rem;

        &:hover {
            opacity: 1;
        }
    }
}

.searchIcon {
    position: relative;
}

@keyframes searchSlide {
    from {
        opacity: 1;
        transform: translateX(0%);
    }

    to {
        opacity: 0;
        transform: translateX(-500%);
    }
}

.search_transition-enter-active,
.search_transition-leave-active {
    transition: opacity .05s, transform .3s;
}

.search_transition-enter-from,
.search_transition-leave-to {
    opacity: 0;
    transform: translateX(-500%);
}

.search_transition-enter-to,
.search_transition-leave-from {

    opacity: 1;
    transform: translateX(0%);
}

.burgerWrapper {
    display: none;

    .burger {
        position: absolute;
        top: 50%;
        left: 3rem;
        transform: translateY(-50%);
        z-index: 3;
        width: 30px;
        height: 20px;
        background: transparent;
        cursor: pointer;
        display: block;
        transform-origin: center;
        transition: scale .15s, opacity .15s;

        &:hover {
            scale: 1.05;
        }
    }

    .burger input {
        display: none;
    }

    .burger span {
        display: block;
        position: absolute;
        height: 2px;
        width: 100%;
        background-color: $secondBacColor;
        border-radius: 9px;
        opacity: 1;
        left: 0;
        transform: rotate(0deg);
        transition: all .25s .6s, background-color .25s;
    }

    .foldBurgerBac span {
        background-color: $primaryBacColor;
    }

    .burger span:nth-of-type(1) {
        top: 0px;
        transform-origin: left center;
    }

    .burger span:nth-of-type(2) {
        top: 50%;
        transform: translateY(-50%);
        transform-origin: left center;
    }

    .burger span:nth-of-type(3) {
        top: 100%;
        transform-origin: left center;
        transform: translateY(-100%);
    }

    .burger input:checked~span:nth-of-type(1) {
        transform: rotate(45deg);
        top: -1px;
        left: 5px;
    }

    .burger input:checked~span:nth-of-type(2) {
        width: 0%;
        opacity: 0;
    }

    .burger input:checked~span:nth-of-type(3) {
        transform: rotate(-45deg);
        top: 20px;
        left: 5px;
    }

    .hideBurger {
        opacity: 0;
        pointer-events: none;
    }
}

@keyframes toRear {
    0% {
        translate: 0;
        z-index: 2;
    }

    50% {
        translate: 0 -50%;
        z-index: 1;
    }

    100% {
        translate: 0 5%;
        z-index: 1;
    }
}

@keyframes toFront {
    0% {
        translate: 0 5%;
        z-index: 1;
    }

    50% {
        translate: 0 50%;
        z-index: 2;
    }

    100% {
        translate: 0;
        z-index: 2;
    }
}

@keyframes burgerSwitch {
    from {
        background-color: $secondBacColor;
        opacity: 0;
    }

    to {
        background-color: $primaryBacColor;
        opacity: 1;
    }
}


.behind {
    display: none;
    // transition: translate .3s, scale .3s;
    box-shadow: 0px 1px 8px black;
}

.foldNavLink {
    // background-color: rgba(0, 0, 0, 0.25);
    position: absolute;
    left: 0;
    top: 0;
    height: 100px;
    width: 100%;
    // z-index: 98;


    ul {
        background-color: $secondBacColor;
        align-items: center;
        display: flex;
        // flex-direction: column;
        width: 100%;
        height: 100px;
        padding-left: calc(4rem + 30px);
    }

    li {
        margin-left: 2rem;
        font-variation-settings: 'wght' 600;
        color: $primaryBacColor;
        letter-spacing: 1px;
        text-wrap: nowrap;
        transition: opacity .3s .1s;
    }

    &:has(li:hover) {
        li:not(:hover) {
            opacity: .5;
        }
    }
}

.mobileNavList {
    display: none;
}

.mobileSearch {
    display: none;
}



// RWD
/**
* //中小滾動距離不足導致無法收起、取消padding、切換路由收起fold nav
* //小的路由功能
* //初始化時不要撥放動畫
* //初始化LOGO RWD
* //shadow有點醜
*/


@include XLarge {
    .container {
        // max-width: 1920px;
    }
}

@include large {}

@include medium($width: 1440px) {
    .container .front {
        padding-inline: 4rem;
    }
}

@include medium($width: 1024px) {
    .foldNav {
        animation: toRear .5s forwards ease-in-out;
    }

    .openNav {
        animation: toFront .5s forwards ease-in-out;
    }

    .initAnimate {
        animation-duration: 0s;
        transition-duration: 0s;
    }

    .burgerWrapper {
        display: block;
    }

    .container .front {
        padding-inline: 3rem;
        box-shadow: 0px 1px 8px black;
    }

    .behind {
        display: block;
    }

    .logoRoute {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: opacity .3s;
    }

    // .hideLogo {
    //     opacity: 0;
    // }

    .navIconWrapper {
        flex-direction: row-reverse;
    }

    .navLink {
        display: none;
    }

    .navIcon {}
}


@include medium($width: 900px) {
    .hideLogo {
        opacity: 0;
    }
}

@include medium {}

@include small {
    %pseudoLine {
        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: $primaryBacColor;
        }
    }

    .burgerWrapper .burger span {
        transition: all .25s .3s, background-color .25s;
    }

    .foldNavLink {
        background-color: $secondBacColor;
        position: fixed;
        height: 100%;
        padding-top: 100px;
        padding-left: 1rem;
        transition: transform .3s;
        z-index: 2;
        transform: translateX(-100%);

        ul {
            height: auto;
            padding-inline: 3.5rem;
            flex-direction: column;
            align-items: normal;

            &>li:not(.mobileNavList) {
                display: none;
            }

            // &>li:nth-of-type(even) {
            //     align-self: flex-end;
            // }

            &:has(li:hover) {
                li:not(:hover) {
                    opacity: .5;
                }
            }
        }

        .mobileNavList {
            @extend %pseudoLine;

            cursor: pointer;
            display: block;
            margin-left: 0;
            margin-block: 1rem;
            transition: opacity .3s;
            position: relative;
            width: fit-content;
            user-select: none;
        }

        .mobileSearch {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            display: block;

            .icon {
                position: absolute;
                top: 50px;
                right: 1rem;
                translate: -50% -50%;
            }
        }

        .searchShow {
            z-index: 4;
        }
    }

    .initAnimate {
        animation-duration: 0s;
        transition-duration: 0s;
    }

    .foldNav {
        animation: none;
        box-shadow: none;
    }

    .openNav {
        animation: none;
        transform: translateX(0%);
    }

    .behind ul {
        // position: fixed;
        // top: 0;
        // left: 0;
        // height: 100%;
    }

    .container {
        .front {
            box-shadow: none;
            padding-inline: 1rem;
            // display: none;
        }
    }

    .burgerWrapper .burger {
        left: 1rem;
    }

    .navIcon {
        li {
            margin-right: .5rem;
        }

        .searchIcon {
            display: none;
        }
    }
}
</style>