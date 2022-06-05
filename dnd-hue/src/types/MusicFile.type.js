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
    soundId = null;
    format = 'mp3';
    #loaded = false;
    constructor() {
        this.id = null;
        this.title = '';
        this.filename = '';
        this.data = null;
        this.sound = null;
        this.soundId = null;
        this.format = 'mp3';
        this.loop = false;
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
                onloaderror: onLoadError,
                onplayerror: onPlayError,
                onload: () => {this.#loaded = true},
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
            return 0;
        }else{
            return this.sound.volume();
        }
    }

    set volume(vol) {
        this.#requiresSound();
        if (this.sound == null) {
            return;
        }
        this.sound.volume(vol);
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
        if (this.soundId == null) {
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
        if (this.soundId == null) {
            return false;
        }
        return this.sound.playing(this.soundId);
    }

    play() {
        this.#requiresSound();
        if (this.soundId !== null) {
            this.sound.stop(this.soundId);
        }
        this.soundId = this.sound.play();
        return this.soundId;
    }

    toggle() {
        if (this.sound == null) {
            this.play();
            return;
        }
        if (this.soundId == null) {
            return;
        }
        if (this.sound.playing(this.soundId)) {
            this.sound.pause(this.soundId);
        } else {
            this.sound.play(this.soundId)
        }
        
    }


    static from(json) {
        const musicFile = Object.assign(new MusicFile(), json);
        musicFile.format = musicFile.format.split('.').join('').toLowerCase();
        return musicFile;
    }
}

export default MusicFile;