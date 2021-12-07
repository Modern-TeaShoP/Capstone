import 'phaser';
import OctoGuy from '../entity/OctoGuy';
import Furniture from '../entity/Furniture';

export default class IntermissionRoom extends Phaser.Scene {
  constructor() {
    super('IntermissionRoom');
    this.state = {};
  }
  init(data) {
    this.socket = data.socket;
  }

  preload() {
    //First in the preload is to load the tilemap in the form of a .JSON file.
    //The first argument is simply whatever we'd like to call the tileset later, and the second argument is the path to the file.
    //It needs to be included somewhere in our project folder.
    this.load.tilemapTiledJSON(
      'intermissionRoom',
      'assets/backgrounds/intermissionRoom.json'
    );

    //Then we load all of the image files that the tilemap uses (as in, what we used in Tiled to make the tilemap).
    //Again, the first argument is what we're going to call this image later, the second is the path to the image.
    this.load.image('floors', 'assets/tilesets/Inside_A2.png');
    this.load.image('walls', 'assets/tilesets/NewWalls.png');
    this.load.image('furniture', 'assets/tilesets/Inside_Bv2.png');
    this.load.image('tv', 'assets/tilesets/!TV_screens.png');

    //Just for ease of reading, I've separated the images I want to collide with from the tilesets. These follow the same parameter conventions as above.
    //I'm too dumb to figure out how to import collisions from Tiled, so we're gonna do this the old fashioned way.
    this.load.image('wallCollider', 'assets/colliders/WallCollider.png');
    this.load.image('tableCollider', 'assets/colliders/TableCollider.png');
    this.load.image('toiletCollider', 'assets/colliders/ToiletCollider.png');
    this.load.image('redBedCollider', 'assets/colliders/RedBedCollider.png');
    this.load.image('purpBedCollider', 'assets/colliders/PurpBedCollider.png');
    this.load.image(
      'redBedBotCollider',
      'assets/colliders/RedBedBotCollider.png'
    );
    this.load.image(
      'purpBedBotCollider',
      'assets/colliders/PurpBedBotCollider.png'
    );
    this.load.image(
      'bottomEdgeCollider',
      'assets/colliders/BottomEdgeCollider.png'
    );
    this.load.image(
      'rightEdgeCollider',
      'assets/colliders/RightEdgeCollider.png'
    );

    //Now we'll preload our character as well. Notice the load command here isn't an image, but a spritesheet.
    //The first argument is the key word we'll use to create it later. The second is the path to the sheet.
    //IMPORTANTLY, the third argument is the dimensions of each sprite on your spritesheet!
    this.load.spritesheet(
      'octoGuy',
      'assets/spriteSheets/octoSpriteSheet.png',
      {
        frameWidth: 18,
        frameHeight: 27,
      }
    );
  }

