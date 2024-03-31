<template>
    <div class="container" :class="{ 'hideNav': hideNav }">
        <header class="header" ref="header">
            <a href="">
                <SvgIcon name="Logo" height="65px">
                </SvgIcon>
            </a>
            <div>
                <ul class="navLink">
                    <li v-for="{ link } in  navLink "
                        :key="link">
                        <a href=""><span>{{ link
                                }}</span></a>
                    </li>
                </ul>
                <ul class="navIcon">
                    <li v-for="{ icon } in  navIcon "
                        :key="icon">
                        <a href="">
                            <SvgIcon :name="icon"
                                width="40px" height="40px">
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

let navLink = [
    { link: '首頁' }, { link: '專屬分析' }, { link: '美味菜單' }, { link: '關於果漾' }
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
const throttledOnScroll = throttle(onScroll, 200);
onMounted(() => {
    window.addEventListener('scroll', throttledOnScroll)
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', throttledOnScroll)
})
</script>

<style scoped lang="scss">
.container {
    background-color: $primeBacColor;
    border-bottom: 1px solid rgba(128, 128, 128, 0.5);
    width: 100%;
    position: fixed;
    top: 0;
    transition: all 0.2s linear;
    z-index: 3;

    .header {
        @include flex-center-center;
        @include main-part;



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