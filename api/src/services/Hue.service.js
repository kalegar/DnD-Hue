import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const timers = [];

const startLoop = function(scene) {
    for (const light of scene.lights) {
        const id = uuidv4();
        timers.push(id);
        loop(id, scene, light);
    }
}

const loop = function(id, scene, light) {
    let found = false;
    for (const t of timers) {
        if (t == id) {
            found = true;
            break;
        }
    }
    if (!found) return;
    const baseURL = process.env.HUE_BRIDGE_ADDRESS + 'api/' + process.env.HUE_USER + '/lights';
    const stage = scene.stages[Math.floor(Math.random() * scene.stages.length)];
    const time = (Math.random() * (Number(scene.maxTransitionTime) - Number(scene.transitionTime))) + Number(scene.transitionTime);
    const state = {"on": true, "bri": stage.bri, "sat": stage.sat, "hue": stage.hue, "transitiontime": Math.max(1,Math.floor(time/100))};
    // console.log(`Loop ID: ${id}. Timeout: ${time}`);
    axios.put(`${baseURL}/${light.index}/state`, state);
    setTimeout(loop,time,id, scene,light);
}

const HueService = {

    activateScene: function(scene) {
        return new Promise((resolve, reject) => {
            
            try {
                if ('lights' in scene && Array.isArray(scene.lights) && scene.lights.length) {
                    startLoop(scene);
                    // const stage = scene.stages[Math.floor(Math.random() * scene.stages.length)];
                    // const time = (Math.random() * (Number(scene.maxTransitionTime) - Number(scene.transitionTime))) + Number(scene.transitionTime);
                    // const state = {"on": true, "bri": stage.bri, "sat": stage.sat, "hue": stage.hue, "transitiontime": Math.max(1,Math.floor(time/100))};




                    // return axios.put(`${baseURL}/${light.index}/state`, state);

                    // Promise.all(scene.lights.map((light) => {
                    //     const stage = scene.stages[Math.floor(Math.random() * scene.stages.length)];
                    //     const time = (Math.random() * (Number(scene.maxTransitionTime) - Number(scene.transitionTime))) + Number(scene.transitionTime);
                    //     const state = {"on": true, "bri": stage.bri, "sat": stage.sat, "hue": stage.hue, "transitiontime": Math.max(1,Math.floor(time/100))};
                    //     return axios.put(`${baseURL}/${light.index}/state`, state);
                    // }
                    // )).then((res) => {
                    //     if (res.length && res[0].status == 200) {
                    //         resolve(res[0]);
                    //     }else{
                    //         reject(res[0]);
                    //     }
                    // })
                    // .catch(err => {
                    //     console.log(err);
                    //     reject(err);
                    // })
                }
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    },

    deactivate: function() {
        timers.splice(0, timers.length);
    }
}

export default HueService;