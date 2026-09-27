import * as THREE from "three";
import { EventEmitter } from "events";
import Experience from "./Experience.js";
import GSAP from "gsap";
import convert from "./Utils/convertDivsToSpan.js";

// Room objects that pop in one after another during the intro:
// [roomChildren key, final scale, timeline position]
const ROOM_OBJECTS = [
    ["speaker", 0.77, ">-0.3"],
    ["video", 1.27, ">-0.2"],
    ["letters", 1, ">-0.3"],
    ["table", 1, ">-0.3"],
    ["floor", 1, ">-0.3"],
    ["moniter", 1, ">-0.3"],
    ["computer", 1, ">-0.3"],
    ["mousepad", 1, ">-0.3"],
    ["coke", 1, ">-0.3"],
    ["pizza", 1, ">-0.3"],
    ["plate", 1, ">-0.3"],
    ["pizzaslice", 1, ">-0.3"],
    ["gamecontroller1", 1, ">-0.3"],
    ["gamecontroller2", 1, ">-0.35"],
    ["gamecontroller3", 1, ">-0.4"],
    ["gamecontroller4", 1, ">-0.45"],
    ["keyboard", 1, ">-0.7"],
    ["mouse", 1, ">-0.6"],
];

const POP_IN = { ease: "back.out(2.2)", duration: 0.5 };

export default class Preloader extends EventEmitter {
    constructor() {
        super();
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.resources = this.experience.resources;
        this.camera = this.experience.camera;
        this.world = this.experience.world;

        this.world.on("worldready", () => {
            this.setAssets();
            this.playIntro();
        });
    }

    setAssets() {
        convert(document.querySelector(".intro-text"));
        convert(document.querySelector(".hero-main-title"));
        convert(document.querySelector(".hero-main-description"));

        this.room = this.experience.world.room.actualRoom;
        this.roomChildren = this.experience.world.room.roomChildren;
    }

    playIntroAnimation() {
        return new Promise((resolve) => {
            this.timeline = new GSAP.timeline();
            this.timeline
                .to(".preloader", {
                    delay: 0.2,
                    scale: 0,
                    onComplete: () => {
                        document.querySelector(".preloader").classList.add("hidden");
                    },
                })
                .to(this.roomChildren.cube.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    ease: "back.out(2.5)",
                    duration: 0.7,
                })
                .to(this.roomChildren.cube.position, {
                    x: -6.5,
                    ease: "power1.out",
                    duration: 0.8,
                })

                // intro-text animation //
                .to(".intro-text .animatedis", {
                    yPercent: -100,
                    stagger: 0.05,
                    ease: "back.out(1.7)",
                })
                .to(
                    ".intro-text .animatedis",
                    {
                        yPercent: 100,
                        stagger: 0.05,
                        ease: "back.in(1.7)",
                    },
                    "fadeout"
                )

                // cube animation //
                .to(
                    this.roomChildren.cube.rotation,
                    {
                        y: 2 * Math.PI + Math.PI / 4,
                    },
                    "same"
                )
                .to(
                    this.roomChildren.cube.scale,
                    {
                        x: 6.3,
                        y: 6.3,
                        z: 6.3,
                    },
                    "same"
                )
                .to(
                    this.camera.orthographicCamera.position,
                    {
                        y: 6,
                    },
                    "same"
                )
                .to(
                    this.roomChildren.cube.position,
                    {
                        x: 0.677251,
                        y: 5.27073,
                        z: 0.247747,
                    },
                    "same"
                )
                .set(this.roomChildren.room.scale, { x: 1, y: 1, z: 1 }, "room+platform")
                .set(this.roomChildren.platform.scale, { x: 1, y: 1, z: 1 }, "room+platform")
                .to(
                    this.roomChildren.cube.scale,
                    {
                        x: 0,
                        y: 0,
                        z: 0,
                        duration: 0.4,
                    },
                    "introtext"
                )

                // room objects //
                .to(this.roomChildren.television.scale, {
                    x: 1.27,
                    y: 1.27,
                    z: 1.27,
                });

            ROOM_OBJECTS.forEach(([name, scale, position]) => {
                this.timeline.to(
                    this.roomChildren[name].scale,
                    { x: scale, y: scale, z: scale, ...POP_IN },
                    position
                );
            });

            // chair spins in //
            ["chairbottom", "chair"].forEach((name) => {
                this.timeline
                    .to(this.roomChildren[name].scale, { x: 1, y: 1, z: 1, ...POP_IN }, "chair")
                    .to(
                        this.roomChildren[name].rotation,
                        {
                            z: -2 * Math.PI,
                            ease: "power2.out",
                            duration: 1,
                        },
                        "chair"
                    );
            });

            this.timeline
                .to(
                    ".hero-main-title .animatedis",
                    {
                        yPercent: -100,
                        stagger: 0.05,
                        ease: "back.out(1.7)",
                    },
                    ">-0.8"
                )
                .to(
                    ".hero-main-description .animatedis",
                    {
                        yPercent: -100,
                        stagger: 0.05,
                        ease: "back.out(1.7)",
                    },
                    ">-0.8"
                )
                .to(".arrow-svg-wrapper", {
                    opacity: 1,
                    onComplete: resolve,
                });
        });
    }

    addVideo() {
        this.roomChildren.video.material = new THREE.MeshBasicMaterial({
            map: this.resources.items.screen,
        });
    }

    async playIntro() {
        await this.playIntroAnimation();
        this.addVideo();
        this.world.onIntroComplete();
    }
}
