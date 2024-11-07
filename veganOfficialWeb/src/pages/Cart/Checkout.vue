<template>
    <div class="container" @click="clickOuter">
        <div class="wrapper">
            <div class="left">
                <VForm as=""
                    v-slot="{ handleSubmit, submitCount, values }"
                    :validation-schema="verifiedSchema">
                    <form action=""
                        @submit="handleSubmit($event, onSubmit)">
                        <fieldset>
                            <div class="topContent">
                                <h2>
                                    聯絡方式
                                </h2>
                                <router-link to="/profile"
                                    class="loginLink">
                                    登入
                                </router-link>
                            </div>

                            <div class="formWrapper">
                                <VField name="email"
                                    v-slot="{ field, meta }">
                                    <input type="email"
                                        placeholder=""
                                        :="field" :class="{
                                            invalidInput: !meta.valid && submitCount > 0
                                        }">
                                </VField>
                                <label for="">電子信箱</label>

                                <ErrorMessage name="email"
                                    as="div"
                                    v-slot="{ message }"
                                    class="errorMsg" :style="{
                                        opacity: submitCount > 0 ? 1 : 0
                                    }">
                                    <SvgIcon
                                        name="QNR_alert"
                                        width="18"
                                        height="18"
                                        color="#b3261e">
                                    </SvgIcon>
                                    <span>
                                        {{
                                            message
                                        }}
                                    </span>
                                </ErrorMessage>
                            </div>
                        </fieldset>

                        <fieldset>
                            <h2>配送地址</h2>
                            <div class="formWrapper">
                                <VField name="consigneeName"
                                    v-slot="{ field, meta }">
                                    <input type="text"
                                        placeholder=""
                                        :="field" :class="{
                                            invalidInput: !meta.valid && submitCount > 0
                                        }">
                                </VField>
                                <label for="">姓名</label>

                                <ErrorMessage
                                    name="consigneeName"
                                    as="div"
                                    v-slot="{ message }"
                                    class="errorMsg" :style="{
                                        opacity: submitCount > 0 ? 1 : 0
                                    }">
                                    <SvgIcon
                                        name="QNR_alert"
                                        width="18"
                                        height="18"
                                        color="#b3261e">
                                    </SvgIcon>
                                    <span>
                                        {{
                                            message
                                        }}
                                    </span>
                                </ErrorMessage>
                            </div>

                            <div
                                class="formWrapper addressWrapper">
                                <VField name="address"
                                    v-slot="{ field, meta }">
                                    <input type="text"
                                        autocomplete="off"
                                        placeholder=""
                                        :="field" :class="{
                                            invalidInput: !meta.valid && submitCount > 0
                                        }"
                                        @blur="updateAddrInput(field.value)">
                                </VField>
                                <label for="">地址</label>

                                <ErrorMessage name="address"
                                    as="div"
                                    v-slot="{ message }"
                                    class="errorMsg" :style="{
                                        opacity: submitCount > 0 ? 1 : 0
                                    }">
                                    <SvgIcon
                                        name="QNR_alert"
                                        width="18"
                                        height="18"
                                        color="#b3261e">
                                    </SvgIcon>
                                    <span>
                                        {{
                                            message
                                        }}
                                    </span>
                                </ErrorMessage>
                            </div>

                            <div class="city_postal">
                                <div class="formWrapper"
                                    @click.stop>
                                    <VField as="div"
                                        name="city"
                                        v-model="inputCity"
                                        v-slot="{ field, meta }">
                                        <input
                                            class="hideInput"
                                            :="field"
                                            placeholder=""
                                            :class="{
                                                invalidInput: !meta.valid && submitCount > 0
                                            }">
                                    </VField>
                                    <label for=""
                                        class="staticLabel"
                                        :class="{
                                            selectingOptions: isOptionsOpen || selectedCity.city !== ''
                                        }">
                                        縣市
                                    </label>

                                    <ErrorMessage
                                        name="city" as="div"
                                        v-slot="{ message }"
                                        class="errorMsg"
                                        :style="{
                                            opacity: submitCount > 0 ? 1 : 0
                                        }">
                                        <SvgIcon
                                            name="QNR_alert"
                                            width="18"
                                            height="18"
                                            color="#b3261e">
                                        </SvgIcon>
                                        <span>
                                            {{
                                                message
                                            }}
                                        </span>
                                    </ErrorMessage>

                                    <div @click.self="toggleOpenOptions"
                                        class="selectWrapper">
                                        <span
                                            class="showCity"
                                            v-show="selectedCity.city">
                                            {{
                                                inputCity
                                            }}
                                        </span>
                                        <SvgIcon
                                            @click="toggleOpenOptions"
                                            class="switchIcon"
                                            name="ListArrowDown"
                                            width="24"
                                            height="24"
                                            color="black"
                                            :class="{
                                                optionOpen: isOptionsOpen
                                            }">
                                        </SvgIcon>
                                        <div class="optionsWrapper"
                                            v-show="isOptionsOpen">
                                            <div
                                                class="title">
                                                <span
                                                    @click="switchTab('city')">縣市</span>
                                                <span
                                                    @click="switchTab('town')">鄉鎮</span>
                                            </div>

                                            <div
                                                class="tabs">
                                                <ul
                                                    v-show="currTab == 'city'">
                                                    <li v-for="({ NAME, CODE }) in showCityList"
                                                        :key="CODE"
                                                        @click="pickCity({ city: NAME, code: CODE })">
                                                        {{
                                                            NAME
                                                        }}
                                                    </li>
                                                </ul>

                                                <ul
                                                    v-show="currTab == 'town'">
                                                    <li v-for="(town, index) in townList"
                                                        :key="index"
                                                        @click="pickTown(town)">
                                                        {{
                                                            town
                                                        }}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="formWrapper">
                                    <VField
                                        v-model="postalCode"
                                        name="postal"
                                        v-slot="{ field, meta }">
                                        <input type="text"
                                            placeholder=""
                                            :="field"
                                            :class="{
                                                invalidInput: !meta.valid && submitCount > 0
                                            }">
                                    </VField>
                                    <label
                                        for="">郵遞區號</label>

                                    <ErrorMessage
                                        name="postal"
                                        as="div"
                                        v-slot="{ message }"
                                        class="errorMsg"
                                        :style="{
                                            opacity: submitCount > 0 ? 1 : 0
                                        }">
                                        <SvgIcon
                                            name="QNR_alert"
                                            width="18"
                                            height="18"
                                            color="#b3261e">
                                        </SvgIcon>
                                        <span>
                                            {{
                                                message
                                            }}
                                        </span>
                                    </ErrorMessage>
                                </div>

                            </div>

                            <div
                                class="formWrapper contactNoWrapper">
                                <VField name="contactNo"
                                    v-slot="{ field, meta }">
                                    <input type="tel"
                                        placeholder=""
                                        :="field" :class="{
                                            invalidInput: !meta.valid && submitCount > 0
                                        }">
                                </VField>
                                <label for="">連絡電話</label>

                                <ErrorMessage
                                    name="contactNo"
                                    as="div"
                                    v-slot="{ message }"
                                    class="errorMsg" :style="{
                                        opacity: submitCount > 0 ? 1 : 0
                                    }">
                                    <SvgIcon
                                        name="QNR_alert"
                                        width="18"
                                        height="18"
                                        color="#b3261e">
                                    </SvgIcon>
                                    <span>
                                        {{
                                            message
                                        }}
                                    </span>
                                </ErrorMessage>
                            </div>
                        </fieldset>

                        <fieldset>
                            <div
                                class="formWrapper ckboxWrapper">
                                <VField as=""
                                    name="saveInfo"
                                    type="checkbox"
                                    :value="true"
                                    :unchecked-value="false"
                                    v-slot="{ field, meta }">
                                    <input type="checkbox"
                                        :="field"
                                        :value="true">
                                </VField>
                                <label for=""
                                    class="staticLabel">
                                    儲存寄送資訊供下次使用
                                </label>

                                <!-- <ErrorMessage
                                    name="saveInfo" as="div"
                                    v-slot="{ message }"
                                    class="errorMsg" :style="{
                                        opacity: submitCount > 0 ? 1 : 0
                                    }">
                                    <SvgIcon
                                        name="QNR_alert"
                                        width="18"
                                        height="18"
                                        color="#b3261e">
                                    </SvgIcon>
                                    <span>
                                        {{
                                        message
                                        }}
                                    </span>
                                </ErrorMessage> -->
                            </div>

                            <div
                                class="formWrapper ckboxWrapper">
                                <VField as="" name="subNews"
                                    type="checkbox"
                                    :value="true"
                                    :unchecked-value="false"
                                    v-slot="{ field }">
                                    <input type="checkbox"
                                        :value="true"
                                        :="field">
                                </VField>
                                <label for=""
                                    class="staticLabel">收到最新資訊</label>

                                <!-- <ErrorMessage name="subNews"
                                    as="div"
                                    v-slot="{ message }"
                                    class="errorMsg">
                                    <SvgIcon
                                        name="QNR_alert"
                                        width="18"
                                        height="18"
                                        color="#b3261e">
                                    </SvgIcon>
                                    <span>
                                        {{
                                        message
                                        }}
                                    </span>
                                </ErrorMessage> -->
                            </div>
                        </fieldset>

                        <fieldset>
                            <h2>配送方式</h2>
                            <div
                                class="formWrapper radioWrapper">
                                <VField
                                    v-model="selectedDelivery"
                                    name="deliveryType"
                                    v-slot="{ field }">
                                    <input type="text" id=""
                                        :="field"
                                        v-show="false">
                                </VField>
                                <!-- <label for="">配送方式</label> -->

                                <ErrorMessage
                                    name="deliveryType"
                                    as="div"
                                    v-slot="{ message }"
                                    class="errorMsg">
                                    <SvgIcon
                                        name="QNR_alert"
                                        width="18"
                                        height="18"
                                        color="#b3261e">
                                    </SvgIcon>
                                    <span>
                                        {{
                                            message
                                        }}
                                    </span>
                                </ErrorMessage>

                                <div class="radio">
                                    <ul>
                                        <li v-for="(type, index) in deliveryTypeList"
                                            :key="index"
                                            :class="{
                                                selectLi: type == selectedDelivery
                                            }"
                                            @click="pickDeliveryType(type)">
                                            <div
                                                class="radioBtn">
                                                <div></div>
                                            </div>
                                            <div class="radioContent"
                                                v-if="type == '超商'">
                                                <h3>
                                                    {{
                                                        type
                                                    }}
                                                </h3>
                                                <div class="storeAddr"
                                                    :class="{
                                                        showStoreAddr: selectedDelivery == '超商'
                                                    }">
                                                    <div
                                                        class="textWrapper">
                                                        <h4>
                                                            {{
                                                                selectedStore.branch
                                                                ||
                                                                '請選擇門市'
                                                            }}
                                                        </h4>
                                                        <p>
                                                            {{
                                                                selectedStore.addr
                                                                ||
                                                                '門市地址'
                                                            }}
                                                        </p>
                                                    </div>
                                                    <div
                                                        class="chooseStoreBtn">
                                                        <button
                                                            @click.prevent="toggleOpenStoreAddrList">
                                                            選擇門市
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div v-else
                                                class="express">
                                                <h3>
                                                    {{
                                                        type
                                                    }}
                                                </h3>

                                                <p>
                                                    {{
                                                        expressAddr
                                                    }}
                                                </p>
                                            </div>
                                        </li>
                                    </ul>

                                    <Teleport to='main'>
                                        <div class="storeAddrList"
                                            v-show="openStoreAddrList">
                                            <h2>
                                                選擇分店
                                            </h2>
                                            <SvgIcon
                                                name="cancel"
                                                width="24px"
                                                class="cancelIcon"
                                                height="24px"
                                                @click="toggleOpenStoreAddrList">
                                            </SvgIcon>
                                            <ul>
                                                <li v-for="({ branch, addr }, index) in storeAddrList"
                                                    :key="index"
                                                    @click="pickSelectedStore({ branch, addr })">
                                                    {{
                                                        addr
                                                    }}
                                                </li>
                                            </ul>
                                        </div>
                                    </Teleport>
                                </div>
                            </div>
                        </fieldset>

                        <fieldset>
                            <h2>付款方式</h2>

                            <div
                                class="formWrapper radioWrapper">
                                <VField name="paymentType"
                                    v-model="selectedPayment"
                                    v-slot="{ field }">
                                    <input type="radio"
                                        :="field"
                                        v-show="false">
                                </VField>
                                <!-- <label for="">貨到付款</label> -->

                                <ErrorMessage
                                    name="paymentType"
                                    as="div"
                                    v-slot="{ message }"
                                    class="errorMsg">
                                    <SvgIcon
                                        name="QNR_alert"
                                        width="18"
                                        height="18"
                                        color="#b3261e">
                                    </SvgIcon>
                                    <span>
                                        {{
                                            message
                                        }}
                                    </span>
                                </ErrorMessage>

                                <div class="radio">
                                    <ul>
                                        <li v-for="(type, index) in paymentTypeList"
                                            :key="index"
                                            :class="{
                                                selectLi: type == selectedPayment
                                            }"
                                            @click="pickPaymentType(type)">
                                            <div
                                                class="radioBtn">
                                                <div></div>
                                            </div>
                                            <h3>
                                                {{ type }}
                                            </h3>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </fieldset>

                        <div class="btnWrapper">
                            <button>送出</button>
                        </div>
                    </form>

                    <!-- <pre>{{ values }}</pre> -->
                </VForm>
            </div>

            <div class="right">
                <CheckCartList
                    :selectedDelivery="selectedDelivery">
                </CheckCartList>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * todo:  郵遞區號驗證, 折扣碼,金流api, member DB
 * doing: 
 * ------------------------------------------
 * //delivery payment bind value
 * //profile
 * //表單驗證(宅配、超取擇一)
 * //驗證電話
 * //postal code api
 * //right part list building
 */

