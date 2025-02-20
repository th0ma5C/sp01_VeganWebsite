<template>
    <div class="hiringContainer" ref="containerRef">
        <transition name="showMain">
            <main v-show="isSplitDone">
                <div class="contentWrapper">
                    <div class="content">
                        <p>Build our</p>
                        <span>Relation-Ship</span>
                        <p>加入您的熱情和才華，使餐點更美味！</p>
                    </div>

                    <div class="btnWrapper"
                        @click="btnOnclick">

                        <button>
                            <span :style="{
                                lineHeight: `${svgSize}px`
                            }">
                                Join Us
                            </span>
                            <div class="iconWrapper">
                                <SvgIcon
                                    v-for="(item, index) in 3"
                                    :key="`${svgSize}-${index}`"
                                    name="HiringArrow"
                                    :width='`${svgSize}px`'
                                    :height='`${svgSize}px`'
                                    color="#FCFAF2">
                                </SvgIcon>
                            </div>
                        </button>
                    </div>
                </div>

                <div class="imgBc">
                    <img src="/imgs/Hiring/chef.png" alt="">
                </div>
            </main>
        </transition>

        <div class="startImg" v-show="!isSplitDone">
            <div v-for="(item, index) in 8" :key="index"
                :class='`imgWrapper${index}`'
                ref="startImgRef">
                <img src="/imgs/about/upper_right_chef.webp"
                    alt="">
            </div>
        </div>

        <div class="splitTextWrapper" v-show="!isSplitDone">
            <span v-for="(str, index) in splitStr.split('')"
                :key="index" :data-content="str"
                ref="splitTextRef">
                {{ str }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { homeStore } from '../store/homeStore';

const containerRef = useTemplateRef('containerRef');

// gsap scroll trigger
const hasEnter = computed(() => {
    return homeStore.hasEnter
})
function startImgScrollTrigger() {
    ScrollTrigger.create({
        trigger: containerRef.value,
        // pin: containerRef.value,
        start: 'top-=50% top',
        // end: 'top+=4',
        onEnter: () => {
            startImgGsap();
        },
        // markers: true,
        // once: true
    })
}

// start img gsap
const startImgRef = useTemplateRef('startImgRef');
gsap.registerPlugin(ScrollTrigger);

function startImgGsap() {
    if (!startImgRef.value || isSplitDone.value || hasEnter.value) return
    const tl = gsap.timeline({
        onComplete: () => {
            splitGsap();
        }
    });

    tl.set(splitTextRef.value, {
        yPercent: 100
    });

    tl.to(startImgRef.value, {
        yPercent: -100,
        duration: 1,
        ease: 'power4.in',
        stagger: {
            each: 1 * 0.05,
            from: 'start',
        }
    }).to(startImgRef.value, {
        autoAlpha: 0,
        duration: 0,
    })
}

// split span
const splitStr = ref('WE ARE HIRING');
const splitTextRef = useTemplateRef('splitTextRef');
const isSplitDone = ref(false);

function splitGsap() {
    if (!splitTextRef.value) return
    const tl = gsap.timeline({
        defaults: {
            duration: 1,
            ease: 'power4.out',
            stagger: {
                each: 1 * 0.025,
                from: 'start',
            }
        },
        onComplete: () => {
            isSplitDone.value = true;
            homeStore.hasEnter = true
        }
    });

    tl.to(splitTextRef.value, {
        yPercent: 0,
    }).to(splitTextRef.value, {
        yPercent: -100,
        ease: 'power4.in',
        delay: 0,
    }).to('.splitTextWrapper', {
        autoAlpha: 0,
        duration: .15,
        stagger: 0
    })
}

// handle if has enter
function initSplit() {
    if (hasEnter.value) {
        isSplitDone.value = true
    }
}

// btn on click
function btnOnclick() {
    let url = null;
    url = 'https://www.104.com.tw/';
    window.open(url, '_blank')?.focus();
}

// svg size
const svgSize = ref(26);
// prevent url bar resize
let currWidth = 0;


function svgOnresize(e: Event) {
    if (currWidth == window.innerWidth) return
    const width = (e.target as Window).innerWidth;
    if (width <= 768 && width > 576) {
        svgSize.value = 24;
    } else if (width <= 576) {
        svgSize.value = 22;
    } else {
        svgSize.value = 26;
    }
    currWidth = window.innerWidth;
}


onMounted(() => {
    startImgScrollTrigger();
    initSplit();
    window.addEventListener('resize', svgOnresize);
})

onUnmounted(() => {
    window.removeEventListener('resize', svgOnresize);
})

</script>

<style scoped lang="scss">
* {
    // outline: 1px solid black;
}

.hiringContainer {
    width: 100%;
    max-width: 1920px;
    height: calc(100vh - 12rem);
    // height: calc(100vh - 6rem);
    max-height: 920px;

    position: relative;

    margin-block: 6rem;
    margin-block: clamp(1rem, 0rem + 5vw, 6rem) 6rem;
    // padding-inline: 6rem;
    margin-inline: auto
}

.startImg {
    @include WnH(calc(100% - 12rem), 100%);
    width: 100%;
    display: flex;
    overflow: hidden;
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0rem;

    div {
        overflow: hidden;
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
    }

    img {
        width: 100%;
        max-width: none;
        object-fit: cover;
    }
}

@for $i from 0 through 7 {
    .imgWrapper#{$i} {
        clip-path: polygon(#{$i * 12.5} + "%" + " 0",
            #{$i * 12.5 + 12.5} + "%" + " 0",
            #{$i * 12.5 + 12.5} + "%" + " 100%",
            #{$i * 12.5} + "%" + " 100%",
        );
    }
}

