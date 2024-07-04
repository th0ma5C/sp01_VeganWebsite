<template>
    <div class="container">
        <div class="top">
            <div class="sub">
                <h2>訂閱第一手消息！</h2>
                <p>成為我們的VIP！訂閱我們的電子報，即刻獲得獨家優惠、新菜品消息和特別活動邀請。
                    每週精選的美味直送您的信箱！
                </p>
                <form action="" class="submitForm">
                    <input type='email'
                        placeholder="E-mail">
                    <button type="submit">訂閱</button>
                </form>
            </div>
            <div class="app">
                <div class="content">
                    <h2>立即下載APP！</h2>
                    <p>
                        即刻下載，立即掌握美味的滋味～獨享訂單優惠、專屬菜單推薦，輕鬆預訂、方便外帶，尊享美食新體驗！
                    </p>
                    <div class="download">
                        <button>下載APP</button>
                    </div>
                </div>
                <div class="phone">
                    <img src="@assets/img/InfoFooter/app.png"
                        alt="" class="info-phone">
                    <!-- <div class="screen"
                        style="font-size: 5rem;color: #00430b;">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div> -->
                </div>
            </div>
        </div>
        <div class="mid">
            <nav>
                <ul v-for="({ title, content }, listIndex) in footerList"
                    :key="title">
                    <li>
                        <h2>
                            {{ title }}
                        </h2>
                    </li>
                    <li v-for="(item, contentIndex) in content"
                        :key="item"
                        @mouseenter="handleMouseEnter(listIndex, contentIndex)"
                        @mouseleave="handleMouseLeave(listIndex, contentIndex)">
                        {{ item }}
                        <SvgIcon name="ConceptArrow"
                            width="18px" height="18px"
                            class="in"
                            :class="[{ 'out': iconStates[listIndex][contentIndex].setAnimate }]">
                        </SvgIcon>
                    </li>
                </ul>
                <div class="socialLink">
                    <a href=""
                        v-for="(item, index) in iconList"
                        :key="index">
                        <SvgIcon :name="item" width="20px"
                            height="20px" class="linkIcon">
                        </SvgIcon>
                    </a>
                </div>
            </nav>
            <div class="copyRight">
                <SvgIcon name="copyRight" width="17px"
                    height="17px" color="#FCFAF2"></SvgIcon>
                Relation-Ship&nbsp;果漾
            </div>
        </div>
        <div class="bot">
            <img src="@assets/icons/FooterFont.svg" alt="">
            <!-- <span>
                Relation-ship
            </span> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, watchEffect, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';
import useArrowFly from '@/hooks/useArrowFly';
import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';


let footerList = reactive([
    {
        title: '快速連結',
        content: ['開始專屬分析', '菜單', '關於果漾', '我的帳戶']
    },
    {
        title: '顧客服務',
        content: ['常見問題', '付款與寄送流程', '果漾會員制度', '聯絡我們']
    },
    {
        title: '聲明條款',
        content: ['隱私權服務', '服務條款', '退貨政策', '反詐騙公告']
    },
    {
        title: '果漾蔬食',
        content: ['信箱', '官方LINE', '客服專線', '服務時間']
    },
]);

let iconList = reactive(['Fb', 'Ig', 'LINE', 'Twitter']);

// li icon hover
const iconStates = reactive(footerList.map(section =>
    section.content.map(() => ({
        isHover: false,
        isAnimating: false,
        timer: null as number | null | NodeJS.Timeout,
        setAnimate: false
    }))
));

const ANIMATION_DURATION = 500;

const handleMouseEnter = (listIndex: number, contentIndex: number) => {
    iconStates[listIndex][contentIndex].isHover = true;
    if (!iconStates[listIndex][contentIndex].isAnimating) {
        triggerAnimation(listIndex, contentIndex, true);
    }
};

const handleMouseLeave = (listIndex: number, contentIndex: number) => {
    iconStates[listIndex][contentIndex].isHover = false;
    if (!iconStates[listIndex][contentIndex].isAnimating) {
        triggerAnimation(listIndex, contentIndex, false);
    }
};
const triggerAnimation = (listIndex: number, contentIndex: number, isEntering: boolean) => {
    const state = iconStates[listIndex][contentIndex];
    state.isAnimating = true;
    state.setAnimate = isEntering;

    if (state.timer) clearTimeout(state.timer);

    state.timer = setTimeout(() => {
        completeAnimation(listIndex, contentIndex, isEntering);
    }, ANIMATION_DURATION);
};

