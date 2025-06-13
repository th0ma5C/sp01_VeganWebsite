<template>
    <div class="container" @click="closePop">
        <div class="analystTop">
            <div class="analystImgWrapper">
                <swiper-container effect="fade" speed="700"
                    autoplay-delay="4000"
                    :fadeEffect="{ crossFade: true }"
                    :allowTouchMove="false">
                    <swiper-slide>
                        <img src="@assets/img/Menu/doc01.png"
                            alt="doctor A">
                    </swiper-slide>
                    <swiper-slide
                        data-swiper-autoplay="6000">
                        <img src="@assets/img/Menu/doc02.png"
                            alt="doctor B">
                    </swiper-slide>
                </swiper-container>
            </div>
            <div class="textWrapper">
                <div class="titleWrapper" :style="{
                    translate: `0 -${subTitleTranslate}px`
                }">
                    <span class="subTitle"
                        ref="subTitleRef">您做過專屬個人分析了嗎?</span>
                    <h1>
                        <span
                            class="text">Relation-Ship</span>團隊的專業分析，為您打造專屬菜單
                    </h1>
                </div>

                <button @click="routerToQNR">開始分析</button>
            </div>
        </div>
        <div class="menuWrapper">
            <div class="title">
                <div class="breadCrumb">
                    <Breadcrumbs>
                    </Breadcrumbs>
                </div>
                <div class="titleText">
                    SALADS and SIDES
                </div>
                <div class="filterWrapper">
                    <div class="filter" @click.stop>
                        <span>篩選：</span>
                        <div class="details">
                            <div class="summary"
                                @click="handleShowList('filter')">
                                <span>
                                    營養種類
                                </span>
                                <SvgIcon
                                    name="ListArrowDown"
                                    width="24px"
                                    height="24px"
                                    class="filterArrow"
                                    :class="{ rotateArrow: listOpening == 'filter' }">
                                </SvgIcon>
                            </div>
                            <transition name="filter">
                                <div class="listWrapper"
                                    v-show="listOpening == 'filter'">
                                    <div class="listHeader">
                                        <SvgIcon
                                            name="cancel"
                                            width="20px"
                                            height="20px"
                                            class="exit"
                                            @click="closePop">
                                        </SvgIcon>
                                        <div
                                            class="inputWrapper">
                                            <form action="">
                                                <input
                                                    id="searchFilterWord"
                                                    type="text"
                                                    placeholder="篩選條件"
                                                    v-model.trim="searchFilterWord"
                                                    @keydown.enter.prevent>
                                                <SvgIcon
                                                    name="Search02"
                                                    width="18px"
                                                    height="18px"
                                                    color="black"
                                                    class="searchIcon">
                                                </SvgIcon>
                                            </form>
                                            <div
                                                class="selectCount">
                                                已選取
                                                {{
                                                    selectIngredient.length
                                                }}
                                                項
                                            </div>
                                            <div
                                                class="resetBtn">
                                                <button
                                                    @click="resetFilterSelect">重置</button>
                                            </div>
                                            <div
                                                class="mobileContent">
                                                <div
                                                    class="selectCount">
                                                    已選取
                                                    {{
                                                        selectIngredient.length
                                                    }}
                                                    項
                                                </div>
                                                <div
                                                    class="resetBtn">
                                                    <button
                                                        @click="resetFilterSelect">重置</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="fieldset">
                                        <ul>
                                            <li class="selectAll"
                                                v-show="searchFilterWord !== '' && showIngredientList.length !== 0"
                                                @click="selectAll">
                                                <span>{{
                                                    selectAllText
                                                    }}</span>
                                            </li>
                                            <li v-for="(item, index) in showIngredientList"
                                                :key="index"
                                                @click="handleFilterSelect(item);"
                                                :class="{
                                                    select: selectIngredient.includes(item),
                                                    unSelect: !filteredIngredient.includes(item)
                                                }">
                                                <label
                                                    :for="`salad${item}`">
                                                    <input
                                                        :id="`salad${item}`"
                                                        type="checkbox"
                                                        :value="item"
                                                        v-model="selectIngredient">
                                                    {{
                                                        item
                                                    }}
                                                </label>
                                                <span>
                                                    {{
                                                        item
                                                    }}
                                                </span>
                                            </li>
                                            <div v-show="showIngredientList.length == 0"
                                                class="empty">
                                                <span>無此項目</span>
                                            </div>
                                        </ul>
                                    </div>
                                </div>
                            </transition>
                        </div>
                    </div>
                    <div class="sort">
                        <span>排序：</span>
                        <div class="sortWrapper"
                            @click.stop>
                            <div class="header"
                                @click="handleShowList('sort')">
                                <span>{{ sorting }}</span>
                                <SvgIcon name="sortDown"
                                    width='16px'
                                    height="16px"
                                    :color="sorting == '精選' ? '#FCFAF2' : '#0d731e'"
                                    :style="sortDirIcon">
                                </SvgIcon>
                                <SvgIcon
                                    name="ListArrowDown"
                                    width="24px"
                                    height="24px"
                                    :class="{ sortIcon: listOpening !== 'sort' }">
                                </SvgIcon>
                            </div>
                            <transition name="sort">
                                <ul class="sortList"
                                    @click="closePop"
                                    v-show="listOpening == 'sort'">
                                    <li v-for="(item, index) in sortList"
                                        :key="index"
                                        @click="setSortDirection(item)">
                                        <button>
                                            {{ item }}
                                        </button>
                                    </li>
                                </ul>
                            </transition>
                        </div>
                        <div class="sortCount">
                            共{{ filteredSalad.length }}項
                        </div>
                    </div>
                </div>
                <div class="filterTagWrapper">
                    <div class="tag"
                        v-for="(item, index) in selectIngredient"
                        :key="index"
                        @click="handleFilterSelect(item)">
                        <span>{{ item }}</span>
                        <SvgIcon name="cancel" width="16px"
                            height="16px" color="black">
                        </SvgIcon>
                    </div>
                    <div class="cancelSelect"
                        v-show="selectIngredient.length !== 0"
                        @click="resetFilterSelect">
                        <span>取消篩選</span>
                    </div>
                </div>
            </div>

            <div class="saladMenu"
                :class="{ expandMenu: isShowFullMenu }"
                :style="saladMenuStyle"
                ref="saladContainer">
                <Product_template :item="item"
                    :flightDelay="hideNav ? .2 : 0"
                    v-for="(item, index) in sortedSalad"
                    :key="item.id ? item.id : index" :class="{
                        hideItem: index > (showMenuLimit - 1),
                    }"
                    v-show="filteredSalad.includes(item) && index < showMenuLimit && isLoaded"
                    ref="COMList">
                </Product_template>
                <transition name="skeleton ">
                    <div class="skeleton componentSkeleton"
                        v-if="!isLoaded">
                        <div class="scanner"></div>
                    </div>
                </transition>
            </div>
            <div class="showFullMenuBtn" :class="{
                onUnloaded: !isLoaded
            }" v-show="true">
                <span>{{ currShow }} of {{
                    saladList.length }}</span>
                <button @click="setFullMenu"
                    v-show="isShowBtn">
                    展開
                </button>
            </div>
        </div>
        <div class="smoothieMenu">
            <div class="title">
                SMOOTHIES <span></span>
            </div>
            <div class="itemWrapper" ref="itemWrapper"
                :class="{
                    isSelecting: selectIngredient.length !== 0
                }">
                <swiper-container ref="smoothieSwiper"
                    scrollbar-hide="true"
                    slides-per-view="auto"
                    :loopAddBlankSlides="true"
                    grabCursor="true" :loop="loopProps"
                    speed="3000" :autoplay="{
                        pauseOnMouseEnter: true
                    }" :injectStyles="scrollBarStyle"
                    :breakpoints="{
                        320: {
                            spaceBetween: 16
                        },
                        430: {
                            spaceBetween: 24
                        },
                        768: {
                            spaceBetween: 32
                        }
                    }">
                    <swiper-slide class="item"
                        v-for="(items, index) in sortedSmoothies"
                        v-show="filteredSmoothie.includes(items)"
                        :key="index">
                        <transition name="skeleton">
                            <div class="skeleton"
                                v-show="isImgLoading">
                                <div class="top"></div>
                                <div class="bot">
                                    <div></div>
                                    <div></div>
                                </div>
                                <div class="scanner"></div>
                            </div>
                        </transition>
                        <div class="imgWrapper"
                            @click="routerToProduct(items.name)">
                            <img :src="items.fileName!"
                                alt="商品" @load="imgLoaded">
                            <div class="description">
                                <span>{{
                                    items.description
                                    }}</span>
                            </div>
                        </div>
                        <h3>{{ items.name }}</h3>
                        <p>{{ items.price }}元</p>
                        <div class="ingredients">
                            <span
                                v-for="(item) in items.ingredients"
                                :key="item">
                                {{ item }}
                            </span>
                        </div>
                        <div class="btnWrapper">
                            <button
                                @click="clickSmoothiesBtn(items, $event)"
                                class="cart-btn">加入購物車</button>
                            <button
                                @click="routerToProduct(items.name)"
                                class="info-btn">詳細資訊</button>
                            <div class="btnBackground">
                                <svg width="260" height="48"
                                    viewBox="0 0 260 48"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <g id="btnBac"
                                        filter="url('#btn')">
                                        <rect id="center"
                                            y="21"
                                            width="117.52"
                                            height="6"
                                            fill="currentColor" />
                                        <path id="left"
                                            d="M0 0H26.5417H53.0833H79.625H117.553L130 48H0V0Z"
                                            fill="currentColor" />
                                        <path id="right"
                                            d="M260 48L233.458 48L206.917 48L180.375 48L142.447 48L130 4.93616e-06L260 1.5864e-05L260 48Z"
                                            fill="currentColor" />
                                    </g>
                                    <filter id="btn">
                                        <feGaussianBlur
                                            in="SourceGraphic"
                                            result="blur"
                                            stdDeviation="5" />
                                        <feColorMatrix
                                            in="blur"
                                            mode="matrix"
                                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                                            result="btn" />
                                    </filter>
                                </svg>
                            </div>
                        </div>
                        <div class="btnWrapper mobileBtn"
                            ref="btnWrapper">
                            <button class="cart-btn"
                                ref="cartBtnEl"
                                @click="clickSmoothiesBtn(items, $event)">
                                加入購物車
                            </button>
                            <button class="info-btn"
                                @click="routerToProduct(items.name)">
                                詳細資訊
                            </button>
                        </div>
                        <Teleport defer
                            :to="'.flyToCartContainer'">
                            <div class="flyToCart"
                                ref="flyToCartEl"
                                v-if="true">
                                <img :src="smoothiesPlane.imgURL.value"
                                    alt="">
                            </div>
                        </Teleport>
                    </swiper-slide>
                </swiper-container>
            </div>
        </div>
        <div class="analystBot" ref="analystBotRef">
            <div>

                <div class="botTitle">
                    <h2>
                        <span class="text">Relation-Ship
                        </span>
                        and analysts team
                    </h2>
                </div>
                <swiper-container effect="fade" speed="700"
                    :fadeEffect="{ crossFade: true }"
                    :autoplay="{
                        delay: 4000,
                        pauseOnMouseEnter: true
                    }" :allowTouchMove="false"
                    observer="true" observeParents="true"
                    ref="deskSwiper">
                    <swiper-slide
                        v-for="({ title, name, intro, avatarURL }, index) in docData"
                        :key="index">
                        <div class="analystSwiper">
                            <div class="imgWrapper">
                                <img :src="avatarURL"
                                    alt="">
                                <span>
                                    {{ title }}
                                </span>
                            </div>
                            <div class="content">
                                <h2>{{ name }}</h2>
                                <p>
                                    {{ intro }}
                                </p>
                                <button
                                    @click="routerToQNR">
                                    開始分析
                                </button>
                            </div>
                        </div>
                    </swiper-slide>
                </swiper-container>

                <swiper-container effect="fade" speed="700"
                    :fadeEffect="{ crossFade: true }"
                    :autoplay="{
                        delay: 4000,
                        pauseOnMouseEnter: true
                    }" :allowTouchMove="false"
                    observer="true" observeParents="true"
                    class="mobileBot" ref="mobileSwiper">
                    <swiper-slide
                        v-for="({ title, name, intro, avatarURL }, index) in docData"
                        :key="index" class="docList">
                        <div>
                            <div class="docImgWrapper">
                                <img :src="avatarURL"
                                    alt="">
                                <span>
                                    {{ title }}
                                </span>
                            </div>

                            <div class="content">
                                <h2>
                                    {{ name }}
                                </h2>
                                <p>
                                    {{ intro }}
                                </p>
                            </div>
                        </div>
                    </swiper-slide>
                    <div slot="container-end"
                        class="buttonWrapper">
                        <button @click="routerToQNR">
                            開始分析
                        </button>
                    </div>
                </swiper-container>
            </div>
        </div>
        <div class="flyToCartContainer"></div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, reactive, watch, onBeforeMount, watchEffect, nextTick, onBeforeUpdate, inject, toRefs, onUnmounted, useTemplateRef, onUpdated, watchPostEffect } from 'vue';
