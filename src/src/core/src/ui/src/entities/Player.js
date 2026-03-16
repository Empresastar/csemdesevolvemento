/**
 * ARQUIVO 08: Player.js
 * Função: Gerenciar a física do jogador, visão em primeira pessoa e controles WASD.
 */

import * as THREE from 'three';

export class Player {
    constructor(camera, collidables) {
        this.camera = camera;
        this.collidables = collidables; // Vem do MapLoader.js

        // Configurações de física
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.speed = 12.0;
        this.jumpForce = 5.0;
        this.gravity = 15.0;
        this.height = 1.7; // Altura dos olhos do personagem

        // Estado do jogador
        this.keys = {};
        this.isGrounded = false;
        this.isCrouching = false;

        this.initControls();
    }

    initControls() {
        // Escuta o teclado
        window.addEventListener('keydown', (e) => this.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);

        // Movimento do Mouse (Visão)
        window.addEventListener('mousemove', (e) => {
            if (document.pointerLockElement === document.body) {
                // Sensibilidade do mouse
                const sensitivity = 0.002;
                this.camera.rotation.y -= e.movementX * sensitivity;
                this.camera.rotation.x -= e.movementY * sensitivity;

                // Trava a visão para não girar 360 verticalmente (não quebrar o pescoço)
                this.camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.camera.rotation.x));
            }
        });
    }

    update(delta) {
        if (!delta) return;

        // 1. Aplicar Gravidade
        this.velocity.y -= this.gravity * delta;

        // 2. Processar Entrada (WASD)
        this.direction.z = Number(this.keys['KeyS'] || 0) - Number(this.keys['KeyW'] || 0);
        this.direction.x = Number(this.keys['KeyD'] || 0) - Number(this.keys['KeyA'] || 0);
        this.direction.normalize();

        // 3. Movimentação Horizontal
        if (this.keys['KeyW'] || this.keys['KeyS'] || this.keys['KeyA'] || this.keys['KeyD']) {
            const moveSpeed = this.isCrouching ? this.speed * 0.4 : this.speed;
            
            // Move relativo à direção que a câmera está olhando
            const camYaw = this.camera.rotation.y;
            this.velocity.x = (this.direction.x * Math.cos(camYaw) + this.direction.z * Math.sin(camYaw)) * moveSpeed;
            this.velocity.z = (this.direction.z * Math.cos(camYaw) - this.direction.x * Math.sin(camYaw)) * moveSpeed;
        } else {
            // Atrito (para o jogador não deslizar no gelo)
            this.velocity.x *= 0.1;
            this.velocity.z *= 0.1;
        }

        // 4. Pulo e Agachar
        if (this.keys['Space'] && this.isGrounded) {
            this.velocity.y = this.jumpForce;
            this.isGrounded = false;
        }
        
        this.isCrouching = !!this.keys['ControlLeft'];
        const targetHeight = this.isCrouching ? 0.8 : this.height;
        
        // Suaviza a descida do agachar
        this.camera.position.y += (targetHeight - (this.camera.position.y - this.camera.position.y + targetHeight)) * 0.1;

        // 5. Aplicar Movimento com Detecção de Colisão Simplificada
        const nextPos = this.camera.position.clone().add(this.velocity.clone().multiplyScalar(delta));
        
        // Aqui checamos se a próxima posição bate em algum objeto do MapLoader
        if (!this.checkCollisions(nextPos)) {
            this.camera.position.x = nextPos.x;
            this.camera.position.z = nextPos.z;
        }

        this.camera.position.y += this.velocity.y * delta;

        // 6. Chão Simples (Piso 0)
        if (this.camera.position.y < targetHeight) {
            this.velocity.y = 0;
            this.camera.position.y = targetHeight;
            this.isGrounded = true;
        }
    }

    checkCollisions(pos) {
        // Cria uma caixa invisível ao redor do jogador para testar impacto
        const playerBox = new THREE.Box3().setFromCenterAndSize(pos, new THREE.Vector3(0.6, 1.8, 0.6));
        
        for (let wall of this.collidables) {
            if (playerBox.intersectsBox(wall)) return true;
        }
        return false;
    }
}
