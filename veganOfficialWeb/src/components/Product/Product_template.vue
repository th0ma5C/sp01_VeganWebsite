<template>
    <div class="item" ref="productEl" v-if="item">
        <transition name="skeleton">
            <div class="skeleton" v-show="isImgLoading">
                <div class="top"></div>
                <div class="bot">
                    <div></div>
                    <div></div>
                </div>
                <div class="scanner"></div>
            </div>
        </transition>
        <div :class="imgClass"
            @click="routerPush(item.name ?? '')">
            <img :src="item.fileName ?? ''" alt="商品"
                ref="itemImg" @load="imgLoaded">
            <p>{{ item.price }}元</p>
            <div class="description">
                <span>{{ item.description }}</span>
            </div>
        </div>
        <h3>{{ item.name }}</h3>
        <div class="ingredients">
            <span v-for="(el) in item.ingredients" :key="el"
                :title="el">
                {{ el }}
            </span>
        </div>
        <div class="btnWrapper" :style="{
            boxShadow: isImgLoading ? 'none' : ' 2px 2px 8px rgb(0, 0, 0, 0.5)'
        }">
            <button class="cart-btn" ref="cartBtnEl"
                @click="addCart">
                加入購物車
            </button>
            <button class="info-btn"
                @click="routerPush(item.name!)">詳細資訊</button>
            <div class="btnBackground">
                <svg width="260" height="48"
                    viewBox="0 0 260 48" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <g id="btnBac" filter="url('#btn')">
                        <rect id="center" y="21"
                            width="117.52" height="6"
                            fill="currentColor" />
                        <path id="left"
                            d="M0 0H26.5417H53.0833H79.625H117.553L130 48H0V0Z"
                            fill="currentColor" />
                        <path id="right"
                            d="M260 48L233.458 48L206.917 48L180.375 48L142.447 48L130 4.93616e-06L260 1.5864e-05L260 48Z"
                            fill="currentColor" />
                    </g>
                    <filter id="btn">
                        <feGaussianBlur in="SourceGraphic"
                            result="blur"
                            stdDeviation="5" />
                        <feColorMatrix in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                            result="btn" />
                    </filter>
                </svg>
            </div>
        </div>
        <div class="btnWrapper mobileBtn" :style="{
            boxShadow: isImgLoading ? 'none' : ' 2px 2px 8px rgb(0, 0, 0, 0.5)'
        }">
            <button class="cart-btn" ref="mobileCartBtnEl"
                @click="addCart">
                加入購物車
            </button>
            <button class="info-btn"
                @click="routerPush(item.name!)">
                詳細資訊
            </button>
        </div>
        <Teleport :to="'.flyToCartContainer'" :defer="true">
            <div class="flyToCart" ref="flyToCartEl"
                v-if="destinationPoint">
                <img :src="flyToCartImg" alt="">
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, watch, inject, onMounted, useTemplateRef, onUpdated } from 'vue';
import type { Ref } from 'vue';
import type { MenuItem } from '@/api/menu/type';
import { useRouter } from 'vue-router';
import { useMenuStore } from '@/store/menuStore';
import { storeToRefs } from 'pinia';
import gsap from 'gsap';
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useCartStore } from '@/store/cartStore';
import emitter from '@/utils/eventBus';

// 購物車state
const cartStore = useCartStore();
const { addItemToCart } = cartStore;
const { headerCart } = storeToRefs(cartStore)


//接收菜單數據 
interface Props {
    item: MenuItem,
    cartEl?: HTMLElement | undefined,
    flightDelay?: number,
    flyToCartDisError?: number
}
const { item, cartEl, flightDelay, flyToCartDisError = 0 } = defineProps<Props>();

const destinationPoint = computed(() => {
    return cartEl ?? headerCart.value
})

// 提供DOM狀態
const productEl = useTemplateRef('productEl');
defineExpose({ productEl });

// 路由跳轉
const router = useRouter();

function routerPush(name: string, id?: string) {
    router.push({
        path: '/product',
        query: {
            name,
        },
    })
}

// img class
const imgClass = computed(() => {
    return item.category == 'salad' ? 'menuImg' : 'smoothiesImg'
})

// 訂閱nav event
// const hideNav = ref(false);
// const isFlightDelay = ref(0)
// emitter.on('navEvent', (e) => {
//     isFlightDelay.value = e as boolean
//     hideNav.value = e as boolean;
// })


