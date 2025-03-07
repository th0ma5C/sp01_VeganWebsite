<template>
    <div class="container">
        <div class="breadCrumb">
            <Breadcrumbs :currentPage="breadcrumbProps">
            </Breadcrumbs>
        </div>
        <div class="productWrapper">
            <div class="imgWrapper">
                <transition name="mainImg">
                    <img v-show="showMainImg"
                        @click="setShowPopUpImg"
                        ref="mainImg" @load="mainImgLoaded"
                        :class="{ unLoaded: !showMainImg }"
                        v-if="productInfo"
                        :src="replaceImgFileName(productInfo) ?? ''"
                        alt="大圖">
                </transition>

                <transition name="mainImg">
                    <SvgIcon v-show="showSkeleton"
                        name="skeletonSalad"
                        class="skeleton" width="80%"
                        height="80%" color="#00430b">
                    </SvgIcon>
                </transition>
            </div>
            <transition name="popUpImg">
                <div class="popUpImg" v-show="showPopUpImg"
                    @click="setShowPopUpImg">
                    <SvgIcon class="popUpImgCancelIcon"
                        name="cancel" width="32px"
                        height="32px"></SvgIcon>
                    <img v-if="productInfo"
                        :src="replaceImgFileName(productInfo) ?? ''"
                        alt="大圖">
                </div>
            </transition>


            <div class="contentWrapper">
                <div class="topContent">
                    <h1>
                        {{ productInfo?.name }}
                    </h1>
                    <div class="ingredientWrapper">
                        <span
                            v-for="(item, index) in productInfo?.ingredients"
                            :key="index"
                            v-show="item !== ''">
                            {{ item }}
                        </span>
                    </div>
                    <p>
                        {{ productInfo?.description }}
                    </p>
                </div>

                <div class="detailWrapper">
                    <div class="sizeSelector">
                        <h2>包裝尺寸</h2>
                        <div class="selectWrapper">
                            <label
                                :for="`selectOption-${icon}`"
                                @click="setSelectAmount(index)"
                                :class="{ selected: selectedIndex == index }"
                                v-for="({ size, amount, icon }, index) in selectOptions"
                                :key="index">
                                <SvgIcon class="amountIcon"
                                    :name="`productAmount${icon}`"
                                    :width="`${amountBtnSize.width}px`"
                                    :height="`${amountBtnSize.height}px`"
                                    :key="`${amountBtnSize.height}`">
                                </SvgIcon>
                                <div class="selector">
                                    <input type="radio"
                                        :name="`selectOption-${icon}`"
                                        :value="Number(icon)"
                                        :id="`selectOption-${icon}`">
                                    <span
                                        class="marker"></span>
                                    <div class="amount">
                                        <span>
                                            {{ size }}
                                        </span>
                                        <span>
                                            {{ amount }}
                                        </span>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div class="orderCounter">
                        <span>數量</span>
                        <OrderCounter
                            v-model:amount="orderAmount">
                        </OrderCounter>
                    </div>
                    <div class="price">
                        <h2>價格</h2>
                        <span>
                            <span>
                                {{
                                    showUnitPrice.number.toFixed(0)
                                }}
                            </span>

                            <div class="discountWrapper">
                                <span
                                    :style="selectSizeStyle"
                                    v-for="(item, index) in priceDiscount"
                                    :key="index">
                                    {{ item }}
                                </span>
                            </div>
                        </span>
                        <span>
                            /
                            <div class="selectSize"
                                :style="selectSizeStyle">
                                <span
                                    v-for="({ icon }, index) in selectOptions"
                                    :key="index">
                                    {{ icon }}
                                </span>
                            </div>

                            <span>入</span>
                        </span>
                    </div>

                    <div class="addCart">
                        <button ref="addCartBtn"
                            @click="clickAddCart($event)">加入購物車</button>

                        <transition name="amountAlert">
                            <div class="amountAlert"
                                :style="amountAlertStyle"
                                v-show="showAmountAlert">
                                <span>
                                    超過最高訂購上限99！
                                </span>
                            </div>
                        </transition>

                    </div>

                    <Teleport :to="'.flyToCartContainer'"
                        :defer="true">
                        <div class="flyToCart"
                            ref="flyToCartEl" v-if="true">
                            <img :src="imgURL" alt="">
                        </div>
                    </Teleport>

                    <div class="infoFolder">
                        <div class="Wrapper"
                            v-for="({ title, content, classState }, index) in infoData"
                            :key="index">
                            <div class="title"
                                @click="setInfoOpen(index)">
                                <SvgIcon
                                    name="ListArrowDown"
                                    width="30px"
                                    height="30px"
                                    color="black"
                                    :class="{ folderIcon: classState }">
                                </SvgIcon>
                                <h2>

                                    {{ title }}
                                </h2>
                            </div>

                            <div class="folder"
                                :class="{ folderText: classState }">
                                <p>
                                    {{ content }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <section class="socialMedia">
            <swiper-container ref="socialSwiperRef"
                slidesPerView="auto" grabCursor="true"
                :navigation-prev-el="'.prevBtn'"
                :navigation-next-el="'.nextBtn'"
                :breakpoints="{
                    320: {
                        spaceBetween: 16
                    },
                    430: {
                        spaceBetween: 18
                    },
                    768: {
                        spaceBetween: 20
                    }
                }">
                <swiper-slide v-for="(item, index) in 10"
                    :key="index" class="wrapper"
                    lazy="true">
                    <img src="@assets/img/IG temp.jpg"
                        alt="" loading="lazy">
                </swiper-slide>
            </swiper-container>
            <div class="prevBtn">
                <SvgIcon name="Previous"
                    :width="`${swiperBtnSize}px`"
                    :height="`${swiperBtnSize}px`"
                    :key="swiperBtnSize" color="#0d731e">
                </SvgIcon>
            </div>
            <div class="nextBtn">
                <SvgIcon name="Next"
                    :width="`${swiperBtnSize}px`"
                    :height="`${swiperBtnSize}px`"
                    :key="swiperBtnSize" color="#0d731e">
                </SvgIcon>
            </div>
        </section>

        <section class="buyMore">
            <h1>
                為您推薦
            </h1>

            <div class="hot">
                <h2>
                    同款熱門
                </h2>

                <swiper-container class="itemWrapper"
                    ref="itemListRef" spaceBetween="16"
                    slidesPerView="auto" scrollBar="true"
                    free-mode="true" grabCursor="true"
                    observer="true" observeParents="true"
                    :injectStyles="scrollBarStyle"
                    :breakpoints="{
                        320: {
                            spaceBetween: 16
                        },
                        430: {
                            spaceBetween: 18
                        },
                        768: {
                            spaceBetween: 20
                        }
                    }">
                    <swiper-slide
                        v-for="(item, index) in similarList"
                        :key="index">
                        <Product_template :item="item"
                            :flightDelay="hideNav ? .2 : 0"
                            v-show="isLoaded" ref="COMList">
                        </Product_template>
                    </swiper-slide>
                </swiper-container>
            </div>

            <div class="analyze">
                <h2>
                    專屬推薦
                </h2>
                <swiper-container
                    v-if="recList.length !== 0"
                    class="itemWrapper" ref="recItemListRef"
                    spaceBetween="16" slidesPerView="auto"
                    scrollBar="true" free-mode="true"
                    grabCursor="true" observer="true"
                    observeParents="true"
                    :injectStyles="scrollBarStyle"
                    :breakpoints="{
                        320: {
                            spaceBetween: 16
                        },
                        430: {
                            spaceBetween: 18
                        },
                        768: {
                            spaceBetween: 20
                        }
                    }">
                    <swiper-slide
                        v-for="(item, index) in recList"
                        :key="index">
                        <Product_template :item="item"
                            :flightDelay="hideNav ? .2 : 0"
                            v-show="isLoaded" ref="COMList">
                        </Product_template>
                    </swiper-slide>
                </swiper-container>

                <div class="guestTab" :class="{
                    isMember: recList.length !== 0
                }">
                    <Spinner v-show="!isResultCheck">
                    </Spinner>
                    <div class="analyzeLink"
                        v-show="isResultCheck && !QNR_isDone">
                        <router-link to="/questionnaire">
                            <span>
                                開始免費專屬分析
                            </span>
                        </router-link>
                    </div>
                </div>
            </div>
        </section>
        <div class="flyToCartContainer"></div>
    </div>

