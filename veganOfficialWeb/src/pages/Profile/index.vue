<template>
    <div class="container">
        <h1>
            登入
        </h1>

        <div class="inputWrapper">
            <form action="">
                <fieldset>
                    <div class="username">
                        <input type="text">
                        <label for="">帳號</label>
                    </div>

                    <div class="password">
                        <input type="text">
                        <label for="">密碼</label>
                    </div>
                </fieldset>
            </form>

            <div class="forgetPassword">
                <a href="">
                    忘記密碼？
                </a>
            </div>
        </div>

        <div class="login_signup">
            <button>
                登入
            </button>

            <div class="signup">
                <span>
                    沒有帳號?
                </span>
                <a href="">
                    註冊
                </a>
            </div>
        </div>

        <div class="divider">
            --------------------------or--------------------------
        </div>

        <div class="outerAccount">
            <a href="">FB</a>
            <a href="">GOOGLE</a>
            <a href="">LINE</a>
        </div>

    </div>
</template>

<script setup lang="ts">
/**
 * todo: 樣式完成 分隔線 忘記密碼/註冊分頁 社群登入
 * doing: label 轉場 社群icon
 * -----------------------------------------
 * ? 臨時ID
 */
</script>

<style scoped lang="scss">
* {
    outline: 1px solid black
}

.container {
    @extend %headerPseudo;
    @extend %fixContainer;

    flex-direction: column;
    justify-content: normal;
    min-height: 80vh;

    padding-top: 3rem;
    // gap: 2rem;

    h1 {
        font-size: 2rem;
        font-variation-settings: 'wght' 400;
    }

    &>div {
        // margin-top: 1rem;
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
            width: 300px;
            height: 48px;
            padding: 0 1rem;
        }

        label {
            position: absolute;
            text-wrap: nowrap;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            font-size: 1.25rem;
        }
    }
}

.forgetPassword {
    margin-top: .5rem;
    font-size: .75rem;
    text-align: end;
}

.login_signup {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: .5rem;

    button {
        width: 150px;
        height: 36px;
        font-size: 1.25rem;
    }

    .signup {
        font-size: .75rem;
    }
}

.divider {
    margin: 1rem;
}

.outerAccount {
    display: flex;
    gap: 1rem;
}
</style>