// 飛入購物車
const cartBtnEl = useTemplateRef('cartBtnEl');
const mobileCartBtnEl = useTemplateRef('mobileCartBtnEl');
const flyToCartEl = useTemplateRef('flyToCartEl');
const flyToCartImg = ref('');
const isFlying = ref(false);
gsap.registerPlugin(MotionPathPlugin);

// const cartBtnElCoord = computed(() => {
//     if (!cartBtnEl.value || !mobileCartBtnEl.value) return
//     const vw = document.documentElement.innerHTML;
//     const target = Number(vw) <= 768 ? mobileCartBtnEl.value : cartBtnEl.value;
//     const { left, top, width, height } = target.getBoundingClientRect();
//     const originCoord = {
//         x: (left + width / 2) - 73,
//         y: (window.scrollY + top + height / 2) - 25
//     }
//     return originCoord
// })

function getBtnCoord(target: HTMLElement) {
    // if (!cartBtnEl.value) return
    const { left, top, width, height } = target.getBoundingClientRect();
    const originCoord = {
        x: (left + width / 2) - 73,
        y: (window.scrollY + top + flyToCartDisError + height / 2) - 25
    }
    return originCoord
}

function getCartElCoord() {
    if (!destinationPoint.value) return
    const { left, top, width } = destinationPoint.value.getBoundingClientRect();

    const targetCoord = {
        x: left + (width / 2) - (48 + 25), //padding + width/2,
        y: window.scrollY + top + flyToCartDisError,
    }
    return targetCoord
}

function initTakeoffPoint(target: HTMLElement) {
    const { x = 0, y = 0 } = getBtnCoord(target) ?? {}

    gsap.set(flyToCartEl.value, {
        x: x,
        y: y,
        scale: 1,
        opacity: 1,
    });
    flyToCartImg.value = item.fileName ?? '';
}

function flyToCart(target: HTMLElement) {
    // if (!cartBtnElCoord.value) return;
    isFlying.value = true;
    initTakeoffPoint(target);
    const { x: originX = 0, y: originY = 0 } = getBtnCoord(target) ?? {}
    const { x: targetX = 0, y: targetY = 0 } = getCartElCoord() ?? {};

    const inflectX = originX < targetX ? 50 : -50;

    gsap.to(flyToCartEl.value, {
        duration: .5,
        opacity: 0,
        scale: .3,
        motionPath: {
            path: [
                { x: originX, y: originY },
                {
                    x: originX + inflectX,
                    y: originY - 50
                },
                { x: targetX, y: targetY }
            ],
            curviness: 1,
        },
        ease: "power1.inOut",
        onComplete: () => {
            isFlying.value = false;
            gsap.set(flyToCartEl.value, {
                clearProps: 'all'
            })
        }
    });
}

async function delayFlying() {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, (flightDelay ?? 0) * 1000)
    })
}

async function addCart(e: Event) {
    if (isFlying.value) return;
    try {
        emitEvent();
        if (flightDelay) await delayFlying();
        // nextTick(() => {
        flyToCart(e.target as HTMLElement);
        addItemToCart(item);
        // })
    } catch (error) {
        console.log(error);
    }
}

// 展開header
function emitEvent() {
    emitter.emit('sendIcon');
}

// skeleton
const isImgLoading = ref(true);
function imgLoaded() {
    isImgLoading.value = false
}

</script>

<style scoped lang="scss">
* {
    // outline: 1px solid black
}

.item {
    @include flex-center-center;
    flex-direction: column;
    width: fit-content;
    height: fit-content;
    position: relative;

    &>h3 {
        font-size: 1rem;
        font-size: clamp(1rem, 0.8571428571428572rem + 0.7142857142857143vw, 1.5rem); // font-size: 1.5rem;
        font-variation-settings: 'wght' 600;
        color: $secondBacColor;
        margin-top: 0.5rem;
    }
}

.menuImg {
    @include flex-center-center;
    @include WnH(250px);
    background: no-repeat url('@assets/img/Menu/bac_wood.jpg') center/contain;
    cursor: pointer;
    border-radius: 2.5rem;
    position: relative;

    img {
        @include WnH(85%);
        filter: drop-shadow(4px 4px 4px black);
        transition: transform 0.15s linear;
        transform-origin: center;
    }

    p {
        @include WnH(60px, 35px);
        background: $primaryBacColor;
        border-radius: 0.5rem 0 0 0;
        position: absolute;
        right: -1px;
        bottom: -1px;
        z-index: 2;
        text-align: center;
        line-height: 35px;
        font-variation-settings: 'wght' 700;
        color: $secondBacColor;
    }

    &:hover {
        img {
            transform: scale(1.1);
        }

        .description {
            opacity: 1;
        }
    }
}

