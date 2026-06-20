import Phaser from 'phaser';
import { InputManager } from '../systems/InputManager';

export class Player extends Phaser.Physics.Arcade.Sprite {
    inputManager: InputManager;
    maxOxygen: number;
    currentOxygen: number;
    maxHealth: number;
    currentHealth: number;
    isInvulnerable: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, inputManager: InputManager) {
        super(scene, x, y, 'diver');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.inputManager = inputManager;
        
        // Setup physics
        this.setCollideWorldBounds(true);
        this.setDrag(400);
        this.setMaxVelocity(300);

        // Fetch stats from registry
        this.maxOxygen = scene.registry.get('maxOxygen');
        this.currentOxygen = this.maxOxygen;
        this.maxHealth = scene.registry.get('maxHealth');
        this.currentHealth = this.maxHealth;
    }

    update(_time: number, delta: number) {
        // Handle Movement
        const moveVec = this.inputManager.getVector();
        
        if (moveVec.lengthSq() > 0) {
            const accel = 800;
            this.setAcceleration(moveVec.x * accel, moveVec.y * accel);
        } else {
            this.setAcceleration(0, 0);
        }

        // Handle Oxygen Depletion
        this.currentOxygen -= (delta / 1000) * 2; // Lose 2 oxygen per second
        this.scene.events.emit('oxygen_changed', this.currentOxygen);

        if (this.currentOxygen <= 0) {
            this.triggerExtraction();
        }
    }

    takeDamage(amount: number) {
        try {
            if (this.isInvulnerable || this.currentHealth <= 0) return;

            this.currentHealth -= amount;
            this.scene.events.emit('health_changed', this.currentHealth);
            
            if (this.currentHealth <= 0) {
                this.triggerExtraction();
            } else {
                this.isInvulnerable = true;
                this.setTint(0xff0000);
                this.scene.time.delayedCall(1000, () => {
                    this.isInvulnerable = false;
                    this.clearTint();
                });
            }
        } catch (e: any) {
            console.error("Crash in takeDamage: ", e);
        }
    }

    triggerExtraction() {
        this.scene.events.emit('emergency_extraction');
    }
}