.splitTextWrapper {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    z-index: 1;
    width: 100%;
    max-width: 100%;
    // height: 100%;
    padding-inline: 2rem;
    padding-inline: clamp(2rem, 0.8571428571428572rem + 5.714285714285714vw, 6rem);
    background-color: $primaryBacColor;
    display: flex;
    align-items: center;
    overflow: hidden;

    span {
        display: inline-block;
        flex: 1;
        font-size: 2rem;
        font-size: clamp(2rem, 0.8rem + 6vw, 8rem);
        font-variation-settings: 'wght' 600;
        color: $secondBacColor;
        text-align: center;

        &[data-content=' '] {
            flex: 0.75;
        }
    }
}

.showMain-enter-active,
.showMain-leave-active {
    transition: opacity .3s;
}

.showMain-enter-from,
.showMain-leave-to {
    opacity: 0;
}

.showMain-enter-to,
.showMain-leave-from {
    opacity: 1;
}

%logo_fontSize {
    font-size: 2rem;
    font-size: clamp(2rem, 0.5714285714285716rem + 7.142857142857142vw, 7rem);
}

%content_fontSize {
    font-size: 0.75rem;
    font-size: clamp(0.75rem, 0.5357142857142857rem + 1.0714285714285714vw, 1.5rem);
}

%btn_fontSize {
    font-size: 0.75rem;
    font-size: clamp(0.75rem, 0.5357142857142857rem + 1.0714285714285714vw, 1.5rem);
}

main {
    display: flex;
    align-items: center;
    width: 85%;
    height: 100%;
    margin: 0 auto;
    position: relative;
    // overflow: hidden;
}

.contentWrapper {
    // max-width: 50%;
    padding-left: 2.5%;
    position: relative;
    z-index: 1;
}

.content {
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
    user-select: none;

    p {
        @extend %content_fontSize;
        margin: 0;
        font-variation-settings: 'wght' 500;
    }

    span {
        @extend %logo_fontSize;
        font-family: "Mr Dafoe", cursive;
    }
}

@keyframes btnOutline {
    0% {
        outline: 2px solid $btnBacColor;
        outline-offset: 0;
    }
}

