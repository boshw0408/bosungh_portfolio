import * as THREE from "three";
import Experience from "../Experience.js";

export default class Floor {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.setFloor();
        this.setCircles();
    }

    setFloor() {
        this.geometry = new THREE.PlaneGeometry(100, 100);
        this.material = new THREE.MeshStandardMaterial({
            color: 2373475,
            side: THREE.BackSide,
        });
        this.plane = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.plane);
        this.plane.rotation.x = Math.PI / 2;
        this.plane.position.y = -0.3;
        this.plane.receiveShadow = true;
    }
    // 526884 dark mode color // 2373475 //15222085 //16755365

    setCircles() {
        const geometry = new THREE.CircleGeometry(5, 64);
        const material = new THREE.MeshStandardMaterial({ color: 15222095 });
        const material2 = new THREE.MeshStandardMaterial({ color: 15055475 });
        const material5 = new THREE.MeshStandardMaterial({ color: 2373475 });

        this.circleFirst = new THREE.Mesh(geometry, material);
        this.circleSecond = new THREE.Mesh(geometry, material2);
        this.circleLast = new THREE.Mesh(geometry, material5);

        this.circleFirst.position.y = -0.29;

        this.circleSecond.position.y = -0.28;
        this.circleSecond.position.x = 2;

        this.circleLast.position.y = -0.25;

        this.circleFirst.scale.set(0, 0, 0);
        this.circleSecond.scale.set(0, 0, 0);
        this.circleLast.scale.set(0, 0, 0);

        this.circleFirst.rotation.x =
            this.circleSecond.rotation.x =
            this.circleLast.rotation.x =
                -Math.PI / 2;

        this.circleFirst.receiveShadow =
            this.circleSecond.receiveShadow =
            this.circleLast.receiveShadow =
                true;

        this.scene.add(this.circleFirst);
        this.scene.add(this.circleSecond);
        this.scene.add(this.circleLast);
    }

    resize() {}
    
    update() {}
}