import CheckCartList from './CheckCartList/CheckCartList.vue';
import { useCartStore } from '@/store/cartStore';
import { storeToRefs } from 'pinia';
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import {
    Field as VField, Form as VForm, ErrorMessage, defineRule, configure,
} from 'vee-validate';
import * as yup from 'yup';
import { city } from '@/hooks/useGetCityList';
import { getPostalCode } from '@/api/postal';

// 購物車
const cartStore = useCartStore();
const { isCheckout } = storeToRefs(cartStore);
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

const addrVerify = (val: string | undefined) => {
    return Boolean(val && val.split(',').every(item => item !== ''))
}

const contactNoVerify = (val: string | undefined) => {
    if (!val) return false;

    switch (val[0]) {
        case '0':
            return /09\d{2}(\d{6}|-\d{3}-\d{3})/.test(val);
        case '+':
            return /^\+?[1-9]\d{1,14}$/.test(val);
        default:
            return false;
    }
}

let schema = yup.object({
    email: yup.string().trim().required('此欄不能空白').email(),
    consigneeName: yup.string().trim().required('此欄不能空白'),
    contactNo:
        yup.string().trim().required('此欄不能空白')
            .test('phone-test', '請輸入有效的電話號碼', contactNoVerify),
    saveInfo: yup.boolean(),
    subNews: yup.boolean(),
    deliveryType: yup.string(),
    paymentType: yup.string(),
})

