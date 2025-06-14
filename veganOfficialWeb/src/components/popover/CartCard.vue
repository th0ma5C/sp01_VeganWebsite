<template>
    <transition name="CartCard" @after-leave="allowClick">
        <div v-show="isCartCardOpen" class="cartContainer"
            @click="closeDrawer">
            <div class="drawer" @click.stop>
                <div class="topTitle">
                    <h1>
                        購物車
                    </h1>
                    <SvgIcon class="cancelBtn" name="cancel"
                        width="24px" height="24px"
                        color="black" @click="closeDrawer">
                    </SvgIcon>
                </div>

                <!-- <div class="shipDiscount" :style="{
                    opacity: cartCounter ?? 0
                }">
                    再消費 $999 即可免運
                </div> -->

                <div class="itemWrapper">
                    <transition name="emptyList">
                        <div class="emptyList"
                            v-if="!cartCounter">
                            購物車是空的
                        </div>
                    </transition>

                    <transition-group name="item">
                        <div class="item"
                            v-for="(item, key) in showCartItemList"
                            :key="key">
                            <div class="imgWrapper" :class="{
                                saladBg: item.category == 'salad'
                            }">
                                <img :src="item.imgUrl"
                                    alt="商品">
                            </div>

                            <div class="details">
                                <h3>{{ key }}</h3>
                                <small>${{ item.price
                                    }}</small>
                            </div>

                            <div class="itemSubtotal">
                                <div class="counterWrapper">
                                    <OrderCounter
                                        v-model:amount="item.amount">
                                    </OrderCounter>

                                    <SvgIcon
                                        @click="DEL_cartItem(key as string)"
                                        class="DELicon"
                                        name="Delete"
                                        height="24px"
                                        width="24px"
                                        color="black">
                                    </SvgIcon>
                                </div>

                                <div class="price">
                                    <small>小計</small>
                                    <span>${{ item.amount *
                                        item.price }}</span>
                                </div>
                            </div>
                        </div>
                    </transition-group>

                </div>

                <div class="botWrapper">
                    <div class="orderSubtotal">
                        <small class="discountNotice">
                            <span v-if="!userStore.isAuth">
                                <router-link
                                    to="/profile/signup"
                                    @click="closeDrawer">加入會員</router-link>享首購優惠
                            </span>
                            <span v-else>
                                <a href=""
                                    @click.prevent="copyShareLink">社群分享</a>送購物金
                            </span>
                            <span class="popup"
                                ref="popupRef">
                                連結已複製
                            </span>
                        </small>

                        <p class="amount">
                            <span>小計</span>
                            <span>
                                ${{ cartTotalPrice }}
                            </span>
                            <span :class="discountClass">
                                達折扣門檻！
                            </span>
                        </p>

                        <small class="amountNotice">
                            ( 尚未包含運費 )
                        </small>
                    </div>

                    <div class="checkout" :class="{
                        disable: !cartCounter
                    }" @click="clickCheckout">
                        <button @click="goCheckoutPage">
                            結帳
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </transition>
</template>

<script setup lang="ts">
import OrderCounter from '../OrderCounter/OrderCounter.vue';
import { useCartStore } from '@/store/cartStore';
import { storeToRefs } from 'pinia';
import { computed, onMounted, watch, ref, watchEffect, useTemplateRef } from 'vue';
import type { MenuItem } from "@/api/menu/type";
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/userStore';
import { useToastStore } from '@/store/toastStore';
import { gsap } from 'gsap/gsap-core';


const cartStore = useCartStore();
const { isCheckingOut, isCartCardOpen, cartMap, cartCounter, cartTotalPrice } = storeToRefs(cartStore);
const { toggleCartCardOpen, DELItemFromCart, initCart, toggleIsCheckout } = cartStore;

const toastStore = useToastStore();

const showCartItemList = computed(() => {
    return cartMap.value
});

// watch(showCartItemList.value, (nVal) => {
//     setCartToStorage()
//     // console.log(nVal);
// })
// watchEffect(() => {
//     if (showCartItemList.value) {
//         setCartToStorage()
//     }
// })


// 點擊關閉
const isAnimating = ref(false);
function allowClick() {
    isAnimating.value = false
}

function closeDrawer() {
    if (isAnimating.value) return
    isAnimating.value = true;
    toggleCartCardOpen()
}

// 刪除item
function DEL_cartItem(target: string) {
    DELItemFromCart(target);
}


