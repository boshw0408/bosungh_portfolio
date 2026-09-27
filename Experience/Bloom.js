import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import Experience from "./Experience.js";

// Glow tuning.
const BLOOM_STRENGTH = 1.6;
const BLOOM_RADIUS = 0.6;
// How bright each kind of object is in the glow pass. Screens glow softer
// than the neon so bright video frames don't wash out the room.
const NEON_GLOW = 1;
const SCREEN_GLOW = 0.2;

// Selective bloom: only the neon sign, LED strip and screens glow.
//
// Each frame, a glow pass renders the scene with every other mesh swapped to
// black, so objects in front of a light still block its glow. That image is
// blurred, then added on top of the normal frame. The normal render is left
// untouched, so the rest of the scene and the page colors look the same.
export default class Bloom {
    constructor(renderer) {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera.orthographicCamera;
        this.sizes = this.experience.sizes;
        this.renderer = renderer;

        this.darkMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        this.glowMaterials = new Map();
        this.savedMaterials = new Map();
        this.screens = null;

        this.setComposer();
        this.setComposite();
    }

    setComposer() {
        this.composer = new EffectComposer(this.renderer);
        this.composer.renderToScreen = false;
        // The glow is blurry anyway, so skip retina resolution to save GPU.
        this.composer.setPixelRatio(1);
        this.composer.setSize(this.sizes.width, this.sizes.height);

        this.composer.addPass(new RenderPass(this.scene, this.camera));
        this.composer.addPass(
            new UnrealBloomPass(
                new THREE.Vector2(this.sizes.width, this.sizes.height),
                BLOOM_STRENGTH,
                BLOOM_RADIUS,
                0 // threshold: everything left visible in the glow pass glows
            )
        );
    }

    // A fullscreen quad that adds the glow image on top of the frame.
    setComposite() {
        this.compositeMaterial = new THREE.ShaderMaterial({
            uniforms: { tGlow: { value: null } },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position.xy, 0.0, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tGlow;
                varying vec2 vUv;
                void main() {
                    gl_FragColor = texture2D(tGlow, vUv);
                }
            `,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            depthWrite: false,
            transparent: true,
            toneMapped: false,
        });

        const quad = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2),
            this.compositeMaterial
        );
        quad.frustumCulled = false;

        this.compositeScene = new THREE.Scene();
        this.compositeScene.add(quad);
        this.compositeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    }

    // The room loads after the renderer is created, so look up the screens
    // the first time they exist.
    isReady() {
        if (this.screens) return true;

        const room = this.experience.world && this.experience.world.room;
        if (!room) return false;

        const { moniter, video } = room.roomChildren;
        this.screens = new Set([video]);
        moniter.traverse((child) => {
            if (child.isMesh && child.material.isMeshBasicMaterial && child.material.map) {
                this.screens.add(child);
            }
        });
        return true;
    }

    glowMaterialFor(mesh) {
        const material = mesh.material;
        if (Array.isArray(material)) return this.darkMaterial;

        if (this.screens.has(mesh)) {
            let glow = this.glowMaterials.get(mesh);
            if (!glow) {
                glow = new THREE.MeshBasicMaterial({ toneMapped: false });
                glow.color.setScalar(SCREEN_GLOW);
                this.glowMaterials.set(mesh, glow);
            }
            // The TV's material is swapped for the video after the intro.
            if (glow.map !== material.map) {
                if (!glow.map !== !material.map) glow.needsUpdate = true;
                glow.map = material.map;
            }
            return glow;
        }

        const emissive = material.emissive;
        if (emissive && material.emissiveIntensity > 0 && emissive.getHex() !== 0) {
            let glow = this.glowMaterials.get(mesh);
            if (!glow) {
                glow = new THREE.MeshBasicMaterial({
                    color: emissive.clone().multiplyScalar(NEON_GLOW),
                    toneMapped: false,
                });
                this.glowMaterials.set(mesh, glow);
            }
            return glow;
        }

        return this.darkMaterial;
    }

    renderGlow() {
        this.scene.traverse((object) => {
            if (!object.isMesh) return;
            this.savedMaterials.set(object, object.material);
            object.material = this.glowMaterialFor(object);
        });

        // Shadows were already drawn for the normal frame; don't redo them.
        const shadowAutoUpdate = this.renderer.shadowMap.autoUpdate;
        this.renderer.shadowMap.autoUpdate = false;
        this.composer.render();
        this.renderer.shadowMap.autoUpdate = shadowAutoUpdate;

        this.savedMaterials.forEach((material, object) => {
            object.material = material;
        });
        this.savedMaterials.clear();
    }

    composite() {
        this.compositeMaterial.uniforms.tGlow.value = this.composer.readBuffer.texture;

        const autoClear = this.renderer.autoClear;
        this.renderer.autoClear = false;
        this.renderer.render(this.compositeScene, this.compositeCamera);
        this.renderer.autoClear = autoClear;
    }

    resize() {
        this.composer.setSize(this.sizes.width, this.sizes.height);
    }
}
