import http from 'http';
import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

import scenesRoute from './routes/scenes.route';
import globalRoute from './routes/global.route';
import musicRoute from './routes/music.route';

const env = process.env.NODE_ENV || 'development';
console.log('environment: ' + env);
const baseURL = env === 'development' ? '../../' : '../';

console.log('Hue Address: ' + (process.env.HUE_BRIDGE_ADDRESS || 'Not Set'));
console.log('Hue User: ' + (process.env.HUE_USER !== null ? 'Set' : 'Unset') );
console.log('Redis Address: ' + process.env.REDIS_ADDRESS);

const app = express();

const server = http.createServer(app);

app.use(cors());

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use(express.static(path.join(__dirname, `${baseURL}dnd-hue/dist`)));

app.use('/api/scenes',scenesRoute);
app.use('/api/global',globalRoute);
app.use('/api/music',musicRoute);

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, `${baseURL}dnd-hue/dist/index.html`));
 });

 app.get('/api', (req, res) => {
     res.status(200).json({message: 'Welcome to the DnD-Hue API'});
 })

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Server is running on PORT ${port}`));