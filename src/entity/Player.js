import "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, spriteKey) {
        super(scene, x, y, spriteKey);

        // << INITIALIZE PLAYER ATTRIBUTES HERE >>
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
    }
    updateMovement(cursors) {
        // Move left
        if (cursors.left.isDown) {
            this.setVelocityX(-360);
        }
        // Move right
        else if (cursors.right.isDown) {
            this.setVelocityX(360);
        }
        // Neutral (no movement)
        else {
            this.setVelocityX(0);
        }
    }

    // Check which controller button is being pushed and execute movement & animation
    update(cursors) {
        this.updateMovement(cursors);
    }
}
