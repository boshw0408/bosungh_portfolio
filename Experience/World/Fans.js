import * as THREE from "three";
import Experience from "../Experience.js";

// Radians per second.
const FAN_SPEED = 2.5;

// The PC's fan materials and the radius (in UV units) of the round part of
// each fan image. Each fan is a square face showing a square image, so only
// the circle inside the frame spins; the frame corners stay still.
const FAN_MATERIALS = {
    "aorus case fans": 0.47,
    "Material.041": 0.44,
    "Material.050": 0.49,
    "Material.051": 0.49,
    "Material.052": 0.49,
};

export default class Fans {
    constructor() {
        this.experience = new Experience();
        this.time = this.experience.time;
        this.computer = this.experience.world.room.roomChildren.computer;

        // Shared by every fan shader, so one update spins them all.
        this.angle = { value: 0 };

        this.setMaterials();
    }

    setMaterials() {
        this.computer.traverse((child) => {
            if (!child.isMesh) return;
            const radius = FAN_MATERIALS[child.material.name];
            if (radius === undefined || !child.material.map) return;
            this.makeSpin(child.material, radius);
        });
    }

    // Rotate the texture lookup inside the fan's circle.
    makeSpin(material, radius) {
        const spunLookup = THREE.ShaderChunk.map_fragment.replace(
            "texture2D( map, vUv )",
            "texture2D( map, spinFanUv( vUv ) )"
        );

        material.onBeforeCompile = (shader) => {
            shader.uniforms.uFanAngle = this.angle;
            shader.fragmentShader =
                `
                uniform float uFanAngle;
                vec2 spinFanUv(vec2 uv) {
                    vec2 p = uv - 0.5;
                    if (length(p) > ${radius.toFixed(3)}) return uv;
                    float c = cos(uFanAngle);
                    float s = sin(uFanAngle);
                    return vec2(c * p.x - s * p.y, s * p.x + c * p.y) + 0.5;
                }
                ` +
                shader.fragmentShader.replace("#include <map_fragment>", spunLookup);
        };
        material.customProgramCacheKey = () => `spinning-fan-${radius}`;
        material.needsUpdate = true;
    }

    update() {
        const seconds = this.time.delta / 1000;
        this.angle.value = (this.angle.value - FAN_SPEED * seconds) % (Math.PI * 2);
    }
}