const verifiedSchema = computed(() => {
    if (selectedDelivery.value == '宅配') {
        schema = schema.shape({
            city: yup.string().trim().test('addr-test', '此欄不能空白', addrVerify).required('此欄不能空白'),
            postal: yup.string().trim().required('此欄不能空白'),
            address: yup.string().trim().required('此欄不能空白'),
        })
    } else {
        schema = schema.shape({
            city: yup.string().trim(),
            postal: yup.string().trim(),
            address: yup.string().trim(),
        })
    }
    return schema
})

function onSubmit(values?: Record<string, any>) {
    console.log(JSON.stringify(values, null, 2));
}

// const expressSchema = yup.object({
//     email: yup.string().trim().required('此欄不能空白').email(),
//     consigneeName: yup.string().trim().required('此欄不能空白'),
//     city: yup.string().trim().test('addr-test', '此欄不能空白', addrVerify).required('此欄不能空白'),
//     postal: yup.string().trim().required('此欄不能空白'),
//     address: yup.string().trim().required('此欄不能空白'),
//     contactNo: yup.string().trim().required('此欄不能空白'),
//     saveInfo: yup.boolean(),
//     subNews: yup.boolean(),
//     deliveryType: yup.string(),
//     paymentType: yup.string(),
// })
// const inStoreSchema = yup.object({
//     email: yup.string().trim().required('此欄不能空白').email(),
//     consigneeName: yup.string().trim().required('此欄不能空白'),
//     city: yup.string().trim(),
//     postal: yup.string().trim(),
//     address: yup.string().trim(),
//     contactNo: yup.string().trim().required('此欄不能空白'),
//     saveInfo: yup.boolean(),
//     subNews: yup.boolean(),
//     deliveryType: yup.string(),
//     paymentType: yup.string(),
// })


