<template>
    <div class="container" @click="clickOuter">
        <div class="wrapper">
            <div class="left" :class="{
                loadingFilter: isFormInit
            }">
                <VForm ref="checkoutForm" as=""
                    v-slot="{ handleSubmit, submitCount, values, meta, setValues }"
                    :validation-schema="verifiedSchema"
                    :initial-values="userSavedCheckoutForm">
                    <transition name="initSpinner">
                        <div class="spinnerWrapper"
                            @click.prevent
                            v-show="!isFormInit">
                            <Spinner></Spinner>
                        </div>
                    </transition>
                    <form action=""
                        @change="handleFormChange(meta)"
                        @submit="handleSubmit($event, createOrder)">
                        <fieldset>
                            <div class="topContent">
                                <h2>
                                    聯絡信箱
                                </h2>
                                <router-link
                                    v-show="!isAuth"
                                    to="/profile"
                                    class="loginLink">
                                    登入
                                </router-link>
                            </div>

                            <div class="formWrapper">
                                <VField name="email"
                                    v-slot="{ field, meta }">
                                    <input id="email"
                                        type="email"
                                        autocomplete="email"
                                        placeholder=""
                                        :="field" :class="{
                                            invalidInput: !meta.valid && submitCount > 0
                                        }">
                                </VField>
                                <label
                                    for="email">電子信箱</label>

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
                            <h2>收件人資訊</h2>
                            <div class="formWrapper">
                                <VField name="consigneeName"
                                    v-slot="{ field, meta }">
                                    <input
                                        id="consigneeName"
                                        autocomplete="off"
                                        type="text"
                                        placeholder=""
                                        :="field" :class="{
                                            invalidInput: !meta.valid && submitCount > 0
                                        }">
                                </VField>
                                <label
                                    for="consigneeName">姓名</label>

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
                                    <input id="address"
                                        type="text"
                                        autocomplete="off"
                                        placeholder=""
                                        :="field" :class="{
                                            invalidInput: !meta.valid && submitCount > 0
                                        }"
                                        @blur="updateAddrInput(field.value)">
                                </VField>
                                <label
                                    for="address">地址</label>

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
                                        <input id="city"
                                            class="hideInput"
                                            :="field"
                                            placeholder=""
                                            :class="{
                                                invalidInput: !meta.valid && submitCount > 0
                                            }">
                                    </VField>

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
                                        <label for="city"
                                            class="" :class="{
                                                selectingOptions: isOptionsOpen || selectedCity.city !== ''
                                            }">
                                            縣市
                                        </label>
                                        <span
                                            @click="toggleOpenOptions"
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
                                        <transition
                                            name="optionsWrapper">
                                            <div class="optionsWrapper"
                                                v-show="isOptionsOpen">
                                                <div
                                                    class="title">
                                                    <span
                                                        @click="switchTab('city')">縣市</span>
                                                    <span
                                                        :class="{
                                                            'not-allowed': !selectedCity.city
                                                        }"
                                                        @click="switchTab('town')">鄉鎮</span>
                                                </div>

                                                <div ref="tabsRef"
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
                                                        <div class="spinner"
                                                            v-show="showSpinner">
                                                        </div>
                                                        <li v-for="(town, index) in townList"
                                                            :key="index"
                                                            :style="{

                                                            }"
                                                            @click="pickTown(town)">
                                                            {{
                                                                town
                                                            }}
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </transition>
                                    </div>
                                </div>

                                <div class="formWrapper">
                                    <VField
                                        v-model="postalCode"
                                        name="postal"
                                        v-slot="{ field, meta }">
                                        <input type="text"
                                            id="postal"
                                            autocomplete="off"
                                            placeholder=""
                                            :="field"
                                            :class="{
                                                invalidInput: !meta.valid && submitCount > 0
                                            }">
                                    </VField>
                                    <label
                                        for="postal">郵遞區號</label>
                                    <div class="spinner postalSpinner"
                                        v-show="postalSpinner">
                                    </div>

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
                                        id="contactNo"
                                        placeholder=""
                                        :="field" :class="{
                                            invalidInput: !meta.valid && submitCount > 0
                                        }">
                                </VField>
                                <label
                                    for="contactNo">連絡電話</label>

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
                                        :value="true"
                                        id="saveInfo">
                                </VField>
                                <label for="saveInfo"
                                    class="staticLabel">
                                    儲存寄送資訊供下次使用
                                </label>
                            </div>

                            <div
                                class="formWrapper ckboxWrapper">
                                <VField as="" name="subNews"
                                    type="checkbox"
                                    :value="true"
                                    :unchecked-value="false"
                                    v-slot="{ field }">
                                    <input type="checkbox"
                                        id="subNews"
                                        :value="true"
                                        :="field">
                                </VField>
                                <label for="subNews"
                                    class="staticLabel">收到最新資訊</label>
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

                                        <div
                                            class="storeBranch">
                                            <VField
                                                name="storeBranch"
                                                type="text"
                                                v-model="selectedStore.branch"
                                                v-show="false">
                                            </VField>
                                            <VField
                                                name="storeAddr"
                                                type="text"
                                                v-model="selectedStore.addr"
                                                v-show="false">
                                            </VField>

                                            <ErrorMessage
                                                name="storeBranch"
                                                as="div"
                                                v-slot="{ message }"
                                                class="errorMsg"
                                                v-show="selectedDelivery == '超商'"
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
                            <button>
                                <Spinner class="btnSpinner"
                                    v-show="orderProcessing && meta.valid">
                                </Spinner>
                                <span :class="{
                                    hideText: orderProcessing
                                }">
                                    送出
                                </span>
                            </button>
                        </div>
                    </form>
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
//TODO: 金流api
/**
 * doing: anonymous create order, 送出後轉至付款頁面
 * ------------------------------------------
 * //delivery payment bind value
 * //profile
 * //表單驗證(宅配、超取擇一)
 * //驗證電話
 * //postal code api
 * //right part list building
 * //郵遞區號驗證
 * //超商分店加入表單
 * //縣市選擇轉場
 * //縣市選擇spin 郵遞區號spin
 * //折扣碼
 * //label id for input
 * //折價券spinner位置不對 -> 類名衝突導致
 * //縣市選完後沒有關閉,選擇城市後選擇鄉鎮沒有移至頂端
 * //儲存結帳資訊的初始化
 * //重新整理信箱、姓名遺失->若登入過會顯示，若在結帳業重新整理會消失
 * //DB儲存user購物車
 * //購買清單組件
 */

