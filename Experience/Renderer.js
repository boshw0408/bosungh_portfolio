import * as THREE from "three";
import Experience from "./Experience.js";
import Bloom from "./Bloom.js";

export default class Renderer {
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;

        this.setRenderer();
    }

    setRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
        });

        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.CineonToneMapping;
        this.renderer.toneMappingExposure = 1.75;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(this.sizes.pixelRatio);

        this.bloom = new Bloom(this.renderer);
    }

    resize() {
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(this.sizes.pixelRatio);
        this.bloom.resize();
    }

    update() {
        // The glow pass renders first, because the composite needs its result.
        const glow = this.bloom.isReady();
        if (glow) this.bloom.renderGlow();

        this.renderer.render(this.scene, this.camera.orthographicCamera);

        if (glow) this.bloom.composite();
    }
}