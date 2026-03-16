/**
 * ARQUIVO 11: Inventory.js
 * Função: Gerenciar a troca de armas, slots de equipamento e animação de "pull out".
 */

export class Inventory {
    constructor(camera, scene) {
        this.camera = camera;
        this.scene = scene;

        // Slots clássicos do CS
        this.slots = {
            1: null, // Primária (Ex: AK-47)
            2: null, // Secundária (Ex: Pistola)
            3: null, // Faca
            4: null  // Granadas
        };

        this.currentSlot = null;
        this.isSwitching = false;

        this.initControls();
    }

    initControls() {
        // Atalhos de teclado para troca de armas
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Digit1') this.equip(1);
            if (e.code === 'Digit2') this.equip(2);
            if (e.code === 'Digit3') this.equip(3);
            if (e.code === 'Digit4') this.equip(4);
        });
    }

    addWeapon(slot, weaponInstance) {
        // Se já houver algo no slot, removemos da cena antes
        if (this.slots[slot]) {
            this.camera.remove(this.slots[slot].mesh);
        }
        
        this.slots[slot] = weaponInstance;
        
        // Se for o primeiro item ou a faca, já deixa equipado
        if (!this.currentSlot) this.equip(slot);
    }

    equip(slot) {
        if (this.isSwitching || !this.slots[slot] || this.currentSlot === slot) return;

        this.isSwitching = true;
        console.log(`🔄 Trocando para slot ${slot}: ${this.slots[slot].name}`);

        // 1. Esconder a arma atual
        if (this.currentSlot && this.slots[this.currentSlot]) {
            this.slots[this.currentSlot].mesh.visible = false;
        }

        // 2. Delay de troca (Animação de puxar a arma)
        setTimeout(() => {
            this.currentSlot = slot;
            const newWeapon = this.slots[slot];
            
            newWeapon.mesh.visible = true;
            
            // Atualiza o HUD via UIManager (será conectado no Main)
            // window.ui.updateAmmo(newWeapon.ammoInMag, newWeapon.reserveAmmo);
            
            this.isSwitching = false;
        }, 300); // 300ms de "saque"
    }

    getActiveWeapon() {
        return this.slots[this.currentSlot];
    }
}