@keyframes arrowToRight {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

.btnWrapper {
    width: max-content;
    position: relative;
    margin-left: auto;
    // margin-right: 1rem;
    text-wrap: nowrap;

    button {
        @extend %btn_fontSize;

        padding-inline: 1.5rem 1.25rem;
        padding-block: .75rem;
        position: relative;
        border-radius: 1.5rem;
        font-variation-settings: 'wght' 700;
        color: $primaryBacColor;
        background-color: $btnBacColor;
        box-shadow: 0 0 4px 0 $btnBacColor;
        display: flex;
        align-items: center;

        &:hover {
            outline: 2px solid transparent;
            outline-offset: 4px;
            animation: btnOutline 1s;

            .iconWrapper {
                grid-template-columns: 1fr 1fr;

                &>div {
                    opacity: 1;
                    animation: arrowToRight 1.5s infinite;
                }

                &>div:nth-of-type(1) {
                    animation-delay: .4s;
                }

                &>div:nth-of-type(2) {
                    animation-delay: .8s;
                }

                &>div:nth-of-type(3) {
                    animation-delay: 1.2s;
                }
            }
        }
    }

    span {
        margin-right: .5rem;
    }
}

.iconWrapper {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 0fr;
    transition: grid-template-columns .5s;
    position: relative;
    width: 150%;

    &>div {
        // transition: opacity .5s;
    }

    &>div:not(:first-of-type) {
        position: absolute;
        top: 0;
        opacity: 0;
    }

    &>div:nth-of-type(2) {
        left: 25%;
    }

    &>div:nth-of-type(3) {
        left: 50%;
    }
}

.imgBc {
    --bacPosition: 50% 0%;
    // background:
    //     url('/imgs/Hiring/hiring.webp') no-repeat;
    // background-position: var(--bacPosition);
    // // background-position: 50% 0;
    // background-size: 100%;
    width: 100%;
    height: 100%;
    max-height: 100%;
    position: absolute;
    right: 0%;
    top: 50%;
    z-index: 0;

    transform: translate(0%, -50%);
    border-radius: 2rem;
    // overflow: hidden;
    box-shadow: 4px 4px 4px black;
    overflow: hidden;

    &::after {
        // content: '';
        // position: absolute;
        // left: -5%;
        // top: -5%;
        // width: 110%;
        // height: 110%;
        // background:
        //     linear-gradient(to right, $primaryBacColor 25%, transparent 100%);
    }

    &::before {
        content: '';
        background:
            url('/imgs/Hiring/hiring.webp') no-repeat;
        background-position: var(--bacPosition);
        // background-position: 50% 0;
        background-size: cover;
        mask-image: linear-gradient(to right, rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 1) 100%);
        width: 100%;
        height: 100%;
        max-height: 100%;
        position: absolute;
        left: 10%;
        top: 0%;
        z-index: 0;
    }

    img {
        // scale: 1.1;
        // transform: translate(-2%, 0%);
        border-radius: 2rem;
        position: absolute;
        left: 10%;
        z-index: 1;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: var(--bacPosition);
    }
}

@include XLarge {
    .hiringContainer {
        padding-inline: 6rem;
    }
}

@include large {
    .imgBc {
        // --bacPosition: 30% 0;
    }
}

@include medium($width: 1024px) {
    main {
        // width: 85%;
    }
}

@include medium {
    main {
        width: 100%;
    }

    .hiringContainer {
        height: calc(75vh - 12rem);
    }

    .imgBc {
        // --bacPosition: 20% 0;
        border-radius: 0;
    }

    .imgBc::after {
        background: linear-gradient(to right, #FCFAF2 30%, transparent 100%);
    }

    .contentWrapper {
        padding-left: 3rem;
    }

    .btnWrapper button {
        padding-inline: 1rem .75rem;
        padding-block: .75rem;
    }

    .btnWrapper span {
        margin-right: .25rem;
    }

    .content {
        margin-bottom: 1.25rem;
    }
}

@include small {
    .hiringContainer {
        height: calc(60vh - 12rem);
    }

    .imgBc::after {
        background: linear-gradient(to right, #FCFAF2 30%, transparent 100%);
    }

    .contentWrapper {
        padding-left: 2rem;
    }

    .btnWrapper button {
        padding-inline: 1rem .5rem;
        padding-block: .5rem;
    }

    .btnWrapper span {
        margin-right: 0;
    }

    .content {
        margin-bottom: .75rem;
    }
}

@include small($width: 430px) {
    .imgBc {
        // --bacPosition: 40% 0;
    }
}

@include small($width: 430px) {}
</style>