<template>
    <!-- <router-view></router-view> -->
    <div class="container" ref="main" @click="closePop">
        <div class="analystTop">
            <div class="imgWrapper">
                <swiper-container effect="fade" speed="700"
                    autoplay-delay="4000"
                    :fadeEffect="{ crossFade: true }"
                    :allowTouchMove="false" class="test">
                    <swiper-slide>
                        <img src="@assets/img/Menu/doc01.png"
                            alt="doc">
                    </swiper-slide>
                    <swiper-slide
                        data-swiper-autoplay="6000">
                        <img src="@assets/img/Menu/doc02.png"
                            alt="doc">
                    </swiper-slide>
                </swiper-container>
            </div>
            <div class="textWrapper">
                <h1>
                    <span
                        class="subTitle">您做過專屬個人診斷了嗎?</span>
                    <span
                        class="text">Relation-Ship</span>團隊的專業分析，為您打造專屬菜單
                </h1>
            </div>
            <button @click="routerToQNR">開始診斷</button>
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
                                @click="showFilter">
                                <span>
                                    營養種類
                                </span>
                                <SvgIcon
                                    name="ListArrowDown"
                                    width="21px"
                                    height="21px"
                                    class="filterArrow"
                                    :class="{ rotateArrow: filterIsShow }">
                                </SvgIcon>
                            </div>
                            <transition name="filter">
                                <div class="listWrapper"
                                    v-show="filterIsShow">
                                    <SvgIcon name="cancel"
                                        width="20"
                                        height="20"
                                        class="exit"
                                        @click="showFilter">
                                    </SvgIcon>
                                    <div class="listHeader">
                                        <form action="">
                                            <input
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
                                        <div>
                                            已選取
                                            {{
                                                selectIngredient.length
                                            }}
                                            項
                                        </div>
                                        <div>
                                            <button
                                                @click="resetFilterSelect">重置</button>
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
                                                <span>找不到唷</span>
                                            </div>
                                        </ul>
                                    </div>
                                </div>
                            </transition>
                        </div>
                    </div>
                    <!-- <div>
                        選中
                    </div> -->
                    <div class="sort" @click.stop>
                        <span>排序：</span>
                        <div class="sortWrapper">
                            <div class="header"
                                @click="showSort">
                                <span>{{ sorting }}</span>
                                <SvgIcon name="sortDown"
                                    width='16' height="16"
                                    :color="sorting == '精選' ? '#FCFAF2' : '#0d731e'"
                                    :style="sortDirIcon">
                                </SvgIcon>
                                <SvgIcon
                                    name="ListArrowDown"
                                    width="21px"
                                    height="21px"
                                    :class="{ sortIcon: !sortIsShow }">
                                </SvgIcon>
                            </div>
                            <transition name="sort">
                                <ul class="sortList"
                                    @click="showSort"
                                    v-show="sortIsShow">
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
                        <SvgIcon name="cancel" width="16"
                            height="16" color="black">
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
                <transition name="skeleton">
                    <div class="skeleton"
                        v-show="!isLoaded">
                        <Skeleton v-for="(item, index) in 8"
                            :key="index"></Skeleton>
                    </div>
                </transition>

                <Product_template :item="item"
                    :flightDelay="hideNav ? .2 : 0"
                    v-for="(item, index) in sortedSalad"
                    :key="item.id ? item.id : index" :class="{
                        hideItem: index > (showMenuLimit - 1),
                    }"
                    v-show="filteredSalad.includes(item) && index < showMenuLimit && isLoaded"
                    ref="COMList">
                </Product_template>

                <!-- <div class="item"
                    v-for="(item, index) in sortedSalad"
                    :key="item.id ? item.id : index" :class="{
                        hideItem: index > (showMenuLimit - 1),
                    }"
                    v-show="filteredSalad.includes(item) && index < showMenuLimit && isLoaded"
                    ref="elList">
                    <div class="menuImg">
                        <img :src="item.fileName!" alt="商品">
                        <p>{{ item.price }}元</p>
                        <div class="description">
                            <span>{{ item.description
                                }}</span>
                        </div>
                    </div>
                    <h3>{{ item.name }}</h3>
                    <div class="ingredients">
                        <span
                            v-for="(el) in item.ingredients"
                            :key="el">
                            {{ el }}
                        </span>
                    </div>
                    <div class="btnWrapper">
                        <button
                            class="cart-btn">加入購物車</button>
                        <button
                            @click="routerPush(item.name!, item.id)"
                            class="info-btn">詳細資訊</button>
                        <div class="btnBackground">
                            <svg width="260" height="48"
                                viewBox="0 0 260 48"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <g id="btnBac"
                                    filter="url('#btn')">
                                    <rect id="center" y="21"
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
                                    <feColorMatrix in="blur"
                                        mode="matrix"
                                        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                                        result="btn" />
                                </filter>
                            </svg>
                        </div>
                    </div>
                </div> -->
                <!-- </transition-group> -->
            </div>
            <div class="showFullMenuBtn" :class="{
                onUnloaded: !isLoaded
            }" v-show="true">
                <span>{{ currShow }} of {{
                    saladList.length }}</span>
                <!-- <transition name="showFullMenuBtn" -->
                <!-- type="animation"> -->
                <button @click="setFullMenu"
                    v-show="isShowBtn">
                    展開
                </button>
                <!-- </transition> -->
            </div>
            <div class="smoothieMenu">
                <div class="title">
                    SMOOTHIES <span></span>
                </div>
                <div class="itemWrapper" ref="itemWrapper"
                    :style="itemWrapperStyle">
                    <div class="skeletonWrapper"
                        v-show="!isLoaded">
                        <Skeleton class="skeleton"
                            v-for="(item, index) in 6"
                            :key="index"></Skeleton>
                    </div>
                    <swiper-container slides-per-view="auto"
                        :loopAddBlankSlides="true"
                        ref="smoothieSwiper"
                        grabCursor="true"
                        :space-between="32"
                        :loop="loopProps" speed="5000"
                        :autoplay="false">
                        <swiper-slide class="item"
                            v-for="(items, index) in sortedSmoothies"
                            v-show="filteredSmoothie.includes(items)"
                            :key="index">
                            <div class="imgWrapper"
                                @click="routerToProduct(items.name)">
                                <img :src="items.fileName!"
                                    alt="商品">
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
                                    <svg width="260"
                                        height="48"
                                        viewBox="0 0 260 48"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <g id="btnBac"
                                            filter="url('#btn')">
                                            <rect
                                                id="center"
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
                            <Teleport
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
        </div>
        <div class="analystBot">
            <swiper-container effect="fade" speed="700"
                :fadeEffect="{ crossFade: true }" :autoplay="{
                    delay: 4000,
                    pauseOnMouseEnter: true
                }" :allowTouchMove="false">
                <swiper-slide
                    v-for="({ title, name, intro, avatarURL }, index) in docData"
                    :key="index">
                    <div class="analystSwiper">
                        <div class="imgWrapper">
                            <img :src="avatarURL" alt="">
                            <span>
                                {{ title }}
                            </span>
                        </div>
                        <div class="content">
                            <h2>{{ name }}</h2>
                            <p>
                                {{ intro }}
                            </p>
                            <button @click="routerToQNR">
                                開始診斷
                            </button>
                        </div>
                    </div>
                </swiper-slide>
            </swiper-container>
            <div class="analystSwiper cloneSwiper">
                <div class="imgWrapper">
                    <img :src="docData[0].avatarURL" alt="">
                    <span>
                        {{ docData[0].title }}
                    </span>
                </div>
                <div class="content">
                    <h2>{{ docData[0].name }}</h2>
                    <p>
                        {{ docData[0].intro }}
                    </p>
                    <button class="target"
                        @click="routerToQNR">
                        開始診斷
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, reactive, watch, onBeforeMount, watchEffect, nextTick, onBeforeUpdate, inject, toRefs, onUnmounted } from 'vue';
import type { ComputedRef, Ref, WritableComputedRef } from 'vue';
import Skeleton from '@components/skeleton/skeleton.vue';
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
import { log } from 'console';
import { useCartStore } from '@/store/cartStore';
import emitter from '@/utils/eventBus';
import FlyToCart from '@/hooks/useFlyToCart';