// 開啟選擇縣市表單
const isOptionsOpen = ref(false);
function toggleOpenOptions() {
    isOptionsOpen.value = !isOptionsOpen.value
}

function clickOuter() {
    if (isOptionsOpen.value) {
        toggleOpenOptions()
    }
}

// 引入 city 類
// 縣市列表
const showCityList = city.cityList;

// selected city
const selectedCity = reactive({
    city: '',
    code: ''
});
function pickCity(city: typeof selectedCity) {
    ({ city: selectedCity.city, code: selectedCity.code } = city);
    switchTab('town');
}

// 鄉鎮列表
const townList = ref<string[]>([]);
watch(selectedCity, async (nVal) => {
    if (nVal) {
        townList.value = [];
        townList.value = await city.getShowTownList(nVal.city);
        selectedTown.value = '';
    }
})
// selected town
const selectedTown = ref('');
function pickTown(town: string) {
    selectedTown.value = town
}

// city input value
const inputCity = computed(() => {
    return selectedCity.city + ', ' + selectedTown.value
})

// 切換城市選取
const currTab = ref('city');
function switchTab(tab: string) {
    currTab.value = tab;
}

// 宅配地址
const addrInput = ref('');
const updateAddrInput = (value: string) => {
    addrInput.value = value.trim();
};