import CheckCartList from './CheckCartList/CheckCartList.vue';
import { useCartStore } from '@/store/cartStore';
import { storeToRefs } from 'pinia';
import { computed, onMounted, onUnmounted, reactive, ref, watch, watchEffect, nextTick, useTemplateRef, onBeforeMount } from 'vue';
import {
    Field as VField, Form as VForm, ErrorMessage, defineRule, configure,
    type FormMeta,
} from 'vee-validate';
import * as yup from 'yup';
import { city } from '@/hooks/useGetCityList';
import { getPostalCode } from '@/api/postal';
import { useUserStore } from '@/store/userStore';
import { reqCreateOrder, reqGetUserShippingInfo, reqVerifyItemPrice } from '@/api/order/order';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import { reqGetUser } from '@/api/userAuth';
import { reqResetMemberCart } from '@/api/cart/CartRequest';

// 購物車
const cartStore = useCartStore();
const { isCheckout } = storeToRefs(cartStore);
const { toggleIsCheckout,
    getCartState,
    getPurchaseOrder,
    memberLoadCart,
    memberResetCart,
    refreshMemberCart } = cartStore;

// 路由
const router = useRouter();

// 表單驗證
const errMsg = {
    required: '此欄不能空白',
    email: '請輸入正確信箱格式',
    contactNo: '請輸入有效的電話號碼',
    postal: '請輸入有效的郵遞區號',
}
yup.setLocale({
    mixed: {
        required: errMsg.required
    }
})
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

