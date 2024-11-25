<template>
    <h2>
        訂單紀錄
    </h2>

    <div>
        表頭
    </div>

    <main>
        <ul class="listContainer">
            <li v-for="({ orderID, shippingInfo, purchaseOrder, createdAt }, index) in showOrderList"
                :key="orderID">
                <div class="orderTitle">
                    <h3>
                        {{ orderID }}
                    </h3>

                    <span>{{ createdAt }}</span>
                </div>

                <div class="orderContent" v-show="false">
                    <div class="progressBar">
                        訂單進度條
                    </div>

                    <div class="content">
                        <div>
                            {{ shippingInfo }}
                        </div>

                        <div>
                            <ul>
                                <li v-for="(item, index) in purchaseOrder.orderList"
                                    :key="index">
                                    {{ item }}
                                </li>
                            </ul>

                            <div>
                                {{
                                    purchaseOrder.total
                                }}
                            </div>
                        </div>
                    </div>

                    <div class="editBtn">
                        修改按鈕
                    </div>
                </div>
            </li>
        </ul>
    </main>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/userStore';
import { computed, watch } from 'vue';
import type { UserOrder } from '@/api/order/type';


const userStore = useUserStore();
// const { getUserOrderList, logout } = userStore;
const { userOrderList } = storeToRefs(userStore);

const showOrderList = computed(() => {
    if (!userOrderList.value || userOrderList.value.length == 0) return []
    const formatted = userOrderList.value.map((item) => {
        return {
            ...item,
            orderID: item._id.toString().slice(-6),
            createdAt: item.createdAt.split('T')[0],
        }
    })
    return formatted
});

</script>

<style scoped lang="scss">
h2 {
    height: 50px;
    line-height: 50px;
}
</style>