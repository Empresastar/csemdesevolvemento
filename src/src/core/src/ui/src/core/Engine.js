/**
 * ARQUIVO 06: Engine.js
 * Função: Gerenciar a renderização 3D, o Loop de animação e o ambiente global.
 */

import * as THREE from 'three';

export class Engine {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock(); // Essencial para FPS constante
        this.isRunning = false;
    }

    /**
     * Prepara a infraestrutura básica do mundo 3D
     */
    boot() {
        // 1. Criar a Cena
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x222222); // Cor de fundo neutra

        // 2. Configurar a Câmera Principal
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );

        // 3. Configurar o Renderizador Profissional
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true; // Habilita sombras reais
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        document.body.appendChild(this.renderer.domElement);

        // 4. Adicionar Iluminação Global
        this.setupLights();

        // 5. Ajustar a tela caso o jogador redimensione a janela
        window.addEventListener('resize', () => this.onWindowResize());

        this.isRunning = true;
        this.startLoop();
    }

    setupLights() {
        // Luz ambiente para que nada fique 100% preto
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Sol (Luz direcional que gera sombras)
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
        sunLight.position.set(10, 50, 10);
        sunLight.castShadow = true;
        
        // Ajuste fino da qualidade da sombra
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        
        this.scene.add(sunLight);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * O Loop de Ouro: Tudo o que acontece no jogo passa por aqui 60 vezes por segundo.
     */
    startLoop() {
        const animate = () => {
            if (!this.isRunning) return;
            requestAnimationFrame(animate);

            const deltaTime = this.clock.getDelta(); // Tempo entre um frame e outro

            // Aqui enviaremos comandos para os outros sistemas (Player, Bots, Rede)
            // Ex: this.playerManager.update(deltaTime);

            this.renderer.render(this.scene, this.camera);
        };

        animate();
    }

    // Métodos para outros arquivos adicionarem objetos na cena
    addEntity(object) {
        this.scene.add(object);
    }

    stop() {
        this.isRunning = false;
    }
}