</template>

<script setup lang="ts">
/**
 * todo: 會員 購物車 關於
 * --------------------
 * *
 * --------------------
 * //!取消大圓圈，overflow會使圖片sticky失效
 * --------------------
 * ?價格試算移到結帳頁面
 * //?建立果昔組件
 * //?麵包屑組件
 * //?小圖去掉，改只放一張大圖就好
 * 
 * --------------------
 * 推薦菜單架構
 * //麵包屑
 * //大圖出現轉場
 * //骨架屏
 * //字體寬度
 * //點擊圖片跳出放大圖
 * //單位價格隨尺寸改變
 * //推薦菜單架構
 * //大圖JPG
 * //尺寸選擇
 * //折疊icon(可否重用menu的折疊)
 * //營養Tag
 * //IG假圖*5
 * //加入購物車按鈕寬度
 * //包裝圖片長寬
 * //+-按鈕
 * //摺疊區塊底線
 * //detail區顏色
 * //進路由去頁首
 */

import { computed, onMounted, onUnmounted, reactive, ref, watch, watchEffect, nextTick, onBeforeMount, onDeactivated, onActivated, useTemplateRef } from 'vue';
import type { Ref } from 'vue';
import { useMenuStore } from '@/store/menuStore';
import type { MenuItem } from '@/api/menu/type';
import { storeToRefs } from 'pinia';
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from 'vue-router';
import { LoremIpsum } from "lorem-ipsum";
import Product_template from '@/components/Product/Product_template.vue';
import useListener from '@/hooks/useListener';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs.vue';
import OrderCounter from '@/components/OrderCounter/OrderCounter.vue';
import { useCartStore } from '@/store/cartStore';
import FlyToCart from '@/hooks/useFlyToCart';
import emitter from '@/utils/eventBus';
import { useQuestionnaireStore } from '@/store/questionnaireStore';
import type { SwiperContainer } from 'swiper/element';
import debounce from 'lodash/debounce';
import gsap from 'gsap';

