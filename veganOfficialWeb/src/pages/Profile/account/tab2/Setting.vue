<template>
    <div>
        <div class="recipientInfo">
            <h2>
                收件資訊
            </h2>

            <main>
                <div v-show="Object.keys(showShippingInfo).length == 0"
                    class="emptyList">
                    沒有已儲存的收件資訊
                </div>

                <div class="infoContainer"
                    v-show="Object.keys(showShippingInfo).length !== 0">
                    <div class='content'>
                        <div class="shippingType">
                            <h3>
                                {{
                                    showShippingInfo.deliveryType
                                }}
                            </h3>
                        </div>

                        <div class="infoTitle">
                            <p>
                                <span class="highlightName">
                                    {{
                                        showShippingInfo.consigneeName
                                    }}
                                </span>
                                <span class="infoNo">
                                    {{
                                        showShippingInfo.contactNo
                                    }}
                                </span>
                            </p>
                        </div>

                        <div>
                            <p>
                                {{ showShippingInfo.address
                                }}
                            </p>
                        </div>

                        <div class="infoAddr">
                            <p>
                                <span>
                                    {{ showShippingInfo.city
                                    }}
                                </span>
                                <span>
                                    {{
                                        showShippingInfo.postal
                                    }}
                                </span>
                            </p>
                        </div>

                        <div>
                            <p>
                                {{ showShippingInfo.email }}
                            </p>
                        </div>
                    </div>

                    <div class="edit">
                        <button @click="toggleDialogOpen">
                            編輯
                        </button>

                        <button @click="toggleConfirmOpen">
                            刪除
                        </button>
                    </div>
                </div>

                <transition name="editDialog">
                    <VForm as="div" ref="VFormRef"
                        v-if="isUserHasSavedForm !== null && isFormCreated"
                        v-show="isDialogOpen"
                        class="editDialog"
                        v-slot="{ handleSubmit, submitCount, values, meta, setValues, resetForm }"
                        :validation-schema="FormSchema"
                        :initial-values="showShippingInfo"
                        @click="clickOuter">
                        <form action="" class="dialogForm">
                            <div class="formTitle">
                                <h3>
                                    編輯收件資訊
                                </h3>
                            </div>
                            <fieldset>
                                <div>
                                    <!-- <VField id="email"
                                        name="email"
                                        type="email"
                                        placeholder="信箱"
                                        autocomplete="off">
                                    </VField> -->
                                    <VField name="email"
                                        v-slot="{ field, meta, value }">
                                        <input id="email"
                                            type="email"
                                            autocomplete="off"
                                            placeholder="信箱"
                                            :="field"
                                            :class="{
                                                floatLabel: value && value.length > 0,
                                                invalidInput: !meta.valid && submitCount > 0
                                            }">
                                    </VField>

                                    <label
                                        for="email">聯絡信箱</label>

                                    <ErrorMessage as="div"
                                        name="email"
                                        v-slot="{ message }"
                                        class="errorMsg"
                                        :style="{
                                            opacity: submitCount > 0 ? 1 : 0
                                        }">
                                        <SvgIcon
                                            name="QNR_alert"
                                            width="18px"
                                            height="18px"
                                            color="#b3261e">
                                        </SvgIcon>
                                        <span>
                                            {{ message
                                            }}
                                        </span>
                                    </ErrorMessage>
                                </div>
                            </fieldset>

                            <fieldset>
                                <div>
                                    <!-- <VField
                                        id="consigneeName"
                                        name="consigneeName"
                                        type="text"
                                        placeholder="姓名">
                                    </VField> -->
                                    <VField
                                        name="consigneeName"
                                        v-slot="{ field, meta, value }">
                                        <input
                                            id="consigneeName"
                                            autocomplete="off"
                                            type="text"
                                            placeholder="姓名"
                                            :="field"
                                            :class="{
                                                floatLabel: value && value.length > 0,
                                                invalidInput: !meta.valid && submitCount > 0
                                            }">
                                    </VField>
                                    <label
                                        for="consigneeName">姓名</label>

                                    <ErrorMessage as="div"
                                        name="consigneeName"
                                        v-slot="{ message }"
                                        :style="{
                                            opacity: submitCount > 0 ? 1 : 0
                                        }">
                                        <SvgIcon
                                            name="QNR_alert"
                                            width="18px"
                                            height="18px"
                                            color="#b3261e">
                                        </SvgIcon>
                                        <span>
                                            {{ message
                                            }}
                                        </span>
                                    </ErrorMessage>
                                </div>
                            </fieldset>

                            <fieldset>
                                <div>
                                    <VField name="address"
                                        v-slot="{ field, meta, value }">
                                        <input id="address"
                                            type="text"
                                            autocomplete="off"
                                            placeholder="地址"
                                            :="field"
                                            :class="{
                                                floatLabel: value && value.length > 0,
                                                invalidInput: !meta.valid && submitCount > 0
                                            }"
                                            @blur="updateAddrInput(field.value)">
                                    </VField>

                                    <label
                                        for="address">地址</label>

                                    <ErrorMessage as="div"
                                        name="address"
                                        v-slot="{ message }"
                                        :style="{
                                            opacity: submitCount > 0 ? 1 : 0
                                        }">
                                        <SvgIcon
                                            name="QNR_alert"
                                            width="18px"
                                            height="18px"
                                            color="#b3261e">
                                        </SvgIcon>
                                        <span>
                                            {{ message
                                            }}
                                        </span>
                                    </ErrorMessage>
                                </div>
                            </fieldset>

                            <fieldset>
                                <div class="selectWrapper"
                                    @click.stop>
                                    <div class="hideField">
                                        <VField id="city"
                                            name="city"
                                            type="text"
                                            v-model="inputCity"
                                            v-slot="{ field, meta }">
                                            <input id="city"
                                                :="field"
                                                placeholder="縣市"
                                                :class="{
                                                    invalidInput: !meta.valid && submitCount > 0
                                                }">
                                        </VField>


                                        <ErrorMessage
                                            as="div"
                                            name="city"
                                            v-slot="{ message }"
                                            :style="{
                                                opacity: submitCount > 0 ? 1 : 0
                                            }">
                                            <SvgIcon
                                                name="QNR_alert"
                                                width="18px"
                                                height="18px"
                                                color="#b3261e">
                                            </SvgIcon>
                                            <span>
                                                {{
                                                    message
                                                }}
                                            </span>
                                        </ErrorMessage>
                                    </div>

                                    <div class="selectContainer"
                                        @click.self="toggleOpenOptions">
                                        <label for="city"
                                            :class="{
                                                selectingOptions: isOptionsOpen || selectedCity.city !== ''
                                            }">縣市</label>

                                        <div class="selector"
                                            @click="toggleOpenOptions">
                                            <span
                                                v-show="selectedCity.city">
                                                {{
                                                    inputCity
                                                }}
                                            </span>
                                        </div>

                                        <div class="icon"
                                            :class="{
                                                optionOpen: isOptionsOpen
                                            }"
                                            @click="toggleOpenOptions">
                                            <SvgIcon
                                                class="switchIcon"
                                                name="ListArrowDown"
                                                width="24px"
                                                height="24px"
                                                color="black">
                                            </SvgIcon>
                                        </div>

                                        <transition
                                            name="optionsWrapper">
                                            <div class="optionContainer"
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

                                                <div class="tabs"
                                                    ref="tabsRef">
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
                                                        <Spinner
                                                            v-show="showSpinner">
                                                        </Spinner>
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

                                <div>
                                    <div
                                        class='postalWrapper'>
                                        <VField
                                            v-model="postalCode"
                                            name="postal"
                                            v-slot="{ field, meta, value }">
                                            <input
                                                type="text"
                                                id="postal"
                                                autocomplete="off"
                                                placeholder="郵遞區號"
                                                :="field"
                                                :class="{
                                                    floatLabel: value && value.length > 0,
                                                    invalidInput: !meta.valid && submitCount > 0
                                                }">
                                        </VField>

                                        <label
                                            for="postal">郵遞區號</label>

                                        <Spinner
                                            class="postalSpinner"
                                            v-show="postalSpinner">
                                        </Spinner>

                                        <ErrorMessage
                                            as="div"
                                            name="postal"
                                            v-slot="{ message }"
                                            :style="{
                                                opacity: submitCount > 0 ? 1 : 0
                                            }">
                                            <SvgIcon
                                                name="QNR_alert"
                                                width="18px"
                                                height="18px"
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
                            </fieldset>

                            <fieldset>
                                <div>
                                    <!-- <VField id="contactNo"
                                        name="contactNo"
                                        type="tel"
                                        placeholder="聯絡電話">
                                    </VField> -->
                                    <VField name="contactNo"
                                        v-slot="{ field, meta, value }">
                                        <input type="tel"
                                            id="contactNo"
                                            placeholder="連絡電話"
                                            :="field"
                                            :class="{
                                                floatLabel: value && value.length > 0,
                                                invalidInput: !meta.valid && submitCount > 0
                                            }">
                                    </VField>
                                    <label
                                        for="contactNo">聯絡電話</label>

                                    <ErrorMessage as="div"
                                        name="contactNo"
                                        v-slot="{ message }"
                                        :style="{
                                            opacity: submitCount > 0 ? 1 : 0
                                        }">
                                        <SvgIcon
                                            name="QNR_alert"
                                            width="18px"
                                            height="18px"
                                            color="#b3261e">
                                        </SvgIcon>
                                        <span>
                                            {{ message
                                            }}
                                        </span>
                                    </ErrorMessage>
                                </div>
                            </fieldset>

                            <div class="dialogBtn">
                                <button
                                    @click="handleSubmit($event, handleInfoSubmit(meta.dirty))">
                                    儲存
                                </button>
                                <button type="button"
                                    @click="toggleDialogOpen($event, resetForm)">
                                    取消
                                </button>
                            </div>
                        </form>
                    </VForm>
                </transition>

                <div class="confirmDeleteDialog"
                    v-show="confirmDeleteOpen">
                    <div class="dialogContainer">
                        <h3>
                            確認刪除？
                        </h3>

                        <div class="btnWrapper">
                            <button @click="handleDelete">
                                確定
                            </button>
                            <button
                                @click="toggleConfirmOpen">
                                取消
                            </button>
                        </div>
                    </div>
                </div>

                <Spinner
                    v-show="isUserHasSavedForm == null">
                </Spinner>
            </main>
        </div>
        <div class="emailVerify" v-if="user.email">
            <h2>
                個人檔案
            </h2>

            <div class="contentWrapper">
                <h3>
                    帳號信箱
                </h3>

                <div class="accDetail">
                    <p>
                        {{ user.email }}
                        <small v-if="user.verified" :class="{
                            isVerified: user.verified
                        }">
                            已驗證
                        </small>
                        <small v-else>
                            未驗證
                        </small>
                    </p>

                    <button v-if="!user.verified"
                        @click="verifyEmail">
                        <span :class="{
                            isRequesting
                        }">
                            發送驗證信
                        </span>
                        <Spinner v-show="isRequesting">
                        </Spinner>
                    </button>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch, watchEffect, nextTick, useTemplateRef, onBeforeMount } from 'vue';
