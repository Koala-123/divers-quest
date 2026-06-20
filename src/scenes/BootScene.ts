import Phaser from 'phaser';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';

export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        this.load.plugin('rexvirtualjoystickplugin', VirtualJoystickPlugin, true);

        const diverGraphics = this.make.graphics({x:0, y:0});
        // Tank on back
        diverGraphics.fillStyle(0xffff00, 1);
        diverGraphics.fillRoundedRect(10, 20, 20, 40, 5);
        // Legs pointing UP
        diverGraphics.fillStyle(0xaaaaaa, 1);
        diverGraphics.fillRoundedRect(8, 0, 10, 30, 5); // Left leg
        diverGraphics.fillRoundedRect(22, 0, 10, 30, 5); // Right leg
        // Torso
        diverGraphics.fillStyle(0xdddddd, 1);
        diverGraphics.fillRoundedRect(10, 25, 20, 30, 8);
        // Arms pointing DOWN/OUT
        diverGraphics.fillStyle(0xaaaaaa, 1);
        diverGraphics.fillRoundedRect(0, 30, 10, 25, 4); // Left arm
        diverGraphics.fillRoundedRect(30, 30, 10, 25, 4); // Right arm
        // Head pointing DOWN
        diverGraphics.fillStyle(0xdddddd, 1);
        diverGraphics.fillCircle(20, 65, 12);
        // Visor
        diverGraphics.fillStyle(0x00ffff, 1);
        diverGraphics.fillCircle(20, 70, 6);
        diverGraphics.generateTexture('diver', 40, 80);
        diverGraphics.destroy();

        // Predator (Shark/Eel)
        const predGraphics = this.make.graphics({x:0, y:0});
        predGraphics.fillStyle(0xaa2222, 1);
        predGraphics.fillEllipse(30, 15, 40, 15); // body
        predGraphics.fillTriangle(0, 10, 0, 20, 15, 15); // tail
        predGraphics.fillStyle(0xffffff, 1);
        predGraphics.fillCircle(10, 20, 3);
        predGraphics.generateTexture('predator', 60, 30);
        predGraphics.destroy();

        // Artifact
        const artifactGraphics = this.make.graphics({x:0, y:0});
        artifactGraphics.fillStyle(0xffd700, 1);
        artifactGraphics.beginPath();
        artifactGraphics.moveTo(20, 0);
        artifactGraphics.lineTo(40, 20);
        artifactGraphics.lineTo(20, 40);
        artifactGraphics.lineTo(0, 20);
        artifactGraphics.closePath();
        artifactGraphics.fillPath();
        artifactGraphics.generateTexture('artifact', 40, 40);
        artifactGraphics.destroy();

        // Hearts
        const hg = this.make.graphics({x:0,y:0});
        
        // Full Heart
        hg.fillStyle(0xff0000, 1);
        hg.fillCircle(10, 10, 10);
        hg.fillCircle(25, 10, 10);
        hg.fillTriangle(0, 12, 35, 12, 17.5, 30);
        hg.generateTexture('heart_full', 35, 35);
        hg.clear();

        // Empty Heart
        hg.fillStyle(0x555555, 1);
        hg.fillCircle(10, 10, 10);
        hg.fillCircle(25, 10, 10);
        hg.fillTriangle(0, 12, 35, 12, 17.5, 30);
        hg.generateTexture('heart_empty', 35, 35);
        hg.clear();

        // Half Heart
        hg.fillStyle(0xff0000, 1); // Left red
        hg.fillCircle(10, 10, 10);
        hg.beginPath();
        hg.moveTo(0, 12);
        hg.lineTo(17.5, 12);
        hg.lineTo(17.5, 30);
        hg.closePath();
        hg.fillPath();

        hg.fillStyle(0x555555, 1); // Right empty
        hg.fillCircle(25, 10, 10);
        hg.beginPath();
        hg.moveTo(17.5, 12);
        hg.lineTo(35, 12);
        hg.lineTo(17.5, 30);
        hg.closePath();
        hg.fillPath();
        hg.generateTexture('heart_half', 35, 35);
        hg.destroy();

        // Salvage
        const g = this.make.graphics();
        g.fillStyle(0xaaaaaa, 1);
        g.fillRect(0, 0, 20, 15); // Crate
        g.lineStyle(2, 0xffff00, 1);
        g.strokeRect(0, 0, 20, 15);
        g.generateTexture('salvage', 20, 15);
        g.clear();

        // Flora
        g.lineStyle(4, 0x00ffaa, 1);
        g.beginPath();
        g.moveTo(10, 30);
        g.lineTo(5, 20);
        g.lineTo(15, 10);
        g.lineTo(10, 0);
        g.strokePath();
        g.generateTexture('flora', 20, 32);
        g.clear();

        // Bubble
        g.fillStyle(0x00ffff, 0.5);
        g.fillCircle(10, 10, 10);
        g.lineStyle(2, 0xffffff, 0.8);
        g.strokeCircle(10, 10, 10);
        g.generateTexture('bubble', 20, 20);
        g.clear();

        // Balloon
        g.fillStyle(0xff00ff, 1);
        g.fillCircle(16, 16, 16);
        g.generateTexture('balloon', 32, 32);
        g.clear();
    }

    create() {
        this.initRegistry();
        this.scene.start('TutorialScene');
    }

    initRegistry() {
        const defaultData = {
            diverLevel: 1,
            researchPoints: 0,
            salvage: 0,
            maxOxygen: 100,
            maxHealth: 5,
            balloons: 3,
            activeQuests: []
        };

        const savedData = localStorage.getItem('divers_quest_save');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                Object.keys(defaultData).forEach(key => {
                    this.registry.set(key, parsed[key] ?? (defaultData as any)[key]);
                });
                
                // Enforce the new cap of 5 lives regardless of old save files
                this.registry.set('maxHealth', 5);
            } catch (e) {
                console.error("Save file corrupted, using defaults");
                Object.keys(defaultData).forEach(key => this.registry.set(key, (defaultData as any)[key]));
            }
        } else {
            Object.keys(defaultData).forEach(key => this.registry.set(key, (defaultData as any)[key]));
        }
    }
}
