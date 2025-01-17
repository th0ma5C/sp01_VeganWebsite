<template>
    <div class="item" ref="productEl" v-if="item">
        <div :class="imgClass"
            @click="routerPush(item.name ?? '')">
            <img :src="item.fileName ?? ''" alt="商品"
                ref="itemImg">
            <p>{{ item.price }}元</p>
            <div class="description">
                <span>{{ item.description }}</span>
            </div>
        </div>
        <h3>{{ item.name }}</h3>
        <div class="ingredients">
            <span v-for="(el) in item.ingredients"
                :key="el">
                {{ el }}
            </span>
        </div>
        <div class="btnWrapper" ref="btnWrapper">
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
        <Teleport :to="'.flyToCartContainer'">
            <div class="flyToCart" ref="flyToCartEl"
                v-if="destinationPoint">
                <img :src="flyToCartImg" alt="">
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, watch, inject, onMounted } from 'vue';
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
    flightDelay?: number
}
const { item, cartEl, flightDelay } = defineProps<Props>();

const destinationPoint = computed(() => {
    return cartEl ?? headerCart.value
})

// const MenuStore = useMenuStore();
// MenuStore.$subscribe((_, state) => {
//     if (state.isLoaded) {
//         // let { name, date } = item.value;
//         // console.log(name);
//     }
// })
// watch(() => item, (nVal) => {
//     console.log(nVal);
// }, { immediate: true })

// 提供DOM狀態
const productEl = ref();
defineExpose({ productEl });

// 路由跳轉
const router = useRouter();

function routerPush(name: string, id?: string) {
    router.push({
        name: 'Product',
        query: {
            name,
        },
    })
}

// img class
const imgClass = computed(() => {
    return item.category == 'salad' ? 'menuImg' : 'smoothiesImg'
})



// 飛入購物車
const cartBtnEl = ref<HTMLElement | null>(null);
const flyToCartEl = ref<HTMLElement | null>(null);
const flyToCartImg = ref('');
const isFlying = ref(false);
gsap.registerPlugin(MotionPathPlugin);

const cartBtnElCoord = computed(() => {
    if (!cartBtnEl.value) return
    const { left, top, width, height } = cartBtnEl.value.getBoundingClientRect();
    const originCoord = {
        x: (left + width / 2) - 73,
        y: (window.scrollY + top + height / 2) - 25
    }
    return originCoord
})

function getCartElCoord() {
    if (!destinationPoint.value) return
    const { left, top, width } = destinationPoint.value.getBoundingClientRect();

    const targetCoord = {
        x: left + (width / 2) - (48 + 25), //padding + width/2,
        y: window.scrollY + top,
    }
    return targetCoord
}

function initTakeoffPoint() {
    const { x = 0, y = 0 } = cartBtnElCoord.value ?? {}

    gsap.set(flyToCartEl.value, {
        x: x,
        y: y,
        scale: 1,
        opacity: 1,
    });
    flyToCartImg.value = item.fileName ?? '';
}

function flyToCart() {
    if (!cartBtnElCoord.value) return;
    isFlying.value = true;
    initTakeoffPoint();
    const { x: originX = 0, y: originY = 0 } = cartBtnElCoord.value ?? {}
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

async function addCart() {
    if (isFlying.value) return;
    try {
        emitEvent();
        if (flightDelay) await delayFlying();
        // nextTick(() => {
        flyToCart();
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

</script>

<style scoped lang="scss">
.item {
    @include flex-center-center;
    flex-direction: column;
    // gap: 1rem;
    width: fit-content;

    .menuImg {
        @include flex-center-center;
        @include WnH(250px);
        background: no-repeat url('@assets/img/Menu/bac_wood.jpg') center/contain;
        // border-radius: 3rem 40% 1rem 1rem;
        cursor: pointer;
        border-radius: 2.5rem;
        position: relative;
        // margin-top: 1rem;
        // overflow: hidden;

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
            // display: block;
            position: absolute;
            right: -1px;
            bottom: -1px;
            z-index: 2;
            text-align: center;
            line-height: 35px;
            font-variation-settings: 'wght' 700;
            color: $secondBacColor;
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

        &:hover {
            img {
                // scale: 1.1;
                transform: scale(1.1);
            }

            .description {
                opacity: 1;
            }
        }
    }

    .smoothiesImg {
        @extend .menuImg;
        background: none;
        overflow: hidden;
        border-radius: 2.5rem 2.5rem 0 2.5rem;
        // filter: drop-shadow(4px 4px 4px black);

        img {
            @include WnH(100%);
            filter: none;
        }
    }

    &>h3 {
        font-size: 1.5rem;
        font-variation-settings: 'wght' 600;
        color: $secondBacColor;
        margin-top: 0.5rem;
    }

    .ingredients {
        width: 90%;
        display: grid;
        grid-template-columns: 30% 30% 30%;
        justify-content: center;
        justify-items: center;
        gap: 3px;
        border-radius: 8px;
        overflow: hidden;
        margin-top: 0.5rem;
        // position: relative;


        span {
            @include WnH(100%, 24px);
            // border: 2px solid $primaryBacColor;
            background-color: $btnBacColor_light;
            color: $primaryBacColor;
            display: inline-block;
            font-size: 14px;
            font-variation-settings: 'wght' 500;
            line-height: 24px;
            text-align: center;

            &:nth-of-type(1) {
                border-radius: 0.5rem 0 0 0;
            }

            &:nth-of-type(3) {
                border-radius: 0 0.5rem 0 0;
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
            grid-column: span 1;
            grid-row: span 1;
        }

        &>span:nth-child(6)~ ::after {
            display: none;
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
        // border: 1px solid rgb(0, 0, 0, 0.25);
        border-radius: 8px;
        box-shadow: 2px 2px 8px rgb(0, 0, 0, 0.5);
        z-index: 0;
        margin-top: 1.25rem;

        * {
            // border: 1px solid black;
        }

        &>button {
            width: 50%;
            overflow: hidden;
            transition: color 0.3s ease;
            font-variation-settings: 'wght' 500;

            &:hover {
                color: $primaryBacColor;
            }
        }

        .cart-btn {
            color: $primaryBacColor;
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

        .btnBackground {
            transform: translateY(-15%);
            position: absolute;
            z-index: -1;


            g>* {
                fill: $btnBacColor;
                // transition: scale 0.5s ease, transform 0.5s ease;
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
    // background-color: red;
}
</style>