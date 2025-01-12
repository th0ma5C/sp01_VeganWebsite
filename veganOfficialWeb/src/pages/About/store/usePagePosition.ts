import { reactive } from "vue";

type AnchorTarget = 'upper' | 'middle' | 'bottom';

export const positionStore = reactive({
    upperAnchor: 0,
    middleAnchor: 0,
    bottomAnchor: 0,
    setPosition(target: AnchorTarget, position: number) {
        switch (target) {
            case 'upper':
                this.upperAnchor = position;
                break;
            case 'middle':
                this.middleAnchor = position;
                break;
            default:
                this.bottomAnchor = position;
                break;
        }
    },
    getPosition() {
        return {
            upper: this.upperAnchor,
            middle: this.middleAnchor,
            bottom: this.bottomAnchor,
        }
    }
})