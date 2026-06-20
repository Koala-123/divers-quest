import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { TutorialScene } from './scenes/TutorialScene';
import { HubScene } from './scenes/HubScene';
import { FabricatorScene } from './ui/FabricatorScene';
import { QuestBoardScene } from './ui/QuestBoardScene';
import { DiveScene } from './scenes/DiveScene';
import { DiveHUD } from './ui/DiveHUD';
import { SettingsScene } from './ui/SettingsScene';
import { WinScene } from './scenes/WinScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%',
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    backgroundColor: '#001a33',
    pixelArt: true,
    scene: [BootScene, TutorialScene, HubScene, FabricatorScene, QuestBoardScene, DiveScene, DiveHUD, SettingsScene, WinScene]
};

new Phaser.Game(config);
