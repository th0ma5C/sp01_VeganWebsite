<template>
    <div class="rightWrapper">
        <div class="barContainer">
            <h4>
                增加一千包解鎖下個優惠
            </h4>

            <div class="bar">
                <div class="content mileage1">
                    九折優惠
                </div>
                <div class="content mileage2">
                    八五折優惠
                </div>

                <div class="milestone mileage1">
                    <SvgIcon name="Check" width="1.25rem"
                        height="1.25rem" :color="'red'">
                    </SvgIcon>
                </div>

                <div class="milestone mileage2">
                    <SvgIcon name="Check" width="1.25rem"
                        height="1.25rem" :color="'red'">
                    </SvgIcon>
                </div>

                <div class="progress"></div>
            </div>
        </div>

        <div class="listContainer">
            <ul>
                <li class="cartItem"
                    v-for="(item, index) in cartMap"
                    :key="index">
                    <div class="imgContainer">
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
                            ${{ item.price * item.amount }}
                        </span>
                    </div>
                </li>
            </ul>
        </div>

        <div class="discountForm">
            <VForm as=""
                v-slot="{ handleSubmit, submitCount, values }"
                :validation-schema="schema">
                <form action="">
                    <VField name="discount" type=text>

                    </VField>
                    <label for="">折扣碼</label>

                    <div class="formBtn">
                        <button>
                            套用
                        </button>
                    </div>
                </form>
            </VForm>
        </div>

        <div class="subContainer">
            <div>
                <span>小計</span>
                <span>一百萬</span>
            </div>

            <div>
                <span>運費</span>
                <span>五十萬</span>
            </div>

            <div>
                <span>總計</span>
                <span>一百五十萬</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import CartCounter from '@/components/popover/cartCounter/CartCounter.vue';
import { useCartStore } from '@/store/cartStore';
import { storeToRefs } from 'pinia';
import {
    Field as VField, Form as VForm, ErrorMessage, defineRule, configure,
} from 'vee-validate';
import { onMounted } from 'vue';
import * as yup from 'yup';


const cartStore = useCartStore();
const { cartMap } = storeToRefs(cartStore);

// 表單驗證
const schema = yup.object({

})


onMounted(() => {
    console.log(cartMap.value);
})

</script>

<style scoped lang="scss">
.rightWrapper {
    position: sticky;
    top: calc(100px + 3rem);

    display: flex;
    flex-direction: column;
    gap: 2rem;

}

.barContainer {

    h4 {
        text-align: center;
    }

    .bar {
        width: 100%;
        height: 1.25rem;
        background-color: rgb(229, 229, 229);
        border-radius: 1.25rem;

        margin-top: 4rem;

        position: relative;

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
    }
}

.listContainer {



    .cartItem {
        display: flex;
        padding: 0 1rem;
        margin-bottom: 1rem;

        .imgContainer {
            position: relative;
            border: 1px solid gray;
            border-radius: 1rem;
            width: 100px;
            flex: 1;

            .counter {
                transform: translate(-50%, -50%);
                background-color: $btnBacColor;
            }
        }

        .itemContent {
            padding: 0 .5rem 0 1rem;
            flex: 2;

            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: .5rem;

            h4 {
                font-size: 1.25rem;
            }

            p {}
        }

        .itemPrice {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            align-items: center;

            span {
                font-size: 1.25rem;
            }
        }
    }
}

.discountForm {
    padding: 0 1rem;

    form {
        position: relative;
        width: 100%;

        display: flex;
        gap: 1rem;

        input {
            width: 100%;
            height: 48px;
            border: 1px solid gray;
            border-radius: 1rem;
            padding: 0 1rem;
        }

        label {
            // background-color: white;
            border-radius: 4px;
            position: absolute;
            text-wrap: nowrap;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            font-size: 18px;
            color: rgba(0, 0, 0, 0.75);
            transition: transform .3s ease;
            transform-origin: left;
            user-select: none;
            pointer-events: none;

        }

        .formBtn {
            width: 12%;
            text-wrap: nowrap;
            display: flex;
            justify-content: center;
            align-items: center;

            button {
                width: 100%;
                height: 75%;

                border: 1px solid green;
                border-radius: .5rem;
                background-color: $btnBacColor;
                color: $primaryBacColor;
            }
        }
    }
}

.subContainer {
    padding: 0 1rem;
    display: grid;

    &>div {
        display: grid;
    }
}

* {
    // outline: 1px solid black;
}
</style>