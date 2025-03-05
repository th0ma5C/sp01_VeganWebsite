<template>
    <div class="rightWrapper " :class="{
        loadingFilter: isItemListChecked
    }">
        <div class="barContainer">
            <h4 ref="congratulationsRef">
                <span
                    v-if="cartCounter && cartCounter >= 14">
                    恭喜達標
                </span>
                <span v-else>
                    增加{{ 7 - (cartCounter ?? 0) % 7
                    }}包解鎖下個優惠
                </span>
            </h4>

            <div class="bar">
                <div class="content mileage1">
                    九折優惠
                </div>
                <div class="content mileage2">
                    八五折優惠
                </div>

                <div v-for="index in 2" :key="index"
                    class="milestone " :class="{
                        mileage1: index == 1,
                        mileage2: index == 2
                    }">
                    <SvgIcon name="Check" width="1.25rem"
                        height="1.25rem"
                        :color="index == 1 ? milestoneIconColor[0] : milestoneIconColor[1]">
                    </SvgIcon>
                </div>

                <div class="progress"
                    :style="progressLength"></div>
            </div>
        </div>

        <div class="listContainer">
            <ul>
                <li class="cartItem"
                    v-for="(item, index) in cartMap"
                    :key="index">
                    <div class="imgContainer" :class="{
                        saladBg: item.category == 'salad'
                    }">
                        <img :src="item.imgUrl" alt="圖片">
                        <CartCounter :amount="item.amount"
                            class="counter">
                        </CartCounter>
                    </div>

                    <div class="itemContent">
                        <h4>
                            {{ index }}
                        </h4>

                        <p>
                            ${{ item.price }}
                        </p>
                    </div>

                    <div class="itemPrice">
                        <span>
                            ${{ (item.price *
                                item.amount).toLocaleString() }}
                        </span>
                    </div>
                </li>
            </ul>
        </div>

        <div class="discountForm">
            <VForm as=""
                v-slot="{ handleSubmit, submitCount, values }"
                :validation-schema="schema">
                <form action=""
                    @submit="handleSubmit($event, onSubmit)">
                    <VField name="discountCode" as=""
                        v-slot="{ field, resetField }">
                        <input ref="inputRef"
                            id="discountCode" type=text
                            autocomplete="off"
                            placeholder="" :="field"
                            @blur="handleBlur(field.value, resetField, $event)"
                            @keydown.enter="handleEnter(field.value)">
                    </VField>
                    <label for="discountCode">折扣碼</label>

                    <transition name="couponErrMsg">
                        <div class="errorMsg"
                            v-show="(isCouponPassed == false) && (coupon.code) && submitCount != 0">
                            <SvgIcon name="QNR_alert"
                                width="18" height="18"
                                color="#b3261e">
                            </SvgIcon>
                            <span>
                                {{
                                    couponErrMsg
                                }}
                            </span>
                        </div>
                    </transition>


                    <div class="formBtn">
                        <button>
                            套用
                        </button>
                    </div>
                </form>
            </VForm>
        </div>

        <div class="subContainer">
            <div class="cost">
                <div>
                    <h5>
                        小計：
                    </h5>
                </div>

                <div class="discountContent">
                    <span class="itemQuantity">
                        {{ cartCounter }}項
                    </span>
                    <div>
                        <span>$</span>
                        <span class="correctionDigit"
                            v-text="correctionDigit(cartTotalPrice)">
                        </span>
                        <span>
                            {{
                                cartTotalPrice
                            }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="cost discount">
                <div class="title">
                    <h5>優惠：</h5>
                </div>
                <div class="amountDiscount discountContent">
                    <span>
                        <span v-if="discountPercent == 1"
                            class="itemQuantity">
                            {{ '' }}
                        </span>
                        <span
                            v-else-if="discountPercent == 0.9"
                            class="itemQuantity">
                            {{ '9折' }}
                        </span>
                        <span v-else class="itemQuantity">
                            {{ '85折' }}
                        </span>
                    </span>
                    <span class="discountAmount">
                        <span>$</span>
                        <span class="correctionDigit"
                            v-text="correctionDigit(discountAmount)">
                        </span>
                        <span>
                            {{
                                discountAmount
                            }}
                        </span>
                    </span>
                </div>

                <transition name="discountContent">
                    <div class="couponDiscount discountContent"
                        v-show="showCouponContent">
                        <transition-group
                            name="discountContent">
                            <div class="spinner"
                                v-show="showCouponSpinner"
                                key="spinner">
                            </div>
                            <span :class="{
                                loadingFilter: showCouponSpinner
                            }" key="couponCode">
                                {{ `折扣碼 (${couponCode})` }}
                            </span>

                            <span class="discountAmount"
                                :class="{
                                    loadingFilter: showCouponSpinner
                                }" key="couponAmount">
                                <span>$</span>
                                <span
                                    class="correctionDigit"
                                    v-text="correctionDigit(couponAmount)"></span>
                                <span>{{ couponAmount
                                    }}</span>
                            </span>
                        </transition-group>
                    </div>
                </transition>

            </div>

            <div class="cost">
                <span class="freight">
                    運費
                    <SvgIcon class="QuestionMark"
                        name="QuestionMark" width="16px"
                        height="16px" color="black" @="{
                            mouseenter: toggleIsIllustrateShow,
                            mouseleave: toggleIsIllustrateShow
                        }">
                    </SvgIcon>
                    <transition name="freightIllustrate">
                        <div v-show="isIllustrateShow"
                            class="freightIllustrate">
                            <span>
                                Lorem ipsum dolor sit amet
                                consectetur adipisicing
                                elit.
                                Modi, itaque.
                            </span>
                        </div>
                    </transition>

                </span>
                <span>
                    <span>$</span>
                    <span class="correctionDigit"
                        v-text="correctionDigit(freightFee)"></span>
                    <span>{{ freightFee }}</span>
                </span>
            </div>

            <div>
                <span>總計</span>
                <span>${{
                    orderAmount.toLocaleString()
                    }}</span>
            </div>
        </div>

        <transition name="spinner">
            <div class="spinnerWrapper" @click.prevent
                v-show="!isItemListChecked">
                <Spinner></Spinner>
            </div>
        </transition>

    </div>


