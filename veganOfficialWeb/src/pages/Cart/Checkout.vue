<template>
    <div class="container">
        <div class="wrapper">
            <div class="left">
                <VForm as=""
                    :validation-schema="orderFormSchema">
                    <form action="">
                        <fieldset>
                            <h2>聯絡方式</h2>
                            <div class="formWrapper">
                                <VField name="email"
                                    type="email"></VField>
                                <label for="">電子信箱</label>
                            </div>
                        </fieldset>

                        <fieldset>
                            <h2>配送</h2>
                            <div class="formWrapper">
                                <VField name="consigneeName"
                                    type="text">
                                </VField>
                                <label for="">姓名</label>
                            </div>
                            <div class="city_postal">
                                <div class="formWrapper">
                                    <VField as="div"
                                        name="city"
                                        type="text"
                                        v-slot="{ field }">
                                        <input :="field"
                                            :value="field.value">
                                    </VField>
                                    <label for="">縣市</label>

                                    <div
                                        class="selectWrapper">
                                        <span
                                            class="showCity"
                                            v-show="false">
                                            {{ '縣市' }}
                                        </span>
                                        <span
                                            class="switchIcon">></span>
                                        <!-- <SvgIcon></SvgIcon> -->
                                        <div class="optionsWrapper"
                                            v-show="false">
                                            <div
                                                class="title">
                                                <span>城市</span>
                                                <span>區</span>
                                            </div>

                                            <div
                                                class="tabs">
                                                <ul>
                                                    <li v-for="(item, index) in 20"
                                                        :key="index">
                                                        桃園
                                                    </li>
                                                </ul>

                                                <ul
                                                    v-show="false">
                                                    <li>
                                                        中壢
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div class="formWrapper">
                                    <VField name="postal"
                                        type="text">
                                    </VField>
                                    <label
                                        for="">郵遞區號</label>
                                </div>

                            </div>
                            <div
                                class="formWrapper addressWrapper">
                                <VField name="address"
                                    type="text">
                                </VField>
                                <label for="">地址</label>
                            </div>
                            <div
                                class="formWrapper contactNoWrapper">
                                <VField name="contactNo"
                                    type="tel">
                                </VField>
                                <label for="">連絡電話</label>
                            </div>
                        </fieldset>

                        <fieldset>
                            <div
                                class="formWrapper ckboxWrapper staticLabel">
                                <VField name="saveInfo"
                                    v-slot="{ field }">
                                    <input type="checkbox"
                                        :="field">
                                </VField>
                                <label for="">
                                    儲存寄送資訊供下次使用
                                </label>
                            </div>

                            <div
                                class="formWrapper ckboxWrapper staticLabel">
                                <VField name="subNews"
                                    v-slot="{ field }">
                                    <input type="checkbox"
                                        :="field">
                                </VField>
                                <label for="">收到最新資訊</label>
                            </div>
                        </fieldset>

                        <fieldset>
                            <h2>配送方式</h2>
                            <div
                                class="formWrapper radioWrapper staticLabel">
                                <VField name="deliveryType"
                                    v-slot="{ field }">
                                    <input type="radio"
                                        id="" :="field"
                                        v-show="false">
                                </VField>
                                <!-- <label for="">配送方式</label> -->

                                <div class="radio">
                                    <ul>
                                        <li>
                                            超商
                                        </li>
                                        <li>
                                            宅配
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </fieldset>

                        <fieldset>
                            <h2>付款方式</h2>

                            <div
                                class="formWrapper radioWrapper staticLabel">
                                <VField name="paymentType"
                                    v-slot="{ field }">
                                    <input type="radio"
                                        :="field"
                                        v-show="false">
                                </VField>
                                <!-- <label for="">貨到付款</label> -->

                                <div class="radio">
                                    <ul>
                                        <li>
                                            匯款
                                        </li>
                                        <li>
                                            電子支付
                                        </li>
                                        <li>
                                            貨到付款
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </fieldset>

                        <div class="btnWrapper">
                            <button>送出</button>
                        </div>
                    </form>
                </VForm>
            </div>

            <div class="right">
                <div>
                    消費條
                </div>

                <div>
                    列表
                </div>

                <div>
                    折扣碼
                </div>

                <div>
                    小計
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/store/cartStore';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted } from 'vue';
import {
    Field as VField, Form as VForm, ErrorMessage, defineRule, configure,
} from 'vee-validate';
import * as yup from 'yup';