import type { ComputedRef, Ref, WritableComputedRef } from 'vue';
import Product_template from '@/components/Product/Product_template.vue';
import useConcatImgPath from '@/hooks/useConcatImgPath';
import { useMenuStore } from '@/store/menuStore';
// import type { ingredientsList } from '@/store/menuStore';
import type { MenuItem } from '@/api/menu/type'
import { storeToRefs } from 'pinia';
import gsap from 'gsap';
import Flip from 'gsap/Flip';
import { useRoute, useRouter } from 'vue-router';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs.vue';
import { useCartStore } from '@/store/cartStore';
import emitter from '@/utils/eventBus';
import FlyToCart from '@/hooks/useFlyToCart';
import { debounce } from 'lodash-es'
import type { SwiperContainer } from 'swiper/element';
import { LoremIpsum } from 'lorem-ipsum';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


// -----篩選、排序樣式-----
// 下拉顯示
const listOpening = ref<null | 'filter' | 'sort'>(null);
function handleShowList(target: 'filter' | 'sort') {
    listOpening.value = target
}

// 點擊空白關閉 點擊排序後關閉
function closePop() {
    listOpening.value = null
}

// -----menu store 數據-----
const menuStore = useMenuStore();
const { fetchIngredients, fetchMenu } = menuStore;
const { fullMenu, saladList, smoothieList, ingredientsList, isLoaded } = storeToRefs(menuStore);

// -----篩選、排序功能-----
// 排序
// 排序箭頭、內容
let sortList = ref(['精選', '名稱', '價格', '人氣', '日期']),
    sorting: Ref<string> = ref('精選'),
    sortOrder = ref(0); //0 升序 -180降序

function setSortDirection(n: string) {
    setFullMenu();
    if (sorting.value == n) {
        sortOrder.value = sortOrder.value == 0 ? -180 : 0;
        return
    }
    sorting.value = n;
    sortOrder.value = 0;
}

let sortDirIcon = computed(() => ({
    transform: `rotateZ(${180 + sortOrder.value}deg)`
}))

// 排序功能
// 比較函數
type CompareFn<T> = (a: T, b: T) => number;

// const compareFn = <T>(key: (item: T) => any, order: number): CompareFn<T> => {
//     let isDESC = order !== 0;
//     return (a: T, b: T): number => {
//         const aValue = key(a);
//         const bValue = key(b);

//         if (aValue < bValue) {
//             return isDESC ? -1 : 1;
//         } else if (aValue > bValue) {
//             return isDESC ? 1 : -1;
//         } else {
//             return 0;
//         }
//     }
// }

const compareFn = <T>(key: (item: T) => any, isAsc: boolean): CompareFn<T> => {
    return (a, b) => {
        const aVal = key(a), bVal = key(b);
        if (aVal === bVal) return 0;
        return isAsc ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1)
    }
}
// 排序
// function sort(el: Ref<MenuItem[]>) {
//     let list = [...el.value];

//     switch (sorting.value) {
//         case '名稱':
//             sortOrder.value == 0 ?
//                 list.sort(compareFn(item => item.name, 0)) :
//                 list.sort(compareFn(item => item.name, 1))
//             return list
//         case '價格':
//             sortOrder.value == 0 ?
//                 list.sort(compareFn(item => item.price, 0)) :
//                 list.sort(compareFn(item => item.price, 1))
//             return list
//         case '人氣':
//             sortOrder.value == 0 ?
//                 list.sort(compareFn(item => item.rating, 0)) :
//                 list.sort(compareFn(item => item.rating, 1))
//             return list
//         case '日期':
//             sortOrder.value == 0 ?
//                 list.sort(compareFn(item => item.date, 0)) :
//                 list.sort(compareFn(item => item.date, 1))
//             return list
//         default:
//             return list
//     }
// }
type SortKey = '名稱' | '價格' | '人氣' | '日期';

