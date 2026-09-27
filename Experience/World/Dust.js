import * as THREE from "three";
import GSAP from "gsap";
import Experience from "../Experience.js";

const PARTICLE_COUNT = 70;
// Point size in CSS pixels.
const PARTICLE_SIZE = 3;
const PARTICLE_COLOR = "#e6e0ff";
// Rise speed and side-to-side drift, as fractions of the TV's height.
const RISE_SPEED = 0.04;
const SWAY = 0.015;
// The room's resting scale; particles grow when the room zooms in.
const RESTING_ROOM_SCALE = 0.24;

// Dust motes drifting up through the light in front of the TV. They fade in
// once the intro finishes. All motion happens in the shader, so the only
// per-frame work is updating a few uniforms.
export default class Dust {
    constructor() {
        this.experience = new Experience();
        this.time = this.experience.time;
        this.sizes = this.experience.sizes;
        this.room = this.experience.world.room;
        this.points = null;
    }

    // The TV only has its final size after the intro, so the dust volume
    // is measured then.
    show() {
        if (this.points) return;

        const region = this.measureRegion();
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        const seeds = new Float32Array(PARTICLE_COUNT);
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const inward = THREE.MathUtils.lerp(0.1, 0.7, Math.random()) * region.depth;
            const across = (Math.random() - 0.5) * region.width;
            const point = region.origin
                .clone()
                .addScaledVector(region.inward, inward)
                .addScaledVector(region.across, across);
            positions[i * 3] = point.x;
            positions[i * 3 + 1] = region.bottom + Math.random() * region.height;
            positions[i * 3 + 2] = point.z;
            seeds[i] = Math.random();
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uOpacity: { value: 0 },
                uSize: { value: PARTICLE_SIZE * this.sizes.pixelRatio },
                uZoom: { value: 1 },
                uColor: { value: new THREE.Color(PARTICLE_COLOR) },
                uBottom: { value: region.bottom },
                uHeight: { value: region.height },
                uRise: { value: RISE_SPEED * region.height },
                uSway: { value: SWAY * region.height },
            },
            vertexShader: `
                uniform float uTime;
                uniform float uSize;
                uniform float uZoom;
                uniform float uBottom;
                uniform float uHeight;
                uniform float uRise;
                uniform float uSway;
                attribute float aSeed;
                varying float vAlpha;

                void main() {
                    vec3 p = position;
                    // Rise and wrap around inside the volume.
                    float climb = mod(p.y - uBottom + uTime * uRise * (0.6 + aSeed), uHeight);
                    p.y = uBottom + climb;
                    p.x += sin(uTime * 0.6 + aSeed * 6.2832) * uSway;
                    p.z += cos(uTime * 0.5 + aSeed * 3.1416) * uSway;

                    // Fade in at the bottom and out at the top, and twinkle.
                    float t = climb / uHeight;
                    vAlpha = smoothstep(0.0, 0.2, t) * smoothstep(1.0, 0.7, t);
                    vAlpha *= 0.55 + 0.45 * sin(uTime * (1.0 + aSeed * 2.0) + aSeed * 20.0);

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
                    gl_PointSize = uSize * uZoom * (0.6 + 0.8 * fract(aSeed * 7.31));
                }
            `,
            fragmentShader: `
                uniform vec3 uColor;
                uniform float uOpacity;
                varying float vAlpha;

                void main() {
                    float d = length(gl_PointCoord - 0.5);
                    float alpha = smoothstep(0.5, 0.0, d) * vAlpha * uOpacity;
                    gl_FragColor = vec4(uColor, alpha);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        this.points = new THREE.Points(geometry, this.material);
        this.points.frustumCulled = false;
        this.room.actualRoom.add(this.points);

        GSAP.to(this.material.uniforms.uOpacity, { value: 1, duration: 2.5, ease: "power1.inOut" });
    }

    // A box of air in front of the TV, in the room's own coordinates.
    measureRegion() {
        const actualRoom = this.room.actualRoom;
        actualRoom.updateMatrixWorld(true);
        const toRoom = actualRoom.matrixWorld.clone().invert();

        const localBox = (object) =>
            new THREE.Box3().setFromObject(object).applyMatrix4(toRoom);
        const tv = localBox(this.room.roomChildren.television);
        const floor = localBox(this.room.roomChildren.floor);

        const tvCenter = tv.getCenter(new THREE.Vector3());
        const roomCenter = floor.getCenter(new THREE.Vector3());
        const tvSize = tv.getSize(new THREE.Vector3());

        const inward = new THREE.Vector3(roomCenter.x - tvCenter.x, 0, roomCenter.z - tvCenter.z);
        const depth = inward.length();
        inward.normalize();
        const across = new THREE.Vector3(-inward.z, 0, inward.x);

        return {
            origin: new THREE.Vector3(tvCenter.x, 0, tvCenter.z),
            inward,
            across,
            depth,
            // The TV hangs on a diagonal wall, so its width is the diagonal
            // of its footprint.
            width: Math.hypot(tvSize.x, tvSize.z) * 0.8,
            bottom: tv.min.y - tvSize.y * 0.6,
            height: tvSize.y * 1.6,
        };
    }

    resize() {
        if (this.material) {
            this.material.uniforms.uSize.value = PARTICLE_SIZE * this.sizes.pixelRatio;
        }
    }

    update() {
        if (!this.material) return;
        this.material.uniforms.uTime.value = this.time.elapsed / 1000;
        this.material.uniforms.uZoom.value = Math.sqrt(
            this.room.actualRoom.scale.x / RESTING_ROOM_SCALE
        );
    }
}
