/**
 * ARQUIVO 05: UIManager.js
 * Função: Gerenciar a exibição de menus, HUD, telas de loading e interações de interface.
 */

export class UIManager {
    constructor() {
        // Mapeamento dos elementos do DOM para evitar buscas repetitivas (Performance)
        this.elements = {
            loadingScreen: document.getElementById('loading-screen'),
            mainMenu: document.getElementById('main-menu'),
            gameHUD: document.getElementById('game-hud'),
            hpValue: document.getElementById('hp-value'),
            ammoMag: document.getElementById('ammo-mag'),
            ammoRes: document.getElementById('ammo-res')
        };
    }

    // --- MÉTODOS DE ESTADO (TROCA DE TELAS) ---

    hideLoading() {
        if (this.elements.loadingScreen) {
            this.elements.loadingScreen.style.opacity = '0';
            setTimeout(() => {
                this.elements.loadingScreen.style.display = 'none';
            }, 500); // Espera o fade-out do CSS
        }
    }

    showMenu() {
        if (this.elements.mainMenu) {
            this.elements.mainMenu.style.display = 'flex';
        }
    }

    hideMenu() {
        if (this.elements.mainMenu) {
            this.elements.mainMenu.style.display = 'none';
        }
    }

    showHUD() {
        if (this.elements.gameHUD) {
            this.elements.gameHUD.style.display = 'block';
        }
    }

    // --- MÉTODOS DE ATUALIZAÇÃO (DURANTE A PARTIDA) ---

    /**
     * Atualiza a vida no HUD
     * @param {number} value - Valor atual da vida
     */
    updateHP(value) {
        if (this.elements.hpValue) {
            this.elements.hpValue.innerText = Math.round(value);
            // Efeito visual se a vida estiver baixa
            this.elements.hpValue.style.color = value < 25 ? '#ff0000' : '#ffeb3b';
        }
    }

    /**
     * Atualiza a munição no HUD
     * @param {number} mag - No pente
     * @param {number} reserve - Na reserva
     */
    updateAmmo(mag, reserve) {
        if (this.elements.ammoMag) this.elements.ammoMag.innerText = mag;
        if (this.elements.ammoRes) this.elements.ammoRes.innerText = reserve;
    }

    // Método para exibir mensagens de sistema (ex: "Headshot", "O Jogo começou")
    showNotification(text) {
        console.log(`[HUD] Notification: ${text}`);
        // Aqui você poderia criar um elemento flutuante no futuro
    }
}