const expressAddr = computed(() => {
    return selectedCity.city + selectedTown.value + addrInput.value
})



// 開啟選擇門市
interface Branch {
    branch: string | null,
    addr: string | null
}
const storeAddrList = ref([
    {
        branch: '分店一',
        addr: '桃園市中壢區中平路1號'
    },
    {
        branch: '分店二',
        addr: '桃園市中壢區中和路146號'
    },
    {
        branch: '分店三',
        addr: '桃園市中壢區中和路114號中平路8號1樓及101樓2樓'
    },
])
const openStoreAddrList = ref(false);
function toggleOpenStoreAddrList() {
    openStoreAddrList.value = !openStoreAddrList.value
}

// 選擇門市
const selectedStore = ref<Branch>({
    branch: null,
    addr: null
});
function pickSelectedStore(branch: Branch) {
    ({ branch: selectedStore.value.branch, addr: selectedStore.value.addr } = branch);
    toggleOpenStoreAddrList();
}

// 配送方式 input
const deliveryTypeList = ref(['宅配', '超商']);
const selectedDelivery = ref('宅配');

function pickDeliveryType(type: string) {
    selectedDelivery.value = type
}

// 付款方式 input
const paymentTypeList = ref(['匯款', '信用卡', '貨到付款', '電子支付']);
const selectedPayment = ref('匯款');