</template>

<script setup lang="ts">
/**
 * todo:
 * ------------------------
 */

import CartCounter from '@/components/popover/cartCounter/CartCounter.vue';
import { useCartStore } from '@/store/cartStore';
import { storeToRefs } from 'pinia';
import {
    Field as VField, Form as VForm, ErrorMessage, defineRule, configure,
    type FormActions, type SubmissionHandler
} from 'vee-validate';
import { ref, computed, onMounted, reactive, watch, useTemplateRef } from 'vue';
import * as yup from 'yup';
import { reqFetchCoupon, type CouponCode } from '@/api/coupon';
import { reqVerifyItemPrice } from '@/api/order/order';
import confetti from 'canvas-confetti';
import { useLoaderStore } from '@/store/loader';


const cartStore = useCartStore();
const { cartMap, cartCounter, cartTotalPrice } = storeToRefs(cartStore);
const { getFreightFee, getDiscountAmount, getCouponAmount, getTotalAmount, getCartState } = cartStore;


// 進度條長度
const progressLength = computed(() => {
    // const width = ;
    if (!cartCounter.value) return { width: 0 };

    const width = cartCounter.value < 14 ?
        `calc(${Math.floor((100 / 14) * cartCounter.value)}% + 10px)` :
        `100%`

    return {
        width
    }
})

// 達標 icon style
const milestoneIconColor = computed(() => {
    if (!cartCounter.value) return ['', '']

    const styleMap = [
        cartCounter.value >= 7 ? '#FCFAF2' : 'red',
        cartCounter.value >= 14 ? '#FCFAF2' : 'red'
    ];

    return styleMap
})

// 優惠
const discountPercent = computed(() => {
    const isExceed = milestoneIconColor.value.filter(item => item == '#FCFAF2').length;
    if (isExceed == 1) {
        return 0.9
    } else if (isExceed == 2) {
        return 0.85
    } else {
        return 1
    }
})

const discountAmount = computed(() => {
    const amount = Math.floor(cartTotalPrice.value * (1 - discountPercent.value))
    getDiscountAmount(amount);
    return amount
})

// 運費
const { selectedDelivery } = defineProps(['selectedDelivery']);

const freightFee = computed(() => {
    const fee = selectedDelivery == '宅配' ? 120 : 60;
    getFreightFee(fee);
    return fee
})

// 運費說明
const isIllustrateShow = ref(false);
function toggleIsIllustrateShow(e: Event) {
    isIllustrateShow.value = !isIllustrateShow.value
}

// 驗證折扣碼
type CouponInput = {
    code: CouponCode['code'] | null;
}
type CouponForm = Record<string, string>;

const schema = yup.object({
    discountCode: yup.string().trim()
})

const inputRef = ref()
const isCouponPassed = ref<null | boolean>(null);
const couponErrMsg = '無此折扣碼';
const couponCode = ref('')
const couponAmount = ref(0);
const couponApplyMsg = ref('');