  create() {
    const scene = this;
    // this.socket = io();
    //In the create method, we need to make the tilemap, where the key's value is the first argument that we passed when loading the tileset.
    const map = this.make.tilemap({ key: 'intermissionRoom' });

    //Then we add TilesetImages to our map that we just made. The variable name of these is what we'll call later.
    const floorTiles = map.addTilesetImage('Inside_A2', 'floors');
    const wallTiles = map.addTilesetImage('NewWalls', 'walls');
    const furnitureTiles = map.addTilesetImage('Inside_Bv2', 'furniture');
    const tvTiles = map.addTilesetImage('!TV_screens', 'tv');

    //Now we recreate the layers from Tiled. Fairly sure order matters here, so most likely will want to put the lowest layer higher up.
    //The first argument is the NAME OF THE LAYER IN TILED. The second arg is the variable name of the tileset image from above.
    const floor = map.createLayer('floor', floorTiles, 0, 0);
    const walls = map.createLayer('walls', wallTiles, 0, 0);
    const furniture = map.createLayer('furniture', furnitureTiles, 0, 0);
    const tv = map.createLayer('tv', tvTiles, 0, 0);

    //Using this line, we create a group that will encompass all the furniture, or otherwise all the collidable, non-interactive object in the game world.
    //Then we'll use the helper function to make our furniture. We'll make a new function for each type of furniture.
    //Doing it this way, you'll need to manually put in the x and y values of the item. Kind of a pain, but we're stuck with it for now.
    //Finally, we're setting each child within this group to be immovable. This means when the player collides with them, they stay put.
    this.furnitureGroup = this.physics.add.group({
      classType: Furniture,
    });
    this.createWalls(792, 32);
    this.createToilets(696, 824);
    this.createToilets(840, 824);
    this.createTables(599, 443);
    this.createTables(983, 443);
    this.createRedBeds(48, 240);
    this.createRedBeds(48, 528);
    this.createPurpBeds(1536, 240);
    this.createPurpBeds(1536, 528);
    this.createRedBedBots(480, 816);
    this.createRedBedBots(1344, 816);
    this.createPurpBedBots(240, 816);
    this.createPurpBedBots(1057, 816);
    this.createBottomEdge(801, 882);
    this.createRightEdge(1592, 430);
    this.furnitureGroup.children.each((gameObj) => {
      gameObj.setImmovable(true);
    });

    //This is where we create our character on screen. We're calling in the OctoGuy component we've created, and assigning all of its accompanying methods to player.
    //The first arg is the scene ("this" makes sense), then the x coordinate, the y coordinate, and the last is the key that we've named this asset in the preload method.
    //The setScale method dynamically changes the size of the sprite being rendered on screen.
    //Don't forget to import your entity component at the top of the scene file, or it won't load anything!

    // this.player = new OctoGuy(this, 300, 200, 'octoGuy').setScale(2.3);

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

    // CREATE OTHER PLAYERS GROUP
    this.otherPlayers = this.physics.add.group();

    // JOINED ROOM - SET STATE
    this.socket.on('setState', function (state) {
      console.log('in setState socket.on');
      const { roomKey, players, numPlayers } = state;
      scene.physics.resume();

      // STATE
      scene.state.roomKey = roomKey;
      scene.state.players = players;
      scene.state.numPlayers = numPlayers;
    });

    // PLAYERS
    this.socket.on('currentPlayers', function (arg) {
      const { players, numPlayers } = arg;
      scene.state.numPlayers = numPlayers;
      Object.keys(players).forEach(function (id) {
        if (players[id].playerId === scene.socket.id) {
          scene.addPlayer(scene, players[id]);
        } else {
          scene.addOtherPlayers(scene, players[id]);
        }
      });
    });

    this.socket.on('newPlayer', function (arg) {
      const { playerInfo, numPlayers } = arg;
      scene.addOtherPlayers(scene, playerInfo);
      scene.state.numPlayers = numPlayers;
      console.log('number of players', scene.state.numPlayers);
    });

    this.socket.on('playerMoved', function (playerInfo) {
      scene.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerInfo.playerId === otherPlayer.playerId) {
          const oldX = otherPlayer.x;
          const oldY = otherPlayer.y;
          const facing = playerInfo.facing;
          const lastFacing = playerInfo.facing.lastFacing;
          if (facing.up === true) {
            otherPlayer.play('walkUp', true);
          } else if (facing.down === true) {
            otherPlayer.play('walkDown', true);
          } else if (facing.left === true) {
            otherPlayer.play('walkLeft', true);
          } else if (facing.right === true) {
            otherPlayer.play('walkRight', true);
          }
          otherPlayer.setPosition(playerInfo.x, playerInfo.y);
          if (
            facing.up === false &&
            facing.down === false &&
            facing.left === false &&
            facing.right === false
          ) {
            console.log('!!!!!!', lastFacing);
            if (lastFacing === 'up') {
              otherPlayer.play('idleUp', true);
            } else if (lastFacing === 'down') {
              otherPlayer.play('idleDown', true);
            } else if (lastFacing === 'left') {
              otherPlayer.play('idleLeft', true);
            } else if (lastFacing === 'right') {
              otherPlayer.play('idleRight', true);
            }
          }
        }
      });
    });

    //Disconnect
    this.socket.on('disconnected', function (arg) {
      const { playerId, numPlayers } = arg;
      scene.state.numPlayers = numPlayers;
      scene.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerId === otherPlayer.playerId) {
          otherPlayer.destroy();
        }
      });
    });

    setTimeout(() => {
      // this.cameras.main.setBounds(100, 1000);
      this.cameras.main.startFollow(this.octoGuy, true, 0.08, 0.08);
      this.cameras.main.setZoom(1);
      console.log('********', this.octoGuy.cursors);
    }, 3000);
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
    this.anims.generateFrameNumbers('octoGuy');

    //The "key" key is what we'll use on the entity to utilize this animation.
    //The "frames" key is where we'll pick exactly which frames we want from the spritesheet, and put them in the order we want for the animation.
    //Duration indicates how long the frame will last. Not sure if it matters terribly, but if you don't include a duration, you'll get an error.
    //FrameRate is the speed which you cycle through the frames in your animation. Higher frameRate is a faster cycle.
    //Repeat tells how many times the anmation will repeat *after running when it's called*. A value of -1 results in an infinite animation loop as long as the animation is present.
    this.anims.create({
      key: 'walkDown',
      frames: [
        { key: 'octoGuy', frame: 0 },
        { key: 'octoGuy', frame: 1 },
        { key: 'octoGuy', frame: 2 },
        { key: 'octoGuy', frame: 1, duration: 50 },
      ],
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: 'walkUp',
      frames: [
        { key: 'octoGuy', frame: 9 },
        { key: 'octoGuy', frame: 10 },
        { key: 'octoGuy', frame: 11 },
        { key: 'octoGuy', frame: 10, duration: 50 },
      ],
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: 'walkLeft',
      frames: [
        { key: 'octoGuy', frame: 3 },
        { key: 'octoGuy', frame: 4 },
        { key: 'octoGuy', frame: 5 },
        { key: 'octoGuy', frame: 4, duration: 50 },
      ],
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: 'walkRight',
      frames: [
        { key: 'octoGuy', frame: 6 },
        { key: 'octoGuy', frame: 7 },
        { key: 'octoGuy', frame: 8 },
        { key: 'octoGuy', frame: 7, duration: 50 },
      ],
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: 'idleDown',
      frames: [{ key: 'octoGuy', frame: 1, duration: 50 }],
      framerate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: 'idleUp',
      frames: [{ key: 'octoGuy', frame: 10, duration: 50 }],
      framerate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: 'idleLeft',
      frames: [{ key: 'octoGuy', frame: 4, duration: 50 }],
      framerate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: 'idleRight',
      frames: [{ key: 'octoGuy', frame: 8, duration: 50 }],
      framerate: 10,
      repeat: 0,
    });
  }

  //These next few functions are creating our collidable furniture, and adding them to the furniture group, defined above.
  createWalls(x, y) {
    this.furnitureGroup.create(x, y, 'wallCollider');
  }

  createTables(x, y) {
    this.furnitureGroup.create(x, y, 'tableCollider');
  }

  createToilets(x, y) {
    this.furnitureGroup.create(x, y, 'toiletCollider');
  }

  createRedBeds(x, y) {
    this.furnitureGroup.create(x, y, 'redBedCollider');
  }

  createRedBedBots(x, y) {
    this.furnitureGroup.create(x, y, 'redBedBotCollider');
  }

  createPurpBeds(x, y) {
    this.furnitureGroup.create(x, y, 'purpBedCollider');
  }

  createPurpBedBots(x, y) {
    this.furnitureGroup.create(x, y, 'purpBedBotCollider');
  }

  createBottomEdge(x, y) {
    this.furnitureGroup.create(x, y, 'bottomEdgeCollider');
  }

  createRightEdge(x, y) {
    this.furnitureGroup.create(x, y, 'rightEdgeCollider');
  }

  //The update method handles changes to the various pieces of the scene.
  update(time, delta) {
    const scene = this;
    //Here, we're sending a call to the update function attached to this.player. In this case, it's OctoGuy's update function.
    //Note that we're passing our custom cursors through. The arguments of update will be everything OctoGuy's update function is looking for.
    if (this.octoGuy) {
      this.octoGuy.update(this.cursors);

      //These two lines make it so that the player stops when they hit the edges of the canvas.
      this.octoGuy.setCollideWorldBounds(true);
      this.octoGuy.onWorldBounds = true;

      //The collider line makes sure the player runs into the furniture objects, rather than going through.
      this.physics.add.collider(this.octoGuy, this.furnitureGroup);

      // emit player movement
      var x = this.octoGuy.x;
      var y = this.octoGuy.y;
      if (
        this.octoGuy.oldPosition &&
        (x !== this.octoGuy.oldPosition.x || y !== this.octoGuy.oldPosition.y)
      ) {
        this.moving = true;
        this.socket.emit('playerMovement', {
          x: this.octoGuy.x,
          y: this.octoGuy.y,
          facing: this.octoGuy.facing,
          roomKey: scene.state.roomKey,
        });
      }
      // save old position data
      this.octoGuy.oldPosition = {
        x: this.octoGuy.x,
        y: this.octoGuy.y,
        rotation: this.octoGuy.rotation,
      };
    }
  }

  addPlayer(scene, playerInfo) {
    console.log('IN ADD PLAYER FUNCTION');
    scene.joined = true;
    scene.octoGuy = new OctoGuy(scene, 300, 200, 'octoGuy').setScale(2.3);
  }

  addOtherPlayers(scene, playerInfo) {
    console.log('IN ADD OTHER PLAYERS FUNCTION');
    const otherPlayer = new OctoGuy(scene, 340, 240, 'octoGuy').setScale(2.3);
    otherPlayer.playerId = playerInfo.playerId;
    scene.otherPlayers.add(otherPlayer);
  }

  // addPlayer(scene, playerInfo) {
  //   console.log('IN ADDPLAYER FUNCTION');
  //   scene.joined = true;
  //   scene.octoGuy = scene.physics.add
  //     .sprite(playerInfo.x, playerInfo.y, 'octoGuy')
  //     .setOrigin(0.5, 0.5)
  //     .setSize(30, 40)
  //     .setOffset(0, 24);
  // }

  // addOtherPlayers(scene, playerInfo) {
  //   console.log('IN ADD OTHERPLAYERS FUNCTION');
  //   const otherPlayer = scene.add.sprite(
  //     playerInfo.x + 40,
  //     playerInfo.y + 40,
  //     'octoGuy'
  //   );
  //   otherPlayer.playerId = playerInfo.playerId;
  //   scene.otherPlayers.add(otherPlayer);
  // }
}