.description {
    @include WnH(100%);
    @include flex-center-center;
    color: $primaryBacColor;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 2.5rem;
    opacity: 0;
    transition: opacity 0.3s ease;

    span {
        padding: 1rem;
    }
}

.smoothiesImg {
    @extend .menuImg;
    background: none;
    overflow: hidden;
    border-radius: 2.5rem 2.5rem 0 2.5rem;

    img {
        @include WnH(100%);
        filter: none;
    }
}



.ingredients {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 33%);
    justify-content: center;
    justify-items: center;
    column-gap: 3px;
    border-radius: 8px;
    overflow: hidden;
    margin-top: 0.5rem;

    span {
        @include WnH(100%, 24px);
        background-color: $btnBacColor_light;
        color: $primaryBacColor;
        display: inline-block;
        font-size: 14px;
        font-variation-settings: 'wght' 500;
        line-height: 24px;
        text-align: center;
        // padding-inline: .25rem;

        &:nth-of-type(1) {
            border-radius: 0.5rem 0 0 0;
            margin-bottom: 3px;
        }

        &:nth-of-type(2) {
            margin-bottom: 3px;
        }

        &:nth-of-type(3) {
            border-radius: 0 0.5rem 0 0;
            margin-bottom: 3px;
        }

        &:nth-of-type(4) {
            border-radius: 0 0 0 .5rem;
        }

        &:nth-of-type(6) {
            border-radius: 0 0 .5rem 0;
        }
    }

    &::after {
        @include WnH(100%);
        content: '';
        background-color: $btnBacColor_light;
        border-radius: 0 0 .5rem 0;
        // grid-column: span 1;
        // grid-row: span 1;
    }

    &>span:nth-child(6)~ ::after {
        // display: none;
    }
}

.btnWrapper {
    display: flex;
    justify-content: center;
    white-space: nowrap;
    width: 100%;
    height: 32px;
    overflow: hidden;
    position: relative;
    border-radius: 8px;
    // box-shadow: 2px 2px 8px rgb(0, 0, 0, 0.5);
    z-index: 0;
    margin-top: 1.25rem;
    transition: box-shadow .3s;

    &>button {
        width: 50%;
        overflow: hidden;
        transition: color 0.3s ease;
        font-variation-settings: 'wght' 500;

        &:hover {
            color: $primaryBacColor;
        }
    }

    &:has(.info-btn:hover) {

        &>.cart-btn {
            color: black;
        }

        &>.btnBackground {

            #center {
                transform: translateX(137px);
            }

            #left {
                scale: 0;
            }

            #right {
                scale: 1;
            }
        }
    }
}

.cart-btn {
    color: $primaryBacColor;
}

.btnBackground {
    transform: translateY(-15%);
    position: absolute;
    z-index: -1;

    g>* {
        fill: $btnBacColor;
        transform-origin: center;
    }

    #right {
        scale: 0;
        transition: scale 0.4s ease-in-out;
    }

    #center {
        transition: transform 0.5s ease-in-out;
    }

    #left {
        transition: scale 0.4s ease-in-out;
    }

}


.flyToCart {
    @include WnH(50px);
    pointer-events: none;
    opacity: 0;
    position: absolute;
    left: 3rem;
    top: 0;
    z-index: 100;
    border-radius: 25px;
    overflow: hidden;
}

.mobileBtn {
    display: none;
}