import {
    Field as VField, Form as VForm, ErrorMessage, defineRule, configure,
    type FormMeta, type SubmissionContext, type FormState,
} from 'vee-validate';
import * as yup from 'yup';
import { useUserStore } from '@/store/userStore';
import { storeToRefs } from 'pinia';
import { city } from '@/hooks/useGetCityList';
import { getPostalCode } from '@/api/postal';
import type { ShippingInfo } from '@/api/order/type';
import { deleteShippingInfo, saveShippingInfo } from '@/api/shippingInfo/shippingInfo';
import { useToastStore } from '@/store/toastStore';
import { reqCheckUserVerified, reqSendVerifyEmail } from '@/api/userAuth';

//pinia store
const userStore = useUserStore();
const { setUserShippingInfo, deleteSavedInfo, getSavedShippingInfo } = userStore;
const { userSavedCheckoutForm, userToken, user, isUserHasSavedForm } = storeToRefs(userStore);
const toastStore = useToastStore();
const { addNotification } = toastStore;

const showShippingInfo = computed(() => {
    return { ...userSavedCheckoutForm.value }
})

const isFormCreated = computed(() => {
    const length = Object.keys(showShippingInfo.value).length
    return length !== 0
})

async function initUserShippingForm() {
    try {
        if (isUserHasSavedForm.value === false || Object.keys(showShippingInfo.value).length !== 0) return
        await getSavedShippingInfo();
        return
    } catch (error) {
        console.log(error);
    }
}

