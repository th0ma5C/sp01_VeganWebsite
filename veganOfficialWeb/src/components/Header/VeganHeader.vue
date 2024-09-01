<template>
    <div class="container" :class="{ 'hideNav': hideNav }">
        <header class="header" ref="header">
            <a href="">
                <SvgIcon name="Logo" height="65px">
                </SvgIcon>
            </a>
            <div>
                <ul class="navLink">
                    <li v-for="{ title, url } in navLink "
                        :key="title">
                        <!-- <RouterLink :to="url" href=""> -->
                        <span @click="routerTo(url)">
                            {{ title }}
                        </span>
                        <!-- </RouterLink> -->
                    </li>
                </ul>
                <ul class="navIcon">
                    <li v-for="{ icon } in navIcon "
                        :key="icon">
                        <a href="">
                            <SvgIcon :name="icon"
                                width="35px" height="35px">
                            </SvgIcon>
                        </a>
                    </li>
                </ul>
            </div>
        </header>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import throttle from 'lodash/throttle';
import { useRouter } from 'vue-router';

const Router = useRouter();
function routerTo(url: string) {
    Router.push({
        path: '/menu'
    })
}

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
onMounted(() => {
    window.addEventListener('scroll', throttledOnScroll)
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', throttledOnScroll)
})
</script>

<style scoped lang="scss">
.container {
    background-color: $primaryBacColor;
    border-bottom: 1px solid rgba(128, 128, 128, 0.5);
    width: 100%;
    height: 100px;
    position: fixed;
    top: -0.1%;
    transition: all 0.2s linear;
    z-index: 99;

    @extend %fixContainer;

    .header {
        @include flex-center-center;
        @include main-part;
        width: 100%;



        div {
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
                display: flex;

                li {
                    margin-right: 1rem;
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
</style>