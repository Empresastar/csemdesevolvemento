/**
 * ARQUIVO 13: EnemyManager.js
 * Função: Controlar o ciclo de vida de todos os bots no servidor/partida.
 */

import { Bot } from '@entities/Bot.js';

export class EnemyManager {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.enemies = [];
        
        // Pontos de nascimento (Spawns) baseados no mapa
        this.spawnPoints = [
            { x: 10, y: 0, z: 10 },
            { x: -15, y: 0, z: -5 },
            { x: 20, y: 0, z: -15 },
            { x: 0, y: 0, z: 25 }
        ];
    }

    /**
     * Cria uma horda inicial de inimigos
     */
    spawnWave(count) {
        console.log(`💀 Spawnando ${count} inimigos...`);
        for (let i = 0; i < count; i++) {
            const point = this.spawnPoints[i % this.spawnPoints.length];
            const enemy = new Bot(this.scene, this.player, point);
            this.enemies.push(enemy);
        }
    }

    /**
     * Atualiza todos os bots vivos
     */
    update(delta) {
        // Filtra a lista para manter apenas os bots que não estão "DEAD"
        this.enemies = this.enemies.filter(enemy => {
            if (enemy.state === 'DEAD') {
                return false;
            }
            enemy.update(delta);
            return true;
        });

        // Se todos morrerem, você pode disparar um evento de "Round Win"
        if (this.enemies.length === 0) {
            this.onAllEnemiesDead();
        }
    }

    onAllEnemiesDead() {
        console.log("🏆 Round Encerrado: Terroristas Eliminados!");
        // Aqui chamaremos o UIManager para mostrar a mensagem na tela
    }

    /**
     * Retorna a lista de objetos 3D dos inimigos para o sistema de tiro
     */
    getEnemyMeshes() {
        return this.enemies.map(e => e.mesh);
    }
}
