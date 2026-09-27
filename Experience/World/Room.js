import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";

// How far the room turns toward the mouse, in radians at the screen edge.
const TILT_Y = 0.1;
const TILT_X = 0.05;
// Idle float: height in world units and speed in radians per millisecond
// (about one bob every five seconds).
const FLOAT_AMPLITUDE = 0.03;
const FLOAT_SPEED = 0.0012;

export default class Room {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.room = this.resources.items.room;
        this.actualRoom = this.room.scene;
        this.roomChildren = {};

        this.lerp = {
            current: 0,
            target: 0,
            ease: 0.1,
        };
        this.lerpX = {
            current: 0,
            target: 0,
            ease: 0.1,
        };
        this.floatOffset = 0;

        this.setModel();
        this.onMouseMove();
    }

    setModel() {
        this.actualRoom.children.forEach((child) => {
            child.castShadow = true;
            child.receiveShadow = true;

            if (child instanceof THREE.Group) {
                child.children.forEach((groupchild) => {
                    groupchild.castShadow = true;
                    groupchild.receiveShadow = true;
                });
            }
            

            if (child.name === "platform") {
                child.position.x = -0.043262;
                child.position.z = 4.11341 ;
                child.position.y = 1.03456;
            }

            child.scale.set(0, 0, 0);

            if (child.name === "Cube") {
                child.position.set(0, 0, 0);
                child.rotation.y = Math.PI / 4;

            }

            this.roomChildren[child.name.toLowerCase()] = child;
        });

        const width = 0.5;
        const height = 0.7;
        const intensity = 1;
        const rectLight = new THREE.RectAreaLight(
            0xffffff,
            intensity,
            width,
            height
        );
        rectLight.position.set(7.68244, 7, 0.5);
        rectLight.rotation.x = -Math.PI / 2;
        rectLight.rotation.z = Math.PI / 4;
        this.actualRoom.add(rectLight);

        this.roomChildren["rectLight"] = rectLight;

        this.scene.add(this.actualRoom);
        this.actualRoom.scale.set(0.24, 0.24, 0.24);
    }

    onMouseMove() {
        let lastTime = 0;
        const throttleTime = 16; // ~60fps
        
        window.addEventListener("mousemove", (e) => {
            const currentTime = Date.now();
            
            if (currentTime - lastTime >= throttleTime) {
                this.rotation = ((e.clientX - window.innerWidth/2)*2)/window.innerWidth;
                this.lerp.target = this.rotation * TILT_Y;
                const vertical = ((e.clientY - window.innerHeight/2)*2)/window.innerHeight;
                this.lerpX.target = vertical * TILT_X;
                lastTime = currentTime;
            }
        }, { passive: true });
    }

    resize() {}

    update() {
        this.lerp.current = GSAP.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease
        );

        this.actualRoom.rotation.y = this.lerp.current;

        this.lerpX.current = GSAP.utils.interpolate(
            this.lerpX.current,
            this.lerpX.target,
            this.lerpX.ease
        );
        this.actualRoom.rotation.x = this.lerpX.current;

        // The scroll animations in Controls.js also move the room, so the
        // float is applied as a change from last frame instead of setting y.
        const float = Math.sin(this.time.elapsed * FLOAT_SPEED) * FLOAT_AMPLITUDE;
        this.actualRoom.position.y += float - this.floatOffset;
        this.floatOffset = float;
    }
}