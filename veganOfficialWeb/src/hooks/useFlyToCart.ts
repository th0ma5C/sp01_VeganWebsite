import { ref, computed } from 'vue';
import type { Ref } from 'vue';
import gsap from 'gsap';
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import type { MenuItem } from '@/api/menu/type';

gsap.registerPlugin(MotionPathPlugin);

interface Crew {
    cartBtn: Ref<HTMLElement>,
    flyingEl: Ref<HTMLElement>,
    coordCompensation?: {
        x: number,
        y: number
    }
}

export default class FlyToCart {
    #item: MenuItem | null = null;
    #itemBtn: Ref<HTMLElement | null> = ref(null);
    takeoffPoint = computed(() => {
        if (!this.#itemBtn.value) return
        const { left, top, width, height } = this.#itemBtn.value.getBoundingClientRect();
        const originCoord = {
            x: (left + width / 2) - 73,
            y: (window.scrollY + top + height / 2) - 25
        }
        return originCoord
    })
    #cartBtn;
    #flyingEl;
    imgURL = ref('');
    isFlying = ref(false);
    #coordCompensation;

    constructor(crew: Crew) {
        this.#cartBtn = crew.cartBtn;
        this.#flyingEl = crew.flyingEl;
        this.#coordCompensation = crew.coordCompensation;
    }

    getActiveItem = (target: MenuItem) => {
        this.#item = target;
    }

    getActiveBtn = (e: Event) => {
        const target = e.target as HTMLElement;
        this.#itemBtn.value = target
    }

    getLandingPoint = () => {
        if (!this.#cartBtn.value) return
        const { left, top, width } = this.#cartBtn.value.getBoundingClientRect();

        const targetCoord = {
            x: left + (width / 2) - (48 + 25),
            y: window.scrollY + top,
        }
        return targetCoord
    }

    initFlyState = () => {
        const { x = 0, y = 0 } = this.takeoffPoint.value ?? {}
        gsap.set(this.#flyingEl.value, {
            x: x,
            y: y,
            scale: 1,
            opacity: 1,
        });
        this.imgURL.value = this.#item ? (this.#item.fileName ?? '') : ''
    }

    takeoff = () => {
        if (!this.takeoffPoint.value) return;
        this.isFlying.value = true;
        this.initFlyState();
        const { x: originX = 0, y: originY = 0 } = this.takeoffPoint.value ?? {}
        const { x: targetX = 0, y: targetY = 0 } = this.getLandingPoint() ?? {};

        const inflectX = originX < targetX ? 50 : -50;

        gsap.to(this.#flyingEl.value, {
            duration: .5,
            opacity: 0,
            scale: .3,
            motionPath: {
                path: [
                    { x: originX, y: originY },
                    {
                        x: originX + inflectX,
                        y: originY - 50
                    },
                    { x: targetX, y: targetY }
                ],
                curviness: 1,
            },
            ease: "power1.inOut",
            onComplete: () => {
                this.isFlying.value = false;
            }
        });
    }
}
