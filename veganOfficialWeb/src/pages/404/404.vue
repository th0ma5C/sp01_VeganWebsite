<template>
    <div>
        <main
            class="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
            <div class="text-center">
                <p class="text-base ">
                    404</p>
                <h1
                    class="mt-4 text-5xl font-semibold tracking-tight text-balance  sm:text-7xl">
                    Page not found</h1>
                <p
                    class="mt-6 text-lg font-medium text-pretty  sm:text-xl/8">
                    很抱歉，找不到此頁面</p>
                <div
                    class="mt-10 flex items-center justify-center gap-x-6">
                    <router-link to="/"
                        class="rounded-md px-3.5 py-2.5 text-sm  shadow-xs  focus-visible:outline-2 focus-visible:outline-offset-2 ">
                        返回首頁
                    </router-link>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
main {
    height: calc(100vh - 100px);
    background-color: $primaryBacColor;

    h1 {
        color: $secondBacColor;
    }

    p {
        font-variation-settings: 'wght' 400;
    }

    a {
        color: $primaryBacColor ;
        background-color: $btnBacColor;

        &:hover {
            filter: brightness(1.2);
        }

        &:active {
            translate: 1px 1px;
        }
    }
}
</style>