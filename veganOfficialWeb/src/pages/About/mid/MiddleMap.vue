<template>
    <div class="midContainer" :class="currBacImg"
        ref="midContainer">
        <h1>
            ACCESS
        </h1>

        <main>
            <div class="map">
                <transition-group name="tab">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3614.6186188906545!2d121.51571906579045!3d25.047013701133956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a9727e339109%3A0xc34a31ce3a4abecb!2z5Y-w5YyX!5e0!3m2!1szh-TW!2stw!4v1735629135146!5m2!1szh-TW!2stw"
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                        v-show="currTab == 0"
                        key="0"></iframe>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3640.9814927181997!2d120.68229735891396!3d24.13728808206625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34693d1438fb3d3f%3A0xb7b4ebd02f1906b6!2z6Ie65Lit54Gr6LuK56uZ!5e0!3m2!1szh-TW!2stw!4v1735629700952!5m2!1szh-TW!2stw"
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                        v-show="currTab == 1"
                        key="1"></iframe>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3682.3831910081417!2d120.30000271014075!3d22.639497330430878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e04f4871d07a7%3A0xccb9296f1ea5e649!2z6auY6ZuE6LuK56uZ!5e0!3m2!1szh-TW!2stw!4v1735629737060!5m2!1szh-TW!2stw"
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                        v-show="currTab == 2"
                        key="2"></iframe>
                </transition-group>
            </div>

            <div class="detail">
                <div class="branch">
                    <h2>
                        <SvgIcon name="Store" width="32px"
                            height="32px" color="#00430b">
                        </SvgIcon>
                        <span>
                            分店
                        </span>
                    </h2>

                    <div class="tabBtn">
                        <button
                            v-for="(item, index) in list"
                            :key="index"
                            @click="selectTab(index);"
                            :class="index == currTab ? 'isSelect' : 'unselect'"
                            ref="btnList">
                            {{ item.branch }}
                        </button>
                        <div class="btnMarker"
                            ref="btnMarker"
                            :style="btnMarkerStyle">
                        </div>
                    </div>
                </div>

                <div class="content"
                    v-for="(item, index) in list"
                    :key="index" v-show="index == currTab">
                    <ul>
                        <li>
                            <SvgIcon name="Addr"
                                width="32px" height="32px"
                                color="#00430b">
                            </SvgIcon>
                            <span>
                                地址：{{ item.addr }}
                            </span>
                        </li>
                        <li>
                            <SvgIcon name="Phone"
                                width="32px" height="32px"
                                color="#00430b">
                            </SvgIcon>
                            <span>
                                電話：{{ item.tel }}
                            </span>
                        </li>
                        <li>
                            <h3>
                                <SvgIcon name="Open"
                                    width="32px"
                                    height="32px"
                                    color="#00430b">
                                </SvgIcon>
                                <span>
                                    營業時間：
                                </span>
                            </h3>
                        </li>
                        <li>
                            <p>
                                <span>
                                    週一至週五：
                                </span>
                                <span>
                                    11:00 AM - 10:00 PM
                                </span>
                            </p>
                            <p>
                                <span>
                                    週六至週日：
                                </span>
                                <span>
                                    10:00 AM - 11:00 PM
                                </span>
                            </p>
                            <p>
                                <span>
                                    國定假日：
                                </span>
                                <span>
                                    依公告調整
                                </span>
                            </p>
                        </li>
                    </ul>
                </div>

                <div class="imgWrapper">
                    <img v-for="(item, index) in list"
                        :key="index" :src="item.imgUrl"
                        alt="" v-show="index == currTab">

                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';
import { positionStore } from '../store/usePagePosition'
import debounce from 'lodash/debounce';



const list = ref([
    {
        branch: '台北店',
        addr: '臺北市中正區黎明里北平西路3號',
        tel: '02-21234567',
        imgUrl: '/imgs/about/midStore1.webp'
    },
    {
        branch: '台中店',
        addr: '臺中市中區綠川里臺灣大道一段1號',
        tel: '04-31234567',
        imgUrl: '/imgs/about/midStore2.webp'
    },
    {
        branch: '高雄店',
        addr: '高雄市三民區港西里建國二路318號',
        tel: '07-8123456',
        imgUrl: '/imgs/about/midStore3.webp'
    },
])