yup.addMethod(yup.string, 'email', function validateEmail() {
    return this.matches(emailRegex, {
        name: 'email',
        message: errMsg.email,
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
    email: yup.string().trim().required().email(),
    consigneeName: yup.string().trim().required(),
    contactNo:
        yup.string().trim().required()
            .test('phone-test', errMsg.contactNo, contactNoVerify),
    saveInfo: yup.boolean(),
    subNews: yup.boolean(),
    deliveryType: yup.string(),
    paymentType: yup.string(),
});

const verifiedSchema = computed(() => {
    if (selectedDelivery.value == '宅配') {
        schema = schema.shape({
            city: yup.string().trim().test('addr-test', errMsg.required, addrVerify).required('此欄不能空白'),
            postal: yup.string().trim().required()
                .matches(/^[0-9]{3,6}$/, errMsg.postal)
                .min(3, errMsg.postal)
                .max(6, errMsg.postal),
            address: yup.string().trim().required(),
        })
    } else {
        schema = schema.shape({
            storeBranch: yup.string().nullable().required('請選擇門市'),
            storeAddr: yup.string().nullable().required('請選擇門市'),
            city: yup.string().trim(),
            postal: yup.string().trim(),
            address: yup.string().trim(),
        })
    }
    return schema
})

// function onSubmit(values?: Record<string, any>) {
//     console.log(JSON.stringify(values, null, 2));
// }

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
const showSpinner = ref(true);
const tabsRef = useTemplateRef('tabsRef');

watch(() => selectedCity.city, async (nVal) => {
    if (nVal) {
        showSpinner.value = true;
        townList.value = [];
        townList.value = await city.getShowTownList(nVal);
        if (townList.value.includes(selectedTown.value)) {
            showSpinner.value = false;
            return
        }
        selectedTown.value = '';
        showSpinner.value = false;
    }
}, { immediate: true })

// selected town
const selectedTown = ref('');
function pickTown(town: string) {
    selectedTown.value = town;
    isOptionsOpen.value = false;
}

// city input value
const inputCity = computed({
    get() {
        return selectedCity.city + ', ' + selectedTown.value
    },
    set(newValue) {
        [selectedCity.city, selectedTown.value] = newValue.split(', ');
    }
    // return selectedCity.city + ', ' + selectedTown.value
})

// 切換城市選取
const currTab = ref('city');
function switchTab(tab: string) {
    if (tab == 'town' && !selectedCity.city) return
    tabsRef.value!.scrollTop = 0;
    currTab.value = tab;
}


// 宅配地址
const addrInput = ref('');
const updateAddrInput = (value: string) => {
    if (value) addrInput.value = value.trim();
};

const expressAddr = computed(() => {
    return selectedCity.city + selectedTown.value + addrInput.value
})

// 配送方式 input
const deliveryTypeList = ref(['宅配', '超商']);
const selectedDelivery = ref('宅配');

function pickDeliveryType(type: string) {
    selectedDelivery.value = type;
    if (type == '宅配') {
        clearSelectedStore();
    }
}

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

// 清空門市表單
function clearSelectedStore() {
    selectedStore.value.branch = null;
    selectedStore.value.addr = null;
}


// 付款方式 input
const paymentTypeList = ref(['匯款', '信用卡', '貨到付款', '電子支付']);
const selectedPayment = ref('匯款');

function pickPaymentType(type: string) {
    selectedPayment.value = type
}

// 郵遞區號請求
const postalCode = ref('');
const postalSpinner = ref(false);
const postalCodeAddr = computed(() => {
    const adrs = expressAddr.value;
    return {
        adrs
    }
})
async function autoFillPostalCode() {
    postalSpinner.value = true;
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
            postalSpinner.value = false;
        } catch (error) {
            console.log(error);
        }
    }
})


// user store
const userStore = useUserStore();
const { getSavedShippingInfo, getUserOrderList } = userStore;
const { isAuth, user, userSavedCheckoutForm, userToken } = storeToRefs(userStore);

const checkoutForm = ref();
const isFormInit = ref(false);
userStore.$subscribe(async (_, state) => {
    if (!state.isAuth) {
        try {
            const { state, token } = await reqGetUser();
            if (state && state == 'confirm' && token) {
                userStore.login(token);
            }
        } catch (error) {
            isFormInit.value = true
            userStore.isAuth = false;
            return
        }
    } else if (state.isAuth && Object.keys(state.userSavedCheckoutForm).length != 0) {
        nextTick(() => {
            checkoutForm.value.setValues(state.userSavedCheckoutForm);
            setTimeout(() => {
                isFormInit.value = true
            }, 1000)
        })
    } else if (state.isAuth && Object.keys(state.userSavedCheckoutForm).length == 0) {
        nextTick(() => {
            checkoutForm.value.setValues({
                email: user.value.email,
                consigneeName: user.value.username
            })
            setTimeout(() => {
                isFormInit.value = true
            }, 1000)
        })
    }
}, { immediate: true })


const showEmail = computed(() => {
    return user.value.email ?? ''
})

const showUsername = computed(() => {
    return user.value.username ?? ''
})

// collect order info
const newOrder = (shippingInfo: Record<string, any>) => {
    return {
        order: {
            shippingInfo,
            purchaseOrder: getPurchaseOrder()
        }
    }
}

// req create order
const orderProcessing = ref(false);
async function createOrder(form: Record<string, any>) {
    try {
        orderProcessing.value = true;
        const { state } = await reqCreateOrder(newOrder(form));
        if (state == 'confirm') {
            window.removeEventListener('beforeunload', handleRefreshAlert);
            await refreshMemberCart();
            await getUserOrderList();
            isAuth.value ?
                await router.replace('/profile/account') :
                await router.replace('/');
        }
    } catch (error) {
        console.log(error);
    }
}

// 提示失去進度
const formHasChanged = ref(false);
const isFormFinish = ref(false);
function handleFormChange(meta: FormMeta<Record<string, string>>) {
    formHasChanged.value = meta.dirty;
    isFormFinish.value = meta.valid
}

