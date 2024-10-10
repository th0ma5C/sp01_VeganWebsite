<template>
    <div class="resultContainer" ref="resultContainer">
        <div class="restart">
            <button @click="retest">重新測驗</button>
        </div>

        <div class="topText">
            <h1>
                {{
                    QNR_result.info.userName
                }}，您的專屬分析完成了！
            </h1>

            <div class="gptRes">
                <div class="content">
                    <h2>營養建議</h2>
                    <p>鷹村先生，根據您選擇的完全素食飲食習慣、清爽的口味偏好，以及Omega-3、抗氧化物、維生素的需求，我們為您提供以下建議：
                    </p>
                    <h2>營養分析</h2>
                    <ul>
                        <li><strong>Omega-3：</strong>由於完全素食者無法從魚類中攝取Omega-3，建議您多攝取亞麻籽、奇亞籽和南瓜籽這類植物來源的Omega-3脂肪酸，對心血管健康非常有益。
                        </li>
                        <li><strong>抗氧化物：</strong>抗氧化物可以幫助對抗自由基，減少身體氧化壓力。莓果類如藍莓、草莓以及深綠色蔬菜如菠菜，都是豐富的抗氧化物來源。
                        </li>
                        <li><strong>維生素：</strong>對於維生素，尤其是維生素C和維生素E，可多攝取富含這些維生素的食材如橙子、奇異果、酪梨等，來促進免疫力及皮膚健康。
                        </li>
                    </ul>
                    <h2>食材推薦</h2>
                    <ul>
                        <li><strong>Omega-3
                                來源：</strong>亞麻籽、奇亞籽、南瓜籽</li>
                        <li><strong>抗氧化物來源：</strong>藍莓、草莓、菠菜
                        </li>
                        <li><strong>維生素來源：</strong>橙子、奇異果、酪梨
                        </li>
                    </ul>
                    <h2>每日卡路里建議</h2>
                    <p>根據您的每日卡路里需求（1800卡），建議選擇低卡且富含營養的食材，並適當控制油脂和糖分的攝取。多食用蔬果及全穀類食材，以達到均衡飲食的效果。
                    </p>
                </div>
            </div>

            <div class="guideContent">
                根據分析結果，推薦以下最佳搭配給您~
            </div>
        </div>

        <div class="recommendList" ref="recommendList"
            v-if="isLoaded">
            <div class="bestComb" ref="bestCombContainer">
                <transition-group name="bestComb">
                    <Product_template :item="saladRank[0]"
                        key="0" v-show="rankComplete">
                    </Product_template>

                    <Product_template
                        :item="smoothiesRank[0]" key="1"
                        v-show="rankComplete">
                    </Product_template>
                </transition-group>
            </div>

            <div class="divider">
                <h2>
                    你可能也會喜歡
                </h2>
            </div>


            <!-- <div class="otherRecommend"
                ref="otherRecommend">
                <Product_template
                    v-for="(item, index) in saladRank"
                    :key="index" :item="item"
                    v-show="rankComplete && index != 0">
                </Product_template>
                <Product_template
                    v-for="(item, index) in smoothiesRank"
                    :key="index" :item="item"
                    v-show="rankComplete && index != 0">
                </Product_template>
            </div> -->
            <div class="salad" ref="saladContainer" :style="{
                opacity: showRecommendList ? '1' : '0'
            }">
                <Product_template
                    v-for="(item, index) in saladRank"
                    :key="index" :item="item"
                    v-show="rankComplete && index != 0">
                </Product_template>
            </div>

            <div class="smoothies" ref="smoothiesContainer"
                :style="{
                    opacity: showRecommendList ? '1' : '0'
                }">
                <Product_template
                    v-for="(item, index) in smoothiesRank"
                    :key="index" :item="item"
                    v-show="rankComplete && index != 0">
                </Product_template>
            </div>

            <!-- <swiper-container class="foo" loop="true"
                :breakpoints="{
                    850: {
                        slidesPerView: 1,
                    },
                    900: {
                        slidesPerView: 2,
                    },
                    1300: {
                        slidesPerView: 3,
                    }
                }">
                <swiper-slide
                    v-for="(item, index) in saladRank.slice(1)"
                    :key="index"
                    v-show="rankComplete && index != 0">
                    <Product_template :item="item">
                    </Product_template>
                </swiper-slide>
            </swiper-container>
            <swiper-container class="foo" loop="true"
                :breakpoints="{
                    850: {
                        slidesPerView: 1,
                    },
                    900: {
                        slidesPerView: 2,
                    },
                    1300: {
                        slidesPerView: 3,
                    }
                }">
                <swiper-slide
                    v-for="(item, index) in smoothiesRank"
                    :key="index"
                    v-show="rankComplete && index != 0">
                    <Product_template :item="item">
                    </Product_template>
                </swiper-slide>
            </swiper-container> -->


        </div>

        <div class="viewBtnWrapper" ref="viewBtnWrapper">
            <button class="cartBtn" ref="viewCart">
                <transition-group name="cartBtn">
                    <span class="main" key="0"
                        v-show="showMainCart">
                        查看購物車
                    </span>
                    <span class="side" key="1"
                        v-show="!showMainCart">
                        <SvgIcon name="Cart" width="36px"
                            height="36px">
                        </SvgIcon>
                    </span>
                </transition-group>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * todo: 結果頁面樣式 加入購物車動畫 完成表單功能 登入 會員 購物車 關於
 * doing 數據太多或太少的情況 and 樣式
 * ----------------------------------
 * ?結果本地儲存
 * ----------------------------------
 * //?重新整理頁面、數據會消失 
 */