function initForm() {
    if (showShippingInfo.value.city && showShippingInfo.value.postal) {
        [selectedCity.city = '', selectedTown.value = ''] = showShippingInfo.value.city.split(', ');
        postalCode.value = showShippingInfo.value.postal
    }
}
const VFormRef = useTemplateRef('VFormRef');

watch(() => showShippingInfo.value.email, (nVal) => {
    nextTick(() => {
        VFormRef.value?.resetForm();
    })
}, { immediate: true })

// 表單
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
};

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
};

const FormSchema = yup.object({
    email: yup.string().trim().required().email(),
    consigneeName: yup.string().trim().required(),
    address: yup.string().trim().required(),
    city: yup.string().trim().test('addr-test', errMsg.required, addrVerify).required('此欄不能空白'),
    postal: yup.string().trim().required()
        .matches(/^[0-9]{3,6}$/, errMsg.postal)
        .min(3, errMsg.postal)
        .max(6, errMsg.postal),
    contactNo:
        yup.string().trim().required()
            .test('phone-test', errMsg.contactNo, contactNoVerify),
});

// 初始化表格


// show edit dialog
const isDialogOpen = ref(false);
function toggleDialogOpen(e?: Event, cb?: () => void) {
    isDialogOpen.value = !isDialogOpen.value
    if (cb) cb()
}

