import 'phaser';

export default class OctoGuy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey, socket) {
    super(scene, x, y, spriteKey);

    //Here, we're prepping our octoGuy to be added to any scene.
    //By putting him in his own entity, we're making him modular, to be used in any scene we want, rather than defining him again every scene.
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.socket = socket;

    //The facing object here is used to keep track of which direction the character is facing so that we can play the correct idle animation when movement stops.
    this.facing = {
      left: false,
      right: false,
      up: false,
      down: false,
    };
  }

  //This helper function handles his movement around the game world.
  updateMovement(cursors) {
    //Here we're moving left. The argument is the speed. Lower speeds will move your character more slowly across the screen.
    //Note that negative numbers don't represent a slower speed. Speeds start at 0 and increase in both directions. Negative numbers change direction of movement.
    //The second argument for the animation, true, needs to be true in order for the animation to fire while the button is pressed.
    //If it's left out, or turned to false, it will run when the key is released, rather than when it's pressed.
    if (cursors.left.isDown) {
      if (!cursors.up.isDown && !cursors.down.isDown) {
        this.play('walkLeft', true);
      }
      this.setVelocityX(-150);
      this.facing.left = true;
    }

    //This moves right.
    //Notice we're setting the right facing to true. It comes in handy once we stop moving.
    else if (cursors.right.isDown) {
      if (!cursors.up.isDown && !cursors.down.isDown) {
        this.play('walkRight', true);
      }
      this.setVelocityX(150);
      this.facing.right = true;
    }
    //This line stops movement when neither left nor right are being pressed.
    //In the if statement, we're checking whether right or left were pressed, and if so, we immediately interrupt the animation with another, which is just a single frame.
    //Without this, the animation wants to "finish" running through all the unfinished frames when we let off the key.
    //Now, no matter where in the animation we are, we stop dead. We also set left and right facing back to false so we don't ALWAYS face that way.
    else {
      this.setVelocityX(0);

      if (this.facing.left === true) {
        this.play('idleLeft');
      } else if (this.facing.right === true) {
        this.play('idleRight');
      }

      this.facing.left = false;
      this.facing.right = false;
    }

    // This moves up.
    //It's a little counterintuitive that negative y values move the sprite up on the screen, so be aware of that.
    if (
      cursors.up.isDown ||
      (cursors.up.isDown && cursors.left.isDown) ||
      (cursors.up.isDown && cursors.right.isDown)
    ) {
      this.play('walkUp', true);
      this.setVelocityY(-150);
      this.facing.up = true;
    }

    // This moves down and activates the animation walkDown, which was declared in the scene.
    else if (
      cursors.down.isDown ||
      (cursors.down.isDown && cursors.left.isDown) ||
      (cursors.down.isDown && cursors.right.isDown)
    ) {
      this.play('walkDown', true);
      this.setVelocityY(150);
      this.facing.down = true;
    }

    //This line simply removes any velocity attached to the player when no up or down key is being pressed. We're also idling facing in the direction we traveled last.
    else {
      this.setVelocityY(0);

      if (this.facing.up === true) {
        this.play('idleUp');
      } else if (this.facing.down === true) {
        this.play('idleDown');
      }

      this.facing.up = false;
      this.facing.down = false;
    }
  }

  //Update methods check for any changes. In this case, we're specifically looking for button presses (our cursors argument).
  //Not only does update check for changes, but it can also carry out a function (or several) in response to that change.
  //This particular function checks which controller button is being pushed and executes a movement & animation in response.
  update(cursors) {
    this.updateMovement(cursors);
  }
}