// store數據
const menuStore = useMenuStore();
const { isLoaded, hotList, fullMenu } = storeToRefs(useMenuStore());
const { fetchMenu, fetchHotList, getInfoByName, getSameStyleItem } = useMenuStore();

// 路由props
const { name } = defineProps(['name']);

let productInfo = ref<MenuItem>();

async function initProductInfo(isInit: boolean) {
    if (!isInit) {
        await fetchMenu();
    }
    productInfo.value = getInfoByName(name);
    if (productInfo.value) {
        showUnitPrice.number = productInfo.value.price || 0
    }
    // if (productInfo.value?.category == 'salad') {
    //     replaceImgFileName(productInfo.value!);
    // }
    getSimilarList();
    // getHotList();
    // nextTick(() => {
    //     console.log(mainImg);
    // })
}

// 選擇尺寸
const selectOptions = [
    {
        size: 'S"',
        amount: '一入',
        icon: '1'
    },
    {
        size: 'M"',
        amount: '七入',
        icon: '7'
    },
    {
        size: 'L"',
        amount: '十四入',
        icon: '14'
    },

];

const selectedIndex = ref(0);
const selectSize = computed(() => {
    if (selectedIndex.value == 0) {
        return 1
    } else if (selectedIndex.value == 1) {
        return 7
    } else {
        return 14
    }
})


function setSelectAmount(index: number) {
    if (counterAnimating) return
    selectedIndex.value = index
}

// 數量+-
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
    // switch (actions) {
    //     case '+':
    //         if (counterVal.value >= max) break
    //         counterVal.value += 1;
    //         break;

    //     case '-':
    //         if (counterVal.value <= min) break
    //         counterVal.value -= 1;
    //         break;

    //     default:
    //         break;
    // }
}

watch(counterVal, (nVal, oVal) => {
    nextTick(() => {
        if (Number.isNaN(nVal)) {
            counterVal.value = prevCounterVal;
        } else if (nVal > max) {
            counterVal.value = max;
        } else if (nVal < min) {
            counterVal.value = min;
        }
    })
    // if (nVal >= max || nVal <= min) {
    //     limitAlert.value = true;
    //     return
    // }

    limitAlert.value = nVal >= max || nVal <= min;
    prevCounterVal = counterVal.value;
    // prevCounterVal = oVal ?? 1;
    // limitAlert.value = false;

}, { immediate: true });

// size切換響應
const selectSizeStyle = computed(() => ({
    transform: `translateY(-${selectedIndex.value * 30}px)`,
}));

const priceDiscount = ['10折', '9折', '85折'];

const showPrice = ref(0);
const currPrice = ref(0);
const targetPrice = ref(0);
let counterAnimating = false;

watchEffect(() => {
    // if (!productInfo.value || !productInfo.value.price) return

    // if (currPrice.value == 0) {
    //     showPrice.value = productInfo.value.price;
    //     currPrice.value = productInfo.value.price;
    //     targetPrice.value = productInfo.value.price;
    // }

    // switch (selectedIndex.value) {
    //     case 1:
    //         targetPrice.value = Math.floor(productInfo.value.price * 7 * 0.9);
    //         animateCounter(currPrice, targetPrice.value, showPrice, 200);
    //         break;
    //     case 2:
    //         targetPrice.value = Math.floor(productInfo.value.price * 14 * 0.85);
    //         animateCounter(currPrice, targetPrice.value, showPrice, 200);
    //         break;

    //     default:
    //         targetPrice.value = productInfo.value.price;
    //         animateCounter(currPrice, targetPrice.value, showPrice, 200);
    //         break;
    // }
})

// function animateCounter(curr: Ref<number>, target: number, show: Ref<number>, duration: number) {
//     const start = performance.now();
//     const gap = target - curr.value;
//     const easeOutFn = (t: number) => t * (2 - t);

//     const update = () => {
//         counterAnimating = true;
//         const now = performance.now();
//         const passedTime = now - start;
//         const progress = Math.min(passedTime / duration, 1);

//         const easeOut = easeOutFn(progress);
//         const currNum = curr.value + gap * easeOut;

//         show.value = Math.floor(currNum);

//         if (show.value == target) {
//             counterAnimating = false;
//             curr.value = target;
//             return
//         };

//         if (progress < 1) return requestAnimationFrame(update);
//     }

//     requestAnimationFrame(update);
// }
// 使用GSAP達成
function animateCounter(curr: Ref<number>, target: number, show: Ref<number>, duration: number) {
    counterAnimating = true;

    const gap = target - curr.value;
    const stepTime = 10;
    const steps = duration / stepTime;
    // const stepSize = gap / steps;
    const timingFn = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    let stepCount = 0;

    const timer = setInterval(() => {
        stepCount++;
        const progress = Math.min(stepCount / steps, 1);
        const easeInOut = timingFn(progress);

        show.value = Math.floor(curr.value + gap * easeInOut)

        // show.value += Math.floor(stepSize);

        if (stepCount >= steps || show.value == target) {
            clearInterval(timer);
            counterAnimating = false;
            show.value = target;
            curr.value = target;
        }
    }, stepTime);
}

const num = ref(0)
const showUnitPrice = reactive({
    number: 0
})

