<template>
    <h2>
        訂單紀錄
    </h2>

    <main>
        <ul class="orderContainer">
            <li>
                <div class="orderTitle orderHeader">
                    <div class="title_id">
                        <h3>
                            訂單編號
                        </h3>
                    </div>

                    <div class="progressBar title_bar">
                        訂單進度
                    </div>

                    <div class="title_date">
                        <span>建立日期</span>
                    </div>

                    <div class="title_price">
                        <span>
                            訂單金額
                        </span>
                    </div>

                    <div class="title_icon">
                    </div>
                </div>


                <div :class="{
                    emptyList: showOrderList.length == 0
                }"
                    v-show="showOrderList.length == 0 || fetchOrderListResult == null">
                    <Spinner
                        v-show="fetchOrderListResult == null">
                    </Spinner>
                    <h3
                        v-show="fetchOrderListResult == 'denied'">
                        沒有訂單
                    </h3>
                </div>
            </li>

            <li v-for="({ _id, orderID, shippingInfo, purchaseOrder, createdAt, statusBtnList, statusStyleIndex }, index) in showOrderList"
                :key="orderID" :class="{
                    orderCompleted: purchaseOrder.status == 'cancelled' || purchaseOrder.status == 'completed',
                    loadingFilter: isListLoading
                }" ref="orderListRefs"
                v-show="filterWord.includes(purchaseOrder.status)">
                <div class="orderTitle listItem"
                    @click="toggleListOpen(index)">
                    <div class=" orderID">
                        <h3 class="mobileID_title">
                            訂單編號
                        </h3>
                        <h3>
                            {{ orderID }}
                        </h3>
                    </div>

                    <div class="progressBar orderBar">
                        <!-- <div class="trail"></div> -->
                        <div class="milestone step0 filled"
                            :class="{
                                cancelledFilled: purchaseOrder.status == 'cancelled'
                            }">
                            <span
                                v-if="purchaseOrder.status == 'cancelled'">{{
                                    '取消' }}</span>
                            <span v-else>{{
                                '訂單建立' }}</span>
                        </div>
                        <div v-for="(text, index) in milestone"
                            :key="index" class="milestone"
                            :class="[
                                `step${index + 1}`,
                                { filled: statusStyleIndex > index }
                            ]">
                            <span>{{ text }}</span>
                        </div>
                        <div class="progress" :style="{
                            width: `${statusStyleIndex * 25}%`,
                            opacity: purchaseOrder.status == 'cancelled' ? '0' : '1'
                        }">
                        </div>
                    </div>

                    <div class="mobileProgressBar ">
                        <span class="barTitle">
                            訂單狀態
                        </span>
                        <span
                            v-if="purchaseOrder.status == 'cancelled'">
                            {{
                                '取消' }}
                        </span>
                        <span v-else>
                            {{
                                milestone[statusStyleIndex - 1]
                            }}
                        </span>
                    </div>

                    <div class="orderDate">
                        <span class="mobileDate">
                            訂單日期
                        </span>
                        <span>{{ createdAt }}</span>
                    </div>

                    <div class="orderPrice">
                        <span class="mobilePrice">
                            訂單金額
                        </span>
                        <span>
                            ${{
                                purchaseOrder.total.toLocaleString()
                            }}
                        </span>
                    </div>

                    <div class="orderIcon">
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
                        <div class="info"
                            v-if="shippingInfo.deliveryType !== '超商'">
                            <h4>
                                收件地址
                            </h4>
                            <div class="detail">
                                <div class="consigneeName">
                                    {{
                                        shippingInfo.consigneeName
                                    }}
                                </div>
                                <div>
                                    {{
                                        shippingInfo.contactNo
                                    }}
                                </div>
                                <div>
                                    {{ shippingInfo.city +
                                        shippingInfo.address }}
                                </div>
                                <div>
                                    {{
                                        shippingInfo.deliveryType
                                    }}
                                </div>
                            </div>
                        </div>
                        <div class="info" v-else>
                            <h4>
                                收件地址
                            </h4>
                            <div class="detail">
                                <div class="consigneeName">
                                    {{
                                        shippingInfo.consigneeName
                                    }}
                                </div>
                                <div>
                                    {{
                                        shippingInfo.contactNo
                                    }}
                                </div>
                                <div>
                                    {{
                                        shippingInfo.storeBranch
                                    }}
                                </div>
                                <div>
                                    {{
                                        shippingInfo.storeAddr
                                    }}
                                </div>
                                <div>
                                    {{
                                        shippingInfo.deliveryType
                                    }}
                                </div>
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
                                            數量：{{ amount
                                            }}
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
                                <span>折扣：</span>
                                <span>
                                    ${{
                                        purchaseOrder.discountAmount.toLocaleString()
                                    }}
                                </span>
                                <span>總額：</span>
                                <span>
                                    ${{
                                        purchaseOrder.total.toLocaleString()
                                    }}
                                </span>
                                <!-- <div class="totalAmount">
                                    <span>總額：</span>
                                    <span>
                                        ${{
                                            purchaseOrder.total.toLocaleString()
                                        }}
                                    </span>
                                </div> -->
                            </div>
                        </div>
                    </div>

                    <div class="editBtn">
                        <button
                            v-for="(item, index) in statusBtnList"
                            :key="index"
                            @click="toggleDialogOpen(item, _id)">
                            {{ item }}
                        </button>
                    </div>
                </div>
            </li>
            <div class="spinnerContainer"
                v-show="isListLoading">
                <Spinner style="width: 3rem; height: 3rem;">
                </Spinner>
            </div>
        </ul>
        <transition name="Dialog">
            <Dialog v-show="isCancelDialogOpen"
                :orderID="orderOnCancelling"
                @toggleDialogOpen="toggleDialogOpen"
                @cancelConfirm="refreshList">
            </Dialog>
        </transition>
    </main>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/userStore';