// current tab
const currTab = ref<null | number>(null);
const lastTab = ref(0);
function selectTab(tab: number) {
    currTab.value = tab;
}

// background img
const currBacImg = computed(() => {
    switch (currTab.value) {
        case 0:
            return ['store1']
        case 1:
            if (lastTab.value == 0) {
                return ['store2']
            }
            return ['store2']
        default:
            return ['store3']
    }
})

// hover btn move marker
const btnList = useTemplateRef('btnList');
const btnMarkerLeft = ref(0);
const btnMarkerTop = ref(0);
const btnMarkerHeight = ref(0);
const btnMarkerWidth = ref(0);

function getPosition(index: number) {
    if (btnList.value) {
        const { width, height } = btnList.value[index].getBoundingClientRect();
        const { offsetLeft: left, offsetTop: top } = btnList.value[index];

        btnMarkerLeft.value = left;
        btnMarkerTop.value = top;
        btnMarkerHeight.value = height;
        btnMarkerWidth.value = width;
    }
}


watch(currTab, (nVal, oVal) => {
    if (typeof nVal === 'number' || nVal) {
        getPosition(nVal);

    }
    if (oVal !== null) {
        lastTab.value = oVal;
    }
})

const btnMarkerStyle = computed(() => {
    return {
        left: `${btnMarkerLeft.value}px`,
        top: `${btnMarkerTop.value}px`,
        width: `${btnMarkerWidth.value}px`,
        height: `${btnMarkerHeight.value}px`
    }
})

// position store
const midContainer = useTemplateRef('midContainer');
function exposePosition() {
    if (midContainer.value) {
        const { top } = midContainer.value.getBoundingClientRect();
        positionStore.setPosition('middle', top);
    }
}

// on resize
let currWidth = window.innerWidth;
function onResize() {
    if (window.innerWidth == currWidth) return
    getPosition(currTab.value || 0);
    currWidth = window.innerWidth;
}

const debounceResize = debounce(onResize, 500);

onMounted(() => {
    selectTab(0);
    exposePosition();
    window.addEventListener('resize', debounceResize);
})

onUnmounted(() => {
    window.removeEventListener('resize', debounceResize);
})

</script>

<style scoped lang="scss">
* {
    // outline: 1px solid black;
}

%pseudo_line {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0rem;
    width: 100%;
    height: 2px;
    background-color: $secondBacColor;
}


.midContainer {
    padding: 0 8rem;
    // padding-top: 60px;
    min-height: 100vh;
    position: relative;
    z-index: 0;
    top: 100px;
    padding-inline: 1.5rem;
    padding-inline: clamp(1.5rem, 0.19999999999999996rem + 6.5vw, 8rem);
    display: flex;
    flex-direction: column;
    justify-content: center;

    &::after {
        transition: opacity .5s;
    }

    h1 {
        font-size: 3rem;
        font-size: 2.5rem;
        font-size: clamp(2.5rem, 2.4rem + 0.5vw, 3rem);
        position: relative;
        margin-bottom: 3rem;
        font-family: "EB Garamond", serif;
        font-variation-settings: 'wght' 450;

        width: fit-content;

        &::after {
            @extend %pseudo_line;
        }
    }
}

@keyframes leftInSlider {
    from {
        background-position: right 40%;
    }

    to {
        background-position: center;
    }
}

@keyframes rightInSlider {
    from {
        background-position: left 40%;
    }

    to {
        background-position: center;
    }
}

.slideRightIn {
    // animation: rightInSlider .5s forwards;
}

.slideLeftIn {
    // animation: leftInSlider .5s forwards;
}

@keyframes pseudo_bac0 {
    from {
        opacity: .25;
    }

    to {
        opacity: 1;
    }
}

@keyframes pseudo_bac1 {
    from {
        opacity: .25;
    }

    to {
        opacity: 1;
    }
}

@keyframes pseudo_bac2 {
    from {
        opacity: .25;
    }

    to {
        opacity: 1;
    }
}