function clickOuter() {
    if (isOptionsOpen.value) {
        toggleOpenOptions()
    }
}

// show city options
const isOptionsOpen = ref(false);
function toggleOpenOptions() {
    isOptionsOpen.value = !isOptionsOpen.value
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
})

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
        const { zipcode6, zipcode } = await getPostalCode(postalCodeAddr.value);
        postalCode.value = zipcode6 || zipcode || '';
    } catch (error) {
        console.log('autoFillPostalCode', error);
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

// 表單驗證

// 編輯 info
const loadingNewInfo = ref(false);
function loadingTimer() {
    setTimeout(() => {
        loadingNewInfo.value = false;
    }, 1500);
}
function handleInfoSubmit(dirty: boolean) {
    return async (form: Record<string, any>, ctx: SubmissionContext) => {
        const data = form as ShippingInfo;
        const token = userToken.value;
        if (!token || !data || !dirty) {
            ctx.resetForm();
            toggleDialogOpen();
            return
        }

        try {
            loadingNewInfo.value = true;
            const { result, state } = await saveShippingInfo(data, token);
            if (result) {
                setUserShippingInfo(result);
                toggleDialogOpen();
                loadingTimer();
                addNotification(`修改成功`)
            }

        } catch (error) {
            console.log(error);
        }
    }
}
// async function handleInfoSubmit(form: Record<string, any>) {
//     const data = form as ShippingInfo;
//     const token = userToken.value;
//     if (!token || !data || !isFormEdit.value) return

//     try {
//         loadingNewInfo.value = true;
//         const { result, state } = await saveShippingInfo(data, token);
//         if (result) {
//             setUserShippingInfo(result);
//             toggleDialogOpen();
//             loadingTimer();
//         }

//     } catch (error) {
//         console.log(error);
//     }
// }

// 刪除 info
const confirmDeleteOpen = ref(false);
function toggleConfirmOpen() {
    confirmDeleteOpen.value = !confirmDeleteOpen.value
}

async function handleDelete() {
    const token = userToken.value;
    if (!token) return
    try {
        loadingNewInfo.value = true;
        await deleteShippingInfo(token);
        deleteSavedInfo();
        loadingTimer();
        toggleConfirmOpen();
        addNotification(`刪除成功`)
    } catch (error) {
        console.log(error);
    }
}

// check verified
async function checkVerified() {
    if (user.value.verified) return
    try {
        const { state } = await reqCheckUserVerified();
        if (state == 'confirm') {
            user.value.verified = true
        } else {
            user.value.verified = false
        }
    } catch (error) {
        console.log(error);
    }
}

// verified request
const isRequesting = ref(false);

async function verifyEmail() {
    if (!user.value.email) return
    const params = {
        to: user.value.email
    }
    try {
        isRequesting.value = true
        const res = await reqSendVerifyEmail(params);
        if (res.state == 'confirm') {
            isRequesting.value = false
            addNotification('發送成功，請至信箱點擊驗證連結')
        }
    } catch (error) {
        isRequesting.value = false
        addNotification('發送失敗，請重試')
    }
}

onMounted(() => {
    initForm();
    checkVerified();
    // initUserShippingForm()
})

</script>

<style scoped lang="scss">
* {
    // outline: 1px black solid;
}

%edit_button {
    border: 1px solid $btnBacColor;
    border-radius: 1rem;
    background-color: $btnBacColor;
    color: $primaryBacColor;

    &:hover {
        filter: brightness(1.2);
    }
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

.recipientInfo {
    margin-bottom: 1rem;

    main {
        position: relative;
    }
}

.emptyList {
    text-align: center;
    margin-top: 2.5rem;
    color: rgba(0, 0, 0, 0.5);
    // width: calc(100% / 5.5 * 5);
}

.infoContainer {
    display: flex;
    justify-content: space-between;
    padding: 0 3rem;

    p {
        color: rgba(0, 0, 0, 0.8);
    }

    .content {
        position: relative;

        div {
            margin-bottom: .25rem;
        }
    }
}

.shippingType h3 {
    font-size: 1.5rem;
    margin-bottom: .5rem;
}

.infoTitle {}

.highlightName {
    font-size: 1.25rem;
    color: black;

    padding-right: .5rem;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        right: 0;
        top: 15%;
        width: 1px;
        height: 80%;
        background-color: gray;
    }
}

.infoNo {
    margin-left: .5rem;
    line-height: 30px;
    vertical-align: baseline;
}

.infoAddr {
    span:nth-of-type(1) {
        margin-right: .25rem;
    }

    span:nth-of-type(2) {
        margin-left: .25rem;
    }
}

.edit {
    display: flex;
    gap: .5rem;
    align-self: self-end;
    margin-right: 2rem;

    button {
        @include WnH(60px, 30px);
        @extend %edit_button;
    }
}

.editDialog {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;

    width: 100vw;
    height: 100vh;

    background-color: rgba(0, 0, 0, 0.25);


    form {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        background-color: $primaryBacColor;

        padding: 1.5rem 3rem;
        border-radius: 1rem;

        transform-origin: top left;
    }

    .formTitle h3 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }

    fieldset {
        min-width: 400px;
        margin-bottom: 2rem;

        input {
            @include WnH(100%, 36px);
            font-size: .9rem;
            padding: 0 1rem;
            border: 1px solid gray;
            border-radius: .5rem;
            background-color: white;
            padding-left: 1rem;
        }

        &>div:has(label) {
            position: relative;

            label {
                position: absolute;
                left: 1rem;
                top: 50%;
                transform: translateY(-50%);

                font-size: .9rem;
                color: rgba(0, 0, 0, 0.75);

                border-radius: 4px;
                text-wrap: nowrap;
                transition: transform .3s ease;
                transform-origin: left;
                user-select: none;
                pointer-events: none;
            }
        }

        &>div {
            position: relative;

            &>div[role="alert"] {
                @include flex-center-center;
                flex-direction: row;
                gap: 2px;
                color: #b3261e;
                font-size: .8rem;
                text-wrap: nowrap;
                position: absolute;
                bottom: -55%;
                left: .25rem;
                // transform: translate(0%, 100%);
                transition: opacity .15s;
            }
        }

        &:has(.hideField) {
            display: flex;
            gap: 1rem;
            width: 100%;

            &>div {
                // width: calc((100% - 1rem) / 2);
                flex: 1;
                // max-width: 50%;
            }
        }

        & div:has(input:focus)>label {
            transform: translateY(calc(-100% - 6px)) scale(0.9);
            background: linear-gradient(to bottom, $primaryBacColor 49%, white 50%);
        }

        & div:has(.floatLabel)>label {
            transform: translateY(calc(-100% - 6px)) scale(0.9);
            background: linear-gradient(to bottom, $primaryBacColor 49%, white 50%);
        }

        // & div:has(input:focus)>label,
        // & div:has(input:not(:placeholder-shown))>label {
        //     transform: translateY(calc(-100% - 6px)) scale(0.9);
        //     background: linear-gradient(to bottom, $primaryBacColor 49%, white 50%);
        // }

        input::placeholder {
            opacity: 0;
        }
    }
}