watch(selectedIndex, (nVal) => {
    if (!productInfo.value?.price) return;

    const basePrice = productInfo.value.price;
    switch (nVal) {
        case 1:
            num.value = Math.floor(basePrice * 7 * 0.9);
            break;
        case 2:
            num.value = Math.floor(basePrice * 14 * 0.85);
            break;
        default:
            num.value = basePrice;
            break;
    }

    gsap.to(showUnitPrice, { duration: 0.5, number: Number(num.value) || 0 });
})

// info摺疊
const lorem = new LoremIpsum();
const infoData = reactive([
    {
        title: '宅配資訊',
        content: lorem.generateWords(30),
        classState: true
    },
    {
        title: '食材清單',
        content: lorem.generateWords(20),
        classState: false
    },
    {
        title: '卡路里&營養標示',
        content: lorem.generateWords(30),
        classState: false
    },
]);

function setInfoOpen(index: number) {
    infoData[index].classState = !infoData[index].classState;
}

// 推薦
// 同款熱門
const similarList = ref<MenuItem[] | undefined>([]);

async function getSimilarList() {
    if (!isLoaded.value) {
        await fetchMenu();
    }
    if (!productInfo.value) return
    similarList.value = getSameStyleItem(productInfo.value.ingredients, productInfo.value.category!);
}

watch(similarList, (nVal) => {
    if (nVal?.length !== 0) {
        nextTick(() => {
            itemListRef.value?.swiper.update();
        })
    }
})


// 熱門新品
// const showHotList = ref<MenuItem[]>([]);
// const apiParams = computed(() => {
//     let params;
//     if (productInfo.value) {
//         params = productInfo.value.category === 'salad' ?
//             { name: 'salad' } :
//             { name: 'smoothies' }
//     }
//     return params
// })

// async function getHotList() {
//     // if (hotList.value.length == 0) {
//     // console.log(apiParams.value);
//     await fetchHotList(apiParams.value)
//     // }
//     showHotList.value = [...hotList.value];
// }

// 大圖檔名
function replaceImgFileName(info: MenuItem) {
    const reg = /\.png$/;
    if (info.category == 'salad') {
        return info.fileName!.replace(reg, '.jpg');
    }
    return info.fileName
}

// 跳出圖片
const showPopUpImg = ref(false);

function setShowPopUpImg() {
    if (showSkeleton.value) return
    showPopUpImg.value = !showPopUpImg.value;
}

watchEffect(() => {
    if (showPopUpImg.value) {
        document.documentElement.style.overflow = 'hidden';
        return
    }
    document.documentElement.style.overflow = '';
})

onBeforeRouteLeave((to, from) => {
    if (showPopUpImg.value) {
        showPopUpImg.value = !showPopUpImg.value;
        document.documentElement.style.overflow = '';
        return false
    }
    return true
})

// 大圖骨架
const showMainImg = ref(false);
const showSkeleton = ref(false);
const mainImg = useTemplateRef('mainImg')

function mainImgLoaded() {
    showMainImg.value = true;
}

let imgTimer: ReturnType<typeof setTimeout> | null = null;
function imgChecker() {
    imgTimer = setTimeout(() => {
        if (mainImg.value && !mainImg.value.complete) {
            showSkeleton.value = true;
        }
    }, 1000);
}
watch(showMainImg, (nVal) => {
    if (nVal) {
        showSkeleton.value = false;
        if (imgTimer) {
            clearTimeout(imgTimer);
            imgTimer = null;
        }
    }
}, { once: true })

onMounted(() => {
    imgChecker()
})

// 麵包屑路由
const breadcrumbProps = ref();
const route = useRoute();


function setBreadcrumb() {
    breadcrumbProps.value = route.query.name
}

// 加入購物車、飛入購物車
const cartStore = useCartStore();
const { headerCart } = storeToRefs(cartStore);
const { addItemToCart, } = cartStore;
const orderAmount = ref(1);
const amountSubtotal = computed(() => {
    return Math.min(orderAmount.value * selectSize.value, 99)
})

const flyToCartEl = ref();
const isFlightDelay = ref(false);
emitter.on('navEvent', (e) => {
    isFlightDelay.value = e as boolean
})

const crew = {
    cartBtn: headerCart,
    flyingEl: flyToCartEl,
    coordCompensation: {
        x: 0,
        y: 0
    }
}
const flyIcon = new FlyToCart(crew);
const {
    imgURL,
    isFlying
} = flyIcon;

const {
    getActiveItem,
    getActiveBtn,
    getLandingPoint,
    takeoff
} = flyIcon;

async function delayFlying() {
    // console.log('delay');
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, isFlightDelay.value ? 200 : 0)
    })
}

async function clickAddCart(e: Event, target?: MenuItem,) {
    const item = target ?? productInfo.value;
    const amount = amountSubtotal.value;
    if (amount == 99) emitAmountAlert(e);
    if (isFlying.value || !item) return;
    try {
        emitter.emit('sendIcon')
        if (isFlightDelay.value) await delayFlying();
        getActiveItem(item);
        getActiveBtn(e);
        getLandingPoint();
        takeoff();
        for (let i = 0; i < amount; i++) {
            addItemToCart(item);
        }
    } catch (error) {
        console.log(error);
    }
}

