<template>
    <div class="mainFooter">
        <nav>
            <div>
                <h2>快速連結</h2>
                <ul>
                    <li>1</li>
                    <li>link</li>
                </ul>
            </div>
            <div>
                <h2>顧客服務</h2>
                <ul>
                    <li>2</li>
                    <li>link</li>
                </ul>
            </div>
            <div>
                <h2>果漾蔬食</h2>
                <ul>
                    <li>3</li>
                    <li>link</li>
                </ul>
            </div>
        </nav>
        <div>
            底部連結
        </div>

    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.mainFooter {
    @include main-part;

    nav {
        display: flex;
        flex-direction: row;
    }
}
</style>