import "core-js/stable";
import "regenerator-runtime/runtime";

import { Router } from 'express';

import redisClient from "../services/Redis.service";
import { v4 as uuidv4 } from 'uuid';

import HueService from "../services/Hue.service";

const KEY_PREFIX = 'SCENE:';

const router = Router();

router.get('/', async (req, res) => {
    try {
        if ('active' in req.query) {
            res.status(200).json(HueService.getActiveScenes());
            return;
        }
        redisClient.keys(`${KEY_PREFIX}*`, (err, reply) => {
            if (err) throw err;
            if (reply && reply.length) {
                redisClient.mget(reply,(err1, reply1) => {
                    if (err1) throw err1;
                    if (reply1) {
                        res.status(200).json(reply1.map(val => {
                            const scene = JSON.parse(val);
                            scene.active = HueService.isSceneActive(scene.id);
                            return scene;
                        }));
                    }
                })
            } else {
                res.status(200).json([]);
                return;
            }
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message});
    }
});

router.get("/:id", async(req, res) => {
    try {
        redisClient.get(`${KEY_PREFIX}${req.params.id}`, (err, reply) => {
            if (err) throw err;
            if (reply) {
                const scene = JSON.parse(reply);
                scene.active = HueService.isSceneActive(req.params.id);
                res.status(200).json(scene);
            }else{
                res.status(404).send();
            }
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
})

router.post('/', async(req, res) => {
    try {
        const uuid = uuidv4();
        const scene = req.body;
        scene.id = uuid;
        redisClient.set(`${KEY_PREFIX}${uuid}`, JSON.stringify(scene), (err, reply) => {
            if (err) throw err;
            if (reply) {
                res.status(201).json(scene);
            }else{
                res.status(400).json({message: 'Malformed request'});
            }
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
});

router.post('/:id', async(req, res) => {
    try {
        const uuid = req.params.id;
        redisClient.get(`${KEY_PREFIX}${uuid}`, (err, reply) => {
            if (err) throw err;
            if (reply) {
                const oldScene = JSON.parse(reply);
                const newScene = req.body;
                newScene.id = uuid;

                redisClient.set(`${KEY_PREFIX}${uuid}`, JSON.stringify(newScene), (err1, reply1) => {
                    if (err1) throw err1;
                    if (reply1) {
                        res.status(201).json(newScene);
                    }else{
                        res.status(400).json({message: 'Malformed request'});
                    }
                })
            }else{
                res.status(404).send();
            }
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id', async(req, res) => {
    try {
        redisClient.del(`${KEY_PREFIX}${req.params.id}`, (err, reply) => {
            if (err) throw err;
            if (reply > 0) {
                res.status(200).send();
            }else{
                res.status(404).send();
            }
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
});

router.post('/:id/activate', async(req, res) => {
    try {
        redisClient.get(`${KEY_PREFIX}${req.params.id}`, (err, reply) => {
            if (err) throw err;
            if (reply) {
                
                const scene = JSON.parse(reply);
                scene.active = true;

                redisClient.set(`${KEY_PREFIX}${req.params.id}`, JSON.stringify(scene), (err1) => {
                    if (err1) throw err1;
                })

                HueService.activateScene(scene).then(success => {
                    res.status(200).json(success);
                }, failure => { if (failure) throw failure;});
            }else{
                res.status(404).send();
            }
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
});

router.post('/:id/deactivate', async(req, res) => {
    try {
        redisClient.get(`${KEY_PREFIX}${req.params.id}`, (err, reply) => {
            if (err) throw err;
            if (reply) {
                const scene = JSON.parse(reply);
                scene.active = false;

                redisClient.set(`${KEY_PREFIX}${req.params.id}`, JSON.stringify(scene), (err1) => {
                    if (err1) throw err1;
                })

                HueService.deactivate(scene).then(success => {
                    res.status(200).json(success);
                }, failure => { if (failure) throw failure;});
            }else{
                res.status(404).send();
            }
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
})




export default router;