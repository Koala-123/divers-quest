import Phaser from 'phaser';

export class FabricatorScene extends Phaser.Scene {
    constructor() {
        super('FabricatorScene');
    }

    create() {
        const { width, height } = this.scale;

        this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.8);
        this.add.text(width / 2, height * 0.2, 'FABRICATOR BAY', { fontSize: '28px', color: '#ffaa00' }).setOrigin(0.5);

        const salvageText = this.add.text(width / 2, height * 0.3, `Salvage: ${this.registry.get('salvage')}`, { fontSize: '20px' }).setOrigin(0.5);

        const o2Btn = this.add.text(width / 2, height * 0.5, 'Upgrade O2 (50 Salvage)', { backgroundColor: '#444', padding: { x: 10, y: 10 } })
            .setOrigin(0.5).setInteractive();
        
        o2Btn.on('pointerdown', () => {
            let salvage = this.registry.get('salvage');
            if (salvage >= 50) {
                this.registry.set('salvage', salvage - 50);
                this.registry.set('maxOxygen', this.registry.get('maxOxygen') + 20);
                salvageText.setText(`Salvage: ${this.registry.get('salvage')}`);
                this.showFeedback(o2Btn.x, o2Btn.y - 30, '-50 Salvage', '#ff0000');
                
                o2Btn.disableInteractive();
                o2Btn.setText('Upgraded!');
                o2Btn.setBackgroundColor('#00cc00');
                this.time.delayedCall(2000, () => {
                    o2Btn.setText('Upgrade O2 (50 Salvage)');
                    o2Btn.setBackgroundColor('#444');
                    o2Btn.setInteractive();
                });
            } else {
                this.showFeedback(o2Btn.x, o2Btn.y - 30, 'Not enough Salvage!', '#ff0000');
                o2Btn.disableInteractive();
                o2Btn.setBackgroundColor('#cc0000');
                this.time.delayedCall(500, () => {
                    o2Btn.setBackgroundColor('#444');
                    o2Btn.setInteractive();
                });
            }
        });

        const closeBtn = this.add.text(width / 2, height * 0.85, 'Close', { backgroundColor: '#800', padding: { x: 10, y: 10 } })
            .setOrigin(0.5).setInteractive();
        closeBtn.on('pointerdown', () => {
            this.scene.stop();
            const hub = this.scene.get('HubScene');
            if(hub) hub.scene.restart();
        });

        this.scale.on('resize', () => { this.scene.restart(); });
    }

    showFeedback(x: number, y: number, msg: string, color: string) {
        const txt = this.add.text(x, y, msg, { fontSize: '18px', color: color, fontStyle: 'bold' }).setOrigin(0.5);
        this.tweens.add({
            targets: txt,
            y: y - 30,
            alpha: 0,
            duration: 1000,
            onComplete: () => txt.destroy()
        });
    }
}