function sort(el: Ref<MenuItem[]>) {
    const isAsc = sortOrder.value === 0;
    const keyMap = {
        '名稱': (item: MenuItem) => item.name,
        '價格': (item: MenuItem) => item.price,
        '人氣': (item: MenuItem) => item.rating,
        '日期': (item: MenuItem) => item.date,
    };
    const key = keyMap[sorting.value as SortKey] ?? (() => 0);

    return [...el.value].sort(compareFn(key, isAsc));
}

// 篩選資料去重
let ingredientSet = computed<Set<string>>(() => {
    if (!isLoaded.value || !ingredientsList.value || ingredientsList.value.length <= 1) return new Set();
    let set = new Set<string>();
    for (let i of ingredientsList.value) {
        for (let j of i.ingredients!) {
            set.add(j)
        }
    }
    return set
})

let ingredientList = computed(() => {
    return [...ingredientSet.value]
})

// 篩選清單選中
let selectIngredient: Ref<string[]> = ref([]);
let selectAllText = computed(() => {
    return selectIngredient.value.length == 0 ? '全選' : '取消'
})

function handleFilterSelect(n: string) {
    setFullMenu();
    if (!filteredIngredient.value.includes(n)) return
    if (selectIngredient.value.includes(n)) {
        selectIngredient.value = selectIngredient.value.filter(item => item !== n);
        return
    }
    selectIngredient.value.push(n)
}

function selectAll() {
    if (selectIngredient.value.length == 0) {
        for (let i of showIngredientList.value) {
            // handleFilterSelect(i)
            selectIngredient.value.push(i)
        }
        return
    }
    selectIngredient.value = [];
}

// 篩選清單搜尋
let searchFilterWord = ref('');
let showIngredientList = computed(() => {
    const word = searchFilterWord.value.toLowerCase();

    if (word == '') {
        // console.log('空');
        return ingredientList.value
    }

    return ingredientList.value.filter((item) => {
        return item.toLowerCase().indexOf(word) !== -1;
    })
})

// 篩選重置
function resetFilterSelect() {
    if (selectIngredient.value.length == 0) return
    searchFilterWord.value = '';
    selectIngredient.value = [];
}

// 篩選
function filter(el: Ref<MenuItem[]>) {
    if (selectIngredient.value.length === 0) return [...el.value]

    const selectedSet = new Set(selectIngredient.value);
    return el.value.filter(item => item.ingredients.some(ing => selectedSet.has(ing)))
}

// -----menu 摺疊-----
// let isShowFullMenu = computed(() => showMenuLimit.value == filteredSalad.value.length);
const isShowFullMenu = ref(false)
let isShowBtn = computed(() => showMenuLimit.value < filteredSalad.value.length)

const showMenuLimit = ref(8);

const columnsLimit = ref(0);
function getColumnsLimit() {
    if (!saladContainer.value) return
    const containerWidth = saladContainer.value.getBoundingClientRect().width;
    const itemWidth = saladContainer.value.children[1].getBoundingClientRect().width
    columnsLimit.value = Math.floor(containerWidth / itemWidth);
    if (!isShowFullMenu.value) {
        showMenuLimit.value = Math.floor(containerWidth / itemWidth) * 2;
    }
}


let currShow = computed(() => {
    let length = filteredSalad.value.length;
    // console.log(length);
    if (length > showMenuLimit.value) {
        return showMenuLimit.value
    }
    return length
})

function setFullMenu(e?: Event) {
    if (isShowBtn.value && e) {
        gsap.fromTo('.hideItem',
            {
                opacity: 0
            },
            {
                opacity: 1,
                duration: .3,
                clearProps: 'all'
            }
        )
    }
    showMenuLimit.value = saladList.value.length;
    isShowFullMenu.value = true;

    nextTick(() => {
        setGridRows()
    })
}


// -----smoothie marquee-----
let smoothieSwiper = useTemplateRef<SwiperContainer>('smoothieSwiper');
const deskSwiper = useTemplateRef<SwiperContainer>('deskSwiper');
const mobileSwiper = useTemplateRef<SwiperContainer>('mobileSwiper');
let itemWrapper = useTemplateRef('itemWrapper');
let loopProps = computed(() => {
    if (selectIngredient.value.length === 0) {
        return {
            delay: 0,
            pauseOnMouseEnter: true,
        }
    }
    return false
});

const scrollBarStyle = [
    `
        .swiper-scrollbar-drag {
            background: #0d731e;
        }
    `
]

watch(isLoaded, (nVal) => {
    if (nVal) {
        showMenuLimit.value = 8
        nextTick(() => {
            handleSwiperSlide('start');
        });
    }
}, { once: true })

watch(selectIngredient, (nVal) => {
    if (nVal.length == 0) {
        nextTick(() => {
            handleSwiperSlide('update');
            handleSwiperSlide('start');
        })
        return
    }
    nextTick(() => {
        handleSwiperSlide('update');
        handleSwiperSlide('stop');
    })
}, { deep: true })


function handleSwiperSlide(action: "start" | "stop" | "update") {
    if (!smoothieSwiper.value) return
    const actionsMap = {
        start: () => {
            smoothieSwiper.value!.swiper.autoplay.start();
        },
        stop: () => smoothieSwiper.value!.swiper.autoplay.stop(),
        update: () => {
            smoothieSwiper.value!.swiper.update();
            smoothieSwiper.value!.swiper.slideToLoop(0, 1000);
            nextTick(() => {
                refreshTrigger()
            })
        }
    };
    const actionHandler = actionsMap[action];
    actionHandler();

}
// prevent url bar resize
let currWidth = 0;

async function handleResize() {
    if (currWidth == window.innerWidth) return
    await nextTick();
    handleSwiperSlide('update');
    getSubTitleTranslate();
    getColumnsLimit();
    setGridRows();
    getDocumentWidth();
    await nextTick();
    refreshTrigger();
    currWidth = window.innerWidth;
}

const debounceResize = debounce(handleResize, 500)

// -----menu GSAP-----
gsap.registerPlugin(Flip);
const saladContainer = useTemplateRef('saladContainer');

const COMList = useTemplateRef<InstanceType<typeof Product_template>[]>('COMList');
watch([COMList, isLoaded], (nVal) => {
    if (nVal[1]) {
        nextTick(() => {
            getColumnsLimit()
        })
    }
})
function getProductElState() {
    return isLoaded.value && COMList.value ? COMList.value.map(component => component.productEl) : []
}

function setSaladGSAP(state: Flip.FlipState) {
    Flip.from(state, {
        fade: true,
        simple: true,
        duration: 0.75,
        absolute: true,
        ease: "power1.inOut",
        onEnter: (elements) => {
            return gsap.fromTo(elements,
                { opacity: 0 },
                { opacity: 1, duration: 1 })
        },
        onLeave: (elements) => {
            return gsap.fromTo(elements,
                { opacity: 1 },
                { opacity: 0, duration: 1 })
        },
    });
}

// ----- show數據 -----

const filteredSalad = computed(() => {
    let salad = filter(saladList);
    return salad
})

let sortedSalad = computed<MenuItem[]>(() => {
    if (!isLoaded.value) return Array(8).fill(saladList.value);
    let list = sort(saladList);
    return list
});

watch([filteredSalad, sortedSalad], (nVal) => {
    let elList = getProductElState()
    const state = Flip.getState(elList);
    nextTick(() => {
        setSaladGSAP(state);
    })
})

let filteredSmoothie = computed(() => {
    let smoothies = filter(smoothieList);

    if (smoothies.length == 0) {
        handleSwiperSlide('start');
        smoothies = [...smoothieList.value]
    }

    return smoothies
})

let sortedSmoothies = computed(() => {
    if (!isLoaded.value) return Array(6).fill(smoothieList.value);

    let smoothies = sort(smoothieList);

    return smoothies
})

// 篩選後 ingredient list 樣式
let filteredIngredient = computed(() => {
    let list = [...filteredSalad.value];

    let set = new Set();

    for (let i of list) {
        i.ingredients.forEach((item) => {
            if (item != '') {
                set.add(item)
            }
        })
    }

    return [...set]
})

