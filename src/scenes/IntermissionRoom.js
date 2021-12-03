import "phaser";
import OctoGuy from "../entity/OctoGuy";

export default class IntermissionRoom extends Phaser.Scene {
  constructor() {
    super("IntermissionRoom");
  }

  preload() {
    //First in the preload is to load the tilemap in the form of a .JSON file.
    //The first argument is simply whatever we'd like to call the tileset later, and the second argument is the path to the file.
    //It needs to be included somewhere in our project folder.
    this.load.tilemapTiledJSON(
      "intermissionRoom",
      "assets/backgrounds/intermissionRoom.json"
    );

    //Then we load all of the image files that the tilemap uses (as in, what we used in Tiled to make the tilemap).
    //Again, the first argument is what we're going to call this image later, the second is the path to the image.
    this.load.image("floors", "assets/tilesets/Inside_A2.png");
    this.load.image("walls", "assets/tilesets/NewWalls.png");
    this.load.image("furniture", "assets/tilesets/Inside_Bv2.png");
    this.load.image("tv", "assets/tilesets/!TV_screens.png");

    //Now we'll preload our character as well. Notice the load command here isn't an image, but a spritesheet.
    //The first argument is the key word we'll use to create it later. The second is the path to the sheet.
    //IMPORTANTLY, the third argument is the dimensions of each sprite on your spritesheet!
    this.load.spritesheet(
      "octoGuy",
      "assets/spriteSheets/octoSpriteSheet.png",
      {
        frameWidth: 18,
        frameHeight: 27,
      }
    );

    // this.cursors;
    // this.load.
  }

  create() {
    //In the create method, we need to make the tilemap, where the key's value is the first argument that we passed when loading the tileset.
    const map = this.make.tilemap({ key: "intermissionRoom" });

    //Then we add TilesetImages to our map that we just made. The variable name of these is what we'll call later.
    const floorTiles = map.addTilesetImage("Inside_A2", "floors");
    const wallTiles = map.addTilesetImage("NewWalls", "walls");
    const furnitureTiles = map.addTilesetImage("Inside_Bv2", "furniture");
    const tvTiles = map.addTilesetImage("!TV_screens", "tv");

    //Now we recreate the layers from Tiled. Fairly sure order matters here, so most likely will want to put the lowest layer higher up.
    //The first argument is the NAME OF THE LAYER IN TILED. The second arg is the variable name of the tileset image from above.
    const floor = map.createLayer("floor", floorTiles, 0, 0);
    const walls = map.createLayer("walls", wallTiles, 0, 0);
    const furniture = map.createLayer("furniture", furnitureTiles, 0, 0);
    const tv = map.createLayer("tv", tvTiles, 0, 0);

    //This is where we create our character on screen. We're calling in the OctoGuy component we've created, and assigning all of its accompanying methods to player.
    //The first arg is the scene (this makes sense), then the x coordinate, the y coordinate, and the last is the key that we've named this asset in the preload method.
    //The setScale method dynamically changes the size of the sprite being rendered on screen.
    //Don't forget to import your entity component at the top of the scene file, or it won't load anything!
    this.player = new OctoGuy(this, 300, 200, "octoGuy").setScale(2.3);

    //This looks like a solid block of text, but it's actually pretty intuitive.
    //For this scene, we're setting the cursors property to something other than the default arrow keys.
    //Now, whenever we use cursors.up, it will be bound to the W key, cursors.down is the S key, and so on.
    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    //Here is where we call the createAnimations function that we've created between the create and update methods. If we don't call this here, there won't be any motion!
    this.createAnimations();

    walls.setCollisionBetween(1, 300);
    this.physics.add.collider(this.player, walls);
    // this.physics.add.collider(this.player, furniture);

    // furniture.setCollisionByExclusion(-1, true);
  }

  //This helper function will create our animations for the OctoGuy character walking around on the screen.
  //Notice that it is inside neither the create nor update functions.
  //It's good to note also that animations are global. Once you create them in one scene, you can use them in any scene.
  //Also, after you generate the frame numbers for a spritesheet, subsequent animations using that sheet only use the anims.create method, rather than generating again.
  //They do, however, use the key you created as the first argument when you generated those frame numbers.
  createAnimations() {
    //First, we use this line to generate frame numbers for the spritesheet called octoGuy.
    //There's no "output" of this function, but it makes the individual sprites on the sheet accessible through indices, like an array.
    //The frames are each the size we decided when loading octoGuy in the preload method, so make sure each sprite on the sheet is the same size.
    this.anims.generateFrameNumbers("octoGuy");

    //The "key" key is what we'll use on the entity to utilize this animation.
    //The "frames" key is where we'll pick exactly which frames we want from the spritesheet, and put them in the order we want for the animation.
    //Duration indicates how long the frame will last. Not sure if it matters terribly, but if you don't include a duration, you'll get an error.
    //FrameRate is the speed which you cycle through the frames in your animation. Higher frameRate is a faster cycle.
    this.anims.create({
      key: "walkDown",
      frames: [
        { key: "octoGuy", frame: 0 },
        { key: "octoGuy", frame: 1 },
        { key: "octoGuy", frame: 2 },
        { key: "octoGuy", frame: 1, duration: 50 },
      ],
      frameRate: 5,
      repeat: 0,
    });

    this.anims.create({
      key: "walkUp",
      frames: [
        { key: "octoGuy", frame: 9 },
        { key: "octoGuy", frame: 10 },
        { key: "octoGuy", frame: 11 },
        { key: "octoGuy", frame: 10, duration: 50 },
      ],
      frameRate: 5,
      repeat: 0,
    });

    this.anims.create({
      key: "walkLeft",
      frames: [
        { key: "octoGuy", frame: 3 },
        { key: "octoGuy", frame: 4 },
        { key: "octoGuy", frame: 5 },
        { key: "octoGuy", frame: 4, duration: 50 },
      ],
      frameRate: 5,
      repeat: 0,
    });

    this.anims.create({
      key: "walkRight",
      frames: [
        { key: "octoGuy", frame: 6 },
        { key: "octoGuy", frame: 7 },
        { key: "octoGuy", frame: 8 },
        { key: "octoGuy", frame: 7, duration: 50 },
      ],
      frameRate: 5,
      repeat: 0,
    });

    this.anims.create({
      key: "idleDown",
      frames: [{ key: "octoGuy", frame: 1, duration: 50 }],
      framerate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: "idleUp",
      frames: [{ key: "octoGuy", frame: 10, duration: 50 }],
      framerate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: "idleLeft",
      frames: [{ key: "octoGuy", frame: 4, duration: 50 }],
      framerate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: "idleRight",
      frames: [{ key: "octoGuy", frame: 8, duration: 50 }],
      framerate: 10,
      repeat: 0,
    });
  }

  //The update method handles changes to the various pieces of the scene.
  update(time, delta) {
    //Here, we're sending a call to the update function attached to this.player. In this case, it's OctoGuy's update function.
    //Note that we're passing our custom cursors through. The arguments of update will be everything OctoGuy's update function is looking for.
    this.player.update(this.cursors);
  }
}