import Product_template from '@/components/Product/Product_template.vue';
import { useQuestionnaireStore } from '@/store/questionnaireStore';
import { useMenuStore } from '@/store/menuStore';
import { ref, onMounted, watch, computed, reactive, nextTick, onBeforeMount, watchEffect } from 'vue';
import type { Ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import type { MenuItem } from '@/api/menu/type';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useListener from '@/hooks/useListener';

// questionnaireStore
const questionnaireStore = useQuestionnaireStore();
const { QNR_result, QNR_isDone, localStorageKey } = storeToRefs(questionnaireStore);
// const { info: { userName, gender, birth }, habit, flavor, ingredients, food, calories } = QNR_result.value;


// menuStore
const menuStore = useMenuStore();
const { saladList, smoothieList, isLoaded } = storeToRefs(menuStore);
// watch(saladList, (nVal) => {
//     console.log(nVal);
// }, { immediate: true, deep: true })
// 顯示推薦
function filterByTag(
    catalog: 'salad' | 'smoothies',
    tagIndex: number | null,
    condition: (tag: string | string[]) => boolean) {
    const list = catalog == 'salad' ? saladList.value : smoothieList.value;
    if (tagIndex) {
        return list.filter(item => condition(item.tags[tagIndex]));
    }
    return list.filter(item => condition(item.tags));
}

function calc_similarity(target: string[], origin: string[]): number {
    let count = 0;
    origin.forEach((item) => {
        if (target.includes(item)) {
            count++
        }
    })
    return count
}

function rank_similarity(target: string[],
    originObj: Ref<MenuItem[]>
): MenuItem[] {
    return originObj.value.map((item) => {
        return {
            array: item,
            rank: calc_similarity(target, item.ingredients)
        }
    }).sort((a, b) => {
        return b.rank - a.rank
    }).map((item) => item.array)
}

const genderRank = computed(() => {
    const gender = new RegExp(`^${QNR_result.value.info.gender}`, 'g');

    const saladRank = filterByTag('salad', 0, tag => gender.test(tag as string));
    const smoothiesRank = filterByTag('smoothies', 0, tag => gender.test(tag as string));

    return [saladRank, smoothiesRank]
});

const ageRank = computed(() => {
    if (!isLoaded.value) return [];

    const age = new Date().getFullYear() - QNR_result.value.info.birth[0]!;

    const saladRank = filterByTag('salad', 1, tag => {
        const scope = (tag as string).split('-');
        return age >= Number(scope[0]) && age <= Number(scope[1]);
    });
    const smoothiesRank = filterByTag('smoothies', 1, tag => {
        const scope = (tag as string).split('-');
        return age >= Number(scope[0]) && age <= Number(scope[1]);
    });

    return [saladRank, smoothiesRank]
});

const habitRank = computed(() => {
    if (!QNR_result.value.habit) return []

    const habit = QNR_result.value.habit;

    const saladRank = filterByTag('salad', null, tag => tag.includes(habit));
    const smoothiesRank = filterByTag('smoothies', null, tag => tag.includes(habit));

    return [saladRank, smoothiesRank]
});

const flavorRank = computed(() => {
    if (!QNR_result.value.flavor) return []

    const flavor = QNR_result.value.flavor;

    const saladRank = filterByTag('salad', null, tag => tag.includes(flavor));
    const smoothiesRank = filterByTag('smoothies', null, tag => tag.includes(flavor));

    return [saladRank, smoothiesRank]
});


const ingredientsRank = computed(() => {
    if (!QNR_result.value.ingredients) return []

    const ingredients = QNR_result.value.ingredients;

    const saladRank = rank_similarity(ingredients, saladList).slice(0, 5);
    const smoothiesRank = rank_similarity(ingredients, smoothieList).slice(0, 5);

    return [saladRank, smoothiesRank]
});

const foodRank = computed(() => {
    if (!QNR_result.value.food) return []

    const food = QNR_result.value.food;

    const saladRank = saladList.value.filter((item) => {
        if (item.main) return food.includes(item.main)
    })
    const smoothiesRank = smoothieList.value.filter((item) => {
        if (item.main) return food.includes(item.main)
    })

    return [saladRank, smoothiesRank]
});

const caloriesRank = computed(() => {
    if (!QNR_result.value.calories || !isLoaded.value) return []

    const numReg = /\D/g;
    const calories = QNR_result.value.calories?.replace(numReg, '');

    const saladRank = filterByTag('salad', 4, tag => {
        const funnel = (tag as string).replace(numReg, '');
        return calories >= funnel
    })
    const smoothiesRank = filterByTag('smoothies', 4, tag => {
        const funnel = (tag as string).replace(numReg, '');
        return calories >= funnel
    })

    return [saladRank, smoothiesRank]
});


function findRecommend(arrays: MenuItem[][]): MenuItem[] {
    const countMap = new Map<MenuItem, number>();
    let threshold = 1;

    arrays.flat().forEach(item => {
        countMap.set(item, (countMap.get(item) || 0) + 1);
    });

    function getResult() {
        const list = Array.from(countMap)
            .filter(([item, count]) => count > threshold)
            .sort((a, b) => b[1] - a[1]);

        // if (list.length > 6) {
        //     threshold++;
        //     return getResult();
        // }

        return list.slice(0, 6);
    }


    let result = getResult();
    console.log(result);

    return result.map(([item]) => item);
}

const saladRank = computed(() => {
    if (!isLoaded.value) return [...saladList.value]

    const allSaladRanks = [
        genderRank.value[0],
        ageRank.value[0],
        habitRank.value[0],
        flavorRank.value[0],
        ingredientsRank.value[0],
        foodRank.value[0],
        caloriesRank.value[0],
    ];
    return findRecommend(allSaladRanks);
});

const smoothiesRank = computed(() => {
    if (!isLoaded.value) return [...smoothieList.value]

    const allSmoothiesRanks = [
        genderRank.value[1],
        ageRank.value[1],
        habitRank.value[1],
        flavorRank.value[1],
        ingredientsRank.value[1],
        foodRank.value[1],
        caloriesRank.value[1],
    ];

    return findRecommend(allSmoothiesRanks);
});

const rankComplete = ref(false);
watch([saladRank, smoothiesRank], (nVal) => {
    if (nVal.every(item => item.length > 1)) {
        rankComplete.value = true;
        nextTick(() => {
            ScrollTrigger.refresh();
        })
    }
}, { immediate: true })

// 顯示動畫
const bestCombContainer = ref<null | HTMLDivElement>(null);
const saladContainer = ref<null | HTMLDivElement>(null);
const smoothiesContainer = ref<null | HTMLDivElement>(null);
const showBestCombContainer = ref(false);
const showSaladContainer = ref(false);
const showSmoothiesContainer = ref(false);
const showRecommendList = ref(false);

//#region 
// function observer(target: HTMLElement, options?: IntersectionObserverInit) {
//     function observerCb(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
//         // console.log(entries);
//         entries.forEach((item) => {
//             // console.dir(window.getComputedStyle(item.target).transitionDelay);
//             if (item.boundingClientRect.height == 0 || !item.isIntersecting) return
//             if (item.target.classList.contains('salad')) {
//                 showSaladContainer.value = true;
//             } else if (item.target.classList.contains('smoothies')) {
//                 showSmoothiesContainer.value = true;
//             }
//         })
//     }

//     const observer = new IntersectionObserver(observerCb, options);

//     observer.observe(target)
// }

// watch([saladContainer, smoothiesContainer], ([nVal1, nVal2]) => {
//     if (!nVal1 || !nVal2) return
//     const options = (position?: number) => ({
//         root: null,
//         rootMargin: "0px 0px 0px 0px",
//         threshold: 0.3,
//     })
//     observer(nVal1, options());

//     observer(nVal2, options());
// })
//#endregion
/**
 * 用GSAP stagger製作
 */

function showListAnimate() {
    if (!saladContainer.value || !smoothiesContainer.value) return
    const tl = gsap.timeline();

    tl.fromTo(saladContainer.value.children,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }
    );

    tl.fromTo(smoothiesContainer.value.children,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
        "+=0"  // 表示直接接續前面的動畫
    );
    // gsap.fromTo(saladContainer.value.children,
    //     { opacity: 0, y: 50 },
    //     {
    //         opacity: 1, y: 0, duration: 0.5, stagger: 0.1,
    //         onComplete: () => {
    //             gsap.fromTo(smoothiesContainer.value!.children,
    //                 { opacity: 0, y: 50 },
    //                 { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }
    //             )
    //         }
    //     }
    // )
    // gsap.set(smoothiesContainer.value!.children,
    //     { opacity: 0, y: 50 }
    // )
}