// menu min height minmax(0, 200px)
let gridRow = ref(2);
const documentWidth = ref(0);
function getDocumentWidth() {
    documentWidth.value = window.innerWidth;
}
let saladMenuStyle = computed(() => {
    let rowHeight = 410;

    if (documentWidth.value <= 768) {
        rowHeight = 340
    }

    if (documentWidth.value <= 576) {
        rowHeight = 320
    }

    if (documentWidth.value <= 430) {
        rowHeight = 310
    }

    if (documentWidth.value <= 375) {
        rowHeight = 290
    }

    if (documentWidth.value <= 320) {
        rowHeight = 280
    }

    return {
        'grid-template-rows': `repeat(${gridRow.value}, minmax(0, ${rowHeight}px))`
    }
})
function setGridRows() {
    let rowNum = Math.ceil(filteredSalad.value.length / (columnsLimit.value));
    gridRow.value = isShowFullMenu.value ? rowNum : 2
}
watch(selectIngredient, (nVal) => {
    nextTick(() => {
        setGridRows()
    })
}, { deep: true })


// -----bot swiper-----
let docAvatarUrl = useConcatImgPath(['doc01.png', 'doc02.png'], 'Menu');
const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 5,
        min: 4
    },
    wordsPerSentence: {
        max: 10,
        min: 10
    }
});
let docData = [
    {
        title: '營養分析',
        name: '李醫師',
        intro: lorem.generateParagraphs(1),
        avatarURL: docAvatarUrl[0]
    },
    {
        title: '配方分析',
        name: '張營養師',
        intro: lorem.generateParagraphs(1),
        avatarURL: docAvatarUrl[1]
    }
];

// 路由跳轉
const router = useRouter();

function routerToProduct(name: string, id?: string) {
    router.push({
        name: 'Product',
        query: {
            name,
        },
    })
}

function routerToQNR() {
    router.push({
        path: '/questionnaire',
    })
}

// smoothies 加入購物車
const cartStore = useCartStore();
const { headerCart } = storeToRefs(cartStore);
const { addItemToCart } = cartStore;

// smoothies 飛入購物車
const flyToCartEl = ref();
const isFlightDelay = ref(false);
// 訂閱nav event
const hideNav = ref(false);
emitter.on('navEvent', (e) => {
    isFlightDelay.value = e as boolean
    hideNav.value = e as boolean;
})

const smoothiesCrew = {
    cartBtn: headerCart,
    flyingEl: flyToCartEl,
    coordCompensation: {
        x: 0,
        y: 0
    }
}

const smoothiesPlane = new FlyToCart(smoothiesCrew);
const {
    isFlying
} = smoothiesPlane;

const {
    getActiveItem,
    getActiveBtn,
    getLandingPoint,
    takeoff
} = smoothiesPlane;

async function delayFlying() {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, isFlightDelay.value ? 200 : 0)
    })
}

async function clickSmoothiesBtn(target: MenuItem, e: Event) {
    if (isFlying.value) return;
    try {
        emitter.emit('sendIcon')
        if (isFlightDelay.value) await delayFlying();
        getActiveItem(target);
        getActiveBtn(e);
        getLandingPoint();
        takeoff();
        addItemToCart(target);
    } catch (error) {
        console.log(error);
    }
}

// css
const subTitleRef = useTemplateRef('subTitleRef');
const subTitleTranslate = ref(0);
function getSubTitleTranslate() {
    if (!subTitleRef.value) return
    subTitleTranslate.value = subTitleRef.value.getBoundingClientRect().height / 2 || 0
}

// analystBot scroll trigger
gsap.registerPlugin(ScrollTrigger);
const analystBotRef = useTemplateRef('analystBotRef');
function setAnalystBotScrollTrigger() {
    gsap.fromTo(analystBotRef.value,
        {
            backgroundColor: '#FCFAF2',
        },
        {
            backgroundColor: '#fff6d6',
            scrollTrigger: {
                trigger: analystBotRef.value,
                start: 'top 60%',
                end: 'top 30%',
                scrub: .5,
            }
        }
    )
}
function refreshTrigger() {
    ScrollTrigger.refresh();
}

// skeleton
const isImgLoading = ref(true);
function imgLoaded() {
    isImgLoading.value = false
}

// -----生命週期-----
onBeforeMount(() => {
})

onUpdated(() => {
})

onMounted(() => {
    if (!isLoaded.value) {
        fetchMenu();
        // fetchIngredients();
    }
    if (ingredientsList.value.length <= 1) {
        fetchIngredients();
    }
    getSubTitleTranslate();
    getDocumentWidth()
    window.addEventListener('resize', debounceResize);
    setAnalystBotScrollTrigger();
})

onUnmounted(() => {
    window.removeEventListener('resize', debounceResize);
    emitter.off('navEvent', () => {
    })
})

</script>

<style scoped lang="scss">
$imgContainer_width: 250px;
$menuItemContainer_height: 405px;

* {
    // outline: 1px solid black;
}

.container {
    @extend %fixContainer;
    @extend %headerPseudo;

    flex-direction: column;
    position: relative;
    overflow: hidden;
}

%analystBtn {
    background-color: $btnBacColor;
    border-radius: 1.5rem;
    color: $primaryBacColor;
    font-size: 1.5rem;
    padding: 0.25rem 0.75rem;
    transition: box-shadow 0.2s linear;

    &:hover {
        box-shadow: 0 0 0 2px $btnBacColor;
    }
}

.analystTop {
    --padding: clamp(2rem, -0.8571428571428568rem + 14.285714285714285vw, 12rem);
    width: calc(100% - var(--padding));
    max-width: 90rem;
    margin-top: 2rem;
    margin-top: clamp(2rem, 1.4285714285714286rem + 2.857142857142857vw, 4rem);
    display: flex;
    align-items: center;
    flex-direction: row;
    border-radius: 1rem;
    position: relative;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
    border-radius: 1rem;
}

.analystImgWrapper {
    @include WnH(125px);
    margin: 1rem 1rem 1rem 2rem;
    border-radius: 100%;
    overflow: hidden;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
    background-color: white;

    img {
        @include WnH(100%);
    }
}

.textWrapper {
    flex: 1;
    margin-left: 1rem;
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
    padding-block: 2rem;

    h1 {
        font-size: 1.5rem;
        font-size: clamp(1.5rem, 1.3571428571428572rem + 0.7142857142857143vw, 2rem);
        line-height: 1.25;
        position: relative;
        // display: flex;
        font-weight: 450;
        text-align: justify;
    }

    button {
        @include WnH(9rem, 3rem);
        @extend %analystBtn;
        margin: 0 auto;
        align-self: center;
    }
}

.titleWrapper {}

.subTitle {
    font-size: 1rem;
    font-variation-settings: 'wght' 450;
    translate: 0% -.5rem;
}

.text {
    font-size: 1.75rem;
    font-size: clamp(1.75rem, 1.5357142857142856rem + 1.0714285714285714vw, 2.5rem);
    margin-right: 0.5rem;
    font-family: "Mr Dafoe", cursive;
    text-wrap: nowrap;
}



%hoverBotLine {
    &::before {
        @include WnH(105%, 1px);
        background-color: black;
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        transform: translateX(-105%);
        transition: transform 0.3s ease;
    }

    &:hover {
        &::before {
            transform: translateX(0);
        }
    }
}