// above amount limit
const showAmountAlert = ref(false);
const amountAlertX = ref(0);
let alertTimeout: ReturnType<typeof setTimeout>

function emitAmountAlert(e: Event) {
    if (alertTimeout) {
        clearTimeout(alertTimeout);
    }
    const event = e as MouseEvent;
    const x = event.offsetX;
    amountAlertX.value = x + 16;
    nextTick(() => {
        showAmountAlert.value = true;
        alertTimeout = setTimeout(() => {
            showAmountAlert.value = false;
        }, 2000)
    })
}

const amountAlertStyle = computed(() => ({
    transform: `translateX(calc(-50% + ${amountAlertX.value}px))`
}))

//route to analyst result
const questionnaireStore = useQuestionnaireStore();
const { initQNR, getRecList } = questionnaireStore;
const { QNR_isDone } = storeToRefs(questionnaireStore);
const isResultCheck = ref(false);
const recList = ref<MenuItem[]>([]);
const recItemListRef = useTemplateRef<SwiperContainer>('recItemListRef');

async function initVIPtab() {
    if (!isLoaded.value) return
    try {
        await initQNR();
        isResultCheck.value = true;
        if (!QNR_isDone.value) return
        recList.value = getRecList();
    } catch (error) {
        console.log(error);
    }
}

watch(isLoaded, (nVal) => {
    if (nVal) {
        initVIPtab();
    }
})

watch(recList, (nVal) => {
    if (nVal?.length !== 0 && nVal[0].name) {
        nextTick(() => {
            recItemListRef.value?.swiper.update();
        })
    }
})

// 訂閱nav event
const hideNav = ref(false);
emitter.on('navEvent', (e) => {
    isFlightDelay.value = e as boolean
    hideNav.value = e as boolean;
})


// response item list
const COMList = useTemplateRef<InstanceType<typeof Product_template>[]>('COMList');
const itemListRef = useTemplateRef<SwiperContainer>('itemListRef');
const itemListWidth = ref(0)
const columnsLimit = ref(0);

function getItemListWidth() {
    // itemListWidth.value = itemListRef.value!.getBoundingClientRect().width;
}
function getColumnsLimit() {
    // if (!itemListRef.value) return
    // console.dir(itemListRef.value.firstElementChild);
    // const itemWidth = itemListRef.value.firstElementChild!.getBoundingClientRect().width
    // columnsLimit.value = Math.floor(itemListWidth.value / itemWidth);
    // console.log(columnsLimit.value);
    // console.log(itemListWidth.value / 5);
}

const scrollBarStyle = [
    `
        .swiper-scrollbar-drag {
            background: #0d731e;
        }
    `
]

watch([COMList, isLoaded], (nVal) => {
    if (nVal[0]) {
        nextTick(() => {
            getColumnsLimit()
        })
    }
})

// swiper btn svg size
const swiperBtnSize = ref(48);
const amountBtnSize = reactive({
    width: 125,
    height: 100
})
// prevent url bar resize
let currWidth = 0;

function btnOnResize() {
    if (currWidth == window.innerWidth) return
    const vw = window.innerWidth;
    if (vw <= 320) {
        amountBtnSize.height = 50;
        swiperBtnSize.value = 28;
    } else if (vw <= 430) {
        amountBtnSize.height = 75;
        swiperBtnSize.value = 32;
    } else if (vw <= 768) {
        swiperBtnSize.value = 36;
    } else if (vw <= 1024) {
        swiperBtnSize.value = 40;
    } else {
        amountBtnSize.height = 100;
        swiperBtnSize.value = 48;
    }
    currWidth = window.innerWidth;
}

const socialSwiperRef = useTemplateRef<SwiperContainer>('socialSwiperRef');

const debounceResize = debounce(() => {
    socialSwiperRef.value?.swiper.update();
    btnOnResize();
}, 500)

// 生命週期
onBeforeMount(() => {
    setBreadcrumb();
})

onMounted(() => {
    emitter.on('navEvent', (e) => {
        isFlightDelay.value = e as boolean
    })
    initProductInfo(isLoaded.value);
    initVIPtab();
    getItemListWidth();
    debounceResize();
    window.addEventListener('resize', debounceResize)
})
onActivated(() => {
    emitter.on('navEvent', (e) => {
        isFlightDelay.value = e as boolean
    })
})
onUnmounted(() => {
    emitter.off('navEvent');
    window.removeEventListener('resize', debounceResize)
    // console.log('unmounted');
})

</script>

<style scoped lang="scss">
* {
    // outline: 1px solid black;
}

.container {
    @extend %fixContainer;
    @extend %headerPseudo;

    flex-direction: column;
    width: 100%;

    &>div,
    &>section {
        width: 100%;
        max-width: 90rem;
        padding-inline: 1rem;
        padding-inline: clamp(1rem, -0.4285714285714284rem + 7.142857142857142vw, 6rem);
        margin-inline: auto;
        margin-top: 2rem;
    }

    &>section {
        // padding-inline: 4rem;
        margin-top: 4rem;
        padding-inline: 1rem;
        padding-inline: clamp(1rem, 0.1428571428571428rem + 4.285714285714286vw, 4rem);
    }

    .socialMedia {
        // padding-left: 7rem;
        // padding-inline: 1rem;
        // padding-inline: clamp(1rem, 0.1428571428571428rem + 4.285714285714286vw, 4rem);
    }

    .breadCrumb {
        // padding-left: 4rem;
    }

    .buyMore {
        margin-top: 5rem;
    }
}

