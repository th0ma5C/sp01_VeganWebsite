<template>
    <div class="container">
        <div class="top">
            <div class="sub">
                <h2>訂閱第一手消息！</h2>
                <p>成為我們的VIP！訂閱我們的電子報，即刻獲得獨家優惠、新菜品消息和特別活動邀請。
                    每週精選的美味直送到您的信箱！
                </p>
                <form action="" class="submitForm">
                    <input type="text">
                    <button type="submit">訂閱</button>
                </form>
            </div>
            <div class="app">
                <div class="content">
                    <h2>立即下載App！</h2>
                    <p>
                        即刻下載，掌握美味的滋味～<br>獨享訂單優惠、獨家菜單推薦，輕鬆預訂、方便外帶，尊享美食新體驗！
                    </p>
                    <div class="download">
                        <button>下載App</button>
                    </div>
                </div>
                <div class="phone">
                    <img src="@assets/img/InfoFooter/phone.png"
                        alt="" class="info-phone">
                </div>
            </div>
        </div>
        <div class="mid">
            <nav>
                <ul v-for="({ title, content }, index) in footerList"
                    :key="title">
                    <li>
                        <h2>
                            {{ title }}
                        </h2>
                    </li>
                    <li v-for="(item, index) in content"
                        :key="item">
                        {{ item }}
                    </li>
                </ul>
            </nav>
            <div class="socialLink">
                <a href="" v-for="(item, index) in iconList"
                    :key="index">
                    <SvgIcon :name="item" width="30px"
                        height="30px" color="#FCFAF2">
                    </SvgIcon>
                </a>
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
import { reactive } from 'vue';


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

</script>

<style scoped lang="scss">
// DOING:切版
/**
** 右下角加商標 
** line height
** email width placeholder
** nav li margin
** app marquee
** hover transition
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
    }

    .submitForm,
    .download {
        position: absolute;
        bottom: 48px;
        right: 50%;
        transform: translateX(50%);

        button {
            // @include WnH(9rem, 3rem);
            border-radius: 2rem;
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

                input {
                    @include WnH(100%, 3rem);
                    border-radius: 2rem;
                    background-color: #B3D4B9;
                }

                button {
                    @include WnH(9rem, 3rem);
                    border-radius: 0 2rem 2rem 0;
                    background-color: #00510E;
                    border: 1px solid black;
                    color: #FCFAF2;
                    width: 6rem;
                    position: absolute;
                    right: 1rem;
                    top: 0;
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
                    right: calc(153px + 2rem);
                    transform: translateX(0);



                    button {
                        @include WnH(9rem, 3rem);
                        background-color: #00510E;
                        color: rgb(252, 250, 242, 0.75);
                        transition: background-color 0.3s ease, color 0.3s ease;

                        &:hover {
                            background-color: #098E20;
                            color: rgb(252, 250, 242);
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
            }
        }
    }

    .mid {
        @extend %default;

        flex-direction: column;
        // justify-content: space-around;
        padding: 2rem 4rem 0 4rem;

        nav {
            font-size: 14px;
            flex: 2 1 0;
            display: flex;
            justify-content: space-between;
            align-items: center;

            ul>li {

                h2 {
                    font-size: 1.05rem;
                }

                &:not(:has(h2)) {
                    opacity: 0.5;
                }
            }
        }

        .socialLink {
            flex: 1 1 0;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1.5rem;
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