.selectWrapper {
    width: 100%;

    .selectingOptions {
        transform: translateY(calc(-100% - 6px)) scale(0.9);
        background: linear-gradient(to bottom, $primaryBacColor 49%, white 50%);
    }
}

.hideField {
    display: none;
    // visibility: hidden;
}



.selectContainer {
    position: relative;
}

.selector {
    @include WnH(100%, 36px);
    cursor: pointer;
    font-size: .9rem;
    padding: 0 1rem;
    border: 1px solid gray;
    border-radius: .5rem;
    background-color: white;
    padding-left: 1rem;

    span {
        line-height: 36px;
        user-select: none;
    }
}



.icon {
    cursor: pointer;
    position: absolute;
    right: .5rem;
    top: 50%;
    transform: translateY(-50%) rotate(-90deg);
    transition: transform .3s ease;
}

.optionOpen {
    transform: translateY(-50%) rotate(0deg);
}

.optionContainer {
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
}

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
    overflow-y: auto;
    scrollbar-width: thin;
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

.postalWrapper {
    position: relative;

    &>div[role="alert"] {
        @include flex-center-center;
        flex-direction: row;
        gap: 2px;
        color: #b3261e;
        font-size: .8rem;
        text-wrap: nowrap;
        position: absolute;
        bottom: -55%;
        left: .25rem;
        // transform: translate(0%, 100%);
        transition: opacity .15s;
    }
}

