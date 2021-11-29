import Player from "../entity/Player";
import Ground from "../entity/Ground";

export default class FgScene extends Phaser.Scene {
    constructor() {
        super("FgScene");
    }

    createGround(x, y) {
        this.groundGroup.create(x, y, "ground");
    }

    preload() {
        // Preload Sprites
        // << LOAD SPRITES HERE >>
        this.load.spritesheet("octo", "assets/spriteSheets/octo.png", {
            frameWidth: 18,
            frameHeight: 18,
        });
        this.load.image("ground", "assets/sprites/ground.png");

        // Preload Sounds
        // << LOAD SOUNDS HERE >>
    }

    create() {
        // Create game entities
        // << CREATE GAME ENTITIES HERE >>
        // this.player = new Player(this, 20, 400, "octo").setScale(2.0);
        this.groundGroup = this.physics.add.staticGroup({ classType: Ground });
        this.createGround(160, 540);
        this.createGround(600, 540);
        // this.physics.add.collider(this.player, this.groundGroup);
        // this.cursors = this.input.keyboard.createCursorKeys();
        // Create sounds
        // << CREATE SOUNDS HERE >>
        // Create collisions for all entities
        // << CREATE COLLISIONS HERE >>
    }

    // time: total time elapsed (ms)
    // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
    // update(time, delta) {
    //     // << DO UPDATE LOGIC HERE >>
    //     this.player.update(this.cursors);
    // }
}
