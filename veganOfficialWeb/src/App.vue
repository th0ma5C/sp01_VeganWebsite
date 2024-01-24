<template>
    <div class="outer">
        <VeganHeader></VeganHeader>
        <p>我是內容</p>
        <VeganFooter></VeganFooter>
    </div>
</template>

<script setup lang="ts">
import VeganHeader from './components/Header/VeganHeader.vue'
import VeganFooter from './components/Footer/VeganFooter.vue'

</script>

<style>
* {
    box-sizing: border-box;
}

*::before,
*::after {
    box-sizing: inherit;
}

li {
    list-style: none;
}

.outer {
    margin: 0 auto;
    max-width: 100rem;
    padding: 0 5rem;
}
</style>