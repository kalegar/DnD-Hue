import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const baseURL = process.env.HUE_BRIDGE_ADDRESS + 'api/' + process.env.HUE_USER + '/lights';

const HueLight = class {
    index = '';
    scene = null;
    currentStage = 0;
    #timerId = 0;
    constructor(index) {
        this.index = index;
    }

    reset = function() {
        this.scene = null;
        this.currentStage = 0;
    }

    cancel = function() {
        if (this.#timerId !== 0) {
            clearTimeout(this.#timerId);
            this.#timerId = 0;
        }
    }

    restart = function() {
        this.cancel();
        this.currentStage = 0;
        if (this.scene !== null) {
            // console.log('Starting loop for light ' + this.index);
            this.#timerId = setTimeout(this.#mainLoop.bind(this),100,100);
        }
    }

    #mainLoop = function(timeOverride = 0) {
        if (this.scene == null) {
            this.cancel();
            return;
        }
        if (!('mode' in this.scene)) {
            // console.log('Cancelling loop for light ' + this.index + '. No mode defined on scene.');
            this.cancel();
            return;
        }
        const time = timeOverride !== 0 ? timeOverride : (Math.random() * (Number(this.scene.maxTransitionTime) - Number(this.scene.transitionTime))) + Number(this.scene.transitionTime);
        if (this.scene.mode == 0) { //Random
            const stage = this.scene.stages[Math.floor(Math.random() * this.scene.stages.length)];
            const state = {"on": true, "bri": Math.max(1,Math.floor(Number(stage.bri) * HueService.globalBrightness)), "sat": stage.sat, "hue": stage.hue, "transitiontime": Math.max(1,Math.floor(time/100))};
            // console.log(`Push Index ${this.index} : ${time / 1000.0}s`);
            axios.put(`${baseURL}/${this.index}/state`, state);
        }else if (this.scene.mode == 1) { //Sequential
            const stage = this.scene.stages[this.currentStage];
            this.currentStage ++;
            if (this.currentStage > this.scene.stages.length) this.currentStage = 0;
            const state = {"on": true, "bri": Math.max(1,Math.floor(Number(stage.bri) * HueService.globalBrightness)), "sat": stage.sat, "hue": stage.hue, "transitiontime": Math.max(1,Math.floor(time/100))};
            // console.log(`Push Index ${this.index} : ${time / 1000.0}s`);
            axios.put(`${baseURL}/${this.index}/state`, state);
        }
        this.#timerId = setTimeout(this.#mainLoop.bind(this),time);
    }
}

const HueService = class {
    #lights = [];
    #activeScenes = [];

    constructor() {
        this.#init();
    }

    static globalBrightness = 1.0;

    static set globalBrightness(val) {
        HueService.globalBrightness = Math.max(Math.min(1.0,Number(val)),0.0);
    }

    #getLights = function() {
        const url = baseURL;
        // console.log('HueService.#getLights() URL: ' + url);
        return new Promise((resolve, reject) => {
            axios.get(url).then(res => {
                if (res.data) {
                    let array = [];
                    for (const key in res.data) {
                        const light = new HueLight(String(key));
                        array.push(light);
                    }
                    resolve(array);
                    return;
                }
                reject('No Data');
            }, rej => {console.log('HueService.#getLights() Error',rej); reject(rej)});
        });
    }

    #updateActiveScenes() {
        const scenes = [];
        this.#activeScenes = [];
        for (const light of this.#lights) {
            if (light.scene == null) continue;
            if (!scenes.includes(light.scene.id)) {
                scenes.push(light.scene.id);
                this.#activeScenes.push(light.scene);
            }
        }
    }

    #lightHasAnotherActiveScene(light) {
        const currentSceneId = light.scene !== null ? light.scene.id : '';
        for (const scene of this.#activeScenes) {
            if (scene.id !== light.scene.id && scene.lights.reduce((prev, curr) =>  prev || String(curr.index) == String(light.index),false)) 
                return scene;
        }
        return null;
    }

    activateScene(scene) {
        return new Promise((resolve, reject) => {
            
            try {
                if (!('lights' in scene && Array.isArray(scene.lights) && scene.lights.length)) {
                    // console.log('Scene has no lights. Ignoring activation.');
                    resolve();
                    return;
                }
                const sceneLightIndexes = scene.lights.map(val => String(val.index));
                for (const light of this.#lights) {
                    if (sceneLightIndexes.includes(light.index)) {
                        if ((light.scene == null) || (light.scene.priority <= scene.priority)) {
                            light.scene = scene;
                            light.restart();
                        }
                    }
                }
                this.#updateActiveScenes();
                resolve(this.#activeScenes.map(sce => sce.id));
            } catch (err) {
                reject(err);
            }
        });
    }

    deactivate(scene) {
        return new Promise((resolve, reject) => {
            try {
                for (const light of this.#lights) {
                    if (light.scene !== null && light.scene.id == scene.id) {
                        light.cancel();
                        const otherScene = this.#lightHasAnotherActiveScene(light);
                        if (otherScene !== null) {
                            light.scene = otherScene;
                            console.log(`Light ${light.index} had another active scene. Switching...`);
                            light.restart();
                            
                        }else{
                            light.reset();
                        }
                    }
                }
                this.#updateActiveScenes();
                resolve(this.#activeScenes.map(sce => sce.id));
            } catch (err) {
                reject(err);
            }
        });
    }

    isSceneActive(id) {
        for (const scene of this.#activeScenes) {
            if (scene.id == id) return true;
        }
        return false;
    }

    #init() {
        // console.log('HueService.#init()');
        this.#getLights().then(res => {this.#lights = res; }, rej => console.log(rej));
    }
}

const service = new HueService();

export default service;