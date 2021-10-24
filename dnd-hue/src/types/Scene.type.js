import Stage from "./Stage.type";
import Utils from '../util/Utils';

const MinTransitionTime = 100;
const MaxTransitionTime = 120000; // 2 minutes (Hue max is much much higher, but this seems good.)

const Scene = class {
    id = null;
    name = '';
    lights = [];
    stages = [];
    transitionTime = MinTransitionTime + 1000;
    maxTransitionTime = MaxTransitionTime - 1000;
    priority = 1;
    mode = 0;
    looping = true;
    active = false;
    constructor() {
        this.id = null,
        this.name = '',
        this.lights = [],
        this.stages = [],
        this.transitionTime = MinTransitionTime + 1000;
        this.maxTransitionTime = MaxTransitionTime - 1000;
        this.priority = 1;
        this.mode = 0;
        this.looping = true;
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

    get averageColorCSS() {
        if (this.stages && this.stages.length) {
            let hsl = this.stages.reduce((prev, curr) => { return { hue: prev.hue + curr.hue, sat: prev.sat + curr.sat, bri: prev.bri + curr.bri } });
            hsl.hue = hsl.hue / this.stages.length / 65535;
            hsl.sat = hsl.sat / this.stages.length / 254;
            hsl.bri = hsl.bri / this.stages.length / 254;
            const rgb = Utils.hslToRgb(hsl.hue,hsl.sat,hsl.bri);
            return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.5)`;
        }
        return `rgba(255,255,255,1)`;
    }

    clone() {
        let scene = new Scene();
        scene.id = this.id;
        scene.name = this.name;
        scene.lights = [...this.lights];
        scene.stages = this.stages.map(a => {return Object.assign(new Stage(), {...a})}); // Deep clone stages.
        scene.transitionTime = this.transitionTime;
        scene.maxTransitionTime = this.maxTransitionTime;
        scene.priority = this.priority;
        scene.mode = this.mode;
        scene.active = this.active;
        scene.looping = this.looping;
        return scene;
    }

    static from(json) {
        return Object.assign(new Scene(), json);
    }

}

export default Scene;