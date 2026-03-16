/**
 * ARQUIVO 09: WeaponBase.js
 * Função: Classe mestre para todas as armas. Gerencia munição, cadência e raios de colisão.
 */

import * as THREE from 'three';

export class WeaponBase {
    constructor(camera, scene, options = {}) {
        this.camera = camera;
        this.scene = scene;
        
        // Atributos da Arma (Configuráveis via subclasses)
        this.name = options.name || "Generic Weapon";
        this.damage = options.damage || 10;
        this.fireRate = options.fireRate || 0.1; // Segundos entre tiros
        this.magSize = options.magSize || 30;
        this.ammoInMag = this.magSize;
        this.reserveAmmo = options.reserveAmmo || 90;
        this.recoilAmount = options.recoilAmount || 0.02;

        this.lastFireTime = 0;
        this.isReloading = false;
        
        // O "corpo" da arma (será substituído por modelos .glb no futuro)
        this.mesh = null;
        this.initMesh();
    }

    initMesh() {
        // Cria um modelo provisório (um braço/cano de arma)
        const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.5);
        const material = new THREE.MeshStandardMaterial({ color: 0x333333 });
        this.mesh = new THREE.Mesh(geometry, material);
        
        // Posiciona a arma na frente da câmera (visão FPS)
        this.mesh.position.set(0.3, -0.3, -0.5);
        this.camera.add(this.mesh);
    }

    /**
     * Lógica de Disparo (Raycasting Profissional)
     */
    shoot() {
        const currentTime = performance.now() / 1000;
        
        if (this.ammoInMag <= 0 || this.isReloading || (currentTime - this.lastFireTime) < this.fireRate) {
            return false;
        }

        this.ammoInMag--;
        this.lastFireTime = currentTime;

        // Criar o Raio do tiro partindo do centro da tela
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera({ x: 0, y: 0 }, this.camera);

        // Detectar o que o tiro acertou (inimigos ou cenário)
        const intersects = raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {
            const hit = intersects[0];
            this.handleHit(hit);
        }

        this.applyRecoil();
        return true;
    }

    handleHit(hit) {
        // Se acertou algo, cria uma marca de impacto (Bullet Hole)
        console.log(`Acertou: ${hit.object.name || "Cenário"} em ${hit.point}`);
        
        // No futuro, aqui chamaremos o sistema de partículas para faíscas ou sangue
        const holeGeom = new THREE.CircleGeometry(0.02, 8);
        const holeMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
        const hole = new THREE.Mesh(holeGeom, holeMat);
        
        hole.position.copy(hit.point).add(hit.face.normal.multiplyScalar(0.01));
        hole.lookAt(hit.point.clone().add(hit.face.normal));
        this.scene.add(hole);
    }

    applyRecoil() {
        // Faz a câmera subir levemente ao atirar
        this.camera.rotation.x += this.recoilAmount;
    }

    reload() {
        if (this.isReloading || this.ammoInMag === this.magSize || this.reserveAmmo <= 0) return;

        this.isReloading = true;
        console.log("Recarregando...");

        setTimeout(() => {
            const needed = this.magSize - this.ammoInMag;
            const toReload = Math.min(needed, this.reserveAmmo);
            
            this.ammoInMag += toReload;
            this.reserveAmmo -= toReload;
            this.isReloading = false;
            console.log("Pronto!");
        }, 2000); // 2 segundos de reload
    }
}