const completeAnimation = (listIndex: number, contentIndex: number, isEntering: boolean) => {
    const state = iconStates[listIndex][contentIndex];
    state.isAnimating = false;
    if (state.isHover !== isEntering) {
        triggerAnimation(listIndex, contentIndex, !isEntering);
    }
};
// const handleMouseEnter = (sectionIndex: number, itemIndex: number) => {
//     if (animationInProgress.value[sectionIndex][itemIndex]) {
//         timers.value[sectionIndex][itemIndex] = setTimeout(()=>{
//             iconStates.value[sectionIndex][itemIndex] = true;
//         })
//         return
//     };
//     // 清除之前的定时器
//     if (timers.value[sectionIndex][itemIndex] !== null) {
//         clearTimeout(timers.value[sectionIndex][itemIndex]!);
//         timers.value[sectionIndex][itemIndex] = null;
//     }
//     iconStates.value[sectionIndex][itemIndex] = true;
// };

// const handleMouseLeave = (sectionIndex: number, itemIndex: number) => {
//     if (timers.value[sectionIndex][itemIndex] != null) {
//         // 设置新的定时器
//         timers.value[sectionIndex][itemIndex] = setTimeout(() => {
//             iconStates.value[sectionIndex][itemIndex] = false;

//             animationInProgress.value[sectionIndex][itemIndex] = true;
//             setTimeout(() => {
//                 animationInProgress.value[sectionIndex][itemIndex] = false;
//             }, ANIMATION_DURATION);

//             timers.value[sectionIndex][itemIndex] = null;
//         }, ANIMATION_DURATION);
//         return
//     }
//     iconStates.value[sectionIndex][itemIndex] = false;
// };

// // 清理所有定时器
// onUnmounted(() => {
//     timers.value.forEach(sectionTimers => {
//         sectionTimers.forEach(timer => {
//             if (timer !== null) {
//                 clearTimeout(timer);
//             }
//         });
//     });
// });

</script>

<style scoped lang="scss">
// DOING:切版
/**
** 右下角加商標 ✅
** line height ✅
** email width placeholder ✅
** nav li margin ✅
** nav li icon hover ❗
** app marquee ❌
** hover transition 
** top bot 分隔線
** 訂閱改箭頭
** btn 顏色 ✅
** 轉場時間
 */

* {
    // border: 1px solid black;
}



%default {
    width: calc(80% - 6rem);
    margin: 0 auto;
}

%topLayout {
    position: relative;
    flex: 1 1 0;
    padding: 2rem 3rem 3rem 3rem;

    * {
        // border: 1px solid black;
    }

    h2 {
        // text-align: center;
        padding-left: 1rem;
        font-size: 1.5rem;
        font-weight: 600;
    }

    p {
        font-size: 1rem;
        margin-top: 1rem;
        padding: 1rem;
        text-align: justify;
        line-height: 2rem;
    }

    .submitForm,
    .download {
        position: absolute;
        bottom: 48px;
        right: 50%;
        transform: translateX(50%);

        button {
            // @include WnH(9rem, 3rem);
            // border-radius: 2rem;
        }

    }
}

