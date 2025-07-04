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

            <div class="gptRes" :class="{
                unClickable: isAnalyzing
            }">
                <transition name="spinner">
                    <Spinner v-show="isAnalyzing"></Spinner>
                </transition>

                <div class="content" ref="analyzeResult">
                    <component
                        v-for="(node, index) in renderNodes"
                        :is="node.tag" :key="index" :class="{
                            typingMask: isAnalyzing
                        }">
                        {{ node.content }}
                        <span class="cursor" v-show="(node.content?.length !== node.count && node.content?.length) ||
                            (index == 0 && !node.content?.length)
                            ">
                        </span>
                    </component>
                </div>

                <div class="svgWrapper">
                    <transition name="copySvg"
                        mode="out-in">
                        <SvgIcon name="Copy" width="24px"
                            height="24px" color="black"
                            v-if="!isAnalyzing && !isCopied"
                            class="copySvg"
                            @click="copyGPTResponse"
                            key="0">
                        </SvgIcon>
                        <SvgIcon name="Check" width="24px"
                            height="24px" color="black"
                            class="checkSvg"
                            v-else-if="!isAnalyzing && isCopied"
                            @click="" key="1">
                        </SvgIcon>
                    </transition>
                </div>
            </div>

            <div class="guideContent">
                根據分析結果，<br> 推薦以下最佳搭配給您~
            </div>
        </div>

        <div class="recommendList" ref="recommendList">
            <div class="bestComb" ref="bestCombContainer">
                <Product_template :item="saladRank[0]"
                    :cartEl="viewCart" key="0"
                    :flyToCartDisError="-100"
                    v-show="rankComplete">
                </Product_template>

                <Product_template :item="smoothiesRank[0]"
                    :cartEl="viewCart" key="1"
                    :flyToCartDisError="-100"
                    v-show="rankComplete">
                </Product_template>
            </div>

            <div class="divider">
                <h2>
                    你可能也會喜歡
                </h2>
            </div>

            <div class="salad" ref="saladContainer" :style="{
                opacity: showRecommendList ? '1' : '0'
            }">
                <Product_template
                    v-for="(item, index) in saladRank"
                    :key="index" :item="item"
                    :cartEl="viewCart"
                    :flyToCartDisError="-100"
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
                    :cartEl="viewCart"
                    :flyToCartDisError="-100"
                    v-show="rankComplete && index != 0">
                </Product_template>
            </div>

            <div class="salad mobileList"
                ref="mobileSaladContainer" :style="{
                    opacity: showRecommendList ? '1' : '0'
                }">
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
                        v-for="(item, index) in saladRank"
                        :key="index">
                        <Product_template :item="item"
                            v-show="isLoaded" ref="COMList">
                        </Product_template>
                    </swiper-slide>
                </swiper-container>
            </div>

            <div class="smoothies mobileList"
                ref="mobileSmoothiesContainer" :style="{
                    opacity: showRecommendList ? '1' : '0'
                }">
                <swiper-container class="itemWrapper"
                    ref="itemListRef" slidesPerView="auto"
                    spaceBetween="16" scrollBar="true"
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
                        v-for="(item, index) in smoothiesRank"
                        :key="index">
                        <Product_template :item="item"
                            v-show="isLoaded" ref="COMList">
                        </Product_template>
                    </swiper-slide>
                </swiper-container>
            </div>
        </div>

        <div class="viewBtnWrapper" ref="viewCart"
            @click="toggleCartCardOpen" :style="{
                // translate: isCartCardOpen ? `-${scrollbarWidth}px` : 0
            }">
            <button class="cartBtn">
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

            <CartCounter></CartCounter>
        </div>
        <div class="flyToCartContainer"></div>
    </div>
</template>