.productWrapper {
    display: flex;
    justify-content: center;
    padding: 0 2rem;
    // height: calc(100vh - 188px);

    &>div:not(.popUpImg) {
        width: 50%;
        // flex: 1;
        padding: 1.5rem;
        padding-top: 0;
    }
}

.mainImg-enter-active,
.mainImg-leave-active {
    transition: opacity 0.3s ease;
}

.mainImg-enter-from,
.mainImg-leave-to {
    opacity: 0;
}

.mainImg-enter-to,
.mainImg-leave-from {
    opacity: 1;
}

.imgWrapper {
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 0;

    &>img {
        // @include WnH(50%);
        border-radius: 1rem;
        cursor: zoom-in;
        position: sticky;
        top: 188px;
        z-index: 1;
        // width: 80%;
        // margin: auto;
    }

    .unLoaded {
        opacity: 0;
    }

    @keyframes skeletonScan {
        from {
            transform: translateX(-75%);
        }

        to {
            transform: translateX(15%);
        }
    }

    .skeleton {
        background-color: $primaryBacColor;
        border-radius: 1.5rem;
        width: calc(100% - 3rem);
        aspect-ratio: 1/1;
        margin: auto;
        position: absolute;
        left: 50%;
        top: 0;
        translate: -50% 0;
        z-index: 2;
        overflow: hidden;

        &::after {
            @include WnH(200%);
            background: linear-gradient(115deg, transparent 40%, #FCFAF2 50%, transparent 52%);
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            transform: translateX(-75%);
            animation: skeletonScan 2s linear infinite;
        }
    }

    // .thumbnail {
    //     height: 15%;
    //     display: flex;
    //     flex-direction: row;

    //     &>img {
    //         @include WnH(100%);
    //     }
    // }
}

.popUpImg-enter-active,
.popUpImg-leave-active {
    transition: opacity 0.2s ease;
}

.popUpImg-enter-from,
.popUpImg-leave-to {
    opacity: 0;
}

.popUpImg-enter-to,
.popUpImg-leave-from {
    opacity: 1;
}

.popUpImg {
    @include WnH(100%, 100vh);
    // @include absoluteCenterTLXY($top: 0px, $Y: 0);
    @include flex-center-center;
    cursor: zoom-out;
    padding: 0;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: $primaryBacColor;

    img {
        border-radius: 1rem;
        // height: 100%;
    }
}

.popUpImgCancelIcon {
    cursor: pointer;
    position: fixed;
    right: 16px;
    top: 16px;
}



.contentWrapper {
    h2 {
        margin-left: 0.75rem;
        font-size: 20px;
        font-weight: 450;
    }
}

.topContent {
    // padding: 0 1rem;

    h1 {
        font-size: 1.5rem;
        font-size: clamp(1.5rem, 0.7857142857142858rem + 3.571428571428571vw, 2.5rem);
        margin-bottom: 1rem;
        font-weight: 450;
    }

    p {
        font-size: 1.25rem;
        text-indent: 2rem;
        text-align: justify;
        font-variation-settings: 'wght' 450;
    }
}

.ingredientWrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;

    span {
        padding: 0 4px;
        background-color: $secondBacColor;
        border-radius: 0 6px 6px 0;
        color: $primaryBacColor;
        padding-right: 6px;
        margin-right: 1rem;
        position: relative;
        z-index: 0;
        margin-left: 14px;

        &::after {
            @include WnH(100%, 0px);
            content: '';
            border-top: 12px solid transparent;
            border-right: 13px solid $secondBacColor;
            border-bottom: 12px solid transparent;
            position: absolute;
            top: 0;
            left: -100%;
            z-index: -1;

        }

        &::before {
            @include WnH(3px);
            @include absoluteCenterTLXY($left: -5px, $X: 0);
            content: '';
            border-radius: 100%;
            background-color: white;
        }
    }
}