// 購物車
const cartStore = useCartStore();
const { isCheckout, cartMap } = storeToRefs(cartStore)
const { toggleIsCheckout } = cartStore;

// 表單驗證
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
yup.addMethod(yup.string, 'email', function validateEmail(message) {
    return this.matches(emailRegex, {
        message: '請輸入正確信箱格式',
        name: 'email',
        excludeEmptyString: true,
    });
});

const orderFormSchema = yup.object({
    email: yup.string().trim().required('此欄不能空白').email(),
    consigneeName: yup.string().trim().required('此欄不能空白'),
    city: yup.string().trim().required('此欄不能空白'),
    postal: yup.string().trim().required('此欄不能空白'),
    address: yup.string().trim().required('此欄不能空白'),
    contactNo: yup.string().trim().required('此欄不能空白'),
    saveInfo: yup.string().trim().required('此欄不能空白'),
    subNews: yup.string().trim().required('此欄不能空白'),
    deliveryType: yup.string().trim().required('此欄不能空白'),
    paymentType: yup.string().trim().required('此欄不能空白'),
})

function foo(val: string) {
    console.log(val);
}


onMounted(() => {
    if (!isCheckout.value) toggleIsCheckout();
    console.log(cartMap.value);
})

onUnmounted(() => {
    toggleIsCheckout()
})
</script>

<style scoped lang="scss">
* {
    // outline: 1px solid black;
}

.container {
    @extend %headerPseudo;
    @extend %fixContainer;

    flex-direction: column;

    h2 {
        font-size: 1.75rem;
        margin-bottom: 1rem;
    }

    .left {
        border-right: 1px solid gray;
    }
}

.wrapper {
    width: calc(80% - 6rem);
    // padding-left: 3rem;
    display: flex;

    &>div {
        min-width: 50%;
        padding: 3rem 4rem;
    }
}

.left>form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: .5rem;

    &>fieldset {
        width: 80%;
        margin: 0 auto;
    }
}

.formWrapper {
    position: relative;

    input {
        @include WnH(100%, 48px);
        padding: 0 1rem;
        border: 1px solid gray;
        border-radius: .5rem;
        // background-color: $primaryBacColor;
        background-color: white;
    }

    label {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
    }
}

.city_postal {
    display: flex;
    margin: 1rem 0;
    gap: .5rem;

    &>div {
        flex: 1;
    }
}

.selectWrapper {
    @include WnH(calc(100% - 1rem), 48px);
    position: absolute;
    left: 1rem;
    top: 0;

    .showCity {
        line-height: 48px;
    }

    .switchIcon {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
    }

    .optionsWrapper {
        width: calc(100% + 1rem);
        height: 250px;
        position: absolute;
        top: calc(100%);
        left: -1rem;
        z-index: 2;
        background-color: red;
        border: 1px solid black;
        border-radius: .5rem;

        display: flex;
        flex-direction: column;

        .title {
            border-bottom: 1px solid gray;
            width: 100%;
            display: flex;
            // justify-content: center;
            // align-items: center;

            &>span {
                padding: .5rem;
                flex: 1;
                text-align: center;

                &:first-of-type {
                    border-right: 1px solid gray;
                }
            }
        }

        .tabs {
            overflow-y: scroll;

            ul {
                // padding: .5rem 2rem;
            }

            li {
                @include WnH(100%, 36px);
                padding-left: 1rem;
                outline: 1px solid black;
                line-height: 36px;
                // margin: .5rem 0;
            }
        }
    }
}

.addressWrapper,
.contactNoWrapper {
    margin: 1rem 0;
}

.staticLabel {
    label {
        margin-left: .5rem;
        position: static;
        transform: none;
    }
}

.ckboxWrapper {
    margin-bottom: .5rem;
    display: flex;
    align-items: center;

    input {
        @include WnH(16px);
    }
}

.radioWrapper {
    input {
        @include WnH(16px);
    }
}

.radio {
    ul {
        display: flex;
        flex-direction: column;
    }

    li {
        @include WnH(100%, 48px);
        padding-left: 1rem;
        outline: 1px solid black;
        line-height: 36px;
    }
}

.btnWrapper {
    width: 80%;
    margin: 0 auto;
    margin-top: 2rem;

    button {
        @include WnH(100%, 36px);
        border: 1px solid gray;
        border-radius: .5rem;
    }
}
</style>