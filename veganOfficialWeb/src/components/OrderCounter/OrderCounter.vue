<template>
    <div class="counterControl">
        <button
            :class="{ unclickable: limitAlert && counterVal <= min }"
            @click="counter('-')">
            <SvgIcon name="productMinus" class="countIcon"
                width="24" height="24">
            </SvgIcon>
        </button>
        <input autocomplete="off" type="text"
            name="orderAmount"
            @input="formattedInput($event as InputEvent)"
            v-model.number.lazy="counterVal">
        <button
            :class="{ unclickable: limitAlert && counterVal >= max }"
            @click="counter('+')">
            <SvgIcon name="productPlus" class="countIcon"
                width="24" height="24">
            </SvgIcon>
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const counterVal = ref(1);
let prevCounterVal = 1;
const limitAlert = ref(false);
const max = 99, min = 1;

function formattedInput(e: InputEvent) {
    const reg = /\D|^0+/g;
    const target = e.target as HTMLInputElement;
    target.value = target.value.replace(reg, '');
}

function counter(actions: '+' | '-') {
    if (actions === '+' && counterVal.value < max) {
        counterVal.value += 1;
    } else if (actions === '-' && counterVal.value > min) {
        counterVal.value -= 1;
    }
}

watch(counterVal, (nVal, oVal) => {

    if (Number.isNaN(nVal)) {
        counterVal.value = prevCounterVal;
    } else if (nVal > max) {
        counterVal.value = max;
    } else if (nVal < min) {
        counterVal.value = min;
    }

    limitAlert.value = nVal >= max || nVal <= min;
    prevCounterVal = counterVal.value;

}, { immediate: true });

</script>

<style scoped lang="scss">
// .orderCounter {
//     @include WnH(100%, 42px);
//     background-color: $primaryBacColor;
//     border-radius: 0.5rem;
//     flex-direction: row;
//     position: relative;
//     margin-top: 1rem;

//     span {
//         @include absoluteCenterTLXY($left: 0.75rem, $X: 0);
//         font-size: 20px;
//         // font-weight: 900;
//         font-variation-settings: 'wght' 450;
//     }

.counterControl {
    // @include absoluteCenterTLXY($left: calc(100% - 1rem), $X: -100%);
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

// }</style>