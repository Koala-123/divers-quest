import Phaser from 'phaser';

export class TutorialScene extends Phaser.Scene {
    constructor() {
        super('TutorialScene');
    }

    create() {
        const { width, height } = this.scale;
        
        this.add.text(width / 2, height * 0.1, 'Welcome to Diver\'s Quest', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Control Instructions
        this.add.text(width / 2, height * 0.25, 
            'CONTROLS:\n' +
            'Desktop: WASD or Arrow Keys to move.\n' +
            'Mobile: Touch left side for joystick.', {
            fontSize: '18px',
            color: '#aaaaaa',
            align: 'center'
        }).setOrigin(0.5);

        // Explanations for Interactables
        const startY = height * 0.45;
        const spacing = 45;

        this.add.image(width / 2 - 200, startY, 'bubble');
        this.add.text(width / 2 - 160, startY, 'Oxygen Bubbles: Refill your Oxygen meter.', { fontSize: '18px', color: '#00ffff' }).setOrigin(0, 0.5);

        this.add.image(width / 2 - 200, startY + spacing, 'flora');
        this.add.text(width / 2 - 160, startY + spacing, 'Flora: Scan (touch them) for Research Points.', { fontSize: '18px', color: '#00ffaa' }).setOrigin(0, 0.5);

        this.add.image(width / 2 - 200, startY + spacing * 2, 'salvage');
        this.add.text(width / 2 - 160, startY + spacing * 2, 'Salvage: Collect to upgrade gear at the Hub.', { fontSize: '18px', color: '#ffff00' }).setOrigin(0, 0.5);

        this.add.image(width / 2 - 200, startY + spacing * 3, 'predator');
        this.add.text(width / 2 - 160, startY + spacing * 3, 'Predators: Avoid them! They damage your suit.', { fontSize: '18px', color: '#ff5555' }).setOrigin(0, 0.5);

        this.add.text(width / 2, height * 0.75, 
            'If Oxygen or Suit Integrity hit 0, your emergency balloon deploys!\n' +
            'You will be saved, but you will lose 50% of unbanked salvage.', {
            fontSize: '16px',
            color: '#aaaaaa',
            align: 'center'
        }).setOrigin(0.5);

        const startBtn = this.add.text(width / 2, height * 0.9, '[ START GAME ]', {
            fontSize: '24px',
            color: '#00ff00',
            backgroundColor: '#003300',
            padding: { x: 10, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        startBtn.on('pointerdown', () => {
            this.scene.start('HubScene');
        });
        
        this.scale.on('resize', this.resize, this);
    }

    resize(gameSize: Phaser.Structs.Size) {
        this.cameras.main.setViewport(0, 0, gameSize.width, gameSize.height);
        this.scene.restart();
    }
}
