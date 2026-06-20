import Phaser from 'phaser';

export class Salvage extends Phaser.Physics.Arcade.Sprite {
    amount: number;

    constructor(scene: Phaser.Scene, x: number, y: number, amount: number = 10) {
        super(scene, x, y, 'salvage');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.amount = amount;
    }

    collect() {
        let currentSalvage = this.scene.registry.get('salvage');
        this.scene.registry.set('salvage', currentSalvage + this.amount);
        this.destroy();
    }
}

export class Flora extends Phaser.Physics.Arcade.Sprite {
    xpAmount: number;
    scanned: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, xpAmount: number = 50) {
        super(scene, x, y, 'flora');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.xpAmount = xpAmount;
    }

    scan() {
        try {
            if (!this.scanned) {
                this.scanned = true;
                let xp = this.scene.registry.get('researchPoints');
                this.scene.registry.set('researchPoints', xp + this.xpAmount);
                this.setTint(0x555555);
                // Quick floating text
                const txt = this.scene.add.text(this.x, this.y - 20, '+XP', { fontSize: '14px', color: '#00ff00' }).setOrigin(0.5);
                this.scene.tweens.add({
                    targets: txt,
                    y: this.y - 40,
                    alpha: 0,
                    duration: 1000,
                    onComplete: () => txt.destroy()
                });
            }
        } catch (e: any) {
            console.error("Crash in Flora scan: ", e);
        }
    }
}

export class Artifact extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'artifact');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Float animation
        scene.tweens.add({
            targets: this,
            y: y - 20,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    collect() {
        this.scene.events.emit('win_game');
        this.destroy();
    }
}

export class OxygenBubble extends Phaser.Physics.Arcade.Sprite {
    amount: number;

    constructor(scene: Phaser.Scene, x: number, y: number, amount: number = 20) {
        super(scene, x, y, 'bubble');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.amount = amount;
    }

    collect(player: any) {
        player.currentOxygen = Math.min(player.currentOxygen + this.amount, player.maxOxygen);
        this.scene.events.emit('oxygen_changed', player.currentOxygen);
        
        const txt = this.scene.add.text(this.x, this.y - 20, '+O2', { fontSize: '14px', color: '#00ffff' }).setOrigin(0.5);
        this.scene.tweens.add({
            targets: txt,
            y: this.y - 40,
            alpha: 0,
            duration: 1000,
            onComplete: () => txt.destroy()
        });

        this.destroy();
    }
}

export class ArtifactFragment extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'artifact');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Float animation
        scene.tweens.add({
            targets: this,
            y: y - 10,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Tint to distinguish from main artifact
        this.setTint(0x00ffaa);
        this.setScale(0.5);
    }

    collect() {
        let frags = this.scene.registry.get('fragments') || 0;
        this.scene.registry.set('fragments', frags + 1);
        this.destroy();
    }
}
