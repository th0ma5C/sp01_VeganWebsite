<template>
    <div class="searchContainer" ref="searchContainer"
        @click.stop>
        <div class="searchBar">
            <SvgIcon class="searchIcon" name="Search"
                width="35px" height="35px" color="#00430b"
                ref="searchIconRef">
            </SvgIcon>
            <SvgIcon class="mobileSearchIcon" name="Search"
                width="35px" height="35px" color="#FCFAF2"
                ref="searchIconRef">
            </SvgIcon>
            <div class="inputWrapper" :class="{
                inputOutline: !isAnimate
            }">
                <input type="text" name=""
                    :id="`search${nanoid(1)}`"
                    placeholder="搜尋" autocomplete="off"
                    @keydown.enter.prevent
                    v-model="inputSearch">
            </div>
        </div>

        <div class="searchResult" ref="searchResultRef"
            :class="{
                showResult: isAnimate
            }">
            <div class="listWrapper">
                <h2>
                    前往
                </h2>

                <transition name="showResult" mode="out-in">
                    <ul
                        v-if="searchCount == 0 || inputSearch == ''">
                        <li v-for="({ routeName, path }, index) in initRouteList"
                            :key="index"
                            @click="routeOnclick(path)"
                            class="resultList routeList">
                            <div>
                                <h2>
                                    {{ routeName }}
                                </h2>
                            </div>
                        </li>

                    </ul>
                    <ul v-else>
                        <li v-for="({ item: { routeName, path } }, index) in routeResult"
                            :key="index"
                            @click="routeOnclick(path)"
                            class="resultList routeList">
                            <div>
                                <h2>
                                    {{ routeName }}
                                </h2>
                            </div>
                        </li>
                    </ul>
                </transition>
            </div>

            <div class="listWrapper">
                <h2>
                    菜單
                </h2>

                <transition name="showResult" mode="out-in">
                    <ul
                        v-if="searchCount == 0 || inputSearch == ''">
                        <li v-for="({ name, fileName, category }, index) in initMenuList"
                            :key="index"
                            @click="menuOnclick(name)"
                            class="resultList menuList">
                            <div class="imgWrapper">
                                <img :src="fileName || ''"
                                    alt="圖片">
                            </div>
                            <div>
                                <h2>
                                    {{ name }}
                                    <small>
                                        HOT!!!
                                    </small>
                                </h2>
                            </div>
                        </li>
                    </ul>
                    <ul v-else>
                        <li v-for="({ item: { itemName, imgUrl, category } }, index) in menuResult"
                            :key="index"
                            @click="menuOnclick(itemName)"
                            class="resultList menuList">
                            <div class="imgWrapper">
                                <img :src="imgUrl || ''"
                                    alt="圖片">
                            </div>
                            <div>
                                <h2>
                                    {{ itemName }}
                                </h2>
                            </div>
                        </li>
                    </ul>
                </transition>
            </div>

            <transition name="showResult">
                <div class="notFound"
                    v-show="routeResult.length == 0 && menuResult.length == 0">
                    <p>
                        無相關內容
                    </p>
                </div>
            </transition>
        </div>
    </div>

</template>

<script setup lang="ts">
import { useFuse } from '@/hooks/useFuse';
import { useMenuStore } from '@/store/menuStore';
import gsap from 'gsap';
import { storeToRefs } from 'pinia';
import { computed, nextTick, onMounted, onUnmounted, ref, toRaw, toValue, useTemplateRef, watch, type ComponentPublicInstance, type Ref } from 'vue';
import { useRouter, type RouteRecord } from 'vue-router';
import { nanoid } from 'nanoid';
// props
// const { showSearch } = defineProps<{
//     showSearch: boolean
// }>();

// watch(() => showSearch, (n, o) => {
//     console.log('o', o);
//     console.log('n', n);
// }, { immediate: true })
const showSearch = defineModel<boolean>();