.detailWrapper {
    background-color: $primaryBacColor_dark;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-top: 2rem;
    padding: 1rem;
    border-radius: 1rem;

    &>div {
        display: flex;
        flex-direction: column;
    }

    .sizeSelector {

        .selectWrapper {
            display: flex;
            justify-content: space-evenly;
            margin-top: 1rem;

            label {
                width: 30%;
                cursor: pointer;

                .amountIcon {
                    padding: .5rem;
                    border: 1px solid rgba(0, 0, 0, 0.5);
                    border-radius: .5rem;
                    opacity: .5;
                    transition: opacity 0.3s ease;
                }

                .selector {
                    // display: flex;
                    // justify-content: center;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-template-rows: 1fr;
                    align-items: center;
                    margin-top: 1rem;

                    input {
                        display: none;
                    }

                    .marker {
                        @include WnH(12px);
                        background-color: $primaryBacColor;
                        border: 1px solid black;
                        border-radius: 8px;
                        // margin: 12px 6px 12px 6px;
                        margin-inline: auto;
                        position: relative;
                    }

                    .amount {
                        display: flex;
                        flex-direction: column;
                        user-select: none;

                        span {
                            flex: 1;
                            display: block;
                            font-size: 1rem;
                            font-size: 0.75rem;
                            font-size: clamp(0.75rem, 0.5714285714285714rem + 0.8928571428571428vw, 1rem);
                            font-variation-settings: 'wght' 400;

                            &:first-of-type {
                                font-size: 1.5rem;
                                font-size: 1rem;
                                font-size: clamp(1rem, 0.6428571428571429rem + 1.7857142857142856vw, 1.5rem);
                                font-variation-settings: 'wght' 450;
                            }
                        }
                    }
                }

                &:hover .amountIcon {
                    opacity: 1;
                }
            }

            .selected {
                .amountIcon {
                    opacity: 1;
                }

                .marker::after {
                    @include WnH(6px);
                    @include absoluteCenterTLXY;
                    content: '';
                    background-color: $secondBacColor;
                    border-radius: 3px;
                }
            }
        }
    }

    .orderCounter {
        @include WnH(100%, 42px);
        background-color: $primaryBacColor;
        border-radius: 0.5rem;
        flex-direction: row;
        position: relative;
        margin-top: 1rem;

        span {
            @include absoluteCenterTLXY($left: 0.75rem, $X: 0);
            font-size: 20px;
            // font-weight: 900;
            font-variation-settings: 'wght' 450;
        }

        .counterControl {
            @include absoluteCenterTLXY($left: calc(100% - 1rem), $X: -100%);
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
    }

    .price {
        flex-direction: row;
        line-height: 30px;
        margin-top: .5rem;
        position: relative;
        z-index: 0;

        span {
            line-height: 30px;
        }

        &>span:nth-of-type(1) {
            background-color: $primaryBacColor_dark;
            font-size: 20px;
            margin-left: auto;
            position: relative;
            font-variation-settings: 'wght' 450;

            .discountWrapper {
                @include absoluteCenterTLXY($top: 80%, $left: 50%, $X: -50%, $Y: 0);
                display: flex;
                align-items: center;
                height: 100%;
                flex-direction: column;
                font-size: 12px;
                overflow: hidden;
                z-index: -1;

                span {
                    text-wrap: nowrap;
                    transition: transform .3s ease;
                    color: red;
                }

                span:nth-of-type(1) {
                    color: transparent;
                }
            }
        }

        &>span:nth-of-type(2) {
            display: flex;
            width: 40px;
            font-size: 12px;
            margin-left: 10px;
            margin-right: 20px;
            position: relative;
            overflow: hidden;

            span {
                font-variation-settings: 'wght' 450;
            }

            .selectSize {
                display: flex;
                flex-direction: column;
                margin-left: 6px;
                font-size: 12px;
                position: absolute;
                left: 6px;
                transition: transform .3s ease;


            }

            span:last-of-type {
                margin-left: auto;
                font-size: 12px;
            }
        }

    }
}

.addCart {
    margin-top: 1rem;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 0 1rem;

    button {
        @include WnH(100%, 46px);
        background-color: #3EA350;
        border: 1px solid rgba(0, 0, 0, 0.5);
        border-radius: 23px;
        box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.5);
        color: #FCFAF2;
        font-size: 20px;
        line-height: 46px;
        transition: box-shadow 0.15s ease;

        &:hover {
            box-shadow: 3px 4px 6px rgba(0, 0, 0, 0.75);
        }

        &:active {
            transform: translate(1px, 1px);
        }
    }
}

.amountAlert {
    outline: 1px solid black;
    background-color: $primaryBacColor;
    border-radius: 6px;
    padding: 0 1rem;
    position: absolute;
    top: -1.75rem;
    left: 0;

    span {
        text-align: center;
        line-height: 24px;
        color: red;
        font-size: .8rem;
        font-variation-settings: 'wght' 500;
    }
}

.amountAlert-enter-active,
.amountAlert-leave-active {
    transition: opacity .3s ease;
}

.amountAlert-enter-from,
.amountAlert-leave-to {
    opacity: 0;
}

.amountAlert-enter-to,
.amountAlert-leave-from {
    opacity: 1;
}

%divideLine {
    @include WnH(100%, 1px);
    content: '';
    background-color: rgba(0, 0, 0, .25);
    display: block;
    margin: .5rem 0 .5rem 0;
}

.infoFolder>.Wrapper {
    cursor: pointer;

    h2 {
        opacity: .5;
        // color: rgba(0, 0, 0, 0.5);
        transition: opacity 0.3s;
        user-select: none;
        margin-left: .5rem;
    }

    &::before {
        @extend %divideLine;
    }
}

.title {
    display: flex;

    &>div {
        // outline: 1px solid black;
        transform: rotate(-90deg);
        transition: transform .2s linear;
    }

    &:has(.folderIcon) h2 {
        opacity: 1;
    }

    .folderIcon {
        transform: rotate(0deg);
    }
}



.folder {
    padding-left: 1.5rem;
    overflow: hidden;
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows .3s, padding-block .3s;

    p {
        overflow: hidden;
        color: rgba(0, 0, 0, 0.5);
        padding-inline: 1rem 1.5rem;
        text-align: justify;
    }
}

.folderText {
    max-height: min(300px);
    opacity: 1;
    grid-template-rows: 1fr;
    padding-block: .5rem;

    p {
        color: black;
    }
}


