import GSAP from "gsap";
import Experience from "../Experience.js";

// Brightness of the neon while it's "off", as a fraction of full.
const OFF_LEVEL = 0.004;

// The sign's power-on stutter: [seconds after start, brightness].
const SIGN_FLICKER = [
    [0, 1],
    [0.06, OFF_LEVEL],
    [0.16, 1],
    [0.22, 0.25],
    [0.3, 1],
    [0.55, 0.45],
    [0.6, 1],
];

// The BOSUNG sign and the LED strips start dim, then switch on once the
// intro finishes. Every emissive material in the room counts as neon.
//
// Bloom.js reads `material.userData.neonLevel` so the glow follows along.
export default class Neon {
    constructor() {
        this.experience = new Experience();
        const room = this.experience.world.room;
        const sign = room.roomChildren.letters;

        this.sign = [];
        this.strips = [];
        room.actualRoom.traverse((child) => {
            if (!child.isMesh) return;
            const material = child.material;
            const emissive = material.emissive;
            if (!emissive || emissive.getHex() === 0 || material.emissiveIntensity <= 0) {
                return;
            }
            const entry = { material, fullIntensity: material.emissiveIntensity };
            (isInside(child, sign) ? this.sign : this.strips).push(entry);
        });

        this.setLevel(this.sign, OFF_LEVEL);
        this.setLevel(this.strips, OFF_LEVEL);
    }

    setLevel(entries, level) {
        entries.forEach(({ material, fullIntensity }) => {
            material.emissiveIntensity = fullIntensity * level;
            material.userData.neonLevel = level;
        });
    }

    turnOn() {
        const timeline = GSAP.timeline();

        SIGN_FLICKER.forEach(([time, level]) => {
            timeline.call(() => this.setLevel(this.sign, level), null, time);
        });

        // The LED strips fade up smoothly just after the sign catches.
        const strips = { level: OFF_LEVEL };
        timeline.to(
            strips,
            {
                level: 1,
                duration: 0.8,
                ease: "power2.out",
                onUpdate: () => this.setLevel(this.strips, strips.level),
            },
            0.35
        );
    }
}

function isInside(object, ancestor) {
    for (let node = object; node; node = node.parent) {
        if (node === ancestor) return true;
    }
    return false;
}