//DOING salad圖ps改成一致
//TODO 商品內頁 麵包屑
/**
 * *骨架屏、果席跑馬燈初步完成
 * *營養數據轉移
 * *新增數據量
 * *響應初步完成
 * --------------
 * !整理樣式
 * !整理腳本
 * !RWD
 * //!讀取中 menu沒被撐開
 * //!排序 篩選時會閃爍
 * //!篩選多個時 展開按鈕有錯誤 => 改setFullMenu limit 為原數據數量
 * --------------
 * ? localStorage、ETag緩存
 * //? grid轉場效果使用不順 gsap解決
 * //? 加入購物車改為右上角icon
 * //? mongodb 聚合管道
 * --------------
 * 麵包屑
 * //salad圖大小不一致
 * //畫面縮放後更新smoothie marquee
 * //篩選後減少可選選項
 * //篩選下方篩選標籤
 * //初始化轉場(數據初次返回時)
 * //排序精選無轉場
 * //篩選、排序邏輯
 * //菜單響應
 * //營養改在store補足6個
 * //果昔跑馬燈
 * //菜單摺疊區塊
 * //篩選、排序箭頭轉場
 * //縮畫面會有白邊->max width: 100%
 * //menu改4行 WrapperMargin調整 grid space around
 * //top分析改排版
 * //menu 按鈕樣式
 * //服務端導入資源
 * //api 建構
 * //req 編寫 
 * //bottom 診斷圖片 用頭貼輪播
 * //圖片路徑
 * //res 導入 pinia
 */

