/**
 * ARQUIVO 16: AudioManager.js
 * Função: Gerenciar áudio espacial (3D) e efeitos sonoros globais.
 */

import * as THREE from 'three';

export class AudioManager {
    constructor(camera) {
        this.camera = camera;
        this.listener = new THREE.AudioListener();
        this.camera.add(this.listener); // O jogador é o "ouvido" do mundo

        this.sounds = new Map();
    }

    /**
     * Carrega e toca um som 2D (Interface, Música, Chat)
     */
    playGlobal(name, buffer, volume = 0.5) {
        const sound = new THREE.Audio(this.listener);
        sound.setBuffer(buffer);
        sound.setVolume(volume);
        sound.play();
    }

    /**
     * Toca um som 3D em uma posição específica (Explosões, Tiros de Bots)
     */
    playAtPosition(buffer, position, volume = 1.0, distance = 20) {
        const sound = new THREE.PositionalAudio(this.listener);
        sound.setBuffer(buffer);
        sound.setRefDistance(distance); // Onde o som começa a sumir
        sound.setVolume(volume);

        // Cria um objeto invisível para segurar o som na posição
        const helper = new THREE.Object3D();
        helper.position.copy(position);
        this.camera.parent.add(helper); // Adiciona na cena

        sound.play();
        
        // Limpa o objeto da memória após o som acabar
        sound.onEnded = () => {
            helper.removeFromParent();
        };
    }
}