const showCouponContent = computed(() => !(couponAmount.value == 0))
const showCouponSpinner = ref(true);

const coupon = reactive<CouponInput>({
    code: null
})

watch(couponAmount, (nVal) => {
    if (nVal) {
        getCouponAmount(nVal)
    }
})

function handleEnter(val: string) {
    if (!val) return
    coupon.code = val ?? ''.trim();
}

function handleBlur(val: string, resetField: () => void, e: Event) {
    if (val && !val.trim()) {
        resetField();
    }
    return coupon.code = (val ?? '').trim()
}

async function fetchCoupon(val: string) {
    if (!coupon.code) {
        isCouponPassed.value = false;
        return false
    }

    try {
        const { data, message } = await reqFetchCoupon({ code: val });
        if (data) {
            ({ code: couponCode.value, value: couponAmount.value } = data)
            setTimeout(() => {
                showCouponSpinner.value = false;
            }, 500)
        }
        couponApplyMsg.value = message;
        isCouponPassed.value = true;
        return true
    } catch (error) {
        isCouponPassed.value = false;
        setTimeout(() => {
            isCouponPassed.value = null;
        }, 3000)
        // console.log(error);
        return false
    }
}


async function onSubmit<T extends CouponForm>(val: T, { resetForm }: FormActions<T>) {
    try {
        const isValidate = await fetchCoupon(val.discountCode);
        if (isValidate) {
            resetForm()
            inputRef.value.blur();
        } else {
        }
    } catch (error) {
        console.log(error);
    }
}

// 數字位置同步
const maxDigit = computed(() => {
    const bigNum = Math.max(cartTotalPrice.value, freightFee.value);
    return bigNum.toString().length
})

function correctionDigit(currNum: number) {
    const currDigit = currNum.toString().length;
    const diffDigit = maxDigit.value - currDigit
    return '0'.repeat(diffDigit)
}

// 訂單總額
const orderAmount = computed(() => {
    const total = cartTotalPrice.value +
        freightFee.value -
        discountAmount.value -
        couponAmount.value;
    getTotalAmount(total);
    return total
})

const handlers = [
    (newVal: number) => getDiscountAmount(newVal),
    (newVal: number) => getFreightFee(newVal),
    (newVal: number) => getCouponAmount(newVal),
    (newVal: number) => getTotalAmount(newVal),
]

watch([discountAmount, freightFee, couponAmount, orderAmount], (nVal) => {
    nVal.forEach((val, index) => {
        handlers[index](val);
    })
    // console.log(nVal);
}, { immediate: true })

// 驗證商品金額
const isItemListChecked = ref(false)
async function verifyItemPrice() {
    try {
        const params = { order: getCartState() };
        const result = await reqVerifyItemPrice(params);
        if (result.state == 'confirm') {
            setTimeout(() => {
                isItemListChecked.value = true
            }, 1000)
        }
        return
    } catch (error) {
        console.log(error);
    }
}

// confetti config
const isConfettiFired = ref(false);
const congratulationsRef = useTemplateRef('congratulationsRef');
// const congratulationsConfetti = confetti.create(document.createElement('canvas'), { useWorker: true });

const congratulationsRefCoord = computed(() => {
    if (!congratulationsRef.value) return
    const { top, left, width, height } = congratulationsRef.value.getBoundingClientRect();
    const x = (left + (width / 2)) / window.innerWidth;
    const y = (top + (height / 2)) / window.innerHeight;
    return {
        x,
        y
    }
})
const confettiConfig = (): confetti.Options => {
    if (!congratulationsRefCoord.value) return {}
    return {
        origin: congratulationsRefCoord.value,
        zIndex: 100,
        ticks: 250
    }
}

function setConfetti() {
    if (isConfettiFired.value || loaderStore.loaderActivated !== false) return
    if ((cartCounter.value ?? 0) < 14) return
    isConfettiFired.value = true;
    setTimeout(() => {
        confetti(confettiConfig());
    }, 1000);
}

const loaderStore = useLoaderStore();
loaderStore.$subscribe((_, state) => {
    if (state.loaderActivated === false) {
        setConfetti();
    }
})
// watch(() => loaderStore.loaderActivated, (nVal, oVal) => {
//     console.log(oVal, 'o');
//     console.log(nVal, 'n');
// }, { immediate: true })

onMounted(() => {
    verifyItemPrice();
    setConfetti();
})

</script>