%menuItem {
    @include flex-center-center;
    flex-direction: column;

    .menuImg {
        @include flex-center-center;
        @include WnH(250px);
        background: no-repeat url('@assets/img/Menu/bac_wood.jpg') center/contain;
        cursor: pointer;
        border-radius: 2.5rem;
        position: relative;

        img {
            @include WnH(85%);
            filter: drop-shadow(4px 4px 4px black);
            transition: transform 0.15s linear;
            transform-origin: center;
        }

        p {
            @include WnH(60px, 35px);
            background: $primaryBacColor;
            border-radius: 0.5rem 0 0 0;
            position: absolute;
            right: -1px;
            bottom: -1px;
            z-index: 2;
            text-align: center;
            line-height: 35px;
            font-variation-settings: 'wght' 700;
            color: $secondBacColor;
        }

        .description {
            @include WnH(100%);
            @include flex-center-center;
            color: $primaryBacColor;
            position: absolute;
            top: 0;
            left: 0;
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 2.5rem;
            opacity: 0;
            transition: opacity 0.3s ease;

            span {
                padding: 1rem;
            }
        }

        &:hover {
            img {
                transform: scale(1.1);
            }

            .description {
                opacity: 1;
            }
        }
    }

    &>h3 {
        font-size: 1.5rem;
        font-variation-settings: 'wght' 600;
        color: $secondBacColor;
        margin-top: 0.5rem;
    }

    .ingredients {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        justify-content: center;
        justify-items: center;
        column-gap: 3px;
        border-radius: 8px;
        overflow: hidden;
        margin-top: 0.5rem;

        span {
            @include WnH(100%, 24px);
            background-color: $btnBacColor_light;
            color: $primaryBacColor;
            display: inline-block;
            font-size: 14px;
            font-variation-settings: 'wght' 500;
            line-height: 24px;
            text-align: center;
            // padding-inline: .25rem;

            &:nth-of-type(1) {
                border-radius: 0.5rem 0 0 0;
                margin-bottom: 3px;
            }

            &:nth-of-type(2) {
                margin-bottom: 3px;
            }

            &:nth-of-type(3) {
                border-radius: 0 0.5rem 0 0;
                margin-bottom: 3px;
            }

            &:nth-of-type(4) {
                border-radius: 0 0 0 .5rem;
            }

            &:nth-of-type(6) {
                border-radius: 0 0 .5rem 0;
            }
        }

        &::after {
            @include WnH(100%);
            content: '';
            background-color: $btnBacColor_light;
            border-radius: 0 0 .5rem 0;
            // grid-column: span 1;
            // grid-row: span 1;
        }

        &>span:nth-child(6)~ ::after {
            // display: none;
        }
    }

    .btnWrapper {
        display: flex;
        justify-content: center;
        white-space: nowrap;
        width: 100%;
        height: 32px;
        overflow: hidden;
        position: relative;
        // border: 1px solid rgb(0, 0, 0, 0.25);
        border-radius: 8px;
        box-shadow: 2px 2px 8px rgb(0, 0, 0, 0.5);
        z-index: 0;
        margin-top: 1.25rem;

        * {
            // border: 1px solid black;
        }

        &>button {
            width: 50%;
            overflow: hidden;
            transition: color 0.3s ease;
            font-variation-settings: 'wght' 500;

            &:hover {
                color: $primaryBacColor;
            }
        }

        .cart-btn {
            color: $primaryBacColor;
        }

        &:has(.info-btn:hover) {

            &>.cart-btn {
                color: black;
            }

            &>.btnBackground {

                #center {
                    transform: translateX(137px);
                }

                #left {
                    scale: 0;
                }

                #right {
                    scale: 1;
                }
            }
        }

        .btnBackground {
            transform: translateY(-15%);
            position: absolute;
            z-index: -1;


            g>* {
                fill: $btnBacColor;
                // transition: scale 0.5s ease, transform 0.5s ease;
                transform-origin: center;
            }

            #right {
                scale: 0;
                transition: scale 0.4s ease-in-out;
            }

            #center {
                transition: transform 0.5s ease-in-out;
            }

            #left {
                transition: scale 0.4s ease-in-out;
            }

        }
    }
}

.menuWrapper {
    width: 100%;
    max-width: 90rem;
    padding-inline: 1rem;
    padding-inline: clamp(1rem, -0.4285714285714284rem + 7.142857142857142vw, 6rem);
    // margin-inline: 0;
    margin-top: 4rem;

    .title {
        .breadCrumb {
            font-size: 14px;
            // font-size: 0.75rem;
        }

        .titleText {
            font-size: 2rem;
            font-family: "EB Garamond", 'Noto Sans';
            font-variation-settings: 'wght' 750;
            margin-bottom: 1rem;
        }
    }
}

.filterWrapper {
    width: 100%;
    display: flex;
    // justify-content: space-between;
    font-size: 16px;
    font-variation-settings: 'wght' 450;
    position: relative;


    &>div {
        display: flex;
        align-items: center;
    }
}

.details {
    margin-left: 1rem;
    position: relative;

    &:hover .summary>span::before {
        transform: translateX(0);
    }
}

.summary {
    cursor: pointer;
    font-size: 16px;
    display: flex;
    gap: 0.25rem;
    user-select: none;
    position: relative;
    overflow: hidden;

    span {
        position: relative;
        @extend %hoverBotLine;

        &::before {
            width: 102%;
        }
    }

    .filterArrow {
        transform: rotateZ(-90deg);
        transition: transform 0.3s ease;
    }

    .rotateArrow {
        transform: rotateZ(0deg);
    }
}

.listWrapper {
    @include WnH(375px, 400px);
    background-color: $primaryBacColor;
    // border: 1px solid black;
    border-radius: 7px;
    box-shadow: 1px 1px 4px black;
    position: absolute;
    top: 150%;
    overflow-y: scroll;
    overflow-y: auto;
    z-index: 3;
    transition: transform 0.3s ease;

    &::-webkit-scrollbar-thumb {
        // background: transparent;
        background: #c1c1c1;
        border-radius: 10px !important;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
    }

    @supports (-moz-appearance: none) {
        scrollbar-width: thin;
    }

    // scrollbar-width: thin;

    // &::-webkit-scrollbar-track {
    //     background: #e6e6e6;
    //     // border-left: 1px solid transparent;
    //     border-radius: 10px !important;
    // }

    &::-webkit-scrollbar {
        // height: 90%;
        width: 0.5rem;
        scroll-behavior: smooth !important;
    }

    // &::before {
    //     @include WnH(100%, 77px);
    //     content: '';
    //     display: block;
    //     // border-bottom: 1px solid black;
    // }

    &::after {
        @include WnH(30%);
        content: '';
        position: absolute;
        top: -6%;
        left: 0;
        z-index: -1;

    }
}

.listHeader {
    width: 100%;
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    background-color: $primaryBacColor;
    z-index: 1;
}

.exit {
    // width: 20px;
    background-color: $primaryBacColor;
    cursor: pointer;
    // position: sticky;
    // top: 0px;
    z-index: 2;
    // margin-top: 5px;
    // margin-left: calc(100% - 36px);
    // padding-top: 5px;
    // padding-left: calc(100% - 36px);
    color: gray;
    align-self: flex-end;
    margin: 8px 8px 0 0;

    &:hover {
        color: black;
    }
}

.inputWrapper {
    width: 100%;
    // height: 90px;
    display: flex;
    gap: .5rem;
    // margin: 8px 14px 0 14px;
    padding: 1rem 1.5rem 1.5rem 1.5rem;
    justify-content: space-between;
    align-items: center;
    // box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.552);
    // border-radius: calc(1rem - 12px);
    position: sticky;
    top: 25px;
    background-color: $primaryBacColor;
    z-index: 1;
    // outline: 1px solid black;
    // border-bottom: 1px solid rgba(0, 0, 0, 0.25);

    &::after {
        @include WnH(100%, 2px);
        content: '';
        position: absolute;
        left: 0;
        bottom: 0px;
        background-color: rgba(0, 0, 0, 0.25);
    }

    form {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;

        input {
            // box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.551);
            // border: 2px inset rgba(0, 0, 0, 0.45);
            border-radius: 1rem;
            padding-left: 0.75rem;
            box-shadow: 1px 1px 4px inset rgba(0, 0, 0, 0.5);
            background-color: $primaryBacColor;
            line-height: 32px;
            transition: background-color 0.15s ease;

            &::placeholder {
                transition: opacity 0.15s ease;
            }

            &:focus {
                // border: 2px solid gray;
                transition: background-color 0.15s ease;
                outline: none;
                background-color: white;

                &::placeholder {
                    opacity: 0;
                }
            }
        }
    }

    button {
        @include WnH(45px, 24px);
        border: 1px solid rgb(0, 0, 0, 0.5);
        border-radius: 0.5rem;
        transition: border-color 0.3s ease;

        &:hover {
            border-color: black;
        }

        &:active {
            transform: translateY(1px);
        }
    }
}

.selectCount {
    font-size: 12px;
    text-wrap: nowrap;
}

.searchIcon {
    cursor: pointer;
    position: absolute;
    top: 50%;
    right: 8px;
    transform: translateY(-50%);
}