<script setup lang="ts">
import Product_template from '@/components/Product/Product_template.vue';
import { useQuestionnaireStore } from '@/store/questionnaireStore';
import { useMenuStore } from '@/store/menuStore';
import { ref, onMounted, watch, computed, reactive, nextTick, onBeforeMount, watchEffect, useTemplateRef, onUnmounted } from 'vue';
import type { Ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import type { MenuItem } from '@/api/menu/type';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useListener from '@/hooks/useListener';
import { useCartStore } from '@/store/cartStore';
import CartCounter from '@/components/popover/cartCounter/CartCounter.vue';
import { getGPTAnalyze } from '@/api/questionnaire';
import emitter from '@/utils/eventBus';
import { debounce } from 'lodash-es'
import { useUserStore } from '@/store/userStore';
import type { GPT_RES } from '@/api/questionnaire/type';

// questionnaireStore
const questionnaireStore = useQuestionnaireStore();
const { QNR_result, QNR_isDone } = storeToRefs(questionnaireStore);
const { memberSaveResult, memberGetResult, clearSurveyData, memberClearResult } = questionnaireStore;
// const { info: { userName, gender, birth }, habit, flavor, ingredients, food, calories } = QNR_result.value;

// menuStore
const menuStore = useMenuStore();
const { saladList, smoothieList, isLoaded } = storeToRefs(menuStore);

// user store
const userStore = useUserStore();
const { user, isAuth } = storeToRefs(userStore);

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
        if (!item) return
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

// expose rank list


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
        "+=0"
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
        once: true
    })
}

// 重新測驗
const Router = useRouter();
async function retest() {
    try {
        if (isAuth.value) await memberClearResult();
        await clearSurveyData();
        Router.back();
    } catch (error) {
        console.log(error);
    }
}

// 按鈕切換
const viewCart = ref<HTMLElement>();
const showMainCart = ref(true);
const resultContainer = ref<HTMLElement>();
gsap.registerPlugin(ScrollTrigger);
/**
 * todo 在html使用overflow-y scroll; body使用position fixed
 */
function setViewCartSize() {
    const vw = window.innerWidth;
    let { width, height, right } = vw <= 768 ?
        {
            width: 200,
            height: 36,
            right: '10%'
        } :
        {
            width: 300,
            height: 48,
            right: '5%'
        };

    right = vw <= 430 ? '15%' : '10%'

    if (showMainCart.value) {
        gsap.set(viewCart.value!, {
            width,
            height,
            right: "50%"
        });
    } else {
        gsap.set(viewCart.value!, {
            width: 48,
            height: 48,
            right,
        });
    }
}