<style scoped lang="scss">
.rightWrapper {
    position: sticky;
    top: 3rem;

    display: flex;
    flex-direction: column;
    gap: 2rem;

    &>div:not(.spinnerWrapper) {
        filter: blur(2px);
        transition: filter .3s;
    }
}

.loadingFilter>div:not(.spinnerWrapper) {
    filter: blur(0);
}

.spinnerWrapper {
    @include WnH(calc(100% + 4rem), calc(100vh - 3.5rem));

    cursor: not-allowed;
    border-radius: 1rem;
    position: absolute;
    top: -1rem;
    left: -1rem;
    // background-color: rgba(0, 0, 0, 0.2);
    z-index: 2;

    &>div {
        @include WnH(40px);
    }
}

.spinner-leave-active {
    transition: opacity .3s
}

.spinner-enter-from,
.spinner-leave-to {
    opacity: 0;
}

.spinner-enter-to,
.spinner-leave-from {
    opacity: 1;
}

.barContainer {

    h4 {
        font-size: 2rem;
        font-weight: 500;
        text-align: center;
    }
}

.bar {
    width: calc(100% - 2rem);
    height: 1.25rem;
    background-color: rgb(229, 229, 229);
    outline: 1px solid $btnBacColor_light;
    border-radius: 1.25rem;

    margin-top: 4rem;

    position: relative;
    left: 1rem;
}

.content {
    border: 1px solid gray;
    background-color: $primaryBacColor;
    border-radius: .25rem;
    padding: .25rem .5rem;
    text-wrap: nowrap;

    position: absolute;
    top: -2rem;
    left: 30%;
    transform: translate(-50%, -50%);

    &::after {
        border: 1px solid gray;
        border-top: none;
        border-left: none;
        background-color: $primaryBacColor;
        content: '';
        width: .75rem;
        height: .75rem;
        position: absolute;
        bottom: -.80rem;
        left: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
    }
}

.milestone {
    position: absolute;
    top: 0rem;
    transform: translate(-50%, 0%);
}

.mileage1 {
    left: 50%;
}

.mileage2 {
    left: 100%;
    transform: translate(calc(-50% - .675rem), -50%);

    &:has(div) {
        transform: translate(-100%, 0%);
    }
}

.progress {
    content: '';
    border-radius: 1.25rem;
    background-color: $btnBacColor_light;
    height: 100%;
    width: 0;
    // position: absolute;
}



.listContainer .cartItem {
    display: flex;
    padding: 0 1rem;
    margin-bottom: 1rem;
}

.imgContainer {
    position: relative;
    border: 1px solid gray;
    border-radius: 1rem;
    width: 100px;
    align-self: center;
    // overflow: hidden;
    // flex: 1;

    .counter {
        transform: translate(-50%, -50%);
        background-color: $btnBacColor;
    }

    img {
        // max-width: none;
        // height: 100%;
        border-radius: 1rem;
        object-fit: cover;
    }
}

.saladBg {
    background: no-repeat url('@assets/img/Menu/bac_wood.jpg') center/cover;
}

.itemContent {
    flex: 2;
    padding-right: .5rem;
    padding-left: 1rem;
    padding-left: clamp(1rem, -0.1428571428571428rem + 2.380952380952381vw, 2rem);

    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: .5rem;

    h4 {
        font-size: 1.25rem;
    }
}

.itemPrice {
    // flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    span {
        font-size: 1.25rem;
    }
}

.discountForm {
    padding: 0 1rem;
    margin-bottom: 1.5rem;

    form {
        position: relative;
        width: 100%;

        display: flex;
        gap: 1rem;

        input {
            // max-width: 80%;
            // width: 100%;
            flex: 8;
            height: 34px;
            border: 1px solid gray;
            border-radius: 1rem;
            padding: 0 1rem;
            font-size: .75rem;
        }

        &:has(input:focus, input:not(:placeholder-shown))>label {
            opacity: 0;
        }

        label {
            // background-color: white;
            border-radius: 4px;
            position: absolute;
            text-wrap: nowrap;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            font-size: .75rem;
            // font-size: 18px;
            color: rgba(0, 0, 0, 0.75);
            transition: transform .3s ease;
            transform-origin: left;
            user-select: none;
            pointer-events: none;
            transition: opacity .15s ease;
        }
    }
}

.formBtn {
    flex: 1.5;
    // margin-left: 2rem;
    // width: 10%;
    text-wrap: nowrap;
    display: flex;
    justify-content: center;
    align-items: center;

    button {
        width: 100%;
        height: 100%;

        border: 1px solid green;
        border-radius: 1rem;
        background-color: $btnBacColor;
        color: $primaryBacColor;
        font-size: .75rem;
    }
}