.dialogBtn {
    display: flex;
    gap: .75rem;
    justify-content: flex-end;

    button {
        @include WnH(60px, 30px);
        @extend %edit_button;
    }
}

.editDialog-enter-active,
.editDialog-leave-active {
    transition: opacity .3s;

    .dialogForm {
        transition: transform .3s .1s;
    }
}

.editDialog-enter-from,
.editDialog-leave-to {
    opacity: 0;

    .dialogForm {
        transform: scale(.9) translate(-50%, -50%);
    }
}

.editDialog-enter-to,
.editDialog-leave-from {
    opacity: 1;

    .dialogForm {
        transform: scale(1) translate(-50%, -50%);
    }
}

.confirmDeleteDialog {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;

    width: 100vw;
    height: 100vh;

    background-color: rgba(0, 0, 0, 0.25);
}

.dialogContainer {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    background-color: $primaryBacColor;

    padding: 1.5rem 3rem;
    border-radius: 1rem;

    transform-origin: top left;

    h3 {
        font-size: 1.5rem;
        margin-bottom: 2cap;
        margin-right: 3.75rem;
    }
}

.btnWrapper {
    display: flex;
    gap: .75rem;
    justify-content: flex-end;

    button {
        @include WnH(60px, 30px);
        @extend %edit_button;
    }
}

.contentWrapper {
    padding-inline: 3rem;
    margin-bottom: 2rem;

    h3 {
        font-size: 1.5rem;
        margin-bottom: .5rem;
    }

    p {
        font-size: 1.25rem;
    }

    small {
        margin-left: .5rem;
        color: $error_color;
    }

    button {
        // @include WnH(60px, 30px);
        @extend %edit_button;
        align-self: flex-end;
        height: 30px;
        padding: 0rem .75rem;
        margin-right: 2rem;
        position: relative;

        .isRequesting {
            filter: blur(2px);
        }

        div {
            // border-top: 3px solid $primaryBacColor;
        }
    }
}

.accDetail .isVerified {
    color: $btnBacColor_light;
}

.accDetail {
    display: flex;
    justify-content: space-between;
}

@include XLarge {}

@include large {}

@include medium($width: 1024px) {}

@include medium {}

@include small {
    .infoContainer {
        flex-direction: column;
        gap: .75rem;
        padding: 0 1rem;
    }

    .contentWrapper {
        padding-inline: 1rem;

        button {
            margin-right: 1rem;
        }
    }

    .accDetail {
        flex-direction: column;
        gap: .75rem;
    }

    .edit {
        margin-right: 1rem;
    }

    .editDialog {
        .dialogForm {
            width: 95%;
            padding: 1rem 2rem;
        }

        fieldset {
            min-width: max-content;
            margin-bottom: 2rem;
        }

        fieldset:has(.hideField) {
            gap: 2rem;
            flex-direction: column;
        }
    }
}

@include small($width: 430px) {
    .infoContainer {
        padding: 0 .5rem;
    }

    .contentWrapper {
        padding-inline: .5rem;

        button {
            margin-right: 0rem;
        }
    }

    .edit {
        margin-right: 0rem;
    }


}

@include small($width: 320px) {}
</style>