// GSAP
interface IconRef {
    iconRef: Ref<HTMLElement>;
}
const isAnimate = ref(true);
const searchContainer = useTemplateRef('searchContainer');
const searchResultRef = useTemplateRef('searchResultRef');
const searchIconRef = useTemplateRef<IconRef>('searchIconRef');
function setGSAP() {
    if (!searchResultRef.value || !searchIconRef.value || !searchContainer.value) return;
    const { width } = searchContainer.value.getBoundingClientRect();
    // const { height } = searchResultRef.value.getBoundingClientRect();
    const iconRect = toValue(searchIconRef.value.iconRef).getBoundingClientRect();
    const tl = gsap.timeline();
    tl.set(searchResultRef.value, { padding: 0, opacity: 0 });

    tl.fromTo(searchContainer.value,
        {
            width: iconRect.width + 32,
            opacity: 0
        },
        {
            width,
            opacity: 1,
            duration: .3,
            onStart: () => {
            },
            onComplete: () => {
                isAnimate.value = false;
            }
        })
        .fromTo(searchResultRef.value,
            {
                clipPath: 'inset(0 0 100% 0)',
                padding: '0.5rem 1rem',
                opacity: 0
            },
            {
                clipPath: 'inset(-5% -5% -5% -5%)',
                opacity: 1,
                padding: '0.5rem 1rem',
                duration: .3,
                onComplete: () => {
                    setCloseEvent();
                }
            },
            '+=0.05',
        )
}


// close search
// const emit = defineEmits(['close'])
function emitCloseSearch() {
    showSearch.value = false;
    document.removeEventListener('click', emitCloseSearch)
}

function setCloseEvent() {
    document.addEventListener('click', emitCloseSearch)
}

// fuse search
// get routers data
interface FormatRouteList {
    path: string,
    routeName: string,
    searchKeys: string[]
}
const router = useRouter();
const routeList = ref<RouteRecord[]>(router.getRoutes());
const formatRouteList = computed(() => {
    let list: FormatRouteList[] = [];
    routeList.value.forEach((item) => {
        if (item.meta.hasOwnProperty('searchKeys')) {
            const searchKeys = toRaw(item.meta.searchKeys) as string[];
            list.push({
                path: item.path,
                routeName: searchKeys[0],
                searchKeys
            })
        }
    })
    return list
})
// get menu data
const menuStore = useMenuStore();
const { fetchMenu, fetchHotList } = menuStore;
const { fullMenu, hotList, isLoaded } = storeToRefs(menuStore);

async function initMenu() {
    try {
        if (!isLoaded.value) await fetchMenu()
        if (hotList.value.length == 0) await fetchHotList()
    } catch (error) {
        console.log(error);
    }
}

const formatMenuList = computed(() => {
    if (!isLoaded.value) return []
    const [{ items: saladList }, { items: smoothiesList }] = fullMenu.value;
    const list = [...saladList, ...smoothiesList].map((item) => {
        return {
            itemName: item.name,
            main: item.main,
            ingredients: toRaw(item.ingredients),
            imgUrl: item.fileName,
            category: item.category
        }
    })
    return list
})
// set fuse search
const inputSearch = ref('')
const routeFuseOption = {
    fuseOptions: {
        keys: ['searchKeys'],
        threshold: 0.3,
    },
    resultLimit: 3,
    matchAllWhenSearchEmpty: true
}
const menuFuseOption = {
    fuseOptions: {
        keys: [
            'itemName',
            'main',
            'ingredients',
        ],
        threshold: 0.3,
    },
    resultLimit: 3,
    matchAllWhenSearchEmpty: false
}
// route result
const { results: routeResult } = useFuse(inputSearch, formatRouteList.value, routeFuseOption);
watch(() => routeResult.value, (nVal) => {
    // console.log(nVal);
})
// menu result
const { results: menuResult } = useFuse(inputSearch, formatMenuList.value, menuFuseOption);
watch(() => menuResult.value, (nVal) => {
    // console.log('menuResult', nVal);
})