// checkout btn
function clickCheckout() {
    if (!cartCounter.value) return
}

// 折扣提示
const discountClass = computed(() => {
    if (cartCounter.value && cartCounter.value >= 7) {
        return 'exceed'
    } else {
        return 'under'
    }
})

// 超過上限提示

// 路由
const router = useRouter();
function goCheckoutPage() {
    // if (!cartCounter.value || isAnimating.value) return
    isCheckingOut.value = true
    closeDrawer()
    toggleIsCheckout()
    router.push('/checkout');
}

// user store
const userStore = useUserStore();

// share link
const popupRef = useTemplateRef('popupRef');
const link = import.meta.env.VITE_API_BASE_URL;
async function copyShareLink() {
    try {
        await navigator.clipboard.writeText(link);
        gsap.fromTo(popupRef.value,
            {
                yPercent: 0,
                autoAlpha: 0,
            },
            {
                autoAlpha: 1,
                yPercent: -75,
                opacity: 1,
                duration: .3,
                onComplete: () => {
                    gsap.to(popupRef.value, {
                        duration: .3,
                        delay: .5,
                        autoAlpha: 0,
                        yPercent: 0
                    })
                }
            }
        )
        return
    } catch (error) {
        console.log(error);
    }
}

// 免運提示
const freeFrightFeeLimit = 7;
const freeFrightFeeGap = computed(() => {
    const gap = ((cartCounter.value ?? 0) - freeFrightFeeLimit)
    return gap
})

onMounted(() => {
    initCart();
})
</script>

<style scoped lang="scss">
* {
    // outline: 1px solid black;
}

.cartContainer {
    @include WnH(100%);
    position: fixed;
    z-index: 100;
    right: 0;
    top: 0%;
    background-color: rgba(0, 0, 0, 0.25);

    display: flex;
    justify-content: flex-end;
}

.drawer {
    // @include WnH('fit-content', 100%);
    height: 100%;
    width: clamp(320px, 100%, 400px);
    background-color: $primaryBacColor;
    padding: 1.5rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;

    &>div {
        width: 100%;

        &:not(:first-of-type) {
            margin-top: 1.5rem;
        }
    }
}

.topTitle {
    position: relative;

    h1 {
        text-align: center;
        font-size: 2rem;
    }

    .cancelBtn {
        @include absoluteCenterTLXY($left: 100%, $X: -100%);
        cursor: pointer;
        opacity: .3;
        transition: opacity .2s ease;

        &:hover {
            opacity: 1;
        }
    }
}

.shipDiscount {
    text-align: center;
}



.itemWrapper {
    // border: 1px solid black;
    flex: 1;
    overflow-y: scroll;
    overflow-y: auto;
    padding-right: .5rem;
    position: relative;

    scrollbar-width: thin;
    scrollbar-gutter: stable;
    overflow-x: hidden;

    .emptyList {
        font-size: .75rem;
        text-align: center;
        opacity: .5;
        position: absolute;
        left: 50%;
        top: 0;
        transform: translateX(calc(-50%));
    }

    .emptyList-enter-active,
    .emptyList-leave-active {
        transition: opacity .15s .5s ease;
    }

    .emptyList-enter-from,
    .emptyList-leave-to {
        opacity: 0;
    }

    .emptyList-enter-to,
    .emptyList-leave-from {
        opacity: .5;
    }


    .item {
        background-color: $primaryBacColor_dark;
        border-radius: 1rem;
        padding: .5rem;
        display: grid;
        grid-template:
            "a b b" auto
            "a c c" auto
            / 1fr 1fr 1fr;
        align-items: center;
        gap: .5rem;
        margin-bottom: 1rem;

        &>div {
            display: flex;
        }

        .imgWrapper {
            @include WnH(100px);
            border-radius: .5rem;
            grid-area: a;
            overflow: hidden;
            justify-self: center;

            img {
                @include WnH(100%);
            }
        }

        .saladBg {
            background: no-repeat url('@assets/img/Menu/bac_wood.jpg') center/contain;
        }

        .details {
            flex-direction: column;
            grid-area: b;

            h3 {
                font-variation-settings: 'wght' 500;
            }
        }

        .itemSubtotal {
            grid-area: c;
            justify-content: space-between;

            .counterWrapper {
                display: flex;
                align-items: center;
                flex-direction: row;
                gap: 1rem;
                // padding: 0 .25rem;

                &:deep(input) {
                    background-color: $primaryBacColor_dark;
                    width: 25px;
                }

                .DELicon {
                    cursor: pointer;
                    opacity: .5;

                    &:hover {
                        opacity: 1;
                    }
                }
            }

            .price {
                display: flex;
                flex-direction: column;

                small {
                    font-size: 40%;
                    user-select: none;
                }

                span {
                    font-size: 1rem;
                    font-variation-settings: 'wght' 500;
                }
            }
        }
    }

    &::-webkit-scrollbar {
        display: none;
        // width: 4px;
    }

    &::-webkit-scrollbar-thumb {
        // background-color: red;
        // border-radius: 100px;
    }
}