import { computed, watch, watchEffect, ref, useTemplateRef, onMounted, nextTick, onUpdated, onUnmounted } from 'vue';
import type { UserOrder } from '@/api/order/type';
import { useMenuStore } from '@/store/menuStore';
import CartCounter from '@/components/popover/cartCounter/CartCounter.vue';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import Dialog from './dialog/Dialog.vue';
import { useSSEStore } from '@/store/SSEStore';

// pinia
const userStore = useUserStore();
// const { getUserOrderList, logout } = userStore;
const { userOrderList, userSavedCheckoutForm, user, fetchOrderListResult } = storeToRefs(userStore);
const { cancelOrder, refreshOrderList } = userStore;

const menuStore = useMenuStore();
const { isLoaded, menuImgURLMap } = storeToRefs(menuStore);
const { fetchMenu } = menuStore;

// 按鈕 action
const editBtnText = ref({
    cancelled: null,
    new: ['取消訂單', '付款'],
    processed: ['聯絡客服'],
    shipped: ['聯絡客服'],
    completed: ['再買一次'],
});

// progress bar
type OrderStatus = 'cancelled' | 'new' | 'processed' | 'shipped' | 'completed';

const orderStatusStyle = ref({
    cancelled: 0,
    new: 1,
    processed: 2,
    shipped: 3,
    completed: 4,
})

const showOrderList = computed(() => {
    if (!userOrderList.value || userOrderList.value.length == 0) return []
    const formatted = [...userOrderList.value]
        .sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
        .map((item) => {
            return {
                ...item,
                orderID: item._id.toString().slice(-6),
                createdAt: item.createdAt.split('T')[0],
                statusStyleIndex: orderStatusStyle.value[item.purchaseOrder.status as OrderStatus],
                statusBtnList: editBtnText.value[item.purchaseOrder.status as OrderStatus]
            }
        })
    return formatted
});

// milestone
const milestone = ['訂單處理中', '付款成功', '配送中', '配送完成'];

