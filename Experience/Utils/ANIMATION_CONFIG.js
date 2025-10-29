// Centralized animation configuration constants

export const INTRO_ANIMATION = {
    DELAY: 0.2,
    EASE: {
        BOUNCE: "back.out(2.5)",
        CUBE_ROTATION: "power1.out",
        TEXT_ENTRY: "back.out(1.7)",
        TEXT_EXIT: "back.in(1.7)",
        OBJECT_APPEAR: "back.out(2.2)",
        CHAIR_ROTATION: "power2.out"
    },
    DURATION: {
        PRELOADER_HIDE: 0.2,
        CUBE_SCALE: 0.7,
        CUBE_POSITION: 0.8,
        TEXT_STAGGER: 0.05,
        CUBE_ROTATION: 0.4,
        OBJECT_APPEAR: 0.5,
        CHAIR_ROTATION: 1
    },
    SCALE: {
        CUBE_INITIAL: 1,
        CUBE_EXPANDED: 6.3,
        CUBE_DISAPPEAR: 0,
        ROOM_INITIAL: 0,
        ROOM_FINAL: 1,
        PLATFORM_INITIAL: 0,
        PLATFORM_FINAL: 1
    },
    POSITION: {
        CUBE_START_X: -6.5,
        CUBE_FINAL_X: 0.677251,
        CUBE_FINAL_Y: 5.27073,
        CUBE_FINAL_Z: 0.247747
    },
    CAMERA: {
        FINAL_Y: 6
    }
};

export const SCROLL_ANIMATION = {
    SCRUB: {
        DESKTOP: 0.7,
        DESKTOP_FAST: 0.6
    },
    TRIGGER: {
        START: "top top",
        END: "bottom bottom"
    }
};

export const ROOM_CONFIG = {
    SCALE: {
        INITIAL: 0.24,
        SECTION_2: 0.6,
        SECTION_3: 0.9,
        SECTION_4: 0.7
    },
    POSITION: {
        SECTION_1: { x: 0.0017 },
        SECTION_2: { x: -1, z: 0.012 },
        SECTION_3: { x: -0.5, z: 0.015 },
        SECTION_4: { x: 0.01, z: -0.005 },
        FINAL: { x: 0, y: 0, z: 0 }
    }
};

export const CIRCLE_ANIMATION = {
    FINAL_SCALE: 3
};

