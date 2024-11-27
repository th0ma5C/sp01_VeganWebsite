<template>
    <h2>
        訂單紀錄
    </h2>

    <main>
        <ul class="orderContainer">
            <li>
                <div class="orderTitle orderHeader">
                    <div>
                        <h3>
                            訂單編號
                        </h3>
                    </div>

                    <div class="progressBar">
                        訂單進度
                    </div>

                    <div>
                        <span>建立日期</span>
                    </div>

                    <div>
                        <span>
                            訂單金額
                        </span>
                    </div>

                    <div>
                    </div>
                </div>
            </li>

            <li v-for="({ orderID, shippingInfo, purchaseOrder, createdAt }, index) in showOrderList"
                :key="orderID">
                <div class="orderTitle listItem"
                    @click="toggleListOpen(index)">
                    <div>
                        <h3>
                            {{ orderID }}
                        </h3>
                    </div>

                    <div class="progressBar">
                        <div class="trail"></div>
                        <div v-for="(text, index) in milestone"
                            :key="index" class="milestone"
                            :class="{
                                step1: index == 0,
                                step2: index == 1,
                                step3: index == 2,
                                step4: index == 3,
                            }">
                            <span>{{ text }}</span>
                        </div>
                        <div class="progress"></div>
                    </div>

                    <div>
                        <span>{{ createdAt }}</span>
                    </div>

                    <div>
                        <span>
                            ${{
                                purchaseOrder.total.toLocaleString()
                            }}
                        </span>
                    </div>

                    <div>
                        <button>
                            <SvgIcon name="ListArrowDown"
                                height="24px" width="24px"
                                color="black"
                                class="listIcon" :class="{
                                    rotateIcon: listState[index].isOpen
                                }">
                            </SvgIcon>
                        </button>
                    </div>
                </div>

                <div class="orderContent" v-show="true"
                    :class="listState[index].isOpen ? 'listOpen' : 'listClosed'">
                    <div class="content">
                        <div class="info">
                            <h4>
                                收件地址
                            </h4>
                            <div class="consigneeName">
                                {{
                                    shippingInfo.consigneeName
                                }}
                            </div>
                            <div>
                                {{ shippingInfo.contactNo }}
                            </div>
                            <div>
                                {{ shippingInfo.city +
                                    shippingInfo.address }}
                            </div>
                            <div>
                                {{ shippingInfo.deliveryType
                                }}
                            </div>
                        </div>

                        <div class="itemList">
                            <ul>
                                <li v-for="({ name, amount, subtotal }, index) in purchaseOrder.orderList"
                                    :key="index">
                                    <div v-if="isLoaded"
                                        class="imgWrapper">
                                        <img :src="menuImgURLMap[name]"
                                            :class="name.includes('沙拉') ? 'saladBG' : ''"
                                            alt="">
                                    </div>
                                    <div class="itemName">
                                        <h4>
                                            {{ name }}
                                        </h4>
                                        <span>
                                            數量：{{ amount }}
                                        </span>
                                    </div>
                                    <div class="subtotal">
                                        $
                                        <span
                                            class="correctionDigit"
                                            v-text="correctionDigit(subtotal,
                                                purchaseOrder.total)">
                                        </span>
                                        <span>
                                            {{
                                                subtotal.toLocaleString()
                                            }}
                                        </span>
                                    </div>
                                </li>
                            </ul>

                            <div class="total">
                                <span>總額：</span>
                                <span>
                                    ${{
                                        purchaseOrder.total.toLocaleString()
                                    }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="editBtn">
                        <button>
                            {{ '付款' }}
                        </button>
                    </div>
                </div>
            </li>
        </ul>
    </main>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/userStore';
import { computed, watch, watchEffect, ref } from 'vue';
import type { UserOrder } from '@/api/order/type';
import { useMenuStore } from '@/store/menuStore';
import CartCounter from '@/components/popover/cartCounter/CartCounter.vue';

// pinia
const userStore = useUserStore();
// const { getUserOrderList, logout } = userStore;
const { userOrderList } = storeToRefs(userStore);

const menuStore = useMenuStore();
const { isLoaded, menuImgURLMap } = storeToRefs(menuStore);
const { fetchMenu, getImgURLbyName } = menuStore;

const showOrderList = computed(() => {
    if (!userOrderList.value || userOrderList.value.length == 0) return []
    const formatted = userOrderList.value.map((item) => {
        return {
            ...item,
            orderID: item._id.toString().slice(-6),
            createdAt: item.createdAt.split('T')[0],
        }
    })
    return formatted
});

// milestone
const milestone = ['建立', '付款成功', '配送中', '配送完成'];

// list state
interface ListState {
    orderID: string,
    isOpen: boolean,
    itemImgURL?: string
}
const listState = ref<ListState[]>([]);
watchEffect(() => {
    if (showOrderList.value.length != 0) {
        showOrderList.value.forEach(async (item) => {
            listState.value.push({
                orderID: item.orderID,
                isOpen: false
            });
        })
    }
})

function toggleListOpen(target: number) {
    listState.value[target].isOpen = !listState.value[target].isOpen
}

// item list
watchEffect(async () => {
    try {
        if (!isLoaded.value) await fetchMenu();
    } catch (error) {
        console.log(error);
    }
})
const imgMap = computed(() => {
    return { ...menuImgURLMap.value }
})

// 數字位置同步
function correctionDigit(currNum: number, maxDigit: number) {
    const diffDigit = maxDigit.toString().length - currNum.toString().length
    return '0'.repeat(diffDigit)
}

// 按鈕 action
const editBtnAction = (state: string) => {
    switch (state) {
        case 'new':

            return '付款'
        case 'processed':

            return ''
        default:
            return '再買一次'
    }
}

</script>

<style scoped lang="scss">
* {
    // outline: 1px solid black;
}

h2 {
    font-size: 2rem;
    height: 50px;
    line-height: 50px;
    font-variation-settings: 'wght' 450;
    margin-bottom: 1rem;
}

.orderContainer {
    text-align: center;


    &>li {
        // border: 1px solid black;
        border-radius: 1rem;
        padding: 1rem;
        margin-bottom: 1rem;
        box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.5);
        transition: max-height .75s;

        &:has(.orderHeader) {
            box-shadow: none;
            margin-bottom: 0;
            padding: 0 1rem;
        }
    }

    .orderHeader {
        margin-bottom: .5rem;
    }

    .listItem {
        cursor: pointer;

        h3 {
            // padding-left: 1rem;
        }

        .progressBar {
            width: 100%;
            height: 4px;
            border-radius: 4px;


            position: relative;

            outline: 1px solid $btnBacColor;
            background-color: $primaryBacColor;


            .milestone {
                width: 10px;
                height: 10px;
                border-radius: 100%;

                position: absolute;
                top: 50%;
                transform: translate(-50%, -50%);

                outline: 1px solid $btnBacColor;
                background-color: $primaryBacColor;

                span {
                    font-size: .75rem;
                    text-wrap: nowrap;

                    position: absolute;
                    top: -1.25rem;
                    left: 0;
                }
            }

            .step1 {
                left: 25%;

                span {
                    transform: translateX(-7px);
                }
            }

            .step2 {
                left: 50%;

                span {
                    transform: translateX(-19px);
                }
            }

            .step3 {
                left: 75%;

                span {
                    transform: translateX(-13px);
                }
            }

            .step4 {
                left: 100%;

                span {
                    transform: translateX(-19px);
                }
            }

            .progress {
                width: 25%;
                height: 4px;
                border-radius: 4px;


                position: absolute;
                top: 0;
                left: 0;

                outline: 1px solid $btnBacColor;
                background-color: $btnBacColor;
            }
        }
    }

    .orderTitle {
        display: flex;
        flex-direction: row;
        align-items: center;

        padding: .5rem;

        &>div:nth-of-type(1) {
            flex: 1;
        }

        &>div:nth-of-type(2) {
            margin-left: 2rem;
            margin-right: 4rem;
            flex: 2;
        }

        &>div:nth-of-type(3) {
            flex: 1;
        }

        &>div:nth-of-type(4) {
            flex: 1;
        }

        &>div:nth-of-type(5) {
            @include flex-center-center;
            flex: .5;

            .listIcon {
                transform: rotate(0deg);
                transition: transform .3s;
            }

            .rotateIcon {
                transform: rotate(-90deg);
            }
        }
    }

    .orderContent {
        text-align: start;
        display: grid;
        transition: grid-template-rows .5s, padding .25s linear;

        padding: 1rem 0;

        &>* {
            overflow: hidden;
        }

        .content {
            display: flex;
            gap: .5rem;
            padding: 0rem 4rem;
            margin-bottom: 1rem;
            border-top: 1px solid gray;
            transition: border-top .25s, margin-bottom .25s;

            &>div {
                // flex: 1;
                padding-top: 2rem;
            }
        }

        .editBtn {
            padding: 0 4rem;
            justify-self: end;
            font-size: .75rem;

            button {
                @include WnH(80px, 30px);
                border: 1px solid green;
                border-radius: 1rem;
                background-color: $btnBacColor;
                color: $primaryBacColor;
            }
        }

    }

    .info {
        border-right: 1px solid gray;
        margin-right: .5rem;
        flex: 1;

        h4 {
            @apply mb-6;

            font-size: 1.25rem;
            font-variation-settings: 'wght' 450;
        }

        &>div {
            @apply opacity-80 text-sm;
        }

        .consigneeName {
            @apply mb-3 text-lg opacity-100;
        }
    }

    .itemList {
        margin-left: .5rem;
        flex: 2;

        li {
            display: flex;
            margin-bottom: .5rem;
        }

        .imgWrapper {
            position: relative;
            border: 1px solid gray;
            border-radius: 1rem;
            width: 100px;

            img {
                border-radius: 1rem;
            }
        }

        .saladBG {
            background: no-repeat url('@assets/img/Menu/bac_wood.jpg') center/contain;
        }

        .itemName {
            padding: 0 .5rem 0 2rem;
            flex: 2;

            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: .5rem;

            h4 {
                font-size: 1.25rem;
                font-variation-settings: 'wght' 500;
            }

            p {}
        }

        .subtotal {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            align-items: center;

            span {
                // font-size: 1.25rem;
            }

            .correctionDigit {
                user-select: none;
                color: transparent;
            }
        }

        .total {
            text-align: end;

            span:first-of-type {
                font-size: .75rem;
            }

            span:last-of-type {
                font-size: 1.25rem;
                font-variation-settings: 'wght' 600;
                color: $btnBacColor;
            }
        }
    }

    .listClosed {
        padding: 0;
        grid-template-rows: 0fr 0fr;

        .content {
            margin-bottom: 0;
            border-top: 0px;
        }
    }

    .listOpen {
        grid-template-rows: 1fr auto;
    }
}
</style>