// -----篩選、排序樣式-----
// 下拉顯示
function handleShowList() {
    let isShow = ref(false);

    function setShow() {
        isShow.value = !isShow.value;
    }

    return { isShow, setShow }
}

let { isShow: filterIsShow, setShow: showFilter } = handleShowList();
let { isShow: sortIsShow, setShow: showSort } = handleShowList();

// 點擊空白關閉 點擊排序後關閉
function closePop() {
    if (filterIsShow.value || sortIsShow.value) {
        filterIsShow.value = false;
        sortIsShow.value = false;
    }
}

// -----menu store 數據-----
const menuStore = useMenuStore();
const { fetchIngredients, fetchMenu } = menuStore;
const { fullMenu, saladList, smoothieList, ingredientsList, isLoaded } = storeToRefs(menuStore);

// menuStore.$subscribe((_, state) => {
//     if (state.isLoaded) {
//         // fillListToSix(saladList.value);
//         // fillListToSix(smoothieList.value);
//     }
// })

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

// ingredients補足6個 => CSS解決
// function fillListToSix(list: MenuItem[]) {
//     list.forEach((item) => {
//         while (item.ingredients.length < 6) {
//             item.ingredients.push('');
//         }
//     })
// }

// 篩選資料去重
// interface ingredientsList {
//     ingredients: string[] | null
// }
// function removeDuplicates(list: Ref<ingredientsList[]>) {
//     let set = new Set();

//     for (let i of list.value) {
//         i.ingredients!.forEach((ingredient) => {
//             if (ingredient != '') {
//                 set.add(ingredient);
//             }
//         })
//     }

//     return [...set]
// }

menuStore.$subscribe((_, state) => {
    // console.log(state.ingredientsList);
})
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
        selectIngredient.value = selectIngredient.value.filter(item => item !== n)
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
// function filter(el: Ref<MenuItem[]>) {
//     if (selectIngredient.value.length === 0) return [...el.value]

//     let list = el.value.filter((item) => {
//         for (let factor of selectIngredient.value) {
//             if (item.ingredients.some(el => el == factor)) {
//                 return true
//             }
//         }
//         return false
//     })

//     return list
// }

// -----menu 摺疊-----
let isShowFullMenu = computed(() => showMenuLimit.value == filteredSalad.value.length);
let isShowBtn = computed(() => showMenuLimit.value < filteredSalad.value.length)

let showMenuLimit = ref(8);

let currShow = computed(() => {
    let length = filteredSalad.value.length;
    // console.log(length);
    if (length > showMenuLimit.value) {
        return showMenuLimit.value
    }
    return length
})

function setFullMenu() {
    showMenuLimit.value = saladList.value.length;
}

