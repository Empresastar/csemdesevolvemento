/**
 * ARQUIVO 14: HealthSystem.js
 * Função: Gerenciar pontos de vida, escudo, cura e estados de morte para qualquer entidade.
 */

export class HealthSystem {
    /**
     * @param {number} maxHP - Vida máxima (padrão 100)
     * @param {number} maxArmor - Escudo máximo (padrão 100)
     */
    constructor(maxHP = 100, maxArmor = 0) {
        this.maxHP = maxHP;
        this.currentHP = maxHP;
        
        this.maxArmor = maxArmor;
        this.currentArmor = maxArmor;

        this.isDead = false;
        
        // Callbacks para eventos (Útil para tocar sons de dor ou atualizar HUD)
        this.onDamage = null;
        this.onHeal = null;
        this.onDeath = null;
    }

    /**
     * Aplica dano com cálculo de armadura
     * @param {number} amount - Quantidade de dano bruto
     */
    takeDamage(amount) {
        if (this.isDead) return;

        let damageToApply = amount;

        // Lógica de Escudo (reduz o dano em 50% enquanto tiver armadura)
        if (this.currentArmor > 0) {
            const armorAbsorption = amount * 0.5;
            this.currentArmor -= armorAbsorption;
            damageToApply -= armorAbsorption;

            if (this.currentArmor < 0) {
                damageToApply += Math.abs(this.currentArmor);
                this.currentArmor = 0;
            }
        }

        this.currentHP -= damageToApply;

        // Callback de dano (para o UIManager ou efeitos)
        if (this.onDamage) this.onDamage(damageToApply, this.currentHP);

        if (this.currentHP <= 0) {
            this.currentHP = 0;
            this.die();
        }
    }

    heal(amount) {
        if (this.isDead) return;
        this.currentHP = Math.min(this.currentHP + amount, this.maxHP);
        if (this.onHeal) this.onHeal(amount, this.currentHP);
    }

    addArmor(amount) {
        this.currentArmor = Math.min(this.currentArmor + amount, this.maxArmor);
    }

    die() {
        this.isDead = true;
        if (this.onDeath) this.onDeath();
    }

    getHPPercent() {
        return (this.currentHP / this.maxHP) * 100;
    }
}