.fieldset>ul {
    height: 100%;
    margin: 1rem calc(20px + 0.75rem);

    li {
        cursor: pointer;
        padding: 0.25rem 0.25rem;
        margin: 6px 0;
        border: 2px outset rgba(0, 0, 0, 1);
        border-radius: 0.25rem;
        box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.5);
        position: relative;
        text-align: center;
        // // color: white;
        // background-color: green;
        transition: box-shadow 0.2s ease, opacity 0.2s ease;

        label {
            display: none;
        }

        span {
            font-size: 1rem;
            font-variation-settings: 'wght' 500;
        }

        &:not(.select):hover {
            &:hover {
                box-shadow: 2px 2px 3px rgba(0, 0, 0);
            }

            &:active {
                transform: translateY(1px);
            }
        }
    }
}

.select {
    border: 2px inset rgba(0, 0, 0, 1);
    box-shadow: inset 2px 2px 3px rgba(0, 0, 0, 0.5);
    background-color: $btnBacColor_light;

    span {
        color: white;
        // text-shadow: 0px 0px 0px white;
        // -webkit-text-stroke: 1px white;
        // text-shadow: 1px white;
    }

    &:hover {
        box-shadow: inset 2px 2px 3px rgba(0, 0, 0);
    }

    &:active {
        transform: translateY(1px);
    }
}

.unSelect {
    cursor: not-allowed;
    user-select: none;
    opacity: 0.3;

    &:not(.select):hover {
        &:hover {
            box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.5);
        }

        &:active {
            transform: none;
        }
    }
}

.selectAll {
    background-color: #fef7d7;
}

.empty {
    display: flex;
    justify-content: center;
    font-size: 1rem;
    font-variation-settings: 'wght' 400;
    height: 100%;
    opacity: 0.25;
}

.filter-enter-active,
.filter-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.filter-enter-from,
.filter-leave-to {
    opacity: 0;
    transform: translateY(-5%);
}

.filter-enter-to,
.filter-leave-from {
    opacity: 1;
    transform: translateY(0);
}


.sort {
    user-select: none;
    // align-self: flex-end;
    margin-left: auto;

    &>span {
        margin-right: 1rem;
    }
}

.sortWrapper {
    // $listWidth: 80px;
    position: relative;
    cursor: pointer;
    // width: $listWidth;
    // display: flex;
    // gap: 0.25rem;

    &:hover .header>span::before {
        transform: translateX(0);
    }
}

.header {
    display: flex;
    gap: 0.25rem;
    overflow: hidden;
    width: 74px;
    position: relative;

    span {
        @extend %hoverBotLine;
        // padding-left: 14px;
        text-wrap: nowrap;
        text-align: center;
        position: relative;
    }

    div {
        transition: transform 0.3s ease;
    }

    .sortDirIcon {
        // transform: rotate();
        transition: transform 0.3s ease;
    }

    .sortIcon {
        transform: rotateZ(-90deg);
    }
}



.sortList {
    @include flex-center-center;
    background-color: $primaryBacColor;
    // border: 1px solid black;
    border-radius: 7px;
    box-shadow: 1px 1px 4px black;
    flex-direction: column;
    // width: calc(63px + 0.25rem);
    width: 100%;
    position: absolute;
    top: 150%;
    z-index: 3;

    li {
        @include flex-center-center;
        width: 100%;
        margin-top: 0.5rem;
        text-align: center;
        text-wrap: nowrap;
        transition: box-shadow 0.15s ease;



        &:last-of-type {
            margin-bottom: 0.5rem;
        }

        button {
            border-radius: 4px;
            width: 80%;
            position: relative;
            // text-align: center;

            &:hover {
                box-shadow: 0 0 3px black;
            }

            &:active {
                outline: 1px solid black;
            }

            &::after {
                @include WnH(100%, 1px);
                background-color: gray;
                content: '';
                position: absolute;
                left: 0;
                bottom: -4px;
            }
        }

        &:last-of-type>button::after {
            display: none;
        }
    }

    &::before {
        @include WnH(100%);
        content: '';
        position: absolute;
        top: -5%;
        left: 0;
        z-index: -1;
        // background-color: black;
    }
}


.sort-enter-active,
.sort-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.sort-enter-from,
.sort-leave-to {
    opacity: 0;
    transform: translateY(-5%);
}

.sort-enter-to,
.sort-leave-from {
    opacity: 1;
    transform: translateY(0);
}


.sortCount {
    margin-left: 1rem;
    // align-self: flex-end;
    // text-align: end;
}

.filterTagWrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1rem;
    min-height: 28px;
}

.tag {
    border: 1px solid gray;
    background-color: transparent;
    display: flex;
    gap: .5rem;
    padding: 0 0.5rem 0 12px;
    border-radius: 2rem;
    position: relative;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    white-space: nowrap;

    &:hover {
        cursor: pointer;
        border-color: black;
        box-shadow: 0 0 2px black;
    }

    &:active {
        transform: translate(1px, 1px);
    }

    span {
        padding: 1px 0;
        user-select: none;
    }
}

.cancelSelect {
    cursor: pointer;
    margin-left: 0.5rem;

    span {
        line-height: 27px;
        border-bottom: 1px solid black;
        transition: box-shadow 0.3s ease;
        white-space: nowrap;
    }

    &:hover {
        span {
            box-shadow: 0 1px 0 black;
        }
    }

    &:active {
        transform: translate(1px, 1px);
    }
}


@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(5%);
    }

    to {
        opacity: 1;
        transform: translateY(0)
    }
}

.saladMenu {
    padding: 1rem 0rem;
    display: grid;
    justify-content: space-around;
    grid-template-columns: repeat(auto-fill, minmax(250px, 20%));
    row-gap: 2rem;
    position: relative;


    .item {}

    .hideItem {}

}

.onUnloaded {
    min-height: 80px;
    opacity: 0;
}

.showFullMenuBtn {
    // @include absoluteCenterTLXY(calc(100% - 5rem), 50%);
    @include flex-center-center;
    flex-direction: column;
    gap: 1rem;
    margin: 4rem 0;
    font-variation-settings: 'wght' 500;
    // overflow: hidden;
    // grid-column: 2 / span 2;

    span {
        text-align: center
    }

    button {
        @include WnH(75px, 40px);
        border: 1px solid rgba(0, 0, 0, 0.5);
        border-radius: 40px;
        position: relative;
        z-index: 0;
        overflow: hidden;
        transition: box-shadow 10s ease;
        box-shadow: 1px 1px 3px black;

        &:hover {
            box-shadow: 1px 1px 6px black;
        }

        &:active {
            box-shadow: 0px 0px 3px black;
        }
    }
}

.expandMenu {
    // min-height: 1750px;
    // grid-template-rows: 1fr 1fr 1fr 1fr;
}

.smoothieMenu {
    width: 100%;
    // max-width: 1440px;
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 0;
    // overflow: hidden;

    &::after {
        @include WnH(100vw, 100%);
        content: '';
        position: absolute;
        left: 50%;
        top: 0;
        transform: translateX(-50%);
        z-index: -1;
        // background-color: #FFEDA4;
    }

    .title {
        width: 100%;
        max-width: 90rem;
        padding-inline: 1rem;
        padding-inline: clamp(1rem, -0.4285714285714284rem + 7.142857142857142vw, 6rem);
        // width: 100vw;
        // max-width: 90rem;
        font-size: 1.75rem;
        font-family: "EB Garamond", 'Noto Sans';
        font-variation-settings: 'wght' 750;
        margin-inline: auto;
        // margin-bottom: 1rem;
    }

    .itemWrapper {
        // width: clamp(100%, 100vw, 1920px);
        // width: 100vw;
        width: 100%;
        margin: 3rem 0;
        padding: 0 1rem;
        // padding-left: 1rem;
        display: flex;
        gap: 2rem;
        flex-direction: row;
        gap: 2rem;
        position: relative;
        // transform: translateX(-336px);
        min-height: 483px;
    }

    swiper-container {
        width: 100%;

        &::part(container) {
            overflow: visible;
        }

        &::part(wrapper) {}

        &::part(scrollbar) {
            opacity: 0;
            bottom: -5%;
        }
    }

    .isSelecting {
        max-width: 90rem;
        padding-inline: 1rem;
        padding-inline: clamp(1rem, -0.4285714285714284rem + 7.142857142857142vw, 6rem);
        margin-inline: auto;

        swiper-container::part(scrollbar) {
            opacity: 1;
        }
    }

    .item {
        @extend %menuItem;
        @include WnH(300px, 100%);
        // flex-shrink: 0;
        // width: auto;
        flex: 0 0 auto;
        padding: 28px 1.5rem 1.5rem 1.5rem;
        border: 1px solid $secondBacColor;
        border-radius: 150px 150px 1rem 1rem;
        box-shadow:
            1px 0px 0px $secondBacColor,
            3px -1px 0px $secondBacColor,
            5px -2px 0px $secondBacColor,
            7px -4px 0px $secondBacColor,
            7px -6px 7px black;
        overflow: hidden;

        &>p {
            font-variation-settings: 'wght' 700;
            color: $secondBacColor;
        }
    }

    .item .btnWrapper {
        box-shadow: 1px 0px 5px black;

        .btnBackground {
            transform: translateY(-10%);
            scale: 1.5;
        }
    }

    .imgWrapper {
        @include WnH(250px);
        @include flex-center-center;
        position: relative;
        overflow: hidden;
        border-radius: 50% 50% 1rem 1rem;
        box-shadow: 1px 0px 10px black;
        // padding: 1rem;

        img {
            @include WnH(100%);
            transition: transform 0.15s ease;
            // border-radius: 7rem 7rem 1rem 1rem;
            // box-shadow: 2px 2px 3px black;
        }

        &:hover {
            img {
                // scale: 1.05;
                transform: scale(1.05);
            }

            .description {
                opacity: 1;
            }
        }
    }

    .description {
        @include WnH(100%);
        @include flex-center-center;
        color: $primaryBacColor;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 7rem 7rem 1rem 1rem;
        opacity: 0;
        transition: opacity 0.3s ease;

        span {
            transform: translateY(20%);
            padding: 1rem
        }
    }
}

