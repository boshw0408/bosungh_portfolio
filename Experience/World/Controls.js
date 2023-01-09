import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import ASScroll from "@ashthornton/asscroll";

export default class Controls {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.camera = this.experience.camera;
        this.room = this.experience.world.room.actualRoom;

        this.circleFirst = this.experience.world.floor.circleFirst;
        this.circleSecond = this.experience.world.floor.circleSecond;
        this.circleLast = this.experience.world.floor.circleLast;

        GSAP.registerPlugin(ScrollTrigger);

        this.setSmoothScroll();
        this.setScrollTrigger();
        // this.room.children.forEach((child) => {
        //     if (child.type === "RectAreaLight") {
        //         this.rectLight = child;
        //     }
        // });
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
                            x: () => {
                                return -1;
                            },
                            z: () => {
                                return this.sizes.height * 0.012;
                            },
                        },
                        "same"
                    )
                    .to(
                        this.room.scale,
                        {
                            x: 0.6,
                            y: 0.6,
                            z: 0.6,
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
                            x: () => {
                                return -0.5;
                            },
                            z: () => {
                                return this.sizes.height * 0.015;
                            },
                        },
                        "same"
                    )
                    .to(
                        this.room.scale,
                        {
                            x: 0.9,
                            y: 0.9,
                            z: 0.9,
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
            
            // Mobile
            "(max-width: 968px)": () => {
                console.log("fired mobile");
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
