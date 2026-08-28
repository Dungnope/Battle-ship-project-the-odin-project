import fireSound from "../assets/audio/fire_sound.ogg";
import explosiveSound from "../assets/audio/explosive.ogg";
import waterSplashSound from "../assets/audio/water_splash.ogg";
import backgroundMusic from "../assets/audio/Classic_easter.ogg";
export class AudioManager {
    constructor(){
        this.sounds = {};
    }

    load(name, path){
        return new Promise((resolve) => {
            const audio = new Audio(path);
            this.sounds[name] = {audio, loaded: false};

            //runs when the audio file has finished loading and is ready play
            audio.onloadeddata = () => {
                this.sounds[name].loaded = true;
                console.log(`audio loaded test: ${name}`);
                resolve();
            };

            audio.onerror = () => {
                console.log(`Audio failed: ${name} (will skip)`);
                resolve();
            };
        });
    }

    play(name){
        const sound = this.sounds[name];
        if(sound && sound.loaded){
            sound.audio.currentTime = 0;
            sound.audio.play().catch(err => {
                console.log(`cound not play ${name}`, err);
            });
        }
    }

    async loadAll(){
        await Promise.all([
            this.load("fireSound", fireSound),
            this.load("explosiveSound", explosiveSound),
            this.load("waterSplashSound", waterSplashSound),
            this.load("backgroundMusic", backgroundMusic)
        ]);
    }
}

export function backgroundSFX(){
    setTimeout(() => {
        const bodyProgram = document.querySelector("body");
        const backgroundAudio = document.createElement("audio");
        backgroundAudio.src = backgroundMusic;
        backgroundAudio.classList.add("backgroundSFX");
        bodyProgram.append(backgroundAudio);
        backgroundAudio.loop = true;
        backgroundAudio.play();
    }, 1000);
}