.skeletonWrapper {}

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

.analystBot {
    min-height: 60vh;
    width: 100%;
    // max-width: 90rem;
    padding-inline: 1rem;
    padding-inline: clamp(1rem, -0.4285714285714284rem + 7.142857142857142vw, 6rem);
    // margin-inline: 0;
    // margin-block: 4rem 0;
    padding-block: 2rem 4rem;
    // display: flex;
    // margin-bottom: 4rem;
    position: relative;
    z-index: 0;
    display: flex;
    flex-direction: column;
    // align-items: center;
    // background-color: #fff6d6;

    &>div {
        width: 100%;
        max-width: 90rem;
        margin-inline: auto;
        padding-inline: 1rem;
        padding-inline: clamp(1rem, -0.4285714285714284rem + 7.142857142857142vw, 6rem);
    }

    .botTitle {
        margin-bottom: 2rem;
        width: max-content;
        position: relative;

        h2 {
            font-size: 1rem;
            font-size: clamp(1rem, 0.7142857142857143rem + 1.4285714285714286vw, 2rem);
            font-family: "EB Garamond", "Noto Sans";
            font-variation-settings: "wght" 750;
        }

        span {
            font-size: 1.75rem;
            font-size: clamp(1.75rem, 1.3928571428571428rem + 1.7857142857142856vw, 3rem);
            margin-right: .25rem;
        }

        &::after {
            // content: '';
            // position: absolute;
            // width: 160%;
            // height: 2px;
            // background-color: black;
            // bottom: 15px;
            // left: -30%;
        }
    }

    swiper-container {
        width: 100%;
    }

    .analystSwiper {
        --contentHeight: 320px;
        display: flex;
        align-items: center;
        gap: 3rem;
        // margin-bottom: 4rem;
        // margin: 4rem 1rem 8rem 1rem;
        padding: .5rem;
        height: 100%;

        .imgWrapper {
            @include WnH(var(--contentHeight));
            flex-shrink: 0;
            // border: 1px solid black;
            box-shadow: 1px 1px 5px black;
            border-radius: 100%;
            // overflow: hidden;
            position: relative;
            z-index: 0;
            margin-block: auto;
            background-color: $primaryBacColor;

            img {
                // @include WnH(100%);
                // filter: drop-shadow(4px 0px 8px gray);
                border-radius: 100%;
            }

            span {
                @include WnH(140px, 40px);
                background-color: $primaryBacColor;
                border: 1px solid black;
                border-radius: 30px;
                font-size: 1.5rem;
                font-variation-settings: 'wght' 600;
                position: absolute;
                left: 50%;
                bottom: -5%;
                transform: translateX(-50%);
                text-align: center;
                line-height: 40px;
                z-index: 1;
            }
        }

        .content {
            // margin: auto 5rem;
            // padding: 2rem 2rem;
            padding-inline: 2rem;
            padding-top: 2rem;
            padding-top: 3rem;
            display: flex;
            flex-direction: column;
            // justify-content: space-between;
            border-radius: 2rem;
            // box-shadow: 1px 1px 5px black;
            // margin-block: auto;
            height: calc(1.3 * var(--contentHeight));
            // max-height: calc(1.5 * var(--contentHeight));

            h2 {
                font-variation-settings: 'wght' 600;
                // font-size: 2rem;
                font-size: 1.5rem;
                font-size: clamp(1.5rem, 1.3571428571428572rem + 0.7142857142857143vw, 2rem);
            }

            p {
                text-indent: 2rem;
                font-size: 1rem;
                font-size: clamp(1rem, 0.9285714285714286rem + 0.35714285714285715vw, 1.25rem);
                // font-size: 1.25rem;
                // min-height: 90px;
                // height: 120px;
                margin-top: .5rem;
                overflow: hidden;
            }

            button {
                @include WnH(9rem, 3rem);
                @extend %analystBtn;
                font-size: 1.5rem;
                align-self: center;
                margin-top: auto;
                margin-bottom: 1.75rem;
                // visibility: hidden;
                box-shadow: 1px 1px 4px black;
            }
        }
    }

    .cloneSwiper {
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        pointer-events: none;

        .imgWrapper,
        .content {
            box-shadow: none;
        }

        &>div *:not(.target) {
            visibility: hidden;
        }
    }
}

.analystBot {
    // width: 100%;
    // max-width: 90rem;
    // padding-inline: 1rem;
    // padding-inline: clamp(1rem, -0.4285714285714284rem + 7.142857142857142vw, 6rem);
    // margin-block: 4rem;
    // position: relative;
    // z-index: 0;
}

.mobileBot {
    display: none;
    flex-direction: column;
    gap: 1rem;

    .title {
        width: max-content;
        font-size: 3rem;
        margin-inline: auto;
        position: relative;

        span {
            font-size: 4rem;
        }

        &::after {
            content: '';
            position: absolute;
            width: 160%;
            height: 2px;
            background-color: black;
            bottom: 15px;
            left: -30%;
        }
    }

    .buttonWrapper {
        display: flex;
        justify-content: center;
    }

    button {
        @include WnH(10rem, 4rem);
        @extend %analystBtn;
        font-size: 1.75rem;
        border-radius: 6rem;
    }

}

.docList {
    // display: flex;
    // justify-content: space-evenly;

    &>div {
        // width: 400px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .content {
        // margin: auto 5rem;
        padding: 2rem 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 2rem;
        // box-shadow: 1px 1px 5px black;
        margin-block: 1rem;
        flex: 1;

        h2 {
            font-variation-settings: 'wght' 600;
            // font-size: 2rem;
            font-size: 2rem;
            font-size: clamp(1.5rem, 1.3571428571428572rem + 0.7142857142857143vw, 2rem);
        }

        p {
            text-indent: 2rem;
            font-size: 1rem;
            font-size: clamp(1rem, 0.9285714285714286rem + 0.35714285714285715vw, 1.25rem);
            // font-size: 1.25rem;
            margin-top: 0.75rem;
            // min-height: 90px;
            // height: 120px;
            overflow: hidden;
            text-align: justify;
        }


    }
}

.docImgWrapper {
    @include WnH(250px);
    flex-shrink: 0;
    box-shadow: 1px 1px 5px black;
    border-radius: 100%;
    position: relative;
    z-index: 0;
    margin-block: auto;
    background-color: $primaryBacColor;
    margin-top: 4px;

    img {
        border-radius: 100%;
    }

    span {
        @include WnH(140px, 40px);
        background-color: $primaryBacColor;
        border: 1px solid black;
        border-radius: 30px;
        font-size: 1.5rem;
        font-variation-settings: 'wght' 600;
        position: absolute;
        left: 50%;
        bottom: -5%;
        transform: translateX(-50%);
        text-align: center;
        line-height: 40px;
        z-index: 1;
    }
}

.mobileContent {
    display: none;
}

