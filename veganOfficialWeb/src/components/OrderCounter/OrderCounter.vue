<template>
    <div class="counterControl">
        <button
            :class="{ unclickable: limitAlert && amountModel <= min }"
            @click="counter('-')">
            <SvgIcon name="productMinus" class="countIcon"
                width="24" height="24">
            </SvgIcon>
        </button>
        <input autocomplete="off" type="text"
            name="orderAmount"
            @input="formattedInput($event as InputEvent)"
            v-model.number.lazy="amountModel">
        <button
            :class="{ unclickable: limitAlert && amountModel >= max }"
            @click="counter('+')">
            <SvgIcon name="productPlus" class="countIcon"
                width="24" height="24">
            </SvgIcon>
        </button>
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';

// 計數器預設
const amountModel = defineModel('amount', { default: 1 });

// 輸入驗證
// const counterVal = ref(1);
let prevCounterVal = 1;
const limitAlert = ref(false);
const max = 99, min = 1;

function formattedInput(e: InputEvent) {
    const reg = /\D|^0+/g;
    const target = e.target as HTMLInputElement;
    target.value = target.value.replace(reg, '');
}

function counter(actions: '+' | '-') {
    if (actions === '+' && amountModel.value < max) {
        amountModel.value += 1;
    } else if (actions === '-' && amountModel.value > min) {
        amountModel.value -= 1;
    }
}

watch(amountModel, (nVal, oVal) => {

    if (Number.isNaN(nVal)) {
        amountModel.value = prevCounterVal;
    } else if (nVal > max) {
        amountModel.value = max;
    } else if (nVal < min) {
        amountModel.value = min;
    }

    limitAlert.value = nVal >= max || nVal <= min;
    prevCounterVal = amountModel.value;
    amountModel.value = amountModel.value;

}, { immediate: true });
// function counter(actions: '+' | '-') {
//     if (actions === '+' && counterVal.value < max) {
//         counterVal.value += 1;
//     } else if (actions === '-' && counterVal.value > min) {
//         counterVal.value -= 1;
//     }
// }

// watch(counterVal, (nVal, oVal) => {

//     if (Number.isNaN(nVal)) {
//         counterVal.value = prevCounterVal;
//     } else if (nVal > max) {
//         counterVal.value = max;
//     } else if (nVal < min) {
//         counterVal.value = min;
//     }

//     limitAlert.value = nVal >= max || nVal <= min;
//     prevCounterVal = counterVal.value;
//     amountModel.value = counterVal.value;

// }, { immediate: true });



</script>

<style scoped lang="scss">
.counterControl {
    display: flex;
    align-items: center;
    gap: 6px;

    button {
        @include WnH(24px, 20px);
        @include flex-center-center;
        // border: 1px solid black;
        border-radius: 6px;
        transition: box-shadow .3s ease;

        &:not(.unclickable) {
            &:hover {
                box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5);

            }

            &:active {
                transform: translate(1px, 1px);
            }
        }


    }

    input {
        background-color: $primaryBacColor;
        text-align: center;
        line-height: 24px;
        width: 80px;
        font-variation-settings: 'wght' 450;
        font-size: 1.25rem;
    }

    .unclickable {
        opacity: 0.15;
        cursor: not-allowed;
    }
}
</style>