.errorMsg {
    @include flex-center-center;
    flex-direction: row;
    gap: .5rem;
    color: #b3261e;
    text-wrap: nowrap;
    position: absolute;
    bottom: -75%;
    left: .5rem;
    // transform: translate(0%, -50%);
}

.discountContent-enter-active,
.discountContent-leave-active {
    transition: opacity .3s;
}

.discountContent-enter-from,
.discountContent-leave-to {
    opacity: 0;
}

.discountContent-enter-to,
.discountContent-leave-from {
    opacity: 1;
}

.subContainer {
    padding: 0 1rem;
    display: grid;
    grid-template-rows: 1fr 2fr 1fr 2fr;
    gap: .5rem;

    &>div {
        display: grid;
        grid-template-columns: .5fr 2fr;

        &>span:last-of-type {
            justify-self: flex-end;
        }

        &:last-of-type {
            font-size: 1.2rem;

            position: relative;
            align-self: flex-end;

            &::before {
                background-color: rgb(188, 188, 188);
                content: '';
                width: calc(100% + 2rem);
                height: 2px;
                position: absolute;
                top: -.5rem;
                left: -1rem;
            }
        }
    }
}

.cost {
    font-size: .8rem;

    .itemQuantity {
        // margin-left: .5rem;
    }

    .discountAmount {
        color: red;
    }

    .correctionDigit {
        user-select: none;
        color: transparent;
    }

    .discountContent {
        display: flex;
        justify-content: space-between;
        position: relative;

        .loadingFilter {
            filter: opacity(.25);
        }
    }
}

.freight {
    position: relative;
    display: inline-flex;
    gap: .25rem;
    align-items: center;
}

.QuestionMark {
    cursor: pointer;
    opacity: .5;
    transition: opacity .15s;
    height: 100%;

    &:hover {
        opacity: 1;
    }
}

.freightIllustrate {
    padding: .25rem .5rem;
    background-color: $primaryBacColor;
    border: 1px solid black;
    border-radius: .5rem;
    text-align: center;

    width: 150px;
    position: absolute;
    top: 0%;
    left: 40%;
    z-index: 2;

}


.discount {
    display: grid;
    grid-template:
        'a b b' 1fr
        'a c c' 1fr / .5fr 1fr 1fr;

    .title {
        grid-area: a;
    }

    .amountDiscount {
        grid-area: b;
    }

    .couponDiscount {
        grid-area: c;
    }
}

.spinner {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    display: inline-block;
    border-top: 3px solid $secondBacColor;
    border-right: 3px solid transparent;
    animation: rotation 1s linear infinite;

    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

@keyframes rotation {
    0% {
        transform: translate(-50%, -50%) rotate(0deg);
    }

    100% {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}

.freightIllustrate-enter-active,
.freightIllustrate-leave-active {
    transition: opacity .15s;
}

.freightIllustrate-enter-from,
.freightIllustrate-leave-to {
    opacity: 0;
}

.freightIllustrate-enter-to,
.freightIllustrate-leave-from {
    opacity: 1;
}

.couponErrMsg-enter-active,
.couponErrMsg-leave-active {
    transition: opacity .15s;
}

.couponErrMsg-enter-from,
.couponErrMsg-leave-to {
    opacity: 0;
}

.couponErrMsg-enter-to,
.couponErrMsg-leave-from {
    opacity: 1;
}

@include XLarge {}

@include large {}

@include medium($width: 1024px) {}

@include medium {
    .mileage2 {
        transform: translate((-75%, -50%));

        &::after {
            left: calc(75% - 10px)
        }
    }
}

@include small {}

@include small($width: 430px) {
    .discountForm form {
        gap: .5rem;
    }

    .formBtn {
        flex: 2;
    }

    .rightWrapper {
        gap: 1rem;
    }

    .imgContainer {
        width: 90px;
        height: 90px;
    }

    .itemContent {
        h4 {
            font-size: 18px;
        }

        p {
            font-size: 14px;
        }
    }

    .itemPrice span {
        font-size: 18px;
    }
}

@include small($width: 375px) {
    .imgContainer {
        // width: 85px;
    }

    .itemContent {
        h4 {
            font-size: 16px;
        }

        p {
            font-size: 12px;
        }
    }

    .itemPrice span {
        font-size: 16px;
    }
}

@include small($width: 320px) {
    // .itemContent {
    //     h4 {
    //         font-size: 16px;
    //     }

    //     p {
    //         font-size: 14px;
    //     }
    // }

    // .itemPrice span {
    //     font-size: 18px;
    // }
}
</style>