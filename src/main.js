/**
 * ARQUIVO 03: main.js
 * Função: Coordenar a inicialização de todos os módulos.
 */

// Importando os núcleos (Core) que vamos criar a seguir
// Usamos os apelidos (aliases) definidos no index.html
import { Engine } from '@core/Engine.js';
import { AssetLoader } from '@core/Loader.js';
import { UIManager } from '@ui/UIManager.js';

class Main {
    constructor() {
        // Inicializa os controladores principais
        this.ui = new UIManager();
        this.loader = new AssetLoader();
        this.engine = new Engine();

        // Variável para controle de estado
        this.isStarted = false;

        this.init();
    }

    async init() {
        console.log("🚀 JS-GO: Iniciando sistemas profissionais...");

        try {
            // 1. Iniciar o carregamento de Assets (Texturas, Sons, Modelos)
            // O Loader atualizará a barra de progresso no HTML automaticamente
            await this.loader.loadAll();

            // 2. Quando terminar o carregamento, mostrar o Menu
            this.ui.hideLoading();
            this.ui.showMenu();

            // 3. Configurar os botões do Menu
            this.setupEventListeners();

        } catch (error) {
            console.error("❌ Erro fatal na inicialização:", error);
            document.getElementById('loader-status').innerText = "Erro ao carregar arquivos!";
        }
    }

    setupEventListeners() {
        const btnStart = document.getElementById('btn-start');

        btnStart.addEventListener('click', () => {
            this.startGame();
        });
    }

    startGame() {
        if (this.isStarted) return;
        
        console.log("🎮 Entrando no servidor...");
        
        // Esconde o Menu e mostra o HUD do Jogo
        this.ui.hideMenu();
        this.ui.showHUD();

        // Acorda o motor gráfico e físico
        this.engine.boot();
        
        // Bloqueia o mouse para controle FPS
        document.body.requestPointerLock();
        
        this.isStarted = true;
    }
}

// Inicia a aplicação
window.addEventListener('DOMContentLoaded', () => {
    new Main();
});