// let skeletonIsShow = ref(true); //初始化時待skeleton消失
// function setSkeletonIsShow() {
//     skeletonIsShow.value = false;
// }


// -----smoothie marquee-----
let smoothieSwiper = ref();
let itemWrapper = ref();
let loopProps = computed(() => {
    if (selectIngredient.value.length === 0) {
        return {
            delay: 0,
            pauseOnMouseEnter: true,
        }
    }
    return false
})

let itemWrapperStyle = computed(() => {
    let translateX = ref(0);
    if (itemWrapper.value) {
        let { left } = itemWrapper.value.getBoundingClientRect();
        let width = itemWrapper.value.offsetWidth;
        // console.log(itemWrapper);
        translateX.value = left > 336 ? 336 : left;
        // translateX.value = left;
    }

    return {
        // transform: `translateX(-${translateX.value}px)`
    }
})

watch(isLoaded, (nVal) => {
    if (nVal == true) {
        showMenuLimit.value = 8
        nextTick(() => {
            handleSwiperSlide('start');
        })
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
    // const actionsMap = {
    //     start: () => smoothieSwiper.value.swiper.autoplay.start(),
    //     stop: () => smoothieSwiper.value.swiper.autoplay.stop(),
    //     update: () => {
    //         smoothieSwiper.value.swiper.update();
    //         smoothieSwiper.value.swiper.slideToLoop(0, 1000);
    //     }
    // };

    // const actionHandler = actionsMap[action];

    // actionHandler();
}

async function handleResize() {
    await nextTick();
    handleSwiperSlide('update');
}

// -----menu GSAP-----
gsap.registerPlugin(Flip);
let saladContainer = ref();

const COMList = ref<InstanceType<typeof Product_template>[]>();
function getProductElState() {
    // let list: HTMLElement[] = [];
    // if (isLoaded.value && COMList.value) {
    //     COMList.value.forEach((component) => {
    //         list.push(component.productEl)
    //         // console.log(component.productEl);
    //     })
    // }
    // return list
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
        }
    });
}

// ----- show數據 -----

let filteredSalad = computed(() => {

    let elList = getProductElState()
    const state = Flip.getState(elList);

    let salad = filter(saladList);

    nextTick(() => {
        setSaladGSAP(state);
    })
    return salad
})

let sortedSalad = computed<MenuItem[]>(() => {
    if (!isLoaded.value) return Array(8).fill(saladList.value);

    let list = sort(saladList);

    // for (let i of list) {
    //     console.log(i);
    // }

    return list
});

