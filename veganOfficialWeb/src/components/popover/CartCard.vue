<template>
    <div v-show="isCartCardOpen" class="cartContainer">
        <div class="drawer">

            <div class="topTitle">
                <h1>
                    購物車
                </h1>
                <SvgIcon class="cancelBtn" name="cancel"
                    width="24px" height="24px" color="black"
                    @click="toggleCartCardOpen">
                </SvgIcon>
            </div>

            <div class="shipDiscount">
                差999免運
            </div>

            <div class="itemWrapper">
                <div class="item">
                    1
                </div>
                <div class="item">
                    1
                </div>
                <div class="item">
                    1
                </div>
            </div>

            <div class="botWrapper">
                <div class="subtotal">
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
                        <span>999</span>
                    </p>

                    <small class="amountNotice">
                        尚未包含運費
                    </small>
                </div>

                <div class="checkout">
                    <button>
                        結帳
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * todo: 加入會員、社群分享超連結
 * doing: 樣式完成 點空白關閉 導入數據
 * ----------------------------------
 * *item list scrollbar 用icon代替
 * ----------------------------------
 * ?小計分隔線樣式
 */
import { useCartStore } from '@/store/cartStore';
import { storeToRefs } from 'pinia';


const cartStore = useCartStore();
const { isCartCardOpen } = storeToRefs(cartStore);
const { toggleCartCardOpen } = cartStore;

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

    .item {
        height: 300px;
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

    .subtotal {
        display: flex;
        flex-direction: column;
        gap: .5rem;
    }

    .discountNotice {

        a {
            text-decoration: underline;
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
</style>