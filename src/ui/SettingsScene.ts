import Phaser from 'phaser';

export class SettingsScene extends Phaser.Scene {
    fromDive: boolean = false;

    constructor() {
        super('SettingsScene');
    }

    init(data: any) {
        this.fromDive = data.fromDive || false;
    }

    create() {
        const { width, height } = this.scale;

        this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.9);
        this.add.text(width / 2, height * 0.2, this.fromDive ? 'PAUSED' : 'SETTINGS', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5);

        const resumeBtn = this.add.text(width / 2, height * 0.4, 'Resume', { backgroundColor: '#444', padding: { x: 20, y: 10 } })
            .setOrigin(0.5).setInteractive();
        
        resumeBtn.on('pointerdown', () => {
            if (this.fromDive) {
                const diveScene = this.scene.get('DiveScene');
                if (diveScene && diveScene.scene.isPaused()) {
                    diveScene.scene.resume();
                }
            }
            this.scene.stop();
        });

        let soundOn = this.registry.get('sound') !== false;
        const soundBtn = this.add.text(width / 2, height * 0.55, `Sound: ${soundOn ? 'ON' : 'OFF'}`, { backgroundColor: '#444', padding: { x: 20, y: 10 } })
            .setOrigin(0.5).setInteractive();
        soundBtn.on('pointerdown', () => {
            soundOn = !soundOn;
            this.registry.set('sound', soundOn);
            soundBtn.setText(`Sound: ${soundOn ? 'ON' : 'OFF'}`);
        });

        if (this.fromDive) {
            const quitBtn = this.add.text(width / 2, height * 0.7, 'Quit to Hub', { backgroundColor: '#800', padding: { x: 20, y: 10 } })
                .setOrigin(0.5).setInteractive();
            quitBtn.on('pointerdown', () => {
                this.scene.stop('DiveHUD');
                this.scene.stop('DiveScene');
                this.scene.stop();
                this.scene.start('HubScene');
            });
        }
        
        this.scale.on('resize', () => { this.scene.restart(); });
    }
}
