import Phaser from 'phaser';
import { Player } from './Player';

export class Predator extends Phaser.Physics.Arcade.Sprite {
    player: Player;
    chaseRadius: number = 400;
    damage: number = 0.5;

    constructor(scene: Phaser.Scene, x: number, y: number, player: Player) {
        super(scene, x, y, 'predator');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.player = player;
    }

    update() {
        if (!this.player.active) {
            this.setVelocity(0, 0);
            return;
        }

        const dist = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);
        
        if (dist < this.chaseRadius) {
            this.scene.physics.moveToObject(this, this.player, 150);
        } else {
            this.setVelocity(0, 0);
        }
    }
}
