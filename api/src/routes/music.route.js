import "core-js/stable";
import "regenerator-runtime/runtime";

import { Router } from 'express';
const statik = require('node-static');
import redisClient from "../services/Redis.service";
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
const path = require('path');
const fs = require('fs');

const KEY_PREFIX = 'MUSIC:';

const router = Router();

const fileServer = new statik.Server('music/');

const upload = multer({ dest: "music/"});

router.get('/', async(req, res) => {
    try {
        redisClient.keys(`${KEY_PREFIX}*`, (err, reply) => {
            if (err) throw err;
            if (reply && reply.length) {
                redisClient.mget(reply,(err1, reply1) => {
                    if (err1) throw err1;
                    if (reply1) {
                        res.status(200).json(reply1.map(val => {
                            const data = JSON.parse(val);
                            return data;
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

router.get('/:musicID', async(req, res) => {
    try {
        const musicID = req.params.musicID;
        redisClient.get(`${KEY_PREFIX}${musicID}`, (err, reply) => {
            if (err) throw err;
            if (reply) {
                const data = JSON.parse(reply);
                fileServer.serveFile(data.filename, 200, {}, req, res);
            }else{
                res.status(404).send();
            }
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
});

router.patch('/:musicID', async(req, res) => {
    try {
        const musicID = req.params.musicID;
        const newData = req.body;
        redisClient.get(`${KEY_PREFIX}${musicID}`, (err, reply) => {
            if (err) throw err;
            if (reply) {
                const data = JSON.parse(reply);

                data.title = newData.title;

                redisClient.set(`${KEY_PREFIX}${musicID}`, JSON.stringify(data), (err, reply) => {
                    if (err) throw err;
                    if (reply) {
                        res.status(200).send();
                    }else{
                        res.status(404).send();
                    }
                });

            }else{
                res.status(404).send();
            }
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
});

router.post('/', upload.single("file"), async(req, res) => {
    try {
        const uuid = uuidv4();
        const filename = req.file.filename;
        const title = req.body.title || 'New Music File';
        const format = path.extname(req.file.originalname).split('.').join('').toLowerCase();
        const data = {
            id: uuid,
            filename: filename,
            title: title,
            format: format
        }
        redisClient.set(`${KEY_PREFIX}${uuid}`, JSON.stringify(data), (err, reply) => {
            if (err) throw err;
            if (reply) {
                res.status(201).json(data);
            }else{
                res.status(400).json({message: 'Malformed request'});
            }
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:musicID', async(req, res) => {
    try {
        const musicID = req.params.musicID;
        redisClient.get(`${KEY_PREFIX}${musicID}`, (err, reply) => {
            if (err) throw err;
            if (reply) {
                const data = JSON.parse(reply);

                fs.unlink('music/'+data.filename, err => {
                    if (err) {
                        console.log(err);
                    }
                });

                redisClient.del(`${KEY_PREFIX}${musicID}`, (err, reply) => {
                    if (err) throw err;
                    if (reply > 0) {
                        res.status(200).send();
                    }else{
                        res.status(404).send();
                    }
                });

            }else{
                res.status(404).send();
            }
        })
        
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
});

export default router;