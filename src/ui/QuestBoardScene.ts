import Phaser from 'phaser';

export class QuestBoardScene extends Phaser.Scene {
    constructor() {
        super('QuestBoardScene');
    }

    create() {
        const { width, height } = this.scale;

        this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.8);
        this.add.text(width / 2, height * 0.2, 'QUEST BOARD', { fontSize: '28px', color: '#00ffaa' }).setOrigin(0.5);

        let activeQuests: string[] = this.registry.get('activeQuests') || [];
        
        const questText = this.add.text(width / 2, height * 0.4, 
            activeQuests.length > 0 ? activeQuests.join('\n') : 'No active quests.', 
            { fontSize: '20px', align: 'center' }).setOrigin(0.5);

        const acceptBtn = this.add.text(width / 2, height * 0.6, 'Accept Sample Quest', { backgroundColor: '#444', padding: { x: 10, y: 10 } })
            .setOrigin(0.5).setInteractive();
        
        acceptBtn.on('pointerdown', () => {
            if (!activeQuests.includes("Sample Quest")) {
                activeQuests.push("Sample Quest");
                this.registry.set('activeQuests', activeQuests);
                questText.setText(activeQuests.join('\n'));
            }
        });

        const closeBtn = this.add.text(width / 2, height * 0.8, 'Close', { backgroundColor: '#800', padding: { x: 10, y: 10 } })
            .setOrigin(0.5).setInteractive();
        closeBtn.on('pointerdown', () => {
            this.scene.stop();
        });

        this.scale.on('resize', () => { this.scene.restart(); });
    }
}
