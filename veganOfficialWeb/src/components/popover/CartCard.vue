<template>
    <transition name="CartCard">
        <div v-show="isCartCardOpen" class="cartContainer"
            @click="clickOuter">
            <div class="drawer" @click.stop>
                <div class="topTitle">
                    <h1>
                        購物車
                    </h1>
                    <SvgIcon class="cancelBtn" name="cancel"
                        width="24px" height="24px"
                        color="black"
                        @click="toggleCartCardOpen">
                    </SvgIcon>
                </div>

                <div class="shipDiscount" :style="{
                    opacity: cartCounter ?? 0
                }">
                    再消費999免運
                </div>

                <div class="itemWrapper">
                    <div class="emptyList"
                        v-if="!cartCounter">
                        購物車是空的
                    </div>
                    <div class="item"
                        v-for="(item, key) in showCartItemList"
                        :key="key">
                        <div class="imgWrapper">
                            <img :src="item.imgUrl"
                                alt="商品">
                        </div>

                        <div class="details">
                            <h3>{{ key }}</h3>
                            <small>${{ item.price }}</small>
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
                </div>

                <div class="botWrapper">
                    <div class="orderSubtotal">
                        <small class="discountNotice">
                            <span v-if="true">
                                <a href="">加入會員</a>享首購優惠
                            </span>
                            <span v-else>
                                <a href="">社群分享</a>送購物金
                            </span>
                        </small>

                        <p class="amount">
                            <span>小計</span>
                            <span>${{ cartTotalPrice
                                }}</span>
                        </p>

                        <small class="amountNotice">
                            ( 尚未包含運費 )
                        </small>
                    </div>

                    <div class="checkout" :class="{
                        disable: !cartCounter
                    }" @click="clickCheckout">
                        <button>
                            結帳
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
/**
 * todo: 加入會員、社群分享超連結
 * doing: 樣式完成 導入數據 購物車本地儲存
 * 
 * ----------------------------------
 * *item list scrollbar 用icon提示
 * ----------------------------------
 * ?小計分隔線樣式
 * 
 * //封裝加減數量組件
 * //點空白關閉
 */
import OrderCounter from '../OrderCounter/OrderCounter.vue';
import { useCartStore } from '@/store/cartStore';
import { storeToRefs } from 'pinia';
import { computed, onMounted, watch } from 'vue';
import type { MenuItem } from "@/api/menu/type";



const cartStore = useCartStore();
const { isCartCardOpen, cartMap, cartCounter, cartTotalPrice } = storeToRefs(cartStore);
const { toggleCartCardOpen, DELItemFromCart } = cartStore;

const showCartItemList = computed(() => {
    return cartMap.value
});

watch(showCartItemList.value, (nVal) => {
})


// 點擊空白關閉
function clickOuter(e: MouseEvent) {
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

onMounted(() => {
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
    @include WnH(25%, 100%);
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
    padding-right: .5rem;

    .emptyList {
        font-size: .75rem;
        text-align: center;
        opacity: .5;
        transform: translateX(.5rem);
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
        // height: 300px;

        &>div {
            display: flex;
        }

        .imgWrapper {
            @include WnH(100px);
            grid-area: a;

            img {
                @include WnH(100%);
            }
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
        background-color: gray;
    }

    .orderSubtotal {
        display: flex;
        flex-direction: column;
        gap: .5rem;
    }

    .discountNotice {

        a {
            text-decoration: underline;

            &:hover {
                color: blue;
            }
        }
    }

    .amount {
        display: flex;
        justify-content: space-between;
        font-size: 1.25rem;
        font-variation-settings: 'wght' 500;
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
</style>