.store1::after {
    content: "";
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    animation: pseudo_bac0 2.5s forwards;
    background:
        linear-gradient(rgba(252, 250, 242, 0.75), #FCFAF2), url('/imgs/about/midStore1.webp') no-repeat center/cover;
}

.store2::after {
    content: "";
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    animation: pseudo_bac1 2.5s forwards;
    background:
        linear-gradient(rgba(252, 250, 242, 0.75), #FCFAF2), url('/imgs/about/midStore2.webp') no-repeat center/cover;
}

.store3::after {
    content: "";
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    animation: pseudo_bac2 2.5s forwards;
    background:
        linear-gradient(rgba(252, 250, 242, 0.75), #FCFAF2), url('/imgs/about/midStore3.webp') no-repeat center/cover;
}

main {
    display: flex;
    gap: 1rem;
    // max-height: 800px;
    // height: 800px;
    // height: calc(100% - 9rem);
    // height: 100%;

    &>div {
        flex: 1;
    }
}

.map {
    border-radius: 1rem;
    overflow: hidden;
    position: relative;

    iframe {
        width: 100%;
        height: 100%;
    }
}

.detail {
    display: flex;
    flex-direction: column;

    h2 {
        font-size: 1.75rem;
        display: flex;
        gap: .5rem;
    }

    & :where(li, h3):has(span) {
        display: flex;
        align-items: center;
        gap: .5rem;
    }

    ul {
        line-height: 3;
    }

    li:has(p) {
        // text-indent: 2.5rem;
        padding-left: 2.5rem;
        flex-direction: column;
        align-items: start;
    }

    p {
        display: inline-flex;
        align-items: start;
        flex-wrap: wrap;
    }
}

.branch {
    padding-left: 1rem;
}

.tabBtn {
    display: flex;
    gap: 1rem;
    padding: 1rem 0;
    padding-left: 2.5rem;
    font-size: 1.25rem;
    position: relative;


    &::after {
        @extend %pseudo_line;
        height: 1px;
    }

    button {
        padding: .25rem;
        border-radius: .5rem;
        transition: font-variation-settings .15s, color .3s;

        &:hover:not(.isSelect) {
            // color: $primaryBacColor;
            opacity: 1;
            font-variation-settings: 'wght' 600;
        }
    }
}

.isSelect {
    // background-color: $btnBacColor;
    color: $primaryBacColor;
    z-index: 2;
}

.unselect {
    // opacity: .5;
    color: $secondBacColor;
    background-color: transparent;
    z-index: 2;
}

.btnMarker {
    position: absolute;
    // z-index: -1;
    border-radius: .5rem;
    background-color: $btnBacColor;
    transition: left .3s;
}

.content {
    margin-top: 1rem;
    padding: 0 1rem;
}

.imgWrapper {
    margin: 0 2.5rem;
    overflow: hidden;
    border-radius: 1rem;
    position: relative;
    // min-height: 150px;
    // min-width: 300px;

    img {
        // transform: scale(1.1) translateX(-2%);
        animation: imgSlider 15s infinite alternate;
    }
}

@keyframes imgSlider {
    from {
        transform: scale(1.2) translateX(-0%);
    }

    to {
        transform: scale(1.2) translateX(-5%);
    }
}

.tab-enter-active,
.tab-leave-active {
    transition: opacity .3s;
    position: absolute;
}

.tab-enter-from,
.tab-leave-to {
    opacity: 0;
}

.tab-enter-to,
.tab-leave-from {
    opacity: 1;
}

@include XLarge {}

@include large {}

@include medium($width: 1024px) {}

@include medium {
    main {
        flex-direction: column;
    }

    .map,
    iframe {
        min-height: 30vh;
    }

    .detail ul {
        line-height: 2.5;
    }

    .imgWrapper {
        margin: 0;
        margin-top: 1rem;
    }
}

@include small {}

@include small($width: 430px) {
    .tabBtn {
        padding: .5rem 0;
        justify-content: center;
    }
}

@include small($width: 375px) {
    .detail ul {
        line-height: 2;

        li {
            margin-top: .5rem;
        }
    }
}

@include small($width: 320px) {}
</style>