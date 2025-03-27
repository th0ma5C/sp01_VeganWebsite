<template>
    <div class="verifyContainer" v-if="!token">
        <h1>
            信箱驗證
        </h1>

        <div class="content">
            <h2>驗證信將發送至以下信箱</h2>
            <p>{{ showEmail }}</p>

            <button @click="verifyEmail">發送</button>
        </div>
    </div>
    <div class="verifyAccount" v-else>
        <Spinner v-if="isVerify === null"></Spinner>
        <div v-if="isVerify">
            <SvgIcon name="Check" width="36px" height="36px"
                class="checkIcon" color="#00430b">
            </SvgIcon>
            <h1>
                驗證成功，{{ countdown }} 秒後跳轉
            </h1>
        </div>
        <div v-else-if="isVerify === false">
            <h1>
                驗證失敗，{{ countdown }} 秒後跳轉
            </h1>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reqSendVerifyEmail, reqVerifyAccount } from '@/api/userAuth';
import { useLoaderStore } from '@/store/loader';
import { useToastStore } from '@/store/toastStore';
import { useUserStore } from '@/store/userStore';
import { jwtDecode } from 'jwt-decode';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// user store
const { user } = storeToRefs(useUserStore());

// toast store
const toastStore = useToastStore();
const { addNotification } = toastStore;

// loader
const loaderStore = useLoaderStore();
const { loaderActivated } = storeToRefs(loaderStore)

// router
const router = useRouter();
const route = useRoute();

const showEmail = computed(() => {
    let raw = user.value.email;
    const length = raw?.length;
    const regexp = /.{3}(?=@)/
    if (!length) return
    raw = raw!.replace(regexp, '***')
    return raw
})

async function verifyEmail() {
    if (!user.value.email) return
    const params = {
        to: user.value.email
    }
    try {
        const res = await reqSendVerifyEmail(params);
        if (res.state == 'confirm') {
            addNotification('發送成功，請至信箱點擊驗證連結')
            router.push('/profile')
        }
        // console.log(res);
    } catch (error) {
        addNotification('發送失敗，請重試')
        // console.error("驗證失敗：")
    }
}

// verify email redirect
const isVerify = ref<boolean | null>(null);

const token = computed(() => {
    const query = route.query.token;
    if (typeof query == 'string') return query
})
async function handleVerifyAccount() {
    if (user.value.email) return
    if (!token.value) {
        addNotification('無效驗證碼，請登入後重新發送驗證信')
        return await router.push('/profile');
    }

    try {
        await fetchVerifyAccount();
    } catch (error) {
        console.log(error);
    }
}

async function fetchVerifyAccount() {
    if (!token.value) return
    const params = {
        token: token.value
    }
    try {
        const { state, token } = await reqVerifyAccount(params)
        if (state == 'confirm') {
            isVerify.value = true;
            addNotification('驗證成功')
        } else {
            isVerify.value = false;
            addNotification('無效驗證，請稍後重試')
        }
    } catch (error) {
        isVerify.value = false;
        addNotification('無效驗證，請稍後重試')
        // console.log(error);
    }
}

watch([isVerify, loaderActivated], async ([I, L]) => {
    if (I !== null && !L) {
        await countThreeSec()
        await router.push('/profile/account');
    }
})

const countdown = ref(3);
async function sleep1Sec() {
    return new Promise((res) => setTimeout(res, 1000))
}
async function countThreeSec() {
    for (let i = 0; i < 3; i++) {
        await sleep1Sec()
        countdown.value--
    }
}

onMounted(() => {
    handleVerifyAccount()
})

</script>

<style scoped lang="scss">
.verifyContainer {
    flex: 1;
    text-align: center;
    max-width: 100%;

    h1 {
        font-size: 2rem;
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
        word-break: break-word;
        overflow-wrap: break-word;
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

.verifyAccount {
    position: relative;
    flex: 1;

    h1 {
        font-size: 2rem;
        margin-top: 1rem;
        margin-bottom: .75rem;
    }
}

.checkIcon {
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
}
</style>