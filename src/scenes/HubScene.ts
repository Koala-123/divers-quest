import Phaser from 'phaser';
import { DataManager } from '../systems/DataManager';

export class HubScene extends Phaser.Scene {
    dataManager!: DataManager;

    constructor() {
        super('HubScene');
    }

    create() {
        this.dataManager = new DataManager(this.registry);
        const { width, height } = this.scale;

        this.add.text(width / 2, height * 0.1, 'SUBMARINE HUB', {
            fontSize: '32px',
            color: '#00ffff'
        }).setOrigin(0.5);

        const createButton = (y: number, text: string, callback: () => void) => {
            const btn = this.add.text(width / 2, y, text, {
                fontSize: '24px',
                color: '#ffffff',
                backgroundColor: '#333333',
                padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            btn.on('pointerdown', callback);
            return btn;
        };

        createButton(height * 0.3, 'Start Dive', () => {
            this.scene.start('DiveScene');
        });

        createButton(height * 0.5, 'Fabricator Bay', () => {
            this.scene.launch('FabricatorScene');
        });

        createButton(height * 0.7, 'Quest Board', () => {
            this.scene.launch('QuestBoardScene');
        });

        // Display current stats
        this.add.text(20, 20, `Salvage: ${this.registry.get('salvage')}\nBalloons: ${this.registry.get('balloons')}`, { fontSize: '20px' });
        this.add.text(20, 70, `Lvl ${this.registry.get('diverLevel')}`, { fontSize: '20px', color: '#ff00ff', fontStyle: 'bold' });

        this.add.text(width / 2, height * 0.40, `Max Oxygen: ${this.registry.get('maxOxygen')}`, { fontSize: '24px', color: '#00ffff' }).setOrigin(0.5);
        this.add.text(width / 2, height * 0.45, `Max Lives: ${this.registry.get('maxHealth')}`, { fontSize: '24px', color: '#ff0000' }).setOrigin(0.5);
        
        const maxXP = this.registry.get('diverLevel') * 100;
        const currentXP = this.registry.get('researchPoints');
        const pct = Math.min(currentXP / maxXP, 1);
        
        this.add.rectangle(80, 75, 200, 15, 0x333333).setOrigin(0, 0);
        this.add.rectangle(80, 75, 200 * pct, 15, 0xff00ff).setOrigin(0, 0);
        this.add.text(180, 74, `${currentXP} / ${maxXP}`, { fontSize: '14px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5, 0);

        const settingsBtn = this.add.text(width - 20, 20, '⚙ Settings', { fontSize: '20px', color: '#ffffff', backgroundColor: '#333', padding: {x: 10, y: 5} }).setOrigin(1, 0).setInteractive();
        settingsBtn.on('pointerdown', () => {
            this.scene.launch('SettingsScene', { fromDive: false });
        });

        this.scale.on('resize', this.resize, this);
    }

    resize(gameSize: Phaser.Structs.Size) {
        this.cameras.main.setViewport(0, 0, gameSize.width, gameSize.height);
        this.scene.restart();
    }
}
