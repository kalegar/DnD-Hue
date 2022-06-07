import {Howl} from 'howler';

const BASE_API_URL = '/api/music';

const onLoadError = function(id, err) {
    console.log(id, err);
}

const onPlayError = function(id, err) {
    console.log(id, err);
}

const MusicFile = class {
    id = null;
    title = '';
    filename = '';
    data = null;
    sound = null;
    format = 'mp3';
    #loaded = false;
    #internalVolume = 1.0;
    afterLoad = null;
    constructor() {
        this.id = null;
        this.title = '';
        this.filename = '';
        this.data = null;
        this.sound = null;
        this.format = 'mp3';
        this.afterLoad = null;
    }

    #requiresSound() {
        if (this.id == null) {
            return;
        }
        if (this.sound == null) {
            this.#loaded = false;
            this.sound = new Howl({
                src: [`${BASE_API_URL}/${this.id}` ],
                format: [this.format],
                volume: this.#internalVolume,
                html5: true, // Requires fix in API's node-static Server.finish method: 
                /*
                if (status !== 200 || req.method !== 'GET') {
                    if (!res._header) { // FIX "Can't set headers after they are sent." error.
                        res.writeHead(status, headers);
                    }
                    res.end();
                }
                */
                onloaderror: onLoadError,
                onplayerror: onPlayError,
                onload: () => {this.#loaded = true; if (this.afterLoad !== null) {this.afterLoad()}},
            });
            console.log('Created sound for ' + this.title);
        }
        return this.sound;
    }

    set loop(lp) {
        this.#requiresSound();
        if (this.sound == null) {
            return;
        }
        this.sound.loop(lp);
    }

    get loop() {
        if (this.sound == null) {
            return false;
        }else{
            return this.sound.loop();
        }
    }

    get volume() {
        if (this.sound == null) {
            return this.#internalVolume;
        }else{
            return this.sound.volume();
        }
    }

    set volume(vol) {
        this.#internalVolume = vol;
        if (this.sound == null) {
            return;
        }else{
            this.sound.volume(vol);
        }
    }

    get loaded() {
        if (this.sound == null) {
            return false;
        }else{
            return this.#loaded;
        }
    }

    get trackPosition() {
        if (this.sound == null) {
            return 0;
        }
        if (this.sound.duration() == 0) {
            return 0;
        }
        let val = (this.sound.seek() / this.sound.duration()) * 100.0;
        return val;
    }

    get playing() {
        if (this.sound == null) {
            return false;
        }
        return this.sound.playing();
    }

    play() {
        this.#requiresSound();
        if (this.sound.playing()) {
            return;
        }
        this.sound.play();
    }

    stop() {
        if (this.sound == null) {
            return;
        }
        this.sound.stop();
    }

    toggle() {
        if (this.sound == null) {
            this.play();
            return;
        }
        if (this.sound.playing()) {
            this.sound.pause();
        } else {
            this.sound.play();
        }
        
    }

    seek(pos) {
        if (this.sound == null) {
            return;
        }
        let val = Math.max(0.0,Math.min(pos,1.0));
        this.sound.seek(this.sound.duration() * val);
    }


    static from(json) {
        const musicFile = Object.assign(new MusicFile(), json);
        musicFile.format = musicFile.format.split('.').join('').toLowerCase();
        return musicFile;
    }
}

export default MusicFile;