// list state
interface ListState {
    orderID: string,
    isOpen: boolean,
    status: string
}
const listState = ref<ListState[]>([]);
watchEffect(() => {
    if (showOrderList.value.length != 0) {
        showOrderList.value.forEach(async (item) => {
            listState.value.push({
                orderID: item.orderID,
                isOpen: false,
                status: item.purchaseOrder.status
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
function correctionDigit(currNum: number, maxNum: number) {
    const currDigit = currNum.toString().length;
    const maxDigit = maxNum.toString().length;

    const diffDigit = maxDigit - currDigit;
    let comma = 0;

    if ((maxDigit % 3) !== 0 && maxDigit !== currDigit) {
        comma = Math.floor(maxDigit / 3);
    }

    return '0'.repeat(diffDigit) + ','.repeat(comma);
}

// GSAP
gsap.registerPlugin(Flip);
function GSAPsetList(state: Flip.FlipState) {
    Flip.from(state, {
        fade: true,
        simple: true,
        duration: 0.5,
        absolute: false,
        absoluteOnLeave: true,
        ease: "power2.out",
        onEnter: (elements) => {
            return gsap.fromTo(elements,
                { opacity: 0, scale: .9, transformOrigin: 'center' },
                { opacity: 1, scale: 1, transformOrigin: 'center', duration: .3 })
        },
        onLeave: (elements) => {
            return gsap.fromTo(elements,
                { opacity: 1, scale: 1, transformOrigin: 'center', },
                { opacity: 0, scale: .9, transformOrigin: 'center', duration: .3 })
        },
        onComplete: () => {
            closeList();
        }
    });
}


// branch filter
type Branch = '全部' | '待付款' | '已完成'
const { selectBranch } = defineProps<{ selectBranch: Branch }>();

const filterWord = computed(() => {
    let word = null;

    switch (selectBranch) {
        case '已完成':
            word = ['completed', 'cancelled'];
            break
        case '待付款':
            word = ['new'];
            break
        default:
            word = ['new', 'processed', 'shipped', 'completed', 'cancelled'];
            break
    }
    return word
})
// 切分頁GSAP轉場
const orderListRefs = useTemplateRef('orderListRefs');
watch(() => selectBranch, (nVal) => {
    let state = Flip.getState(orderListRefs.value);
    if (nVal) {
        nextTick(() => {
            GSAPsetList(state)
        })
    }
})

// 切分頁時關閉已打開且不相關的訂單
function closeList() {
    listState.value.forEach((item) => {
        if (!filterWord.value.includes(item.status)) {
            item.isOpen = false;
        }
    })
}

// 取消訂單
// const cancelActionRES = ref('');
// const cancelAction = async (orderID: string) => {
//     try {
//         const result = await cancelOrder(orderID);
//         if (!result) {
//             return cancelActionRES.value = '取消失敗'
//         }
//         return cancelActionRES.value = '取消成功'
//     } catch (error) {
//         return cancelActionRES.value = '取消失敗'
//     }
// }
// 確認框
const orderOnCancelling = ref<null | string>(null);
const isCancelDialogOpen = ref(false);
function toggleDialogOpen(btn: string, orderID: string) {
    if (btn !== '取消訂單') return
    orderOnCancelling.value = orderID;
    isCancelDialogOpen.value = !isCancelDialogOpen.value;
}

// 刷新訂單列表
const isListLoading = ref(false);
async function refreshList() {
    try {
        await refreshOrderList();
    } catch (error) {
        console.log(error);
    }
}

// payment sse event
const SSEStore = useSSEStore();
function setPaymentNotify() {
    SSEStore.paymentNotify(user.value.userID, refreshList)
}
function stopPaymentNotify() {
    SSEStore.stopPaymentQueue(user.value.userID);
}

onUpdated(() => {
})

onMounted(() => {
    setPaymentNotify()
})

onUnmounted(() => {
    stopPaymentNotify()
})

</script>

<style scoped lang="scss">
* {
    // outline: 1px solid black;
}

h2 {
    font-size: 2rem;
    font-size: 1.5rem;
    font-size: clamp(1.5rem, 1.3571428571428572rem + 0.7142857142857143vw, 2rem);
    height: 50px;
    line-height: 50px;
    font-variation-settings: 'wght' 450;
    margin-bottom: 1rem;
}

.orderContainer {
    text-align: center;
    position: relative;

    &>li {
        border-radius: 1rem;
        padding: 1.25rem 1rem;
        margin-bottom: 1rem;
        box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.5);

        &:has(.orderHeader) {
            box-shadow: none;
            margin-bottom: 0;
            padding: 0 1rem;
        }
    }

    .orderHeader {
        margin-bottom: .5rem;
    }

    .emptyList {
        position: relative;
        padding: 0 .5rem;
        margin-top: 2.5rem;
        color: rgba(0, 0, 0, 0.5);
        width: calc(100% / 5.5 * 5);
    }

    .orderCompleted {

        .orderTitle,
        .orderContent>*:not(.editBtn) {
            opacity: .5;
        }
    }

    .listItem {
        cursor: pointer;

        .progressBar {
            width: 100%;
            height: 4px;
            border-radius: 4px;
            position: relative;
            outline: 1px solid $btnBacColor;
            background-color: $primaryBacColor;
        }

        .milestone {
            width: 10px;
            height: 10px;
            border-radius: 100%;

            position: absolute;
            top: 50%;
            transform: translate(-50%, -50%);

            outline: 1px solid $btnBacColor;
            background-color: $primaryBacColor;

            transition: background-color .3s;

            span {
                display: block;
                width: max-content;
                font-size: .75rem;
                text-wrap: nowrap;

                position: absolute;
                top: -200%;
                left: 5px;
                translate: -50% 0;
            }
        }

        @for $i from 0 through 4 {
            .step#{$i} {
                left: #{$i * 25}+"%";
            }
        }

        .filled {
            background-color: $btnBacColor;
        }

        .cancelledFilled {
            background-color: $error_color;
            outline-color: $error_color;
        }

        .progress {
            height: 4px;
            border-radius: 4px;


            position: absolute;
            top: 0;
            left: 0;

            outline: 1px solid $btnBacColor;
            background-color: $btnBacColor;

            transition: width .3s;
        }
    }

    .orderTitle {
        display: flex;
        flex-direction: row;
        align-items: center;

        padding: .5rem;

        .title_id,
        .orderID {
            flex: 1;
        }

        .title_bar,
        .orderBar {
            // margin-left: 2rem;
            // margin-right: 4rem;
            margin-inline: 1rem 2rem;
            flex: 2;
        }

        .title_date,
        .orderDate {
            flex: 1;
        }

        .title_price,
        .orderPrice {
            flex: 1;
        }

        .title_icon,
        .orderIcon {
            @include flex-center-center;
            flex: .5;

            .listIcon {
                transform: rotate(-90deg);
                transition: transform .3s;
            }

            .rotateIcon {
                transform: rotate(0deg);
            }
        }

        .mobileID_title,
        .mobileDate,
        .mobilePrice {
            display: none;
        }
    }

    .orderContent {
        text-align: start;
        display: grid;
        transition: grid-template-rows .5s, padding .25s linear;

        padding: 1rem 0;

        &>div {
            overflow: hidden;
        }
    }

    .content {
        display: flex;
        gap: .5rem;
        // padding: 0rem 4rem;
        padding-inline: 1rem;
        padding-inline: clamp(1rem, 0.1428571428571428rem + 4.285714285714286vw, 4rem);
        margin-bottom: 1rem;
        border-top: 1px solid gray;
        transition: border-top .25s, margin-bottom .25s;

        &>div {
            // flex: 1;
            padding-top: 2rem;
        }
    }

    .editBtn {
        // padding: 0 4rem;
        padding-inline: 0.75rem;
        padding-inline: clamp(0.75rem, -0.1785714285714286rem + 4.642857142857143vw, 4rem);
        justify-self: end;
        font-size: .75rem;
        display: flex;
        gap: .5rem;

        button {
            @include WnH(80px, 30px);
            border: 1px solid $btnBacColor;
            border-radius: 1rem;
            background-color: $btnBacColor;
            color: $primaryBacColor;

            &:hover {
                filter: brightness(1.2);
            }
        }
    }

    .info {
        border-right: 1px solid gray;
        margin-right: .5rem;
        flex: 1;

        h4 {
            @apply mb-2;

            font-size: 1.25rem;
            font-variation-settings: 'wght' 450;
        }

        &>div:not(.consigneeName) {
            @apply opacity-80 text-sm;
        }
    }

    .consigneeName {
        @apply mb-1 text-lg opacity-100;
    }

    .itemList {
        margin-left: .5rem;
        flex: 2;

        li {
            display: flex;
            margin-bottom: .5rem;
        }
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
        position: relative;
        display: grid;
        align-items: baseline;
        grid-template-columns: auto max-content;
        grid-template-rows: auto auto;
        column-gap: .5rem;

        span:nth-of-type(1),
        span:nth-of-type(3) {
            font-size: .75rem;
            line-height: 100%;
        }

        span:nth-of-type(2) {
            color: red;
        }

        span:last-of-type {
            font-size: 1.25rem;
            font-variation-settings: 'wght' 600;
            color: $btnBacColor;
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

.spinnerContainer {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.loadingFilter {
    filter: blur(2px);
}

.Dialog-enter-active,
.Dialog-leave-active {
    transition: opacity .3s;
}

.Dialog-enter-from,
.Dialog-leave-to {
    opacity: 0;
}

.Dialog-enter-to,
.Dialog-leave-from {
    opacity: 1;
}

.mobileProgressBar {
    display: none;
}



@include XLarge {}

@include large {}

@include medium($width: 1024px) {
    .orderContainer .orderHeader {
        padding: .5rem 0;

        .progressBar {
            display: none;
        }

        .title_id {
            flex: 1;
        }

        .title_bar {}

        .title_date {
            flex: 1;
        }

        .title_price {
            flex: 1;
        }

        .title_icon {
            flex: .25;
        }
    }

    .orderContainer .listItem {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr .25fr;
        grid-template-rows: repeat(2, 1fr);
        row-gap: 1.5rem;
        padding: 0;
    }

    .orderBar {
        grid-column: 1 / 4;
        grid-row: 2;
        max-width: 80%;
        justify-self: center;
    }

    .orderIcon {
        grid-column: 4 / 5;
        grid-row: 1 / 3;
    }

    .orderContainer {
        .info {
            border-right: none;
            border-bottom: 1px solid gray;
            padding-bottom: 1rem;
            display: flex;
            gap: 2rem;

            h4 {
                display: inline-block;
                width: 100px;
                text-align: center;
            }
        }

        .content {
            flex-direction: column;
            gap: 0;

            &>div {
                padding-top: 1rem;
            }
        }

        .itemList {
            margin-left: 0;
        }
    }
}

@include medium {}

@include small {
    .orderContainer {

        .itemList li {
            display: grid;
            grid-template-columns: 1fr;
            gap: .5rem;
        }

        .imgWrapper {
            grid-column: 1;
            justify-self: center;
        }

        .itemName {
            grid-column: 1;
            grid-row: 2;
        }

        .subtotal {
            grid-column: 1;
            grid-row: 2;
            align-self: flex-end;
        }

        .info {
            flex-direction: column;
            gap: 0;

            h4 {
                width: inherit;
                margin-bottom: 0;
            }

            .detail {
                padding-left: 2rem;
            }
        }

        .editBtn {

            button {
                @include WnH(70px, 30px);
            }
        }
    }
}

@include small($width: 430px) {


    .orderContainer {
        .orderHeader {
            display: none;
        }

        .listItem {
            grid-template-columns: 1fr 1fr .25fr;
            grid-template-rows: 1fr 1fr;
            row-gap: 0rem;
        }

        .mobileID_title {
            grid-column: 1;
            grid-row: 1;

        }

        .orderID {
            grid-column: 1;
            grid-row: 1;
            display: flex;
            justify-content: center;
            flex-direction: column;
        }

        .orderDate {
            grid-row: 2;
            display: flex;
            flex-direction: column;
            margin-top: .5rem;
        }

        .orderPrice {
            grid-column: 2;
            grid-row: 2;
            display: flex;
            flex-direction: column;
            margin-top: .5rem;
        }

        .orderIcon {
            grid-column: 3;
            grid-row: 1/3;
        }

        .orderTitle {

            .mobileID_title,
            .mobileDate,
            .mobilePrice,
            .barTitle {
                display: flex;
                justify-content: center;
                font-variation-settings: 'wght' 450;
                position: relative;
                margin-bottom: .25rem;

                &::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 1px;
                    background-color: black;
                }
            }
        }
    }

    .progressBar {
        display: none;
    }

    .orderContainer .listItem {
        .mobileProgressBar {
            display: block;
            width: 100%;
            grid-column: 2;
            grid-row: 1;
            justify-self: center;
            display: flex;
            justify-content: center;
            flex-direction: column;
            text-wrap: nowrap;
            margin-inline: 0;

            &>span:first-of-type {
                font-variation-settings: 'wght' 450;
            }
        }

    }
}

@include small($width: 320px) {}
</style>