function switchViewCartBtn() {
    if (!viewCart.value) return
    showMainCart.value = !showMainCart.value;
    gsap.to(viewCart.value, {
        opacity: 0,
        duration: .3,
        onComplete() {
            if (!viewCart.value) return
            // if (showMainCart.value) {
            //     gsap.set(viewCart.value, {
            //         width: 300,
            //         height: 48,
            //         right: "50%"
            //     });
            // } else {
            //     gsap.set(viewCart.value, {
            //         width: 48,
            //         height: 48,
            //         right: "5%"
            //     });
            // }
            setViewCartSize();
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
        id: 'ViewCart',
        trigger: resultContainer.value,
        start: "bottom-=3.5% bottom",
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
function sleep(duration: number) {
    return new Promise(resolve => setTimeout(resolve, duration))
}
interface Node {
    tag?: string,
    content?: string,
    count?: number,
}
const renderNodes = ref<Node[]>();
const analyzeResult = useTemplateRef('analyzeResult');
const isAnalyzing = ref(true);
const typingSpeed = 30;

async function fetchGPTAnalyze() {
    try {
        const { result } = await getGPTAnalyze(QNR_result.value);
        const data = result.map((item) => {
            return {
                ...item,
                count: item.content?.length
            }
        })
        await typeEffect(renderNodes, data);
        isAnalyzing.value = false;
        return result
    } catch (error) {
        console.log(error);
    }
}

async function typeEffect(nodes: Ref, data: Node[]) {
    nodes.value = data.map((item) => ({ tag: 'div', content: '', count: item.count }));
    await sleep(3000);

    let tempNodes = [...nodes.value];

    for (let i = 0; i < data.length; i++) {
        let buffer = '';
        for (let [index, char] of [...(data[i].content ?? '')].entries()) {
            const batchSize = Math.floor(Math.random() * 5 + 1);
            buffer += char;
            if ((index + 1) % batchSize === 0 || index === data[i].content!.length - 1) {
                tempNodes[i].content += buffer;
                nodes.value = [...tempNodes];
                buffer = '';
            }

            const delay = Math.floor(Math.random() * typingSpeed + 20);
            await sleep(delay);
        }
        // for (let char of data[i].content ?? '') {
        //     nodes.value[i].content += char;
        //     const delay = Math.floor(Math.random() * 30 + 20);
        //     await sleep(delay);
        // }
    }
    await sleep(500);

    nextTick(() => {
        data.forEach((item, index) => {
            nodes.value[index].tag = item.tag;
        })
    })
}

// init GPT response state
const isAnalyzed = ref(false);
const GPT_result = ref<GPT_RES['result']>();
const { initGPT_res, saveGptDataToStorage, loadGptDataFromStorage, getStorageGptData, loadGPTStorage } = questionnaireStore;
async function initGPTState() {
    try {
        await loadGPTStorage();
        let state = getStorageGptData();
        if (state.gpt_user && state.gpt_user == user.value.userID) {
            GPT_result.value = state.gpt_content;
            renderRes()
            return
        }
        const result = await fetchGPTAnalyze();
        if (result) {
            // GPT_result.value = result
            const data = {
                gpt_user: user.value.userID,
                gpt_content: [...result],
                gpt_stamp: Date.now()
            }
            initGPT_res(data);
            await saveGptDataToStorage();
            return
        }
        return
    } catch (error) {
        console.log(error);
    }
}
function renderRes() {
    if (GPT_result.value && GPT_result.value.length) {
        const data = GPT_result.value.map((item) => {
            return {
                ...item,
                count: item.content?.length
            }
        })
        renderNodes.value = [...data];
        isAnalyzing.value = false;
    }
}
watchEffect(() => {

})

//copy GPT response
const isCopied = ref(false);
async function copyGPTResponse() {
    if (isCopied.value) return
    isCopied.value = true;
    if (analyzeResult.value) {
        try {
            await navigator.clipboard.writeText(analyzeResult.value.innerText);

            setTimeout(() => {
                isCopied.value = false
            }, 3000)
            // alert('複製')
        } catch (error) {
            console.log(error);
        }
    }
}
// 購物車state
const cartStore = useCartStore();
const { cartCounter, isCartCardOpen, scrollbarWidth } = storeToRefs(cartStore);
const { toggleCartCardOpen } = cartStore;

watch(isCartCardOpen, (nVal) => {
    // if (nVal && viewCart.value) {
    //     const VW = window.innerWidth
    //     const rect = viewCart.value.getBoundingClientRect();
    //     const coord = VW - rect.right;
    //     console.log(scrollbarWidth.value + coord);

    //     nextTick(() => {
    //         gsap.set(viewCart.value, {
    //             right: `${scrollbarWidth.value + coord}px`
    //         });
    //     })

    // }
})


// 檢查result state
function checkResultState() {
    if (!isLoaded.value) {
        // Router.push('/questionnaire');
        Router.back()
    }
}

const scrollBarStyle = [
    `
        .swiper-scrollbar-drag {
            background: #0d731e;
        }
    `
]

// on resize
let currWidth = 0;
function onResize() {
    if (window.innerWidth == currWidth) return
    nextTick(() => {
        ScrollTrigger.refresh();
        currWidth = window.innerWidth;
    })
}

const debounceResize = debounce(onResize, 1000);

// 生命週期
onBeforeMount(() => {
    checkResultState();
})

onMounted(() => {
    setTimeout(() => {
        if (!viewCart.value) return
        switchViewCartBtn();
    }, 2000);

    window.addEventListener('resize', debounceResize)

    // nextTick(() => {
    createViewCartScrollTrigger();
    createListScrollTrigger();
    // fetchGPTAnalyze();
    // });
    initGPTState();
})

onUnmounted(() => {
    window.removeEventListener('resize', debounceResize)
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
    position: relative;
    // top: 100px;
    // text-align: center;
    // left: 50%;
    // translate: -50% 0;
    max-width: 90rem;
}

.restart {
    @include WnH(4rem, 24px);
    user-select: none;
    cursor: pointer;
    text-align: center;
    opacity: .5;
    transition: opacity .2s ease;
    margin-top: .5rem;
    margin-left: 1rem;

    &:hover {
        opacity: 1;
    }
}

@keyframes flashing_cursor {
    0% {
        visibility: hidden;
    }

    50% {
        visibility: visible;
    }

    100% {
        visibility: hidden;
    }
}


.topText {
    margin-top: 3rem;
    text-align: center;

    h1 {
        font-size: 2rem;
        font-size: 1.5rem;
        font-size: clamp(1.5rem, 1.1428571428571428rem + 1.7857142857142856vw, 2rem);
        font-weight: 600;
        padding-inline: 1rem;
    }

    .gptRes {
        border: 1px solid black;
        border-radius: 1rem;
        background-color: white;
        width: clamp(0px, 80%, 1440px);
        max-height: 80vh;
        overflow: auto;
        margin: 2rem auto;
        padding: 1rem 2rem;
        position: relative;

        .spinner {
            width: 24px;
            height: 24px;
        }

        .svgWrapper {
            position: relative;
            display: flex;
            justify-content: end;
            margin-right: .25rem;

            .copySvg {
                cursor: pointer;
                opacity: .75;
                transition: opacity .2s;

                &:hover {
                    opacity: 1;
                }
            }

            .checkSvg {
                // position: absolute;
                // top: 0;
                // right: .25rem;
            }
        }
    }

    .content {
        display: flex;
        justify-content: center;
        flex-direction: column;
        text-align: start;
        text-wrap: pretty;
        // gap: .5rem;
        min-height: 7rem;

        h2 {
            font-size: 1.25rem;
            font-size: 1rem;
            font-size: clamp(1rem, 0.8214285714285714rem + 0.8928571428571428vw, 1.25rem);
            font-weight: 550;
            margin-top: .5rem;

            &:first-of-type {
                margin-top: 0rem;
            }
        }

        h3 {
            padding-left: 1rem;
            font-variation-settings: 'wght' 550;
        }

        p {
            font-size: 0.75rem;
            font-size: clamp(0.75rem, 0.5714285714285714rem + 0.8928571428571428vw, 1rem);
            padding-left: 1rem;
            font-variation-settings: 'wght' 450;
        }

        strong {
            font-variation-settings: 'wght' 500;
        }

        li {
            padding-left: 1rem;
            font-size: 0.75rem;
            font-size: clamp(0.75rem, 0.5714285714285714rem + 0.8928571428571428vw, 1rem);
        }

        &>*:not(.spinner) {
            transition: opacity .3s;
            width: fit-content;
            position: relative;
        }

        .typingMask {
            opacity: .5;
        }

        .cursor {
            content: '';
            display: inline-block;
            vertical-align: sub;
            // position: absolute;
            // right: 0;
            // bottom: 15%;

            width: 2px;
            height: 1.25rem;
            background-color: black;

            animation: flashing_cursor step-end 1s infinite;
        }
    }

    .unClickable * {
        user-select: none;
    }

    .guideContent {
        margin-top: 1rem;
        font-size: 1.5rem;
        font-size: 1.25rem;
        font-size: clamp(1.25rem, 1.0714285714285714rem + 0.8928571428571428vw, 1.5rem);
        font-variation-settings: 'wght' 500;
        padding-inline: 1rem;
        // text-align: start;

        br {
            display: none;
        }
    }
}

.spinner-enter-active,
.spinner-leave-active {
    transition: opacity .3s;
}

.spinner-enter-from,
.spinner-leave-to {
    opacity: 0;
}

.spinner-enter-to,
.spinner-leave-from {
    opacity: 1;
}

.copySvg-enter-active,
.copySvg-leave-active {
    transition: opacity .3s;
    // position: absolute;
}

.copySvg-enter-from,
.copySvg-leave-to {
    opacity: 0;
}

.copySvg-enter-to,
.copySvg-leave-from {
    opacity: 1;
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

.recommendList {
    margin-bottom: calc(5% + 48px + 3rem);

    &>div {
        margin-top: 3rem;
    }

    .bestComb {
        @include flex-center-center;
        flex-wrap: wrap;
        // min-height: 400px;
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
            font-weight: 500;
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

        @include flex-center-center;
        flex-wrap: wrap;


        // justify-content: start;
        margin-left: auto;
        margin-right: auto;
        // width: fit-content;
        // width: 60%;
        gap: 1rem;
        padding: 0 2rem;
        // overflow-x: scroll;

        @include recList_rwd1000() {
            // display: none
        }

        .item {
            // flex: 0 0 calc(33% - 8rem);
        }


    }

    .foo {


        display: none;
        width: 60%;
        // width: 1440px;

        @include recList_rwd768() {
            // width: 80%;
            // display: block
        }

        @include recList_rwd1000() {
            // width: 80%;
            // display: block;
        }

        swiper-slide {
            padding: 1rem 0;
        }

        .item {
            margin: 0 auto;
        }
    }
}

.viewBtnWrapper {
    // width: 100%;
    font-size: 1.5rem;
    font-size: 1.25rem;
    font-size: clamp(1.25rem, 1.1363636363636362rem + 0.5681818181818182vw, 1.5rem);
    display: flex;
    align-items: center;
    position: fixed;
    right: 50%;
    bottom: 5%;
    transform: translate(50%, -50%);
    z-index: 10;

    &>button {
        background-color: $btnBacColor;
        color: $primaryBacColor;
        overflow: hidden;
    }

    // .counter {
    //     @include flex-center-center;
    //     @include absoluteCenterTLXY($top: 0%, $left: 100%);
    //     @include WnH(24px);
    //     padding: 2px;
    //     position: absolute;
    //     transform: translate(-75%, -25%);
    //     background-color: red;
    //     border-radius: 50%;
    //     transition: opacity .3s ease;

    //     span {
    //         aspect-ratio: 1/1;
    //         color: $primaryBacColor;
    //         font-variation-settings: 'wght' 500;
    //         font-size: 12px;
    //         line-height: 24px;
    //     }
    // }
}

.cartBtn {
    @include WnH(100%);
    border-radius: 24px;
    margin: 0 auto;
    position: relative;
    transform-origin: right;
    box-shadow: 2px 2px 4px black;

    span {
        display: inline-block;
        font-variation-settings: 'wght' 450;
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
    transition: opacity .3s .15s;
}

.cartBtn-enter-from,
.cartBtn-leave-to {
    opacity: 0;
}

.cartBtn-enter-to,
.cartBtn-leave-from {
    opacity: 1;
}

.recommendList .mobileList {
    display: none;
    width: 100%;
    transition: opacity .3s;

    swiper-container {
        position: relative;

        swiper-slide {
            width: min-content;
        }

        &::part(container) {
            // overflow-y: auto;
            padding: 1rem 0;
        }

        &::part(scrollbar) {
            // opacity: 0;
            // bottom: -2.5%;
        }
    }
}

@include XLarge {}

@include large {}

@include medium {}

@include medium {
    .topText {
        margin-top: 2rem;

        .gptRes {
            margin-block: 1.5rem;
            width: clamp(0px, 90%, 1440px);
        }
    }

    .recommendList {
        .bestComb {
            margin-top: 2rem;
        }

        .salad,
        .smoothies {
            display: none;
        }

        .mobileList {
            display: block;
            margin-top: 1.5rem;
        }
    }

    .cartBtn {
        span {}

        .main {
            width: 200px;
            height: 36px;
            line-height: 36px;
        }
    }
}

@include small {
    .topText {
        margin-top: 1rem;
    }

    .recommendList .bestComb {
        margin-top: 1.5rem;
    }

    .viewBtnWrapper {
        bottom: 3%;
    }
}

@include small($width: 430px) {
    .topText {
        .gptRes {
            padding: .75rem 1.5rem;
        }

        .guideContent {
            br {
                display: inline;
            }
        }
    }

    .recommendList .bestComb {
        gap: 1.5rem;
    }
}

@include small($width: 320px) {
    .recommendList .bestComb {
        gap: .75rem;
    }

    .cartBtn .main {
        // width: 150px;
    }
}
</style>