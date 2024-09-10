<template>
    <div class="item" ref="productEl">
        <div :class="item.category == 'salad' ? 'menuImg' : 'smoothiesImg'
            " @click="routerPush(item.name!)">
            <img :src="item.fileName!" alt="商品">
            <p>{{ item.price }}元</p>
            <div class="description">
                <span>{{ item.description }}</span>
            </div>
        </div>
        <h3>{{ item.name }}</h3>
        <div class="ingredients">
            <span v-for="(el) in item.ingredients"
                :key="el">
                {{ el }}
            </span>
        </div>
        <div class="btnWrapper">
            <button class="cart-btn">加入購物車</button>
            <button class="info-btn"
                @click="routerPush(item.name!)">詳細資訊</button>
            <div class="btnBackground">
                <svg width="260" height="48"
                    viewBox="0 0 260 48" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <g id="btnBac" filter="url('#btn')">
                        <rect id="center" y="21"
                            width="117.52" height="6"
                            fill="currentColor" />
                        <path id="left"
                            d="M0 0H26.5417H53.0833H79.625H117.553L130 48H0V0Z"
                            fill="currentColor" />
                        <path id="right"
                            d="M260 48L233.458 48L206.917 48L180.375 48L142.447 48L130 4.93616e-06L260 1.5864e-05L260 48Z"
                            fill="currentColor" />
                    </g>
                    <filter id="btn">
                        <feGaussianBlur in="SourceGraphic"
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
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick, toRefs } from 'vue';
import type { MenuItem } from '@/api/menu/type';
import { useRouter } from 'vue-router';
import { useMenuStore } from '@/store/menuStore';
import { storeToRefs } from 'pinia';

//接收菜單數據 
const props = defineProps<{ item: MenuItem }>();
const { item } = toRefs(props);

// const MenuStore = useMenuStore();
// MenuStore.$subscribe((_, state) => {
//     if (state.isLoaded) {
//         // let { name, date } = item.value;
//         // console.log(name);
//     }
// })

// 提供DOM狀態
let productEl = ref();
defineExpose({ productEl });

// 路由跳轉
const router = useRouter();

function routerPush(name: string, id?: string) {
    router.push({
        name: 'Product',
        query: {
            name,
        },
    })
}

</script>

<style scoped lang="scss">
.item {
    @include flex-center-center;
    flex-direction: column;
    // gap: 1rem;
    width: fit-content;

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

    .smoothiesImg {
        @extend .menuImg;
        background: none;
        overflow: hidden;
        border-radius: 2.5rem 2.5rem 0 2.5rem;
        // filter: drop-shadow(4px 4px 4px black);

        img {
            @include WnH(100%);
            filter: none;
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
        // position: relative;


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
</style>