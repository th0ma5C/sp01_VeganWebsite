import { reactive } from "vue";

type AnchorTarget = 'CONCEPT' | 'ACCESS' | 'FAQ';
type ELementGetter = () => number;

export const positionStore = reactive({
    elFnMap: {} as Record<AnchorTarget, ELementGetter | null>,
    setFn(target: AnchorTarget, fn: ELementGetter) {
        this.elFnMap[target] = fn
    },
    getElPosition(target: AnchorTarget) {
        const getter = this.elFnMap[target];
        return getter ? getter() : null
    },
    exposeElCoord(target: AnchorTarget, el: HTMLDivElement | null) {
        if (!el) return
        this.setFn(target, () => {
            return el.getBoundingClientRect().top
        })
    }
})