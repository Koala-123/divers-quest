import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { InputManager } from '../systems/InputManager';
import { Salvage, Flora, OxygenBubble, Artifact } from '../entities/Interactables';
import { Predator } from '../entities/Predator';

export class DiveScene extends Phaser.Scene {
    player!: Player;
    inputManager!: InputManager;
    salvageGroup!: Phaser.Physics.Arcade.Group;
    floraGroup!: Phaser.Physics.Arcade.Group;
    oxygenGroup!: Phaser.Physics.Arcade.Group;
    predatorGroup!: Phaser.Physics.Arcade.Group;
    helmetLight!: Phaser.GameObjects.Light;

    // For greed mechanic tracking
    startingSalvage: number = 0;

    constructor() {
        super('DiveScene');
    }

    create() {
        this.startingSalvage = this.registry.get('salvage');

        // Lighting
        this.lights.enable();
        this.lights.setAmbientColor(0x333344);

        // Setup world bounds for depth
        this.physics.world.setBounds(0, 0, 2000, 5000);
        this.cameras.main.setBounds(0, 0, 2000, 5000);

        const platforms = this.physics.add.staticGroup();
        platforms.create(1000, 5000, 'diver').setScale(2000, 1).refreshBody();

        this.inputManager = new InputManager(this);
        this.player = new Player(this, 1000, 100, this.inputManager);
        this.player.setPipeline('Light2D');

        this.helmetLight = this.lights.addLight(this.player.x, this.player.y, 300, 0xffffff, 2.0);

        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        this.salvageGroup = this.physics.add.group({ classType: Salvage });
        this.floraGroup = this.physics.add.group({ classType: Flora });
        this.oxygenGroup = this.physics.add.group({ classType: OxygenBubble });
        this.predatorGroup = this.physics.add.group({ classType: Predator, runChildUpdate: true });

        for(let i=0; i<20; i++) {
            const x = Phaser.Math.Between(100, 1900);
            const y = Phaser.Math.Between(500, 4800);
            let s = new Salvage(this, x, y);
            s.setPipeline('Light2D');
            this.salvageGroup.add(s);
            
            const fx = Phaser.Math.Between(100, 1900);
            const fy = Phaser.Math.Between(500, 4800);
            let f = new Flora(this, fx, fy);
            f.setPipeline('Light2D');
            this.floraGroup.add(f);
        }

        for(let i=0; i<30; i++) {
            const ox = Phaser.Math.Between(100, 1900);
            const oy = Phaser.Math.Between(500, 4800);
            let b = new OxygenBubble(this, ox, oy);
            b.setPipeline('Light2D');
            this.oxygenGroup.add(b);
        }

        // Add some predators
        for(let i=0; i<5; i++) {
            const px = Phaser.Math.Between(100, 1900);
            const py = Phaser.Math.Between(1000, 4800);
            let p = new Predator(this, px, py, this.player);
            p.setPipeline('Light2D');
            this.predatorGroup.add(p);
        }

        this.physics.add.collider(this.player, platforms);
        
        this.physics.add.overlap(this.player, this.salvageGroup, (_p, s) => {
            (s as Salvage).collect();
        });

        this.physics.add.overlap(this.player, this.floraGroup, (_p, f) => {
            (f as Flora).scan();
        });

        this.physics.add.overlap(this.player, this.oxygenGroup, (pObj, o) => {
            (o as OxygenBubble).collect(pObj);
        });

        this.physics.add.collider(this.player, this.predatorGroup, (pObj, predObj) => {
            const p = pObj as Player;
            const pred = predObj as Predator;
            p.takeDamage(pred.damage);
            // Bounce player back to prevent multiple hits instantly
            const bounce = new Phaser.Math.Vector2(p.x - pred.x, p.y - pred.y).normalize();
            p.setVelocity(bounce.x * 500, bounce.y * 500);
        });

        // The ultimate goal: Ancient Artifact
        const artifact = new Artifact(this, 1000, 4900);
        artifact.setPipeline('Light2D');
        this.physics.add.overlap(this.player, artifact, (_p, a) => {
            (a as Artifact).collect();
        });

        this.events.on('win_game', () => {
            this.scene.stop('DiveHUD');
            this.scene.start('WinScene');
        });

        this.scene.launch('DiveHUD');
        this.events.on('emergency_extraction', this.handleEmergencyExtraction, this);
        this.scale.on('resize', this.resize, this);
    }

    update(_time: number, delta: number) {
        this.player.update(_time, delta);

        // Update light position
        this.helmetLight.x = this.player.x;
        this.helmetLight.y = this.player.y;

        // Darken ambient light as depth increases
        const depth = this.player.y;
        let ambientIntensity = Math.max(0.05, 1.0 - (depth / 3000));
        // Convert to hex
        let val = Math.floor(ambientIntensity * 255);
        let color = Phaser.Display.Color.GetColor(val, val, val);
        this.lights.setAmbientColor(color);
    }

    resize(gameSize: Phaser.Structs.Size) {
        this.cameras.main.setViewport(0, 0, gameSize.width, gameSize.height);
        this.inputManager.resize(gameSize);
    }

    handleEmergencyExtraction() {
        console.log("Emergency Extraction Triggered!");
        this.player.body!.stop();
        this.player.active = false;
        
        let currentSalvage = this.registry.get('salvage');
        let unbanked = currentSalvage - this.startingSalvage;
        if (unbanked > 0) {
            let penalty = Math.floor(unbanked * 0.5);
            this.registry.set('salvage', currentSalvage - penalty);
            console.log(`Penalty applied! Lost ${penalty} salvage.`);
        }

        let balloons = this.registry.get('balloons');
        this.registry.set('balloons', balloons - 1);

        if (balloons - 1 <= 0) {
            console.log("Game Over!");
            this.registry.set('salvage', 0);
            this.registry.set('balloons', 3);
        }

        this.scene.stop('DiveHUD');
        this.scene.start('HubScene');
    }
}