.skeleton {
    position: absolute;
    top: 0;
    background-color: $primaryBacColor;
    width: 100%;
    height: 100%;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    overflow: hidden;
    pointer-events: none;
    border-radius: 1rem 1rem 8px 8px;

    .top {
        width: 100%;
        aspect-ratio: 1 / 1;
        background-color: rgba(62, 163, 80, 0.2);
        border: 2px solid $btnBacColor_light;
        border-radius: 1rem;
    }

    .bot {
        width: 100%;
        aspect-ratio: 2.5 / 1;
        background-color: rgba(62, 163, 80, 0.2);
        border: 2px solid $btnBacColor_light;
        border-radius: 8px;
    }

    .scanner {
        pointer-events: none;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: linear-gradient(115deg, transparent 40%, #FCFAF2 50%, transparent 52%);
        animation: loading 2.5s infinite ease-in;
    }
}

@keyframes loading {
    0% {
        translate: -100% 0;
    }

    100% {
        translate: 110% 0;
    }
}

.skeleton-leave-active {
    transition: opacity .3s
}

.skeleton-leave-to {
    opacity: 0;
}

.skeleton-leave-from {
    opacity: 1;
}


@include medium {
    .menuImg {
        @include WnH(200px);
    }

    .menuImg {
        border-radius: 2rem;
    }

    .description {
        border-radius: 2rem;
    }

    .ingredients {
        span {
            font-size: 13px;
        }
    }

    .btnWrapper {
        &>button {

            &:is(.info-btn):hover {
                color: black;
            }
        }

        &:has(.info-btn:hover) {
            &>.cart-btn {
                color: $primaryBacColor;
            }

            &>.btnBackground {
                #center {
                    transform: none;
                }

                #left {
                    scale: 1;
                }

                #right {
                    // scale: 0;
                }
            }
        }



        &:has(.cart-btn:active) {
            &>.btnBackground {
                #left {
                    filter: brightness(0.6);
                }
            }
        }

        &:has(.info-btn:active) {
            &>.btnBackground {
                #right {
                    filter: brightness(0.8);
                }
            }
        }
    }

    .btnBackground {
        #left {
            transition: filter .15s;
        }

        #center {
            display: none;
        }

        #right {
            transition: filter .15s;
            scale: 1;
            fill: $primaryBacColor;
        }


    }

    .btnWrapper {
        display: none;
    }

    .mobileBtn {
        display: flex;
        align-items: center;
        // flex-direction: column;
        // gap: .5rem;
        margin-top: 1rem;
        height: max-content;
        box-shadow: none;
        // overflow: visible;
        box-shadow: 2px 2px 8px rgb(0, 0, 0, 0.5);

        button {
            // width: max-content;
            padding-block: .25rem;
            // border-radius: .5rem;
            // transition: translate .15s;
            user-select: none;

            &:active {
                // translate: 2px 2px;
            }
        }

        &:has(.cart-btn:active) {
            &::before {
                filter: brightness(.6);
            }
        }

        &:has(.info-btn:active) {
            &::after {
                filter: brightness(.8);
            }
        }

        &::before {
            content: '';
            position: absolute;
            left: 0%;
            top: 0;
            width: 55%;
            height: 100%;
            z-index: -1;
            border-bottom: 32px solid $btnBacColor;
            border-right: 8px solid transparent;
        }

        &::after {
            content: '';
            position: absolute;
            right: -2.5%;
            top: 0;
            width: 55%;
            height: 100%;
            z-index: -1;
            border-top: 32px solid $primaryBacColor;
            border-left: 8px solid transparent;
        }

        .cart-btn {
            background-color: transparent;
            position: relative;
            z-index: 1;

        }

        .info-btn {
            padding-inline: .5rem;
            position: relative;
            z-index: 0;
        }
    }

    .description {
        display: none;
    }
}

@include small {
    .ingredients {
        span {
            font-size: 12px;
        }
    }

    .menuImg {
        @include WnH(180px);
        border-radius: 1.5rem;
    }

    .description {
        border-radius: 1.5rem;
    }

    .btnWrapper {
        font-size: 14px;
        margin-top: .75rem;
    }
}

@include small($width: 430px) {
    .menuImg {
        @include WnH(155px);
    }

    .menuImg p {
        width: 45px;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
    }

    .btnWrapper {
        font-size: 14px;
    }

    .ingredients {
        grid-template-columns: repeat(2, 1fr);

        span {
            height: 20px;
            line-height: 20px;

            &:nth-of-type(1) {
                border-radius: .5rem 0 0 0;
            }

            &:nth-of-type(2) {
                border-radius: 0 .5rem 0 0;
            }

            &:nth-of-type(3) {
                border-radius: 0;
            }

            &:nth-of-type(4) {
                border-radius: 0;
            }

            &:nth-of-type(5) {
                border-radius: 0 0 0 .5rem;
            }

            &:nth-of-type(6) {
                border-radius: 0 0 .5rem 0;
            }
        }
    }

    .mobileBtn {
        margin-top: .5rem;
    }
}

@include small($width: 375px) {
    .menuImg {
        @include WnH(140px);
    }

    .menuImg {
        border-radius: 1rem;
    }

    .description {
        border-radius: 1rem;
    }

    .menuImg p {
        width: 40px;
        height: 27px;
        line-height: 30px;
        font-size: 14px;
    }

    .btnWrapper {
        font-size: 12px;
    }

    .mobileBtn {
        gap: .25rem;
    }
}

@include small($width: 320px) {
    .menuImg {
        @include WnH(135px);
    }
}
</style>