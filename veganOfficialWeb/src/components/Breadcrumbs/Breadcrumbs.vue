<template>
    <div class="wrapper">
        <router-link
            v-for="({ title, link }, index) in breadcrumbArr"
            :key="index" :to="link" :class="{
                breadcrumb: index != breadcrumbArr.length - 1,
                lastBreadcrumb: index == breadcrumbArr.length - 1
            }">
            <span>
                {{
                    title
                }}
            </span>
        </router-link>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onActivated, onDeactivated, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

// get current route info
const { currentPage } = defineProps(['currentPage']);


// get router info
interface BreadcrumbArr {
    title: string,
    link: string
}

const Route = useRoute();
const breadcrumbArr = computed(() => {
    const result = Route.matched.map((route) => {
        return route.meta.breadcrumbs || []
    }).flat(1) as BreadcrumbArr[]

    if (Route.name == 'Product') {
        result.push({
            title: currentPage,
            link: 'Product'
        })
    }
    return result
})

onMounted(() => {
})
onUnmounted(() => {
})

</script>

<style scoped lang="scss">
.wrapper {

    &>a {
        display: inline-flex;
        overflow: hidden;
    }
}

.breadcrumb {
    position: relative;

    &::after {
        content: '/';
        color: black;
        margin: 0rem .5rem;
        font-variation-settings: 'wght' 400;
    }

    &::before {
        @include WnH(calc(100% - 22px), 1px);
        content: '';
        background-color: black;
        position: absolute;
        bottom: 1px;
        left: -1px;
        transform: translateX(-100%);
        transition: transform 0.2s ease;
    }

    &:has(span:hover) {
        font-variation-settings: 'wght' 500;

        &::before {
            transform: translateX(1px);
        }
    }
}

.lastBreadcrumb {
    cursor: default;
    color: $btnBacColor_light;
    font-variation-settings: 'wght' 500;
    position: relative;

    &::before {
        @include WnH(100%, 1px);
        content: '';
        background-color: $btnBacColor_light;
        position: absolute;
        bottom: 1px;
        left: 0;
    }
}
</style>