function pickPaymentType(type: string) {
    selectedPayment.value = type
}

// 郵遞區號請求
const postalCode = ref('');
const postalCodeAddr = computed(() => {
    const adrs = expressAddr.value;
    return {
        adrs
    }
})
async function autoFillPostalCode() {
    try {
        const { zipcode6 } = await getPostalCode(postalCodeAddr.value);
        postalCode.value = zipcode6 ?? ''
    } catch (error) {
        console.log(autoFillPostalCode.name, error);
    }

}

watch([() => selectedCity.city, selectedTown, addrInput], async (nVal) => {
    if (nVal.every(item => item && item !== '')) {
        try {
            await autoFillPostalCode();
        } catch (error) {
            console.log(error);
        }
    }
})

onMounted(() => {
    if (!isCheckout.value) toggleIsCheckout();
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

        &>div {
            position: relative;
        }

        & div:has(input:focus)>label:not(.staticLabel),
        & div:has(input:not(:placeholder-shown))>label:not(.staticLabel) {
            transform: translateY(calc(-100% - 10px)) scale(0.8);
            background: linear-gradient(to bottom, $primaryBacColor 49%, white 50%);
            // background-color: $primaryBacColor;
        }

    }

    .topContent {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .loginLink {
            cursor: pointer;
            color: $btnBacColor_light;
            font-size: .75rem;
            margin-right: .5rem;
            text-decoration: underline;
            text-underline-offset: 3px;

        }
    }
}

.formWrapper {
    position: relative;
    margin-bottom: 1.75rem;

    input {
        @include WnH(100%, 48px);
        padding: 0 1rem;
        border: 1px solid gray;
        border-radius: .5rem;
        // background-color: $primaryBacColor;
        background-color: white;
    }

    .invalidInput {
        border: 1px solid #b3261e;
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

        &:is(.staticLabel) {
            font-size: 1rem;
        }
    }

    .selectingOptions {
        transform: translateY(calc(-100% - 10px)) scale(0.8);
        background: linear-gradient(to bottom, $primaryBacColor 49%, white 50%);
    }

    .hideInput {
        color: transparent;
    }

    .errorMsg {
        @include flex-center-center;
        flex-direction: row;
        gap: .5rem;
        color: #b3261e;
        text-wrap: nowrap;
        position: absolute;
        bottom: -75%;
        left: 0%;
        transform: translate(0%, -50%);
    }
}

.city_postal {
    cursor: pointer;
    display: flex;
    // margin: 1rem 0;
    gap: .5rem;

    &>div {
        flex: 1;
    }
}

.selectWrapper {
    @include WnH(100%, 48px);
    position: absolute;
    left: 0rem;
    top: 0;

    .showCity {
        padding-left: 1rem;
        line-height: 48px;
    }

    .switchIcon {
        position: absolute;
        right: .5rem;
        top: 50%;
        transform: translateY(-50%) rotate(-90deg);
        transition: transform .3s ease;
    }

    .optionOpen {
        transform: translateY(-50%) rotate(0deg);
    }

    .optionsWrapper {
        width: 100%;
        height: 250px;
        position: absolute;
        top: calc(100%);
        left: 0;
        z-index: 2;
        background-color: white;
        border: 1px solid black;
        border-radius: .5rem;

        display: flex;
        flex-direction: column;

        .title {
            border-bottom: 1px solid black;
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
                line-height: 36px;
                border-bottom: 1px solid gray // margin: .5rem 0;
            }
        }
    }
}

.addressWrapper,
.contactNoWrapper {
    // margin: 1rem 0;
}