function handleRefreshAlert(e: Event) {
    e.preventDefault();
    if (!formHasChanged.value) return
    if (confirm()) {
        // router.push()
    }
}


onBeforeRouteLeave(() => {
    if (formHasChanged.value && !isFormFinish.value) {
        const answer = confirm('離開將丟失當前進度');
        return answer
    }
})


onMounted(() => {
    if (!isCheckout.value) toggleIsCheckout();
    window.addEventListener('beforeunload', handleRefreshAlert);
})

onUnmounted(() => {
    toggleIsCheckout();
    window.removeEventListener('beforeunload', handleRefreshAlert);
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
        position: relative;

        &>*:not(.spinnerWrapper) {
            filter: blur(2px);
            transition: filter .3s;
        }
    }

    .loadingFilter>*:not(.spinnerWrapper) {
        filter: blur(0);
    }

    .spinnerWrapper {
        @include WnH(100%, 100vh);

        cursor: not-allowed;
        border-radius: 1rem;
        position: absolute;
        top: 0;
        left: 50%;
        // background-color: rgba(0, 0, 0, 0.2);
        transform: translateX(-50%);
        z-index: 2;

        &>div {
            @include WnH(40px);
        }
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
            pointer-events: auto;
        }
    }

    .selectingOptions {
        transform: translateY(calc(-100% - 10px)) scale(0.8);
        background: linear-gradient(to bottom, $primaryBacColor 49%, white 50%);
    }

    .hideInput {
        visibility: hidden;
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
        transition: opacity .15s;
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
    padding: 0 1rem;
    border: 1px solid gray;
    border-radius: .5rem;
    background-color: white;

    position: absolute;
    left: 0;
    top: 0;

    .showCity {
        // padding-left: 1rem;
        line-height: 48px;
        user-select: none;
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
        width: calc(100% + 1px);
        height: 250px;
        position: absolute;
        top: calc(100% + 6px);
        left: -1px;
        z-index: 2;
        background-color: white;
        border: 1px solid black;
        border-radius: .5rem;

        display: flex;
        flex-direction: column;
        overflow: hidden;

        .title {
            border-bottom: 1px solid black;
            width: 100%;
            display: flex;

            &>span {
                padding: .5rem;
                flex: 1;
                text-align: center;
                user-select: none;

                &:first-of-type {
                    border-right: 1px solid gray;
                }

                &:not(.not-allowed):hover {
                    box-shadow:
                        inset 0px 0 1px 1px green,
                        inset 0px 0 1px 1px green;
                }
            }
        }

        .not-allowed {
            cursor: not-allowed;
        }

        .tabs {
            overflow-y: scroll;
            height: 100%;

            &::-webkit-scrollbar {
                width: 6px;
            }

            &::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 10px;
                margin: .25rem 0;
            }

            &::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 10px;
            }

            ul {
                position: relative;
                height: 100%;
            }

            li {
                @include WnH(100%, 36px);
                padding-left: 1rem;
                line-height: 36px;
                border-bottom: 1px solid gray;
                user-select: none;

                &:hover {
                    box-shadow:
                        inset -1px 0 1px 1px green,
                        inset 0px 0 1px 1px green;
                }
            }
        }
    }

    .optionsWrapper-enter-active,
    .optionsWrapper-leave-active {
        transition: transform .15s, opacity .15s;
    }

    .optionsWrapper-enter-from,
    .optionsWrapper-leave-to {
        opacity: 0;
        transform: translateY(-2.5%);
    }

    .optionsWrapper-enter-to,
    .optionsWrapper-leave-from {
        opacity: 1;
        transform: translate(0);
    }
}

.spinner {
    width: 20px;
    height: 20px;
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

.postalSpinner {
    // transform: translate(-50%, -50%);
}

@keyframes rotation {
    0% {
        transform: translate(-50%, -50%) rotate(0deg);
    }

    100% {
        transform: translate(-50%, -50%) rotate(360deg);
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
    cursor: pointer;
    margin-bottom: .5rem;
    display: flex;
    align-items: center;

    input {
        @include WnH(16px);
    }

    input,
    label {
        cursor: pointer;
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
        cursor: pointer;
        min-height: 48px;
        padding: .5rem 0;
        padding-left: 1rem;
        border: 1px solid black;
        line-height: 36px;

        display: flex;
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
        }
    }

    .storeBranch>.errorMsg {
        top: calc(100% + .75rem + 1px);
        bottom: none;
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
        position: relative;
    }

    .btnSpinner {
        width: 24px;
        height: 24px;
        border-top-color: $primaryBacColor;
        // transform: translate(-50%, calc(-50% - 3px));
    }

    .hideText {
        opacity: 0;
    }
}

.storeAddrList {
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

            &:hover {
                outline: 1px solid black;
            }
        }
    }
}
</style>