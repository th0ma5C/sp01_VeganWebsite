<template>
    <div class="container">
        <a href="">
            <SvgIcon name="Logo"></SvgIcon>
        </a>
        <div>
            <ul>
                <li v-for="{ link } in  navLink " :key="link">
                    <a href=""><span>{{ link }}</span></a>
                </li>
            </ul>
            <ul>
                <li v-for="{ icon } in  navIcon " :key="icon">
                    <a href="">
                        <SvgIcon :name="icon"></SvgIcon>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
let navLink = [
    { link: '首頁' }, { link: '診斷開始' }, { link: '美味菜單' }, { link: '關於果漾' }
];
let navIcon = [
    { icon: 'Search' }, { icon: 'Cart' }, { icon: 'Person' }
]

</script>

<style scoped lang="scss">
.container {
    @include flex-center-center;

    div {
        @include flex-center-center;
        justify-content: space-between;
        width: 100%;

        li {
            display: inline-flex;
        }

    }
}
</style>