watch(sortedSalad, (nVal) => {
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
// watch(filteredIngredient, () => {
// console.log(filteredIngredient.value);
// })

// menu min height minmax(0, 200px)
let gridRow = ref(2);
let saladMenuStyle = computed(() => ({
    'grid-template-rows': `repeat(${gridRow.value}, minmax(0, 450px))`
}))
watch(selectIngredient, (nVal) => {
    if (nVal.length == 0) return
    let rowNum = Math.ceil(filteredSalad.value.length / 4);
    gridRow.value = rowNum;

}, { deep: true })


// -----bot swiper-----
let docAvatarUrl = useConcatImgPath(['doc01.png', 'doc02.png'], 'Menu');
let docData = [
    {
        title: '營養分析',
        name: '李醫師',
        intro: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque ipsa eveniet similique tenetur laboriosam culpa maxime aspernatur incidunt aut saepe.',
        avatarURL: docAvatarUrl[0]
    },
    {
        title: '配方分析',
        name: '張營養師',
        intro: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maxime velit totam, nulla dicta ea accusamus.',
        avatarURL: docAvatarUrl[1]
    }
];

// 路由跳轉
const router = useRouter();
const route = useRoute();

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


// -----生命週期-----
onBeforeMount(() => {
})
onMounted(() => {
    if (!isLoaded.value) {
        fetchMenu();
        // fetchIngredients();
    }
    if (ingredientsList.value.length <= 1) {
        fetchIngredients();
    }
    window.addEventListener('resize', handleResize);
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    emitter.off('navEvent', () => {
    })
})

</script>

<style scoped lang="scss">
$imgContainer_width: 250px;
$menuItemContainer_height: 405px;

.container {
    @extend %fixContainer;
    @extend %headerPseudo;

    flex-direction: column;
    position: relative;
    overflow: hidden;


    &>div {
        max-width: 100%;
        width: 1440px;
        padding: 0 6rem;
        // margin: 1rem auto;
        margin-top: 4rem;

        // &:nth-child(1),
        // &:last-child {
        //     padding-left: 6rem;
        //     padding-right: 6rem;
        // }
    }

    // .menuWrapper {
    //     padding: 0 6rem;
    // }


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
    // @include flex-center-center;
    display: flex;
    // justify-content: space-around;
    flex-direction: row;
    // margin-top: 4rem;
    // border: 1px solid black;
    border-radius: 1rem;
    // background-color: white;
    // box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
    position: relative;


    &::after {
        @include WnH(calc(100% - 12rem), 100%);
        content: '';
        box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
        border-radius: 1rem;
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 6rem;
    }

    .imgWrapper {
        @include WnH(125px);
        margin: 1rem 1rem 1rem 2rem;
        // margin-left: 2rem;
        border-radius: 100%;
        overflow: hidden;
        box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
        background-color: white;

        img {
            @include WnH(100%);
            // background-color: white;
        }
    }



    .textWrapper {
        margin-left: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: center;

        p {
            // font-size: 1rem;

        }

        h1 {
            font-size: 2rem;
            margin-top: 0.5rem;
            line-height: 2rem;
            position: relative;

            .subTitle {
                font-size: 1rem;
                line-height: 24px;
                position: absolute;
                top: -100%;
            }

            .text {
                font-size: 2.5rem;
                margin-right: 0.5rem;
                font-family: "Mr Dafoe", cursive;
            }
        }
    }

    button {
        @include WnH(9rem, 3rem);
        @extend %analystBtn;
        // margin-top: 1rem;
        margin: 0 auto;
        align-self: center;
    }
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

.menuWrapper {
    // margin-top: 4rem;

    .title {
        .breadCrumb {
            font-size: 0.75rem;
        }

        .titleText {
            font-size: 1.75rem;
            font-family: "EB Garamond", 'Noto Sans';
            font-variation-settings: 'wght' 750;
            margin-bottom: 1rem;
        }

        .filterWrapper {
            width: 100%;
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            position: relative;


            &>div {
                display: flex;
                align-items: center;
            }

            .filter {

                .details {
                    margin-left: 1rem;
                    position: relative;

                    .summary {
                        cursor: pointer;
                        font-size: 14px;
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

                    &:hover .summary>span::before {
                        transform: translateX(0);
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

                        .exit {
                            // width: 20px;
                            background-color: $primaryBacColor;
                            cursor: pointer;
                            position: sticky;
                            top: 0px;
                            z-index: 2;
                            padding-top: 5px;
                            padding-left: calc(100% - 36px);
                            color: gray;

                            &:hover {
                                color: black;
                            }
                        }

                        .listHeader {
                            width: 100%;
                            // height: 90px;
                            display: flex;
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

                                .searchIcon {
                                    cursor: pointer;
                                    position: absolute;
                                    top: 50%;
                                    right: 8px;
                                    transform: translateY(-50%);
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

                            &::after {
                                @include WnH(100%, 2px);
                                content: '';
                                position: absolute;
                                left: 0;
                                bottom: 0px;
                                background-color: rgba(0, 0, 0, 0.25);
                            }
                        }


                        .fieldset>ul {
                            height: 100%;
                            margin: 1rem calc(20px + 0.75rem);

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
                }
            }

            .sort {
                user-select: none;

                &>span {
                    margin-right: 1rem;
                }

                .sortWrapper {
                    // $listWidth: 80px;
                    position: relative;
                    cursor: pointer;
                    // width: $listWidth;
                    // display: flex;
                    // gap: 0.25rem;

                    .header {
                        display: flex;
                        gap: 0.25rem;
                        overflow: hidden;
                        width: 74px;
                        position: relative;

                        span {
                            // padding-left: 14px;
                            text-wrap: nowrap;
                            text-align: center;
                            position: relative;
                            @extend %hoverBotLine;
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

                    &:hover .header>span::before {
                        transform: translateX(0);
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
                }

                .sortCount {
                    margin-left: 1rem;
                }
            }
        }

        .filterTagWrapper {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin-top: 1rem;
            min-height: 28px;


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
        }

    }

    %menuItem {
        @include flex-center-center;
        flex-direction: column;
        // gap: 1rem;
        // width: 100%;

        .menuImg {
            @include flex-center-center;
            @include WnH(250px);
            background: no-repeat url('@assets/img/Menu/bac_wood.jpg') center/contain;
            // border-radius: 3rem 40% 1rem 1rem;
            cursor: pointer;
            border-radius: 2.5rem;
            position: relative;
            // margin-top: 1rem;
            // overflow: hidden;

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
                // display: block;
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
                    // scale: 1.1;
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
            width: 90%;
            display: grid;
            grid-template-columns: 30% 30% 30%;
            justify-content: center;
            justify-items: center;
            gap: 3px;
            border-radius: 8px;
            overflow: hidden;
            margin-top: 0.5rem;


            span {
                @include WnH(100%, 24px);
                // border: 2px solid $primaryBacColor;
                background-color: $btnBacColor_light;
                color: $primaryBacColor;
                display: inline-block;
                font-size: 14px;
                font-variation-settings: 'wght' 500;
                line-height: 24px;
                text-align: center;

                &:nth-of-type(1) {
                    border-radius: 0.5rem 0 0 0;
                }

                &:nth-of-type(3) {
                    border-radius: 0 0.5rem 0 0;
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
                grid-column: span 1;
                grid-row: span 1;
            }

            &>span:nth-child(6)~ ::after {
                display: none;
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


    // .saladMenu-enter-active,
    // .saladMenu-leave-active {
    //     transition: opacity 0.8s ease;
    // }

    // .saladMenu-enter-from,
    // .saladMenu-leave-to {
    //     opacity: 0;
    // }

    // .saladMenu-enter-to,
    // .saladMenu-leave-from {
    //     opacity: 1;
    // }

    .saladMenu {
        // overflow: hidden;
        // margin-top: 1rem;
        padding: 1rem 0rem;
        display: grid;
        justify-content: space-between;
        grid-template-columns: 20% 20% 20% 20%;
        grid-template-rows: repeat(auto, minmax(0, 450px));
        row-gap: 2rem;
        // transition: opacity 0.5s ease;
        position: relative;
        // opacity: 1;


        .item {
            // @extend %menuItem;
            // transition: top 0.5s ease,
            //     left 0.5s ease;
            // transition: transform 0.5s ease;
        }

        .hideItem {
            // display: none;
            // height: 0;
            // overflow: hidden;
            // opacity: 0;
        }

        // @keyframes onUnloaded {
        //     from {
        //         opacity: 0;
        //     }

        //     to {
        //         opacity: 1;
        //     }
        // }


        .skeleton-enter-active,
        .skeleton-leave-active {
            transition: opacity .75s ease;
        }

        .skeleton-enter-from,
        .skeleton-leave-to {
            opacity: 0;
        }

        .skeleton-enter-to,
        .skeleton-leave-from {
            opacity: 1;
        }

        .skeleton {
            // opacity: 0.5;
            @include WnH(110%, 100%);
            background-color: $primaryBacColor;
            padding: 0 4rem;
            display: grid;
            justify-content: space-between;
            grid-template-columns: repeat(4, 20%);
            // grid-template-rows: 1fr 1fr;
            grid-template-rows: repeat(auto, minmax(0, 450px));
            row-gap: 2rem;
            position: absolute;
            top: 0;
            left: -5%;
            z-index: 5;

            &:deep(.wrapper) {
                flex-direction: column;
            }
        }

        // .loadingScene {
        //     display: none;
        //     @include WnH(100%);
        //     position: absolute;
        //     z-index: 3;
        //     left: 0;
        //     top: 0;
        //     background-color: hsla(47, 60%, 97%, 0.3)
        // }
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
        min-height: 1750px;
    }

    .smoothieMenu {
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
            font-size: 1.75rem;
            font-family: "EB Garamond", 'Noto Sans';
            font-variation-settings: 'wght' 750;
            // margin-bottom: 1rem;
        }

        .itemWrapper {
            width: clamp(100%, 100vw, 1920px);
            // width: 100vw;
            margin: 3rem 0;
            padding: 0 1rem;
            // padding-left: 1rem;
            display: flex;
            flex-direction: row;
            gap: 2rem;
            position: relative;
            // transform: translateX(-336px);

            swiper-container {
                width: 100%;

                &::part(container) {
                    overflow: visible;
                }

                &::part(wrapper) {
                    // transition-timing-function: linear;
                }
            }

            .item {
                @extend %menuItem;
                @include WnH(300px, 100%);
                // flex-shrink: 0;
                // width: auto;
                flex: 0 0 auto;
                padding: 1rem;
                padding-top: 28px;
                border: 1px solid black;
                border-radius: 150px 150px 1rem 1rem;
                box-shadow: 8px -5px 0px $secondBacColor, 10px -7px 7px black;
                overflow: hidden;

                &>p {
                    font-variation-settings: 'wght' 700;
                    color: $secondBacColor;
                }

                .btnWrapper {
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
                    border-radius: 134px 134px 1rem 1rem;
                    box-shadow: 1px 0px 10px black;
                    // padding: 1rem;

                    img {
                        @include WnH(100%);
                        transition: transform 0.15s ease;
                        // border-radius: 7rem 7rem 1rem 1rem;
                        // box-shadow: 2px 2px 3px black;
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


            }
        }

        .skeletonWrapper {
            @include absoluteCenterTLXY($top: 0, $Y: 0);
            // background-color: $primaryBacColor;
            // margin: 1.5rem 0;
            // padding: 0 1rem;
            padding-left: 1rem;
            display: flex;
            flex-direction: row;
            gap: 2rem;
            height: 100%;
            // position: absolute;
            // left: 50%;
            // top: 0;
            z-index: 5;


            // &:deep(.wrapper) {
            //     flex-direction: column;
            // }

            .skeleton {
                width: 300px;
                background-color: $primaryBacColor;
                border: 1px solid black;
                border-radius: 150px 150px 1rem 1rem;
                box-shadow: 8px -5px 0px $secondBacColor, 10px -7px 7px black;
                overflow: hidden;
                flex-direction: column;
            }
        }
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

.analystBot {
    // display: flex;
    // margin-bottom: 4rem;
    position: relative;
    z-index: 0;

    swiper-container {
        width: 100%;
    }

    .analystSwiper {
        display: flex;
        // margin-bottom: 4rem;
        margin: 4rem 1rem 8rem 1rem;

        .imgWrapper {
            @include WnH(300px);
            flex-shrink: 0;
            // border: 1px solid black;
            box-shadow: 1px 1px 5px black;
            border-radius: 100%;
            // overflow: hidden;
            position: relative;
            z-index: 0;

            img {
                // @include WnH(100%);
                // filter: drop-shadow(4px 0px 8px gray);
                border-radius: 100%;
            }

            span {
                @include WnH(140px, 40px);
                background-color: #FFEDA4;
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

            // padding: 3rem 8rem 0 8rem;
            margin: auto 5rem;
            padding: 2rem 3rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            // align-items: center;
            // gap: 1.5rem;
            border-radius: 2rem;
            box-shadow: 1px 1px 5px black;

            h2 {
                font-variation-settings: 'wght' 600;
                font-size: 2rem;
            }

            p {
                font-size: 1.25rem;
                margin-top: 0.75rem;
                // min-height: 90px;
                height: 120px;
                overflow: hidden;
            }

            button {
                @include WnH(9rem, 3rem);
                @extend %analystBtn;
                font-size: 1.5rem;
                align-self: center;
                margin-top: 1rem;
                // visibility: hidden;
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

@media only screen and (min-width: ($large-screen)) {
    .saladMenu {
        min-height: 930px;
    }

    .expandMenu {
        // min-height: 1750px;
    }

    .smoothieMenu .itemWrapper {
        min-height: 475px
    }
}

@media only screen and (min-width: ($medium-screen + 1)) and (max-width: $large-screen) {}

@media only screen and (max-width: $medium-screen) {}
</style>