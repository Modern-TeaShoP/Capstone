import "phaser";

export default class BgScene extends Phaser.Scene {
    constructor() {
        super("BgScene");
    }

    preload() {
        // Preload Sprites
        // << LOAD SPRITE HERE >>
        this.load.image("background", "assets/backgrounds/example.png");
    }

    create() {
        // Create Sprites
        // << CREATE SPRITE HERE >>
        this.add.image(-20, 0, "background").setOrigin(0).setScale(0.5);
    }
}