function createListScrollTrigger() {
    ScrollTrigger.create({
        trigger: saladContainer.value,
        start: 'top bottom-=150px',
        onEnter: () => {
            showRecommendList.value = true;
            showListAnimate();
        },
        // markers: true,
        once: true
    })
}


// 重新測驗
const Router = useRouter();
function retest() {
    QNR_isDone.value = false;
    Router.back();
}

// 按鈕切換
const viewCart = ref();
const showMainCart = ref(true);
const resultContainer = ref<HTMLElement>();
gsap.registerPlugin(ScrollTrigger);

function switchViewCartBtn() {
    showMainCart.value = !showMainCart.value;
    gsap.to(viewCart.value, {
        opacity: 0,
        duration: .3,
        onComplete() {
            if (!viewCart.value) return
            if (showMainCart.value) {
                gsap.set(viewCart.value, {
                    width: 300,
                    height: 48,
                    right: "0"
                });
            } else {
                gsap.set(viewCart.value, {
                    width: 48,
                    height: 48,
                    right: "-40%"
                });
            }

            gsap.to(viewCart.value, {
                opacity: 1,
                duration: .3,
                ease: 'power4.out'
            });
        }
    });
}

function createViewCartScrollTrigger() {
    ScrollTrigger.create({
        trigger: resultContainer.value,
        start: "bottom-=100px bottom",
        onToggle: () => {
            switchViewCartBtn();
        },
        scrub: false,
    })
}

