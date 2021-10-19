const hue2rgb = function(p, q, t){
    if(t < 0) t += 1;
    if(t > 1) t -= 1;
    if(t < 1/6) return p + (q - p) * 6 * t;
    if(t < 1/2) return q;
    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
 const hslToRgb = function(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [r * 255, g * 255, b * 255];
}

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
        const rgb = hslToRgb(hsla.h / 360.0,hsla.s,hsla.l);
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