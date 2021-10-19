import Stage from "./Stage.type";

const MinTransitionTime = 100;
const MaxTransitionTime = 120000; // 2 minutes (Hue max is much much higher, but this seems good.)

const Scene = class {
    id = null;
    name = '';
    lights = [];
    stages = [];
    transitionTime = MinTransitionTime + 1000;
    maxTransitionTime = MaxTransitionTime - 1000;
    constructor() {
        this.id = null,
        this.name = '',
        this.lights = [],
        this.stages = [],
        this.transitionTime = MinTransitionTime + 1000;
        this.maxTransitionTime = MaxTransitionTime - 1000;
    }

    set transitionTime(transitionTime) {
        this.transitionTime = Math.min(Math.max(MinTransitionTime,Math.abs(Number(transitionTime))),MaxTransitionTime); 
    }

    set transitionRange(arr) {
        if (arr !== null && Array.isArray(arr) && arr.length > 1) {
            this.transitionTime = arr[0] * 1000;
            this.maxTransitionTime = arr[1] * 1000;
        }
    }

    get transitionRange() {
        return [this.transitionTime / 1000, this.maxTransitionTime / 1000];
    }

    clone() {
        let scene = new Scene();
        scene.id = this.id;
        scene.name = this.name;
        scene.lights = [...this.lights];
        scene.stages = this.stages.map(a => {return Object.assign(new Stage(), {...a})}); // Deep clone stages.
        scene.transitionTime = this.transitionTime;
        scene.maxTransitionTime = this.maxTransitionTime;
        return scene;
    }

    static from(json) {
        return Object.assign(new Scene(), json);
    }

}

export default Scene;