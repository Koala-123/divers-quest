import Phaser from 'phaser';

export class WinScene extends Phaser.Scene {
    constructor() {
        super('WinScene');
    }

    create() {
        const { width, height } = this.scale;
        
        this.add.rectangle(width/2, height/2, width, height, 0x000000, 1.0);
        
        this.add.text(width/2, height/2 - 50, 'YOU WIN!', {
            fontSize: '64px',
            color: '#ffff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(width/2, height/2 + 20, 'You recovered the Ancient Artifact from the depths!', {
            fontSize: '24px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        const btn = this.add.text(width/2, height/2 + 100, 'Return to Hub', {
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#333333',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();
        
        btn.on('pointerdown', () => {
            this.scene.start('HubScene');
        });
        
        this.scale.on('resize', () => { this.scene.restart(); });
    }
}
