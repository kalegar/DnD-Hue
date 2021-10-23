import "core-js/stable";
import "regenerator-runtime/runtime";

import { Router } from 'express';

import HueService from "../services/Hue.service";

const router = Router();

router.get('/brightness', async(req, res) => {
    res.status(200).json({ brightness: HueService.constructor.globalBrightness });
});

router.post('/brightness', async(req, res) => {
    try {
        const obj = req.body;
        if (obj !== null && 'brightness' in obj) {
            HueService.globalBrightness = obj.brightness;
            res.status(200).json({ brightness: HueService.constructor.globalBrightness });
            return;
        }
        res.status(400).send();
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
});

export default router;