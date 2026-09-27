import Experience from "../Experience.js";

import Room from "./Room.js";
import Floor from "./Floor.js";
import Controls from "./Controls.js";
import Environment from "./Environment.js";
import Neon from "./Neon.js";
import Fans from "./Fans.js";
import Dust from "./Dust.js";
import ScreenShowcase from "./ScreenShowcase.js";
import { EventEmitter } from "events";

export default class World extends EventEmitter{
    constructor() {
        super();
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;
        this.resources = this.experience.resources;

        this.resources.on("ready", () => {
            this.environment = new Environment();
            this.floor = new Floor();
            this.room = new Room();
            this.controls = new Controls();
            this.neon = new Neon();
            this.fans = new Fans();
            this.dust = new Dust();
            this.screenShowcase = new ScreenShowcase();
            
            this.emit("worldready");
        });
    }

    // Called by the preloader once the intro animation finishes.
    onIntroComplete() {
        this.neon.turnOn();
        this.dust.show();
        this.controls.measureFrames();
        this.screenShowcase.enable();
    }

    resize() {
        if (this.dust) {
            this.dust.resize();
        }
    }

    update() {
        if (this.room) {
            this.room.update();
        }
        if (this.controls) {
            this.controls.update();
        }
        if (this.fans) {
            this.fans.update();
        }
        if (this.dust) {
            this.dust.update();
        }
    }
}