.smoothieMenu .item .mobileBtn {
    display: none;
}

.skeleton {
    position: absolute;
    top: 0;
    background-color: $primaryBacColor;
    width: 100%;
    height: 100%;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    overflow: hidden;
    pointer-events: none;
    border-radius: 1rem 1rem 8px 8px;

    .top {
        width: 100%;
        aspect-ratio: 1 / 1;
        background-color: rgba(62, 163, 80, 0.2);
        border-radius: 0 0 1rem 1rem;
    }

    .bot {
        width: 100%;
        aspect-ratio: 2.5 / 1;
        background-color: rgba(62, 163, 80, 0.2);
        border-radius: 8px 8px 0 0;
    }

    .scanner {
        pointer-events: none;
        position: absolute;
        width: 200%;
        height: 200%;
        left: 0;
        top: 0;
        background: linear-gradient(115deg, transparent 40%, #FCFAF2 50%, transparent 52%);
        animation: loading 5s infinite linear;
    }
}

.componentSkeleton {
    background-color: $btnBacColor_light;
    opacity: .2;

    .scanner {
        // background-color: red;
    }
}

@keyframes loading {
    0% {
        translate: -100% -50%;
    }

    100% {
        translate: 110% -50%;
    }
}

.skeleton-leave-active {
    transition: opacity .3s
}

.skeleton-leave-to {
    opacity: 0;
}

.skeleton-leave-from {
    opacity: 1;
}

@include XLarge {}

@include large {}

@include medium($width: 1024px) {
    .analystTop {
        flex-direction: column;
    }

    .analystImgWrapper {
        @include WnH(150px);
        margin: 0;
        margin-block: 1rem;
    }

    .textWrapper {
        flex-direction: column;
        margin-left: 0;
        padding-inline: 2rem;
        padding-block: 1rem;
        gap: 0rem;

        h1 {
            // margin-top: 0.25rem;
        }
    }

    .analystBot {

        swiper-container {
            display: none;
        }

        .mobileBot {
            display: flex;
        }

        // .analystSwiper {
        //     margin-inline: .5rem;

        //     .content {
        //         margin-inline: 2.5rem;
        //         // height: 225px;
        //     }

        //     .imgWrapper {
        //         @include WnH(225px);
        //     }
        // }
    }
}

@include medium {
    .analystImgWrapper {
        @include WnH(125px);
    }

    .textWrapper {
        padding-inline: 1.5rem;

        h1 {
            margin-top: 0.25rem;
        }
    }

    .saladMenu,
    .saladMenu {
        grid-template-columns: repeat(auto-fill, minmax(200px, 20%));
    }

    .showFullMenuBtn {
        margin-block: 2rem;
    }

    .filterTagWrapper {
        min-height: 0;
    }

    .smoothieMenu {
        .itemWrapper {
            margin-block: 2rem;
            min-height: 417px;
        }

        .item {
            width: 250px;
            padding: 24px 1rem 1rem 1rem;

            .btnWrapper {
                display: none;

                &>button {

                    &:is(.info-btn):hover {
                        color: black;
                    }
                }

                &:has(.info-btn:hover) {
                    &>.cart-btn {
                        color: $primaryBacColor;
                    }
                }
            }

            .ingredients span {
                font-size: 13px
            }
        }

        .imgWrapper {
            @include WnH(200px);
        }

        .description {
            display: none;
        }
    }

    .smoothieMenu .item .mobileBtn {
        display: flex;
        align-items: center;
        // flex-direction: column;
        // gap: .5rem;
        margin-top: 1rem;
        height: max-content;
        box-shadow: none;
        // overflow: visible;
        box-shadow: 2px 2px 8px rgb(0, 0, 0, 0.5);

        button {
            // width: max-content;
            padding-block: .25rem;
            // border-radius: .5rem;
            // transition: translate .15s;
            user-select: none;

            &:active {
                // translate: 2px 2px;
            }
        }

        &:has(.cart-btn:active) {
            &::before {
                filter: brightness(.6);
            }
        }

        &:has(.info-btn:active) {
            &::after {
                filter: brightness(.8);
            }
        }

        &::before {
            content: '';
            position: absolute;
            left: 0%;
            top: 0;
            width: 55%;
            height: 100%;
            z-index: -1;
            border-bottom: 32px solid $btnBacColor;
            border-right: 8px solid transparent;
        }

        &::after {
            content: '';
            position: absolute;
            right: -2.5%;
            top: 0;
            width: 55%;
            height: 100%;
            z-index: -1;
            border-top: 32px solid $primaryBacColor;
            border-left: 8px solid transparent;
        }

        .cart-btn {
            background-color: transparent;
            position: relative;
            z-index: 1;

        }

        .info-btn {
            padding-inline: .5rem;
            position: relative;
            z-index: 0;
        }
    }

    .docImgWrapper {
        @include WnH(200px);
    }
}

@include small {
    .textWrapper {
        padding-inline: 1.25rem;
        gap: .5rem;
    }

    .saladMenu,
    .saladMenu {
        grid-template-columns: repeat(auto-fill, minmax(180px, 20%));
    }

    .smoothieMenu {
        .itemWrapper {
            margin-block: 1.5rem;
            min-height: 390px;
        }

        .item {
            width: 230px;
            padding-top: 24px;

            .btnWrapper {
                margin-top: 1rem;
            }

            .ingredients span {
                font-size: 12px
            }
        }

        .imgWrapper {
            @include WnH(180px);
        }
    }

    .smoothieMenu .item .mobileBtn {
        margin-top: .75rem;
        font-size: 14px;
    }

    .docImgWrapper {
        @include WnH(175px);
    }
}

@include small($width: 430px) {
    .listWrapper {
        width: 225px;
    }

    .selectCount,
    .resetBtn {
        display: none;
    }

    .filterWrapper {
        flex-direction: column;
        gap: .5rem;
    }

    .filter {
        width: max-content;
    }

    .sort {
        margin-left: 0;
    }

    .sortCount {
        margin-left: auto;
    }

    .inputWrapper {
        padding-block: .5rem 1rem;
        flex-direction: column;
        gap: .5rem;
        // padding-inline: .5rem;
        // display: grid;

        input {
            width: 100%;
        }
    }

    .mobileContent {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-inline: .5rem 0;
        width: 100%;

        .selectCount,
        .resetBtn {
            display: block;
        }

        .selectCount {
            height: 100%;
            line-height: 25px;
        }
    }

    .saladMenu,
    .saladMenu {
        grid-template-columns: repeat(auto-fill, minmax(155px, 20%));
        row-gap: 1.5rem;
    }

    .smoothieMenu {

        .itemWrapper {
            min-height: 357px;
        }

        .skeletonWrapper:deep(.wrapper) {
            .imgSkeleton {
                @include WnH(250px);
            }

            .textSkeleton>div {
                width: 120px;
                height: 20px;
            }
        }

        .item {
            width: 200px;
            padding: 20px .75rem .75rem .75rem;

            .ingredients span {
                font-size: 12px
            }
        }

        .imgWrapper {
            @include WnH(155px);
        }
    }

    .docList .content {
        // margin-block: 0;
        padding-block: 1rem;
    }

    .mobileBot button {
        @include WnH(8rem, 3.5rem);
        font-size: 1.25rem;
    }
}

@include small($width: 375px) {

    .saladMenu,
    .saladMenu {
        grid-template-columns: repeat(auto-fill, minmax(140px, 20%));
        row-gap: 1rem;
    }

    // .smoothieMenu {
    //     .item {
    //         width: 200px;
    //         padding: 20px .75rem .75rem .75rem;

    //         .ingredients span {
    //             font-size: 12px
    //         }
    //     }

    //     .imgWrapper {
    //         @include WnH(155px);
    //     }
    // }

}

@include small($width: 320px) {

    .saladMenu,
    .saladMenu {
        grid-template-columns: repeat(auto-fill, minmax(135px, 20%));
    }

    .smoothieMenu {
        .skeletonWrapper:deep(.wrapper) {
            .imgSkeleton {
                @include WnH(200px);
            }

            .textSkeleton>div {
                width: 100px;
                height: 20px;
            }
        }

        .item {
            // width: 175px;
            // padding: 0rem .5rem .5rem .5rem;

            .ingredients span {
                font-size: 12px
            }
        }

        .imgWrapper {
            // @include WnH(160px);
        }
    }

    .docList .content p {
        text-align: left;
    }
}
</style>