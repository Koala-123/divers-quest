import Phaser from 'phaser';

export class InputManager {
    scene: Phaser.Scene;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    wasd: any;
    joyStick: any;
    isUsingTouch: boolean = false;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.cursors = scene.input.keyboard!.createCursorKeys();
        this.wasd = scene.input.keyboard!.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Initialize Virtual Joystick
        this.joyStick = (scene as any).plugins.get('rexvirtualjoystickplugin').add(scene, {
            x: 100,
            y: scene.scale.height - 100,
            radius: 50,
            base: scene.add.circle(0, 0, 50, 0x888888, 0.5).setDepth(100),
            thumb: scene.add.circle(0, 0, 25, 0xcccccc, 0.8).setDepth(100),
            dir: '8dir',
            forceMin: 16,
        });

        // Fix joystick to camera so it doesn't move with world
        // Or if in a UI scene, we don't need this. Assuming we create InputManager in the main scene.
        this.joyStick.base.setScrollFactor(0);
        this.joyStick.thumb.setScrollFactor(0);

        this.joyStick.base.setVisible(false);
        this.joyStick.thumb.setVisible(false);

        scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.wasTouch) {
                this.isUsingTouch = true;
                this.joyStick.base.setVisible(true);
                this.joyStick.thumb.setVisible(true);
            }
        });

        scene.input.keyboard!.on('keydown', () => {
            this.isUsingTouch = false;
            this.joyStick.base.setVisible(false);
            this.joyStick.thumb.setVisible(false);
        });

        scene.scale.on('resize', this.resize, this);
    }

    resize(gameSize: Phaser.Structs.Size) {
        if (this.joyStick) {
            this.joyStick.x = 100;
            this.joyStick.y = gameSize.height - 100;
        }
    }

    getVector(): Phaser.Math.Vector2 {
        let vec = new Phaser.Math.Vector2(0, 0);

        if (this.isUsingTouch && this.joyStick.force > 0) {
            vec.x = Math.cos(this.joyStick.angle * Phaser.Math.DEG_TO_RAD);
            vec.y = Math.sin(this.joyStick.angle * Phaser.Math.DEG_TO_RAD);
            return vec.normalize();
        }

        if (this.cursors.left.isDown || this.wasd.left.isDown) vec.x -= 1;
        if (this.cursors.right.isDown || this.wasd.right.isDown) vec.x += 1;
        if (this.cursors.up.isDown || this.wasd.up.isDown) vec.y -= 1;
        if (this.cursors.down.isDown || this.wasd.down.isDown) vec.y += 1;

        return vec.normalize();
    }
}