const searchCount = ref(0);
watch(inputSearch, (nVal) => {
    searchCount.value++;
    // console.log(searchCount.value);
})

// init search result show
const initRouteList = computed(() => {
    const target = ['美味菜單', '註冊', '忘記密碼']
    const list = formatRouteList.value.filter((route) => {
        return target.includes(route.routeName)
    })
    return list
})
const initMenuList = computed(() => {
    return hotList.value.slice(0, 3);
})

// search result on click
function routeOnclick(path: string) {
    router.push(path).then(() => {
        emitCloseSearch()
        // emit('close');
    })
}

function menuOnclick(name: string | null) {
    if (!name) return
    router.push({
        name: 'Product',
        query: {
            name
        }
    }).then(() => {
        emitCloseSearch()
        // emit('close');
    })
}

onMounted(() => {
    initMenu()
    nextTick(() => {
        setGSAP();
    })
})

</script>

<style lang="scss" scoped>
* {
    // outline: 1px solid black;
}

.searchContainer {
    cursor: default;
    position: absolute;
    top: 0;
    right: 0;

    @include small {
        top: 50px;
        right: 1rem;
        translate: 0% -17px;
    }
}

.closeZone {
    content: '';
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}

.searchBar {
    padding: 0rem 1rem .5rem 1rem;
    display: flex;
    gap: .5rem;
    border-radius: .5rem .5rem 0 0;
}

.mobileSearchIcon {
    display: none;
}

@include small {
    .searchIcon {
        display: none;
    }

    .mobileSearchIcon {
        display: block;
    }
}

.inputWrapper {
    border-radius: 1rem;
    overflow: hidden;
    border-radius: 1rem;

    input {
        padding-left: .75rem;
        height: 100%;
        background-color: $primaryBacColor;
        opacity: 0;

        &:focus {
            outline: none;
        }
    }
}

.inputOutline {
    outline: 1px solid gray;

    input {
        opacity: 1;
    }
}

@keyframes textFlicker {
    from {
        text-shadow: 0 0 2px red;
    }

    to {
        text-shadow: 0 0 2px rgba(255, 0, 0, 0.5);
    }
}

.searchResult {
    border: 1px solid $secondBacColor;
    border-radius: .5rem;
    background-color: $primaryBacColor;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.7);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    margin-bottom: .5rem;
    transition: box-shadow .3s;
    // transform-origin: top;

    .listWrapper {
        margin-bottom: .75rem;

        &>h2 {
            font-size: .8rem;
            font-variation-settings: 'wght' 700;
            border-bottom: 1px solid gray;
        }

        &:nth-of-type(2) {
            margin-bottom: 0;
        }
    }

    .resultList {
        transition: box-shadow .1s, transform .1s;
        border-radius: .5rem;
        user-select: none;

        small {
            animation: textFlicker 1s infinite;
            color: red;
            // text-shadow: 0 0 2px red;
            // text-shadow: 0 0 2px rgba(255, 0, 0, 0.5);
            font-variation-settings: 'wght' 600;
        }

        &:hover {
            box-shadow:
                0 0 0 1px $btnBacColor_light,
                1px 1px 4px black;
        }

        &:active {
            transform: translate(1px, 1px);
            box-shadow:
                0 0 0 1px $btnBacColor_light;
        }
    }

    .routeList {
        cursor: pointer;
        padding-left: 1rem;
        margin-block: .5rem;
        padding-block: .5rem;


    }


    .menuList {
        cursor: pointer;
        display: flex;
        align-items: center;
        margin-block: .5rem;

        .imgWrapper {
            max-width: 75px;
        }
    }

    .notFound {
        @include flex-center-center;
        flex: 1;
        font-variation-settings: 'wght' 600;

        p {
            opacity: .5;
        }
    }
}

.showResult-enter-active,
.showResult-leave-active {
    transition: opacity .3s;
}

.showResult-enter-from,
.showResult-leave-to {
    opacity: 0;
}

.showResult-enter-to,
.showResult-leave-from {
    opacity: 1;
}
</style>