// const unwatch = watchEffect(() => {
//     console.log(viewCart.value);
//     if (viewCart.value) {
//         switchViewCartBtn();
//         unwatch();
//     }
// })


// 打字效果


// 檢查result state
function checkResultState() {
    if (!isLoaded.value) {
        // Router.push('/questionnaire');
        Router.back()
    }
}


// 生命週期
onBeforeMount(() => {
    checkResultState();
})

onMounted(() => {
    setTimeout(() => {
        if (!viewCart.value) return
        switchViewCartBtn();
    }, 1000);

    // nextTick(() => {
    createViewCartScrollTrigger();
    createListScrollTrigger();
    // });
})


</script>

<style scoped lang="scss">
* {
    // outline: 1px solid black;
}

.resultContainer {
    // @include WnH(100%, calc(100% - 100px));
    width: 100%;
    background-color: $primaryBacColor;
    position: absolute;
    top: 100px;
    left: 0;
    // text-align: center;
}

.restart {
    @include WnH(4rem, 24px);
    user-select: none;
    cursor: pointer;
    text-align: center;
    opacity: .5;
    transition: opacity .2s ease;
    margin-left: 1rem;

    &:hover {
        opacity: 1;
    }
}


.topText {
    margin-top: 3rem;
    text-align: center;

    h1 {
        font-size: 2rem;
        font-weight: 600;
    }

    .gptRes {
        border: 1px solid black;
        border-radius: 1rem;
        background-color: white;
        width: 60%;
        margin: 2rem auto;
        padding: 1rem;
    }

    .content {
        display: flex;
        justify-content: center;
        flex-direction: column;
        text-align: start;
        gap: .5rem;

        h2 {
            font-size: 1.25rem;
            font-weight: 450;
        }

        p {
            padding-left: 2.5rem;
            font-variation-settings: 'wght' 450;
        }

        li {
            padding-left: 2.5rem;
            font-variation-settings: 'wght' 450;
        }
    }

    .guideContent {
        margin-top: 1rem;
        font-size: 1.5rem;
        font-variation-settings: 'wght' 500;
    }
}

