/**
 * ARQUIVO 04: Loader.js
 * Função: Carregar texturas, modelos 3D e áudios, gerenciando a barra de progresso.
 */

import * as THREE from 'three';
// Nota: O GLTFLoader é usado para carregar modelos 3D reais (.glb)
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class AssetLoader {
    constructor() {
        // O LoadingManager centraliza o progresso de todos os loaders
        this.manager = new THREE.LoadingManager();
        this.textureLoader = new THREE.TextureLoader(this.manager);
        this.gltfLoader = new GLTFLoader(this.manager);
        this.audioLoader = new THREE.AudioLoader(this.manager);

        this.assets = {
            textures: {},
            models: {},
            sounds: {}
        };

        this.setupProgress();
    }

    setupProgress() {
        const progressBar = document.getElementById('progress-bar');
        const statusText = document.getElementById('loader-status');

        this.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const progress = (itemsLoaded / itemsTotal) * 100;
            if (progressBar) progressBar.style.width = `${progress}%`;
            if (statusText) statusText.innerText = `Carregando: ${Math.round(progress)}%`;
        };

        this.manager.onError = (url) => {
            console.error(`❌ Erro ao carregar: ${url}`);
        };
    }

    /**
     * Este método é chamado pelo main.js e espera todos os arquivos terminarem.
     */
    async loadAll() {
        return new Promise((resolve) => {
            
            // --- 1. CARREGAR TEXTURAS (Exemplos) ---
            // Substitua pelos seus arquivos na pasta assets/
            this.assets.textures.wall = this.textureLoader.load('assets/parede.jpg');
            this.assets.textures.floor = this.textureLoader.load('assets/chao.jpg');

            // --- 2. CARREGAR MODELOS 3D (.glb) ---
            // Exemplo: this.assets.models.ak47 = this.gltfLoader.loadAsync('assets/ak47.glb');

            // --- 3. CARREGAR SONS ---
            // this.assets.sounds.shoot = this.audioLoader.loadAsync('assets/tiro.mp3');

            // Quando o manager terminar tudo, ele chama o resolve
            this.manager.onLoad = () => {
                console.log("✅ Todos os assets carregados com sucesso!");
                resolve(this.assets);
            };
        });
    }

    // Método para pegar um asset já carregado em qualquer parte do código
    get(type, name) {
        return this.assets[type][name];
    }
}