.staticLabel {
    transform: none;
    margin-left: .5rem;
    position: static;
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
    margin-bottom: 1rem;

    input {
        @include WnH(16px);
    }
}

.radio {
    ul {
        display: flex;
        flex-direction: column;
        background-color: white;

        .selectLi {
            background-color: rgba(62, 163, 80, 0.1);
            border-color: #3EA350;
            box-shadow: 0 0 1px 1px #3EA350;

            &:not(:first-of-type) {
                border-top: 1px solid #3EA350;
            }

            .radioBtn {
                background-color: $secondBacColor;

                &>div {
                    background-color: white;
                }
            }
        }
    }

    li {
        // @include WnH(100%, 48px);
        min-height: 48px;
        padding: .5rem 0;
        padding-left: 1rem;
        // outline: 1px solid black;
        border: 1px solid black;
        line-height: 36px;

        display: flex;
        // justify-content: space-between;
        align-items: center;
        gap: 1rem;
        position: relative;

        &:not(:first-of-type) {
            // border-top: none;
        }


        h3 {
            font-size: 18px;
        }

        .radioBtn {
            @include WnH(16px);
            min-width: 16px;
            content: '';
            border: 1px solid gray;
            background-color: white;

            border-radius: 100%;
            position: relative;

            align-self: self-start;
            margin-top: 10px;

            &>div {
                @include WnH(6px);
                content: '';
                position: absolute;
                left: 50%;
                top: 50%;

                border-radius: 100%;
                transform: translate(-50%, -50%);
            }
        }

        .express {
            display: flex;
            justify-content: center;
            align-items: center;

            h3 {
                text-wrap: nowrap;
            }

            p {
                font-size: 14px;
                margin-left: 1rem;
            }
        }

        .radioContent {
            width: 100%;
        }

        .storeAddr {
            width: 100%;
            max-height: 0;
            display: flex;
            align-items: center;
            overflow: hidden;
            transition: max-height .5s ease;

            .textWrapper {
                padding-right: .5rem;
            }

            p {
                font-size: 12px;
                line-height: 1.5;
            }
        }

        .showStoreAddr {
            max-height: 150px;
        }

        .chooseStoreBtn {
            background-color: $btnBacColor_light;
            height: fit-content;
            color: $primaryBacColor;
            font-size: .75rem;
            padding: 0 .25rem;
            border: 1px solid green;
            border-radius: .5rem;
            display: flex;
            margin-left: auto;
            margin-right: 1rem;
            text-wrap: nowrap;
            // position: absolute;
            // right: 1rem;
            // top: 50%;
            // transform: translateY(-50%);
            // z-index: 2;
        }
    }
}

.btnWrapper {
    width: 80%;
    margin: 0 auto;
    margin-top: 2rem;
    font-size: 1.5rem;

    button {
        @include WnH(100%, 48px);
        border: 1px solid green;
        border-radius: .5rem;
        background-color: $btnBacColor;
        color: $primaryBacColor;
    }
}

.storeAddrList {
    // @include WnH(100%, 200px);
    min-height: 200px;
    min-width: 300px;
    background-color: white;
    border: 1px solid gray;
    border-radius: 1rem;
    box-shadow: 2px 2px 6px 2px gray;

    padding: 1rem;

    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;

    &>h2 {
        font-size: 1.25rem;
        position: absolute;
        top: 1rem;
        left: 50%;
        transform: translateX(-50%);
    }

    .cancelIcon {
        cursor: pointer;
        justify-content: flex-end;
        margin: .25rem 0 1rem 0;
    }

    ul {
        display: flex;
        flex-direction: column;
        gap: 8px;

        li {
            cursor: pointer;
            line-height: 32px;
            border: 1px solid black;
            padding: .5rem;

            // &:not(:first-of-type) {
            //     border-top: none;
            // }

            &:hover {
                // border-top: 1px solid black;
                outline: 1px solid black;
            }
        }
    }
}
</style>