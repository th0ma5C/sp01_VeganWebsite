<template>
    <div>
        <ul class="toastContainer">
            <transition-group name="notificationList">
                <li v-for="(item, index) in notificationList"
                    ref="itemList" v-show="item.show"
                    :key="item.content">
                    <div class="content">
                        <SvgIcon name="cancel" width="20px"
                            height="20px" color="black"
                            class="cancel"
                            @click="clearNotification(item.index)">
                        </SvgIcon>

                        <div class="text">
                            {{ item.content }}
                        </div>
                    </div>
                </li>
            </transition-group>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch, ref, watchEffect, useTemplateRef, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useToastStore } from '@/store/toastStore';


const toastStore = useToastStore();
const { notificationList } = storeToRefs(toastStore);
const { addNotification, clearNotification } = toastStore;


function bar() {
    addNotification('測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試');
    addNotification('測試測試測試測試測試測試測試');
}


</script>

<style scoped lang="scss">
* {
    // outline: 1px solid black;
}

.toastContainer {
    --svg-opacity: 0;
    --r: clamp(1rem, -0.4285714285714284rem + 7.142857142857142vw, 6rem);
    min-width: 180px;
    position: fixed;
    top: 80px;
    right: 1rem;
    right: clamp(1rem, -0.4285714285714284rem + 7.142857142857142vw, 6rem);
    z-index: 99;
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    &>li {
        width: max-content;
        max-width: 360px;
        min-width: 180px;
        min-height: 48px;
        padding: .5rem 1rem;
        padding-top: calc(.5rem + 4px);
        margin-bottom: .5rem;
        box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, 0.5);

        background-color: $primaryBacColor;
        border-radius: .25rem;

        overflow: hidden;

        transform-origin: right;

        &:not(.notificationList-leave-active) {
            position: relative;
        }
    }

    & li:hover {
        .cancel {
            opacity: 1;
        }
    }
}

.notificationList-move,
.notificationList-enter-active,
.notificationList-leave-active {
    transition: all .2s;
}

.notificationList-leave-active {
    position: absolute;
}

.notificationList-enter-from,
.notificationList-leave-to {
    opacity: 0;
    transform: scale(0.1) translate(10px, 0);
}

.notificationList-enter-to,
.notificationList-leave-from {
    opacity: 1;
}

.countdownBarTrack {
    width: 100%;
    height: 4px;

    position: absolute;
    top: 0;
    left: 0;

    // background-color: rgba(0, 0, 0, 0.2);

    .bar {
        height: 100%;
        width: 100%;

        border-radius: 2px;

        background-color: $btnBacColor_light;

        transform-origin: left;
        // will-change: transform;
        // transition: transform .13;
    }
}

.content {
    display: flex;
    flex-direction: column;
    padding-right: 18px;
    position: relative;

    .cancel {
        cursor: pointer;
        align-self: flex-end;
        opacity: 0;
        transition: opacity .3s;

        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
    }

    .text {
        // text-wrap: nowrap;
    }
}

@include XLarge {
    .toastContainer {
        right: 1rem;
        right: calc(50% - 960px + var(--r));
    }
}

@include large {
    .toastContainer li {
        // max-width: 270px;
    }
}

@include medium($width: 1024px) {
    .toastContainer li {
        max-width: 270px;
    }
}

@include medium {}

@include small {
    .toastContainer {
        top: 90px;

        li {
            max-width: 180px;
        }
    }
}

@include small($width: 430px) {}

@include small($width: 320px) {}
</style>