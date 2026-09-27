import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import ASScroll from "@ashthornton/asscroll";

// Scroll stops that frame a specific part of the room. `side` is the half of
// the screen the text panel leaves free, and `fill` is how much of that half
// the objects take up.
const FRAMES = {
    works: {
        objects: ["moniter"],
        side: "left",
        fill: 1,
    },
    experience: {
        objects: ["television", "speaker"],
        side: "right",
        fill: 0.9,
    },
};

export default class Controls {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.camera = this.experience.camera;
        this.room = this.experience.world.room.actualRoom;
        this.roomChildren = this.experience.world.room.roomChildren;
        // Measured once the intro has given every object its final size.
        this.frames = null;

        this.circleFirst = this.experience.world.floor.circleFirst;
        this.circleSecond = this.experience.world.floor.circleSecond;
        this.circleLast = this.experience.world.floor.circleLast;

        GSAP.registerPlugin(ScrollTrigger);

        this.setSmoothScroll();
        this.setScrollTrigger();
    }

    setupASScroll() {
        const asscroll = new ASScroll({
            ease: 0.5,
            disableRaf: true,
        });

        GSAP.ticker.add(asscroll.update);

        ScrollTrigger.defaults({
            scroller: asscroll.containerElement,
        });

        ScrollTrigger.scrollerProxy(asscroll.containerElement, {
            scrollTop(value) {
                if (arguments.length) {
                    asscroll.currentPos = value;
                    return;
                }
                return asscroll.currentPos;
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight,
                };
            },
            fixedMarkers: true,
        });

        asscroll.on("update", ScrollTrigger.update);
        ScrollTrigger.addEventListener("refresh", asscroll.resize);

        requestAnimationFrame(() => {
            asscroll.enable({
                newScrollElements: document.querySelectorAll(
                    ".gsap-marker-start, .gsap-marker-end, [asscroll]"
                ),
            });
        });
        return asscroll;
    }

    // Record where each framed group of objects sits inside the room, then
    // recompute the scroll animations to use it.
    measureFrames() {
        this.room.updateMatrixWorld(true);
        const toRoom = this.room.matrixWorld.clone().invert();

        this.frames = {};
        Object.entries(FRAMES).forEach(([name, frame]) => {
            const box = new THREE.Box3();
            frame.objects.forEach((key) => {
                box.union(
                    new THREE.Box3()
                        .setFromObject(this.roomChildren[key])
                        .applyMatrix4(toRoom)
                );
            });
            this.frames[name] = {
                ...frame,
                sphere: box.getBoundingSphere(new THREE.Sphere()),
            };
        });

        ScrollTrigger.refresh();
    }

    // The room position and scale that center a frame's objects in the free
    // half of the screen.
    framing(name) {
        const frame = this.frames[name];
        const camera = this.camera.orthographicCamera;
        const halfWidth = (camera.right - camera.left) / 2;
        const halfHeight = (camera.top - camera.bottom) / 2;

        // The free half of the screen is `halfWidth` wide.
        const scale =
            (Math.min(halfWidth / 2, halfHeight) * frame.fill) / frame.sphere.radius;
        const center = frame.sphere.center;

        const targetX =
            camera.position.x + (frame.side === "left" ? -0.5 : 0.5) * halfWidth;
        // The camera looks down at an angle, so moving the room along z moves
        // it up or down on screen. Pick the z that puts the objects' center
        // at the vertical middle of the screen.
        const targetY = scale * center.y;
        const tilt = -camera.rotation.x;
        const targetZ =
            camera.position.z +
            ((targetY - camera.position.y) * Math.cos(tilt)) / Math.sin(tilt);

        return {
            x: targetX - scale * center.x,
            z: targetZ - scale * center.z,
            scale,
        };
    }

    // Before the intro finishes the room can't be measured yet, so the
    // original fixed values are used until then.
    stop(name, key, fallback) {
        return this.frames ? this.framing(name)[key] : fallback();
    }

    setSmoothScroll(){
        this.asscroll = this.setupASScroll();
    }
    
    setScrollTrigger(){
        ScrollTrigger.matchMedia({
             //Desktop
             "(min-width: 969px)": () => {
                            
                // About Me Anmation 
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.7,
                        invalidateOnRefresh: true,
                    },
                });
                this.firstMoveTimeline.fromTo(
                    this.room.position,
                    { x: 0, y: 0, z: 0 },
                    {
                        x: () => {
                            return this.sizes.width * 0.0017;
                        },
                    }
                );

                // My Works Animation //
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.7,
                        invalidateOnRefresh: true,
                    },
                })
                    .to(
                        this.room.position,
                        {
                            x: () => this.stop("works", "x", () => -1),
                            z: () =>
                                this.stop("works", "z", () => this.sizes.height * 0.012),
                        },
                        "same"
                    )
                    .to(
                        this.room.scale,
                        {
                            x: () => this.stop("works", "scale", () => 0.6),
                            y: () => this.stop("works", "scale", () => 0.6),
                            z: () => this.stop("works", "scale", () => 0.6),
                        },
                        "same"
                    )

                // Tools Animation //
                this.thirdMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                })
                    .to(
                        this.room.position,
                        {
                            x: () => this.stop("experience", "x", () => -0.5),
                            z: () =>
                                this.stop("experience", "z", () => this.sizes.height * 0.015),
                        },
                        "same"
                    )
                    .to(
                        this.room.scale,
                        {
                            x: () => this.stop("experience", "scale", () => 0.9),
                            y: () => this.stop("experience", "scale", () => 0.9),
                            z: () => this.stop("experience", "scale", () => 0.9),
                        },
                        "same"
                    );

                    // Contact Me Animation //
                    this.fourthMoveTimeline = new GSAP.timeline({
                        scrollTrigger: {
                            trigger: ".fourth-move",
                            start: "top top",
                            end: "bottom bottom",
                            scrub: 0.6,
                            invalidateOnRefresh: true,
                        },
                    })
                    .to(
                        this.room.position,
                        {
                            x: () => {
                                return 0.01;
                            },
                            z: () => {
                                return this.sizes.height * (-0.005);
                            },
                        },
                        "same"
                    )
                    .to(
                        this.room.scale,
                        {
                            x: 0.7,
                            y: 0.7,
                            z: 0.7,
                        },
                        "same"
                    );
                    
                // Last Page Animation //
                this.lastMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".last-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.7,
                        invalidateOnRefresh: true,
                         },
                    })
                    
                    .to(
                        this.room.position,
                        { x: 0, y: 0, z: 0 },
                    )
                    .to(
                        this.room.scale,
                        {
                            x: 0.24,
                            y: 0.24,
                            z: 0.24,
                        },
                        "same"
                    );
                    
                    
            },

            // all
            all: () => {
                // circle animation //
                this.firstCircle = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.7,
                    },
                })
                .to(
                    this.circleFirst.scale,
                    {
                        x: 3,
                        y: 3,
                        z: 3,
                    },
                );

                this.secondCircle = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.7,
                    },
                })
                .to(this.circleSecond.scale, {
                    x: 3,
                    y: 3,
                    z: 3,
                });

                this.lastCircle = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".last-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.7,
                    },
                })
                .to(
                    this.circleLast.scale,
                    {
                        x: 3,
                        y: 3,
                        z: 3,
                    },
                );
                
                // mini platform animation //
                this.fourthAnimationTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".fourth-move",
                        start: "bottom 90%",
                    },
                });

                this.room.children.forEach((child) => {
                    if(child.name === "platform") {
                        this.first = GSAP.to(child.position, {
                            x: -3.2613,
                            z: 7.144,
                            duration: 0.3,
                            ease: "back.out(2)",
                        });
                    }
                    if(child.name === "mailbox") {
                        this.second = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            duration: 0.3,
                            ease: "back.out(2)",
                        });
                    }
                    if(child.name === "mari") {
                        this.third = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            duration: 0.3,
                            ease: "back.out(2)",
                        });
                    }
                    if(child.name === "kami") {
                        this.fourth = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            duration: 0.3,
                            ease: "back.out(2)",
                        });
                    }
                });
                this.fourthAnimationTimeline.add(this.first);
                this.fourthAnimationTimeline.add(this.second);
                this.fourthAnimationTimeline.add(this.third);
                this.fourthAnimationTimeline.add(this.fourth, "-=0.2");
            },
        })
    }   

    resize() {}

    update() {}
}
