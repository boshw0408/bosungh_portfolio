import * as THREE from "three";
import GSAP from "gsap";
import Experience from "../Experience.js";

// The big monitor on the left of the desk shows hovered projects and is
// blank otherwise. Its original code screenshot moves to the monitor on the
// far right.
const PROJECT_MONITOR = "Material.106";
const CODE_MONITOR = "Material.105";

// Hovering a card on the page shows its image on a screen in the room.
const SHOWCASES = [
    {
        // "My Works" projects go on the project monitor.
        cards: ".second-section .section-image-wrapper",
        findScreen: (children) => findByMaterial(children.moniter, PROJECT_MONITOR),
        blankWhenIdle: true,
    },
    {
        // "Experience" cards go on the TV, which plays its video otherwise.
        cards: ".third-section .section-image-wrapper",
        findScreen: (children) => children.video,
        blankWhenIdle: false,
    },
];
// Wait this long before switching back, so moving between cards doesn't
// flash the original screen in between.
const RESTORE_DELAY_MS = 150;
// Width of the canvas each card image is drawn onto.
const TEXTURE_WIDTH = 1024;

export default class ScreenShowcase {
    constructor() {
        this.experience = new Experience();
        this.room = this.experience.world.room;
        this.loader = new THREE.ImageLoader();
        this.screens = [];
        this.blank = createBlankTexture();

        this.setUpDesk();

        SHOWCASES.forEach((showcase, index) => {
            document.querySelectorAll(showcase.cards).forEach((card) => {
                const src = card.querySelector("img").getAttribute("src");
                card.addEventListener("mouseenter", () => this.show(index, src));
                card.addEventListener("mouseleave", () => this.scheduleRestore(index));
            });
        });
    }

    setUpDesk() {
        const monitors = this.room.roomChildren.moniter;
        const projectMonitor = findByMaterial(monitors, PROJECT_MONITOR);
        const codeMonitor = findByMaterial(monitors, CODE_MONITOR);
        codeMonitor.material.map = projectMonitor.material.map;
        projectMonitor.material.map = this.blank;
    }

    // Called after the intro, once the TV is playing its video and every
    // screen has its final size.
    enable() {
        this.screens = SHOWCASES.map(({ findScreen, blankWhenIdle }) => {
            const mesh = findScreen(this.room.roomChildren);
            const idle = blankWhenIdle ? this.blank : mesh.material.map;
            return {
                mesh,
                original: idle,
                aspect: screenAspect(mesh),
                textures: new Map(),
                hovered: null,
                restoreTimer: null,
            };
        });
    }

    show(index, src) {
        const screen = this.screens[index];
        if (!screen) return;
        clearTimeout(screen.restoreTimer);
        screen.hovered = src;

        const cached = screen.textures.get(src);
        if (cached) {
            this.apply(screen, cached);
            return;
        }
        this.loader.load(src, (image) => {
            const texture = this.createTexture(image, screen.aspect);
            screen.textures.set(src, texture);
            if (screen.hovered === src) this.apply(screen, texture);
        });
    }

    // Draw the image cropped to the screen's shape, like CSS object-fit:
    // cover, on white so transparent logos look right.
    createTexture(image, aspect) {
        const canvas = document.createElement("canvas");
        canvas.width = TEXTURE_WIDTH;
        canvas.height = Math.round(TEXTURE_WIDTH / aspect);
        const context = canvas.getContext("2d");
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        const scale = Math.max(canvas.width / image.width, canvas.height / image.height);
        const width = image.width * scale;
        const height = image.height * scale;
        context.drawImage(
            image,
            (canvas.width - width) / 2,
            (canvas.height - height) / 2,
            width,
            height
        );

        const texture = new THREE.CanvasTexture(canvas);
        // glTF UVs expect textures that aren't flipped.
        texture.flipY = false;
        texture.encoding = THREE.sRGBEncoding;
        return texture;
    }

    apply(screen, texture) {
        const material = screen.mesh.material;
        if (material.map === texture) return;
        material.map = texture;
        // A quick brightness flash, like the screen switching inputs.
        GSAP.fromTo(
            material.color,
            { r: 1.8, g: 1.8, b: 1.8 },
            { r: 1, g: 1, b: 1, duration: 0.4, ease: "power2.out" }
        );
    }

    scheduleRestore(index) {
        const screen = this.screens[index];
        if (!screen) return;
        screen.hovered = null;
        clearTimeout(screen.restoreTimer);
        screen.restoreTimer = setTimeout(() => {
            if (!screen.hovered) this.apply(screen, screen.original);
        }, RESTORE_DELAY_MS);
    }
}

function createBlankTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 2;
    const context = canvas.getContext("2d");
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    const texture = new THREE.CanvasTexture(canvas);
    texture.encoding = THREE.sRGBEncoding;
    return texture;
}

// The real width-to-height ratio of a screen's texture area, measured from
// how its UVs stretch across the geometry. Card images are cropped to this
// shape so they don't look squished.
function screenAspect(mesh) {
    const { position, uv } = mesh.geometry.attributes;
    const index = mesh.geometry.index;
    const [a, b, c] = [0, 1, 2].map((n) => (index ? index.getX(n) : n));
    mesh.updateWorldMatrix(true, false);
    const point = (i) =>
        new THREE.Vector3().fromBufferAttribute(position, i).applyMatrix4(mesh.matrixWorld);

    const origin = point(a);
    const edge1 = point(b).sub(origin);
    const edge2 = point(c).sub(origin);
    const du1 = uv.getX(b) - uv.getX(a);
    const dv1 = uv.getY(b) - uv.getY(a);
    const du2 = uv.getX(c) - uv.getX(a);
    const dv2 = uv.getY(c) - uv.getY(a);
    const r = 1 / (du1 * dv2 - du2 * dv1);
    // World-space length of one full unit of u and of v.
    const alongU = edge1.clone().multiplyScalar(dv2).sub(edge2.clone().multiplyScalar(dv1));
    const alongV = edge2.clone().multiplyScalar(du1).sub(edge1.clone().multiplyScalar(du2));
    const aspect = (alongU.length() * Math.abs(r)) / (alongV.length() * Math.abs(r));

    if (Number.isFinite(aspect) && aspect > 0.2 && aspect < 5) return aspect;
    // Fall back to the shape of the screen's original image or video.
    const media = mesh.material.map.image;
    return (media.videoWidth || media.width) / (media.videoHeight || media.height);
}

function findByMaterial(root, materialName) {
    let found = null;
    root.traverse((child) => {
        if (child.isMesh && child.material.name === materialName) found = child;
    });
    return found;
}
