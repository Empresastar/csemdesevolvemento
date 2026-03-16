/**
 * ARQUIVO 12: Bot.js
 * Função: Gerenciar o comportamento do inimigo, IA de perseguição e sistema de vida.
 */

import * as THREE from 'three';

export class Bot {
    constructor(scene, player, position = { x: 0, y: 0, z: 0 }) {
        this.scene = scene;
        this.player = player; // Referência para saber onde você está
        
        // Atributos
        this.hp = 100;
        this.speed = 4.0;
        this.detectionRange = 25;
        this.attackRange = 15;
        this.state = 'IDLE'; // IDLE, CHASE, ATTACK, DEAD

        this.initMesh(position);
    }

    initMesh(pos) {
        // Representação visual do Bot (Um cilindro para simular um corpo)
        const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1.8, 16);
        const material = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Inimigo Vermelho
        this.mesh = new THREE.Mesh(geometry, material);
        
        this.mesh.position.set(pos.x, pos.y + 0.9, pos.z);
        this.mesh.castShadow = true;
        this.mesh.name = "Enemy_Bot"; // Identificador para o Raycast de tiro
        
        this.scene.add(this.mesh);
    }

    update(delta) {
        if (this.state === 'DEAD') return;

        // Calcular distância até o jogador
        const distance = this.mesh.position.distanceTo(this.player.camera.position);

        // --- MÁQUINA DE ESTADOS (FSM) ---
        if (distance < this.attackRange) {
            this.state = 'ATTACK';
        } else if (distance < this.detectionRange) {
            this.state = 'CHASE';
        } else {
            this.state = 'IDLE';
        }

        this.executeState(delta, distance);
    }

    executeState(delta, distance) {
        switch (this.state) {
            case 'CHASE':
                this.moveTowardsPlayer(delta);
                break;
            case 'ATTACK':
                this.lookAtPlayer();
                this.shootAtPlayer();
                break;
        }
    }

    moveTowardsPlayer(delta) {
        // Direção para o jogador
        const dir = new THREE.Vector3();
        dir.subVectors(this.player.camera.position, this.mesh.position);
        dir.y = 0; // Mantém o bot no chão
        dir.normalize();

        // Move o bot
        this.mesh.position.add(dir.multiplyScalar(this.speed * delta));
        this.mesh.lookAt(this.player.camera.position.x, this.mesh.position.y, this.player.camera.position.z);
    }

    lookAtPlayer() {
        this.mesh.lookAt(this.player.camera.position.x, this.mesh.position.y, this.player.camera.position.z);
    }

    shootAtPlayer() {
        // No futuro, aqui chamaremos o sistema de dano no jogador
        // console.log("Bot disparando!");
    }

    takeDamage(amount) {
        this.hp -= amount;
        console.log(`Bot tomou dano! HP: ${this.hp}`);
        
        if (this.hp <= 0) {
            this.die();
        }
    }

    die() {
        this.state = 'DEAD';
        this.mesh.rotation.x = Math.PI / 2; // "Tomba" o boneco no chão
        console.log("Bot eliminado!");
        
        // Remove do jogo após 5 segundos
        setTimeout(() => {
            this.scene.remove(this.mesh);
        }, 5000);
    }
}
