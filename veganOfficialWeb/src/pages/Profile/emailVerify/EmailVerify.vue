<template>
    <div class="verifyContainer">
        <h1>
            信箱驗證
        </h1>

        <div class="content">
            <h2>驗證信將發送至以下信箱</h2>
            <p>{{ showEmail }}</p>

            <button @click="verifyEmail">發送</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reqSendVerifyEmail } from '@/api/userAuth';
import { useUserStore } from '@/store/userStore';
import { storeToRefs } from 'pinia';
import {
    Field as VField, Form as VForm, ErrorMessage, defineRule, configure,
    useField, useForm, type SubmissionHandler,
    type FormContext,
    type FormMeta
} from 'vee-validate';
import { computed } from 'vue';
import * as yup from 'yup';

// user store
const { user } = storeToRefs(useUserStore());

const showEmail = computed(() => {
    let raw = user.value.email;
    const length = raw?.length;
    const regexp = /.{3}(?=@)/
    raw = raw!.replace(regexp, '***')
    return raw
})

async function verifyEmail() {
    if (!user.value.email) return
    const params = {
        to: user.value.email
    }
    reqSendVerifyEmail(params);
}


</script>

<style scoped lang="scss">
* {
    // outline: 1px solid black;
}

.verifyContainer {
    flex: 1;
    text-align: center;

    h1 {
        font-size: 2.5rem;
        margin-bottom: .75rem;
    }
}

.content {
    h2 {
        font-size: 1.25rem;
        margin-bottom: 2rem;
    }

    p {
        font-size: 1.5rem;
        margin-bottom: 3rem;
    }

    button {
        @include WnH(90px, 40px);
        background-color: $btnBacColor_light;
        color: $primaryBacColor;
        font-size: 1.25rem;
        border: 1px solid $btnBacColor_light;
        border-radius: 21px;
        box-shadow: 1px 1px 2px black;
        transition: box-shadow .15s ease;
        position: relative;


        &:hover {
            box-shadow: 2px 2px 4px black;
        }

        &:active {
            transition: none;
            box-shadow: 2px 2px 2px black;
            transform: translate(1px, 1px);
        }
    }
}
</style>