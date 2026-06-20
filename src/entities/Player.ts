import Phaser from 'phaser';
import { InputManager } from '../systems/InputManager';

export class Player extends Phaser.GameObjects.Container {
    inputManager: InputManager;
    maxOxygen: number;
    currentOxygen: number;
    maxHealth: number;
    currentHealth: number;
    isInvulnerable: boolean = false;

    // Body parts
    torso: Phaser.GameObjects.Image;
    head: Phaser.GameObjects.Image;
    legL: Phaser.GameObjects.Image;
    legR: Phaser.GameObjects.Image;
    armL: Phaser.GameObjects.Image;
    armR: Phaser.GameObjects.Image;
    tank: Phaser.GameObjects.Image;
    
    swimTimer: number = 0;

    constructor(scene: Phaser.Scene, x: number, y: number, inputManager: InputManager) {
        super(scene, x, y);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.inputManager = inputManager;

        // Build the diver hierarchy
        this.tank = scene.add.image(0, -10, 'diver_tank');
        this.legL = scene.add.image(-6, -20, 'diver_leg').setOrigin(0.5, 1);
        this.legR = scene.add.image(6, -20, 'diver_leg').setOrigin(0.5, 1);
        this.torso = scene.add.image(0, 0, 'diver_torso');
        this.armL = scene.add.image(-12, -5, 'diver_arm').setOrigin(0.5, 0);
        this.armR = scene.add.image(12, -5, 'diver_arm').setOrigin(0.5, 0);
        this.head = scene.add.image(0, 20, 'diver_head');
        
        this.add([this.tank, this.legL, this.legR, this.torso, this.armL, this.armR, this.head]);
        
        // Setup physics
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setSize(30, 80);
        body.setOffset(-15, -40); // Center the hitbox over the container
        body.setCollideWorldBounds(true);
        body.setDrag(400, 400);
        body.setMaxVelocity(300, 300);

        // Fetch stats from registry
        this.maxOxygen = scene.registry.get('maxOxygen');
        this.currentOxygen = this.maxOxygen;
        this.maxHealth = scene.registry.get('maxHealth');
        this.currentHealth = this.maxHealth;
    }

    setPipeline(pipeline: string) {
        this.each((child: any) => {
            if (child.setPipeline) child.setPipeline(pipeline);
        });
        return this;
    }

    setTint(color: number) {
        this.each((child: any) => {
            if (child.setTint) child.setTint(color);
        });
        return this;
    }
    
    clearTint() {
        this.each((child: any) => {
            if (child.clearTint) child.clearTint();
        });
        return this;
    }

    update(_time: number, delta: number) {
        // Handle Movement
        const moveVec = this.inputManager.getVector();
        const body = this.body as Phaser.Physics.Arcade.Body;
        
        if (moveVec.lengthSq() > 0) {
            const accel = 800;
            body.setAcceleration(moveVec.x * accel, moveVec.y * accel);
            
            // Animation logic
            this.swimTimer += delta * 0.01;
            const swing = Math.sin(this.swimTimer) * 0.5;
            
            this.legL.rotation = swing;
            this.legR.rotation = -swing;
            this.armL.rotation = -swing;
            this.armR.rotation = swing;

            // Rotate entire container based on direction
            this.rotation = Phaser.Math.Angle.Between(0, 0, moveVec.x, moveVec.y) - Math.PI/2;
            
        } else {
            body.setAcceleration(0, 0);
            
            // Return to resting pose
            this.legL.rotation = 0;
            this.legR.rotation = 0;
            this.armL.rotation = 0;
            this.armR.rotation = 0;
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
