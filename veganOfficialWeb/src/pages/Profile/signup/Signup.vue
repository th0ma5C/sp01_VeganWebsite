<template>
    <div class="signupContainer">
        <h1>
            註冊
        </h1>

        <div class="inputWrapper">
            <form action="">
                <fieldset>
                    <div class="username">
                        <input type="text" required>
                        <label for="">稱呼</label>
                    </div>

                    <div class="username">
                        <input type="text" required>
                        <label for="">電子郵件</label>
                    </div>

                    <div class="password">
                        <input required>
                        <label for="">密碼</label>
                    </div>

                    <div class="password">
                        <input required>
                        <label for="">確認密碼</label>
                    </div>
                </fieldset>

                <Fieldset>
                    勾選
                </Fieldset>
            </form>
        </div>

        <div class="login_signup">
            <button>
                送出
            </button>
            <router-link to="/profile">
                上一步
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * doing: 同意勾選框
 */

</script>

<style scoped lang="scss">
$container_width: 300px;

.signupContainer {
    text-align: center;
    flex: 1;

    h1 {
        font-size: 2rem;
        font-variation-settings: 'wght' 400;
    }
}

.inputWrapper {
    margin-top: 2rem;

    fieldset {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        &>div {
            position: relative;
        }

        input {
            width: $container_width;
            height: 48px;
            padding: 0 1rem;
            border: 1px solid gray;
            border-radius: .5rem;
            background-color: $primaryBacColor;
        }

        label {
            background-color: $primaryBacColor;
            position: absolute;
            text-wrap: nowrap;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            font-size: 18px;
            color: rgba(0, 0, 0, 0.75);
            transition: transform .3s ease;
            transform-origin: left;
            user-select: none;
        }

        & div:has(input:focus)>label,
        div:has(input:valid)>label {
            transform: translateY(calc(-100% - 10px)) scale(0.8);
        }

        .passwordIcon {
            @include absoluteCenterTLXY($left: 100%, $X: -150%);
            cursor: pointer;
            // right: 0;
            // top: 50%;
        }
    }
}

.login_signup {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: .75rem;

    button {
        background-color: $btnBacColor_light;
        color: $primaryBacColor;
        width: 150px;
        height: 42px;
        font-size: 1.25rem;
        border: 1px solid $btnBacColor_light;
        border-radius: 21px;
        box-shadow: 1px 1px 2px black;
        transition: box-shadow .15s ease;

        &:hover {
            box-shadow: 2px 2px 4px black;
        }

        &:active {
            transition: none;
            box-shadow: 2px 2px 2px black;
            transform: translate(1px, 1px);
        }
    }

    .signup {
        font-size: .75rem;

        a,
        span {
            opacity: .5;
        }

        a {
            text-decoration: underline;
            text-underline-offset: 3px;

            &:hover {
                opacity: 1;
            }
        }
    }
}
</style>