.container {
    max-width: $primaryWidth;
    color: $primaryBacColor;

    display: flex;
    flex-direction: column;
    min-height: 920px;
    margin: 0 auto;

    &>div {
        display: flex;
        padding-top: 2rem;
        flex: 1 1 0;
    }

    .top {
        @extend %default;

        flex-direction: row;
        // gap: 1rem;
        position: relative;

        // &::after {
        //     @include WnH(80%, 1px);
        //     content: '';
        //     position: absolute;
        //     bottom: 0;
        //     background-color: $primaryBacColor;
        //     margin: auto 6rem;
        // }

        .sub {
            @extend %topLayout;

            form {
                color: black;
                width: calc(100% - 6rem);
                margin-top: 4rem;
                position: relative;
                padding: 0 1rem;
                text-align: end;

                input {
                    @include WnH(60%, 3rem);
                    border-radius: 2rem;
                    background-color: #B3D4B9;
                    font-size: 14px;
                    font-variation-settings: 'wght' 600;
                    padding: 0 1.5rem;
                    transform: translateX(-3px);

                    &::placeholder {
                        opacity: 0.75;
                        transition: opacity 0.2s ease;
                    }

                    &:focus {
                        outline: none;

                        &::placeholder {
                            opacity: 0;
                        }
                    }
                }

                button {
                    @include WnH(5rem, 3rem);
                    border-radius: 0 2rem 2rem 0;
                    background-color: #0d731e;
                    // border: 1px solid #00510E;
                    color: rgb(252, 250, 242);
                    position: absolute;
                    right: 1rem;
                    top: 0;
                    transition: background-color 0.3s ease;

                    &:hover {
                        background-color: #A59052;
                    }
                }
            }

        }

        .app {
            @extend %topLayout;

            display: flex;

            .content {
                flex: 1;

                .download {

                    margin-top: 2rem;
                    right: calc(153px + 1rem);
                    transform: translateX(0);



                    button {
                        @include WnH(7rem, 3rem);
                        background-color: #0d731e;
                        border-radius: 2rem;
                        color: rgb(252, 250, 242);
                        transition: background-color 0.3s ease;

                        &:hover {
                            background-color: #A59052;
                        }
                    }
                }
            }

            &::after {
                width: calc(154px - 48px);
                height: calc(294px - 32px);
                background-color: transparent;
                content: '';
                display: inline-block;
            }

            .phone {
                position: absolute;
                top: 0;
                right: 0;

                img {
                    height: 294px;
                }

                .screen {
                    position: absolute;
                    top: 0;
                    right: 0;
                }
            }
        }
    }

    .mid {
        @extend %default;

        flex-direction: column;
        // justify-content: space-around;
        // padding: 2rem 4rem 0 4rem;


        nav {
            padding: 0 0rem 0 4rem;
            font-size: 14px;
            display: flex;
            justify-content: space-between;

            ul {
                display: flex;
                flex-direction: column;

                li {
                    align-self: self-start;
                    overflow: hidden;

                    h2 {
                        font-size: 1.05rem;
                    }

                    &:has(h2) {
                        cursor: default;
                        margin-bottom: 0.75rem;
                    }

                    &:not(:has(h2)) {
                        cursor: pointer;
                        opacity: 0.5;
                        margin-bottom: 0.25rem;
                        display: flex;
                        gap: 0.5rem;
                    }

                    @keyframes flyOut {
                        to {
                            opacity: 0;
                            transform: translate(100%, -100%);
                        }
                    }

                    @keyframes flyIn {
                        from {
                            opacity: 0;
                            transform: translate(-100%, 100%);
                        }

                        to {
                            opacity: 1;
                            transform: translate(0, 0);
                        }
                    }

                    // &:hover>div {
                    //     animation: flyOut 0.5s ease-in forwards;
                    // }

                    .in {
                        animation: flyIn 0.5s ease-out forwards;
                    }

                    .out {
                        animation: flyOut 0.5s ease-in forwards;
                    }
                }
            }

            .socialLink {
                align-self: self-start;
                display: flex;
                gap: 1rem;

                .linkIcon {
                    color: #FCFAF2;
                    transition: scale 0.3s ease, color 0.3s ease;

                    &:hover {
                        color: #A59052;
                        scale: 1.2;
                    }
                }
            }
        }

        .copyRight {
            cursor: default;
            display: flex;
            font-size: 12px;
            opacity: 0.5;
            margin: 2rem 0.5rem 0 auto;
        }
    }

    .bot {
        text-align: center;
        font-family: 'Mr Dafoe', cursive;
        // font-size: 15rem;
        // line-height: ;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        img {
            width: 95vw;
            transform: translateY(8%);
        }
    }
}



// .container {
//     max-width: $primaryWidth;
//     background-color: $secondBacColor;
//     color: $primaryBacColor;

//     display: flex;
//     flex-direction: column;
//     position: relative;
//     max-height: 920px;
//     overflow: hidden;

//     &>div {
//         flex: 1;
//     }

//     .top {
//         @extend %default;
//     }

//     .mid {
//         @extend %default;
//     }

//     .bot {
//         margin-top: 2rem;
//     }
// }

// .top {
//     @include flex-center-center;
//     align-items: stretch;
//     gap: 1rem;
//     position: relative;
//     width: 80%;

//     &::after {
//         @include WnH(1201px, 1px);
//         position: absolute;
//         bottom: 0;
//         content: '';
//         background-color: $primaryBacColor;
//         margin: auto 6rem;
//     }

//     .app {
//         display: flex;
//         position: relative;

//         .content {
//             display: flex;
//             flex-direction: column;
//         }

//         .phone {
//             // @include WnH(142px, 284px);
//             @include WnH(100px);
//             margin-bottom: 35px;
//             position: absolute;
//         }
//     }
// }

// .mid {

//     nav {
//         display: flex;
//         flex-direction: row;
//         justify-content: space-evenly;

//         ul {
//             padding: 0;
//         }
//     }

//     .socialLink {
//         display: flex;
//         gap: 2rem;
//         justify-content: center;
//     }
// }

// .bot {
//     font-family: 'Mr Dafoe', cursive;
//     font-weight: 400;
//     font-style: normal;
//     text-align: center;
//     margin: 0;
//     font-size: 33vh;
//     white-space: nowrap;
//     overflow: hidden;
// }</style>