.flyToCart {
    @include WnH(50px);
    pointer-events: none;
    opacity: 0;
    position: absolute;
    left: 3rem;
    top: 0;
    z-index: 100;
    border-radius: 25px;
    overflow: hidden;
    // background-color: red;
}

.socialMedia {
    // @include flex-center-center;
    // display: flex;
    // flex-direction: row;
    // gap: 4rem;
    // overflow: hidden;
    padding: 1rem;
    position: relative;
    z-index: 0;
    margin-bottom: 2rem;
    background-color: $primaryBacColor_dark;
    border-radius: 1rem;

    swiper-container {

        &::part(container) {
            // width: calc(100% - 2rem);
        }

        &::part(button-prev) {}

        &::part(button-next) {}
    }

    .wrapper {
        // @include WnH(300px, 0px);
        width: 300px;
        border-radius: 1.5rem;
        overflow: hidden;
        box-shadow: 3px 3px 6px gray;
        margin-block: 1rem;
        // flex: 1 0 auto;

        img {
            // height: 100%;
        }
    }
}

.prevBtn,
.nextBtn {
    height: fit-content;
    position: absolute;
    top: 107%;
    z-index: 2;
    // transform: translate(-50%, -50%);
    // transform-origin: left top;
    transform-origin: center;
    transition: scale .2s, opacity .2s;

    &:hover {
        scale: 1.15;
    }

    &:active {
        translate: calc(-50% + 1px) calc(-50% + 1px);
        // transform: translate(calc(-50% + 1px), calc(50% + 1px));
    }
}

.prevBtn {
    left: 45%;
    translate: -50% -50%;
    // translate: -50% -50%;
    // translate: -60%
}

.nextBtn {
    left: 55%;
    translate: -50% -50%;
    // translate: 50% -50%;
    // translate: 60%
}

.swiper-button-disabled {
    opacity: .5;
}

.buyMore {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 6rem;

    h1 {
        font-size: 1.5rem;
        font-size: clamp(1.5rem, 0.7857142857142858rem + 3.571428571428571vw, 2.5rem);
        // font-size: 36px;
        font-weight: 450;
    }

    h2 {
        font-size: 24px;
        font-weight: 450;
    }

    &>div {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 0 2rem;

        ul {
            display: flex;
        }
    }

    swiper-container {
        position: relative;

        swiper-slide {
            width: min-content;
        }

        &::part(container) {
            overflow-y: visible;
            padding: 1rem 0;
        }

        &::part(scrollbar) {
            // opacity: 0;
            bottom: 0%;
        }
    }
}

.itemWrapper {
    // display: flex;
    // flex-direction: row;
    // justify-content: space-evenly;
    // overflow: hidden;
    width: 100%;
}



.guestTab {
    position: relative;
    height: 100%;
    margin-block: 6rem;
}

.isMember {
    margin-block: 2rem;
}

.analyzeLink {
    cursor: pointer;
    position: relative;
    // position: absolute;
    width: max-content;
    // top: 50%;
    left: 50%;
    transform: translate(-50%, 0%);
    padding: .75rem 1rem;
    border-radius: 1rem;
    background-color: $secondBacColor;
    filter: drop-shadow(2px 2px 1px black);
    transition: scale .15s;
    transform-origin: left top;

    &:hover {
        scale: 1.1;
    }

    &:active {
        transform: translate(calc(-50% + 1px), calc(-50% + 1px));
    }

    span {
        @include flex-center-center;
        @include WnH(100%);
        color: $primaryBacColor;
        font-size: 1rem;
        text-wrap: nowrap;
    }
}

@include XLarge {}

@include large {}

@include medium($width: 1440px) {
    .socialMedia {
        border-radius: 0;
    }
}

@include medium($width: 1024px) {
    .socialMedia .wrapper {
        width: 250px;
    }
}

@include medium {
    .container {
        .buyMore {
            margin-bottom: 4rem;
        }
    }

    .productWrapper {
        flex-direction: column;

        &>div:not(.popUpImg) {
            width: 100%;
        }

        .imgWrapper img {
            width: 90%;
        }
    }

    .socialMedia .wrapper {
        width: 200px;
    }

    .prevBtn,
    .nextBtn {
        top: 110%;
    }

    .detailWrapper .sizeSelector .selectWrapper label .selector {
        grid-template-columns: 1fr;
        grid-template-rows: .5fr 1fr;
        justify-items: center;
    }
}

@include small {

    .container {

        .socialMedia {
            margin-top: 3rem;
        }

        .buyMore {
            margin-top: 4rem;
        }

    }

    .socialMedia .wrapper {
        width: 175px;
    }

    .guestTab {
        margin-block: 4rem;
    }
}

@include small($width: 430px) {
    .container {

        .socialMedia {
            margin-top: 1rem;
        }

        .buyMore {
            margin-top: 2rem;
        }

    }

    .socialMedia .wrapper {
        width: 155px;
    }

    .ingredientWrapper {
        column-gap: 0;

        sapn {}
    }

    .detailWrapper {
        padding-inline: .5rem;
        gap: .75rem;
    }
}

@include small($width: 320px) {
    .socialMedia .wrapper {
        width: 140px;
    }
}
</style>