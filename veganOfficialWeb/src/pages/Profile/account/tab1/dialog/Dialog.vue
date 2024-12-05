<template>
    <div class="dialogContainer">
        <div class="content">
            <div
                :class="{ cancelLoading: cancelActionLoading }">
                <SvgIcon class="cancelBtn" name="cancel"
                    width="24px" height="24px" color="black"
                    @click="emit('toggleDialogOpen', '取消訂單', null)">
                </SvgIcon>

                <h2>
                    確定要取消訂單？<br>
                    <span>
                        取消後將無法復原
                    </span>
                </h2>

                <div class="btnContainer">
                    <button @click="cancelAction">
                        是
                    </button>
                    <button
                        @click="emit('toggleDialogOpen', '取消訂單', null)">
                        否
                    </button>
                </div>
            </div>

            <div class="loadingContent"
                v-show="cancelActionLoading">
                <transition>
                    <h2 v-if="cancelActionRES !== ''">
                        {{ cancelActionRES }}
                    </h2>
                    <div v-else>
                        <Spinner></Spinner>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/userStore';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch, watchEffect } from 'vue';

// pinia
const userStore = useUserStore();
const { cancelOrder } = userStore;

// 確認框開關
const emit = defineEmits(['toggleDialogOpen', 'cancelConfirm']);

// orderID props
const { orderID } = defineProps<{ orderID: string | null }>();

// 取消訂單
const cancelActionRES = ref('');
const cancelActionLoading = ref(false);
const cancelAction = async () => {
    try {
        cancelActionLoading.value = true;

        if (!orderID) throw new Error();
        const result = await cancelOrder(orderID);

        if (!result) {
            return cancelActionRES.value = '取消失敗，請重試'
        }
        cancelActionRES.value = '取消成功'
        emit('cancelConfirm')
        emit('toggleDialogOpen', '取消訂單', null);
        cancelActionLoading.value = false;
        return
    } catch (error) {
        cancelActionRES.value = '取消失敗，請重試';
        emit('toggleDialogOpen', '取消訂單', null);
        return
    }
}

onMounted(() => {
})
</script>

<style scoped lang="scss">
.dialogContainer {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;


    background-color: rgba(0, 0, 0, 0.2);

    .content {
        background-color: $primaryBacColor;
        border: 1px solid black;
        border-radius: 1rem;
        padding: 3rem 2rem;
        position: relative;

        .cancelBtn {
            cursor: pointer;
            position: absolute;
            top: 1rem;
            right: 1rem;

        }

        h2 {
            font-size: 1.5rem;
            margin-bottom: 2rem;

            span {
                font-size: 1rem;
            }
        }

        .btnContainer {
            display: flex;
            gap: .5rem;
            justify-content: flex-end;

            button {
                border: 1px solid $btnBacColor;
                border-radius: .25rem;
                background-color: $btnBacColor;
                color: $primaryBacColor;
                padding: 0 .5rem;

                &:hover {
                    filter: brightness(1.2);
                }
            }
        }

        .cancelLoading {
            visibility: hidden;
        }

        .loadingContent {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            h2 {
                margin: 0;
            }
        }
    }
}
</style>