.botWrapper {
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: -.5rem;
        left: 0;
        height: 2px;
        width: 100%;
        background-color: $secondBacColor;
        border-radius: 2px;
    }

    .orderSubtotal {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        background-color: $primaryBacColor;
    }

    .discountNotice {
        position: relative;
        width: max-content;
        z-index: 0;

        a {
            text-decoration: underline;
            text-underline-offset: 2px;

            &:hover {
                color: blue;
            }
        }

        span:not(.popup) {
            background-color: $primaryBacColor;
        }
    }

    .popup {
        user-select: none;
        position: absolute;
        top: -50%;
        left: 50%;
        translate: -50% 0;
        background-color: $primaryBacColor;
        text-wrap: nowrap;
        padding: .25rem;
        border-radius: .25rem;
        font-variation-settings: 'wght' 500;
        outline: 1px solid gray;
        visibility: hidden;
        z-index: -1;
    }

    .amount {
        background-color: $primaryBacColor;
        position: relative;
        display: flex;
        justify-content: space-between;
        font-size: 1.25rem;
        font-variation-settings: 'wght' 500;

        &>span:nth-child(3) {
            font-size: .8rem;
            // line-height: 30px;
            color: red;
            position: absolute;
            right: 0;
            top: -22px;
            overflow: hidden;
            // transform: translateY(100%);
            transition: opacity .3s ease;
        }

        .exceed {
            animation: bounceIn .5s;
        }

        .under {
            opacity: 0;
        }
    }

    .amountNotice {
        font-variation-settings: 'wght' 400;
        display: block;
        text-align: right;
    }
}

.checkout {
    margin-top: 1.5rem;
    padding: 0;

    button {
        @include WnH(100%, 48px);
        background-color: $btnBacColor_light;
        border: 1px solid $btnBacColor;
        border-radius: 1rem;
        color: $primaryBacColor;
        font-size: 1.5rem;
        font-variation-settings: 'wght' 500;
        line-height: 48px;
        transition: box-shadow .3s ease;

        &:hover {
            box-shadow: 0 0 0 1px $btnBacColor;
        }
    }
}

.disable>button {
    cursor: not-allowed;

    &:hover {
        box-shadow: none;
    }
}

.CartCard-enter-active,
.CartCard-leave-active {
    transition: background-color .3s .3s ease;

    .drawer {
        transition: transform .3s ease-in-out;
    }
}

.CartCard-enter-from,
.CartCard-leave-to {
    background-color: rgba(0, 0, 0, 0);

    .drawer {
        transform: translateX(100%);
    }
}

.CartCard-enter-to,
.CartCard-leave-from {
    background-color: rgba(0, 0, 0, 0.25);

    .drawer {
        transform: translateX(0%);
    }
}

.item-move,
.item-enter-active,
.item-leave-active {
    transition: transform .5s ease, opacity .3s ease;
}

.item-leave-active {
    width: calc(100% - .5rem);
    position: absolute;
}

.item-enter-from,
.item-leave-to {
    transform: translateX(100%);
    opacity: 0;
}

.item-enter-to,
.item-leave-from {
    transform: translateX(0%);
    opacity: 1;
}

@keyframes bounceIn {

    0%,
    20%,
    40%,
    60%,
    80%,
    100% {
        animation-timing-function: ease-out;
    }

    0% {
        opacity: 0;
        transform: scale(0.3);
    }

    20% {
        transform: scale(1.1);
    }

    40% {
        transform: scale(0.9);
    }

    60% {
        opacity: 1;
        transform: scale(1.03);
    }

    80% {
        transform: scale(0.97);
    }

    100% {
        transform: scale(1);
    }
}

@include small {
    .drawer {
        width: 100%;
    }
}
</style>