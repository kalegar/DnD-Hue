
import Utils from '../util/Utils';

const Stage = class {
    name = '';
    hue = 0;
    sat = 0;
    bri = 1;
    #maxBrightness = 254;
    #maxHue = 65535;
    #maxSaturation = 254;
    #minBrightness = 1;
    #minHue = 0;
    #minSaturation = 0;

    constructor() {
        this.name = 'New Stage';
        this.hue = this.#minHue;
        this.sat = this.#minSaturation;
        this.bri = this.#minBrightness;
    }

    setColor(color) {
        this.hue = Math.floor((color.hsla.h / 360.0) * this.#maxHue);
        this.sat = Math.floor(color.hsla.s * this.#maxSaturation);
        this.bri = Math.floor(color.hsla.l * this.#maxBrightness);
    }

    getHSLA() {
        return {
            h: this.hue / this.#maxHue * 360.0,
            s: this.sat / this.#maxSaturation,
            l: this.bri / this.#maxBrightness,
            a: 1.0
        }
    }

    getRGBAString() {
        const hsla = this.getHSLA();
        const rgb = Utils.hslToRgb(hsla.h / 360.0,hsla.s,hsla.l);
        return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${hsla.a})`;
    }

    set hue(hue) {
        this.hue = Math.abs(hue) % (this.#maxHue+1);
    }

    set bri(bri) {
        this.bri = Math.min(Math.max(bri,this.#minBrightness),this.#maxBrightness);
    }

    set sat(sat) {
        this.sat = Math.min(Math.max(sat,this.#minSaturation),this.#maxSaturation);
    }

    get hue() {
        return this.hue;
    }

    get bri() {
        return this.bri;
    }

    get sat() {
        return this.sat;
    }

    clone() {
        let stage = new Stage();
        stage.name = this.name;
        stage.hue = this.hue;
        stage.sat = this.sat;
        stage.bri = this.bri;
        return stage;
    }

    static from(json) {
        return Object.assign(new Stage(), json);
    }
}

export default Stage;