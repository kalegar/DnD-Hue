import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const HueService = class {
    #timers = [];

    #globalBrightness = 1.0;

    set globalBrightness(val) {
        this.#globalBrightness = Math.max(Math.min(1.0,Number(val)),0.0);
    }

    get globalBrightness() {
        return this.#globalBrightness;
    }

    #loop = function(id, scene, light) {
        let found = false;
        for (const t of this.#timers) {
            if (t == id) {
                found = true;
                break;
            }
        }
        if (!found) return;
        const baseURL = process.env.HUE_BRIDGE_ADDRESS + 'api/' + process.env.HUE_USER + '/lights';
        const stage = scene.stages[Math.floor(Math.random() * scene.stages.length)];
        const time = (Math.random() * (Number(scene.maxTransitionTime) - Number(scene.transitionTime))) + Number(scene.transitionTime);
        const state = {"on": true, "bri": Math.max(1,Math.floor(Number(stage.bri) * this.globalBrightness)), "sat": stage.sat, "hue": stage.hue, "transitiontime": Math.max(1,Math.floor(time/100))};
        console.log(state);
        // console.log(`Loop ID: ${id}. Timeout: ${time}`);
        axios.put(`${baseURL}/${light.index}/state`, state);
        setTimeout(this.#loop.bind(this),time,id, scene,light);
    }

    #startLoop = function(scene) {
        console.log('starting loop');
        for (const light of scene.lights) {
            const id = uuidv4();
            this.#timers.push(id);
            this.#loop(id, scene, light);
        }
    }

    activateScene(scene) {
        return new Promise((resolve, reject) => {
            
            try {
                if ('lights' in scene && Array.isArray(scene.lights) && scene.lights.length) {
                    this.#startLoop(scene);
                }
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    deactivate() {
        this.#timers.splice(0, this.#timers.length);
    }
}

const service = new HueService();

export default service;