@keyframes slideUp {
    from {
        opacity: .5;
        transform: translateY(10%);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.bestComb-enter-active,
.bestComb-leave-active {
    transition: transform .3s ease, opacity .3s ease;
}

.bestComb-enter-from,
.bestComb-leave-to {
    transform: translateY(5%);
    opacity: 0;
}

.bestComb-enter-to,
.bestComb-leave-from {
    transform: translateY(0%);
    opacity: 1;
}

.recommendList {
    margin-bottom: calc(5% + 48px + 3rem);

    &>div {
        margin-top: 3rem;
    }

    .bestComb {
        @include flex-center-center;
        flex-wrap: wrap;
        min-height: 400px;
        gap: 2rem;
    }

    .divider {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;

        h2 {
            font-size: 1.25rem;
            // transform: translateX(-5%);
            background-color: $primaryBacColor;
            position: relative;
        }

        & ::after,
        & ::before {
            content: '';
            width: 40vw;
            height: 2px;
            background-color: green;
            position: absolute;
            left: calc(-40vw - 2rem);
            top: 50%;
            margin: 0 1rem;
        }

        & ::after {
            left: 100%;
        }
    }

    @mixin recList_rwd768 {
        @media (max-width: 768px) {
            @content;
        }
    }

    @mixin recList_rwd1000 {
        @media (min-width:768px) and (max-width: 1440px) {
            @content;
        }
    }

    .salad,
    .smoothies {
        // display: grid;
        // grid-template-columns: repeat(3, minmax(100px, max-content));
        // grid-auto-flow: dense;
        // justify-content: center;
        // justify-items: center;
        // gap: 2rem 4rem;
        // padding: 0 6rem;

        // @include recList_rwd768() {
        //     grid-template-columns: repeat(2, minmax(100px, max-content));
        // }

        @include recList_rwd1000() {
            display: none
        }

        @include flex-center-center;
        // justify-content: start;
        margin-left: auto;
        margin-right: auto;
        width: 60%;
        gap: 2rem;
        padding: 0 3rem;
        // overflow-x: scroll;


        .item {
            // flex: 0 0 calc(33% - 8rem);
        }
    }

    .foo {
        @include recList_rwd768() {
            // width: 80%;
            display: block
        }

        @include recList_rwd1000() {
            // width: 80%;
            display: block;
        }

        display: none;
        width: 60%;
        // width: 1440px;

        swiper-slide {
            padding: 1rem 0;
        }

        .item {
            margin: 0 auto;
        }
    }
}

.viewBtnWrapper {
    width: 100%;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 7%;
    z-index: 10;

    &>button {
        background-color: $btnBacColor;
        color: $primaryBacColor;
        overflow: hidden;
    }
}

.cartBtn {
    border-radius: 24px;
    margin: 0 auto;
    position: relative;
    transform-origin: right;
    box-shadow: 2px 2px 4px black;

    span {
        display: inline-block;
    }

    .main {
        @include WnH(300px, 48px);
        line-height: 48px;
        text-wrap: nowrap;
    }

    .side {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
}

.cartBtn-enter-active,
.cartBtn-leave-active {
    transition: opacity .3s ease;
}

.cartBtn-enter-from,
.cartBtn-leave-to {
    opacity: 0;
}

.cartBtn-enter-to,
.cartBtn-leave-from {
    opacity: 1;
}

// .listSlideUp-enter-active,
// .listSlideUp-leave-active {
//     transition: transform .3s ease, opacity .3s ease;
// }

// .listSlideUp-enter-from,
// .listSlideUp-leave-to {
//     opacity: 0;
//     transform: translateY(10%);
// }

// .listSlideUp-enter-to,
// .listSlideUp-leave-from {
//     opacity: 1;
//     transform: translateY(0);
// }</style>