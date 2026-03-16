/**
 * ARQUIVO 10: Ak47.js
 * Função: Define os atributos específicos da AK-47 herdando da base.
 */

import { WeaponBase } from './WeaponBase.js';
import * as THREE from 'three';

export class Ak47 extends WeaponBase {
    constructor(camera, scene) {
        // Passamos as configurações específicas da AK-47 para a base
        super(camera, scene, {
            name: "AK-47",
            damage: 36,          // Dano real (mata com 3-4 tiros no corpo)
            fireRate: 0.1,       // 600 RPM (tiros por minuto)
            magSize: 30,
            reserveAmmo: 90,
            recoilAmount: 0.04   // Coice mais forte que o normal
        });

        this.setupVisuals();
    }

    /**
     * Aqui é onde o jogo deixa de ser "carcaça"
     */
    setupVisuals() {
        // 1. No futuro, aqui carregaremos o modelo .glb baixado
        // loader.load('assets/models/ak47.glb', (gltf) => { ... });

        // 2. Por enquanto, vamos dar uma cor metálica para diferenciar
        if (this.mesh) {
            this.mesh.material.color.setHex(0x4b3621); // Marrom escuro (madeira/ferro)
            this.mesh.scale.set(1, 1.2, 2.5); // Deixa o cano mais longo
        }
    }

    /**
     * Sobrescrevemos o som para ser o da AK
     */
    playShootSound() {
        const audio = new Audio('assets/sounds/ak47_shoot.mp3');
        audio.volume = 0.5;
        audio.play();
    }

    // A AK tem um efeito de flash (fogo saindo do cano)
    muzzleFlash() {
        const light = new THREE.PointLight(0xffaa00, 2, 3);
        light.position.copy(this.mesh.position);
        this.scene.add(light);
        
        // Remove o brilho após 50 milissegundos
        setTimeout(() => this.scene.remove(light), 50);
    }

    /**
     * Especialização do tiro da AK
     */
    shoot() {
        const fired = super.shoot(); // Chama a lógica principal do arquivo 09
        if (fired) {
            this.muzzleFlash();
            // this.playShootSound(); // Descomente quando tiver o arquivo .mp3
        }
    }
}
