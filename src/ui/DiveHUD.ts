import Phaser from 'phaser';

export class DiveHUD extends Phaser.Scene {
    oxygenText!: Phaser.GameObjects.Text;
    healthText!: Phaser.GameObjects.Text;
    salvageText!: Phaser.GameObjects.Text;
    fragmentText!: Phaser.GameObjects.Text;
    levelText!: Phaser.GameObjects.Text;
    xpBarBg!: Phaser.GameObjects.Rectangle;
    xpBarFill!: Phaser.GameObjects.Rectangle;
    xpBarText!: Phaser.GameObjects.Text;
    depthText!: Phaser.GameObjects.Text;
    pauseBtn!: Phaser.GameObjects.Text;
    hearts: Phaser.GameObjects.Image[] = [];

    constructor() {
        super('DiveHUD');
    }

    create() {
        this.hearts = [];
        this.oxygenText = this.add.text(20, 20, 'Oxygen: 100', { fontSize: '20px', color: '#00ffff' });
        
        for (let i = 0; i < 5; i++) {
            let h = this.add.image(30 + i * 40, 60, 'heart_full').setOrigin(0.5);
            this.hearts.push(h);
        }

        this.salvageText = this.add.text(20, 90, `Salvage: ${this.registry.get('salvage')}`, { fontSize: '20px', color: '#ffff00' });
        this.fragmentText = this.add.text(20, 115, `Fragments: ${this.registry.get('fragments') || 0}/3`, { fontSize: '20px', color: '#00ffaa' });

        this.depthText = this.add.text(this.scale.width / 2, 20, 'Depth: 1000m / 4900m', { fontSize: '24px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5, 0);

        this.pauseBtn = this.add.text(this.scale.width - 20, 20, '|| PAUSE', { fontSize: '20px', color: '#ffffff', backgroundColor: '#333', padding: {x: 10, y: 5} })
            .setOrigin(1, 0)
            .setInteractive();
        
        this.pauseBtn.on('pointerdown', () => {
            this.scene.pause('DiveScene');
            this.scene.launch('SettingsScene', { fromDive: true });
        });

        // Listen for events from DiveScene
        const diveScene = this.scene.get('DiveScene') as any;
        if (diveScene && diveScene.events) {
            diveScene.events.on('oxygen_changed', (ox: number) => {
                this.oxygenText.setText(`Oxygen: ${Math.floor(ox)}`);
            });
            diveScene.events.on('health_changed', (hp: number) => {
                this.updateHearts(hp);
            });
        }

        const updateSalvage = (_parent: any, value: number) => {
            if (this.salvageText && this.salvageText.active) {
                this.salvageText.setText(`Salvage: ${value}`);
            }
        };

        const updateFragments = (_parent: any, value: number) => {
            if (this.fragmentText && this.fragmentText.active) {
                if (value >= 3) {
                    this.fragmentText.setText(`TRUE ARTIFACT REVEALED AT 4900m!`);
                    this.fragmentText.setColor('#ff0000');
                    this.fragmentText.setFontStyle('bold');
                } else {
                    this.fragmentText.setText(`Fragments: ${value}/3`);
                }
            }
        };

        this.levelText = this.add.text(20, 140, `Lvl ${this.registry.get('diverLevel')}`, { fontSize: '20px', color: '#ff00ff', fontStyle: 'bold' });
        this.xpBarBg = this.add.rectangle(80, 145, 200, 15, 0x333333).setOrigin(0, 0);
        this.xpBarFill = this.add.rectangle(80, 145, 0, 15, 0xff00ff).setOrigin(0, 0);
        this.xpBarText = this.add.text(180, 144, '', { fontSize: '14px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5, 0);
        this.updateXPBar();

        const updateXP = () => this.updateXPBar();
        const onLevelUp = (newLevel: number) => {
            const lvlUpText = this.add.text(this.scale.width / 2, this.scale.height / 3, `LEVEL UP!\nLevel ${newLevel}\n+50 Max Oxygen\nRestored Lives`, { fontSize: '32px', color: '#ffff00', fontStyle: 'bold', align: 'center' }).setOrigin(0.5);
            this.tweens.add({
                targets: lvlUpText,
                y: this.scale.height / 3 - 50,
                alpha: 0,
                duration: 3000,
                ease: 'Power2',
                onComplete: () => lvlUpText.destroy()
            });
            
            const diveScene = this.scene.get('DiveScene') as any;
            if (diveScene && diveScene.player && diveScene.scene.isActive()) {
                diveScene.player.maxOxygen = this.registry.get('maxOxygen');
                diveScene.player.maxHealth = this.registry.get('maxHealth');
                diveScene.player.currentOxygen = diveScene.player.maxOxygen;
                diveScene.player.currentHealth = diveScene.player.maxHealth;
                diveScene.events.emit('oxygen_changed', diveScene.player.currentOxygen);
                diveScene.events.emit('health_changed', diveScene.player.currentHealth);
            }
        };

        // Listen for salvage changes in registry
        this.registry.events.on('changedata-salvage', updateSalvage);
        this.registry.events.on('changedata-fragments', updateFragments);
        this.registry.events.on('changedata-researchPoints', updateXP);
        this.registry.events.on('changedata-diverLevel', updateXP);
        this.registry.events.on('level_up', onLevelUp);

        this.events.once('shutdown', () => {
            this.registry.events.off('changedata-salvage', updateSalvage);
            this.registry.events.off('changedata-fragments', updateFragments);
            this.registry.events.off('changedata-researchPoints', updateXP);
            this.registry.events.off('changedata-diverLevel', updateXP);
            this.registry.events.off('level_up', onLevelUp);
        });

        this.scale.on('resize', this.resize, this);
    }

    resize(gameSize: Phaser.Structs.Size) {
        if (this.pauseBtn) {
            this.pauseBtn.setPosition(gameSize.width - 20, 20);
        }
        if (this.depthText) {
            this.depthText.setPosition(gameSize.width / 2, 20);
        }
    }

    update() {
        const diveScene = this.scene.get('DiveScene') as any;
        if (diveScene && diveScene.player && diveScene.scene.isActive()) {
            let currentDepth = Math.floor(diveScene.player.y);
            this.depthText.setText(`Depth: ${currentDepth}m / 4900m`);
        }
    }

    updateXPBar() {
        let level = this.registry.get('diverLevel');
        let xp = this.registry.get('researchPoints');
        let maxXP = level * 100;
        this.levelText.setText(`Lvl ${level}`);
        this.xpBarText.setText(`${xp} / ${maxXP}`);
        let pct = Math.min(xp / maxXP, 1);
        this.xpBarFill.width = 200 * pct;
    }

    updateHearts(hp: number) {
        try {
            for (let i = 0; i < 5; i++) {
                if (!this.hearts || !this.hearts[i]) continue;
                if (hp >= i + 1) {
                    this.hearts[i].setTexture('heart_full');
                } else if (hp > i) {
                    this.hearts[i].setTexture('heart_half');
                } else {
                    this.hearts[i].setTexture('heart_empty');
                }
            }
        } catch (e: any) {
            console.error("Error in updateHearts", e);
        }
    }
}
