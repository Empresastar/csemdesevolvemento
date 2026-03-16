/**
 * ARQUIVO 15: CollisionSystem.js
 * Função: Processar raios de disparos, calcular dano e identificar alvos.
 */

import * as THREE from 'three';

export class CollisionSystem {
    /**
     * @param {THREE.Scene} scene - A cena do jogo
     * @param {EnemyManager} enemyManager - Para identificar os bots
     */
    constructor(scene, enemyManager) {
        this.scene = scene;
        this.enemyManager = enemyManager;
        this.raycaster = new THREE.Raycaster();
    }

    /**
     * Processa um disparo
     * @param {THREE.Vector3} origin - Posição da arma/câmera
     * @param {THREE.Vector3} direction - Vetor para onde o jogador olha
     */
    checkShot(origin, direction) {
        // Configura o raio para a detecção
        this.raycaster.set(origin, direction);

        // Pega todos os objetos que o raio pode atingir
        // (Paredes, Chão, Bots)
        const allIntersects = this.raycaster.intersectObjects(this.scene.children, true);

        if (allIntersects.length > 0) {
            const hit = allIntersects[0]; // O primeiro objeto atingido é o que importa
            
            // 1. Verificar se é um Bot Inimigo
            const botHit = this.identifyBot(hit.object);
            
            if (botHit) {
                this.applyBotDamage(botHit, hit);
                return { type: 'BOT', point: hit.point, normal: hit.face.normal };
            }

            // 2. Verificar se é uma parede/cenário
            return { type: 'ENVIRONMENT', point: hit.point, normal: hit.face.normal };
        }

        return { type: 'MISS' };
    }

    identifyBot(object) {
        // Procura na lista de bots do EnemyManager se esse objeto 3D pertence a algum bot
        return this.enemyManager.enemies.find(bot => bot.mesh === object || bot.mesh.children.includes(object));
    }

    applyBotDamage(bot, hit) {
        // No futuro, aqui checaremos se hit.faceIndex ou o nome do osso é "Head" para dar Headshot
        const baseDamage = 30; // Isso virá da arma futuramente
        bot.takeDamage(baseDamage);
        
        console.log("💥 HIT registrado no Bot!");
    }
}
