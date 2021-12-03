import 'phaser';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
    this.state = {};
  }

  preload() {
    this.load.tilemapTiledJSON(
      'intermissionRoom',
      'assets/backgrounds/intermissionRoom.json'
    );
    this.load.image('floors', 'assets/tilesets/Inside_A2.png');
    this.load.image('walls', 'assets/tilesets/NewWalls.png');
    this.load.image('furniture', 'assets/tilesets/Inside_Bv2.png');
    this.load.image('tv', 'assets/tilesets/!TV_screens.png');

    this.load.spritesheet('octo', 'assets/spriteSheets/octo.png', {
      frameWidth: 18,
      frameHeight: 18,
    });
  }

  create() {
    const map = this.make.tilemap({ key: 'intermissionRoom' });
    const floorTiles = map.addTilesetImage('Inside_A2', 'floors');
    const wallTiles = map.addTilesetImage('NewWalls', 'walls');
    const furnitureTiles = map.addTilesetImage('Inside_Bv2', 'furniture');
    const tvTiles = map.addTilesetImage('!TV_screens', 'tv');

    //Now we recreate the layers from Tiled
    const floor = map.createLayer('floor', floorTiles, 0, 0);
    const walls = map.createLayer('walls', wallTiles, 0, 0);
    const furniture = map.createLayer('furniture', furnitureTiles, 0, 0);
    const tv = map.createLayer('tv', tvTiles, 0, 0);

    this.physics.add.collider(this.player, walls);
    // this.physics.add.collider(this.player, furniture);

    walls.setCollisionBetween(228, 229);
    // furniture.setCollisionByExclusion(-1, true);

    const scene = this;
    this.cursors = this.input.keyboard.createCursorKeys();

    //CREATE SOCKET
    this.socket = io();

    //LAUNCH WAITING ROOM
    scene.scene.launch('LoginScene', { socket: scene.socket });

    // CREATE OTHER PLAYERS GROUP
    this.otherPlayers = this.physics.add.group();

    // JOINED ROOM - SET STATE
    this.socket.on('setState', function (state) {
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
    });

    this.socket.on('playerMoved', function (playerInfo) {
      scene.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerInfo.playerId === otherPlayer.playerId) {
          const oldX = otherPlayer.x;
          const oldY = otherPlayer.y;
          otherPlayer.setPosition(playerInfo.x, playerInfo.y);
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
  }

  update() {
    const scene = this;
    //MOVEMENT
    if (this.octo) {
      const speed = 225;
      const prevVelocity = this.octo.body.velocity.clone();
      // Stop any previous movement from the last frame
      this.octo.body.setVelocity(0);
      // Horizontal movement
      if (this.cursors.left.isDown) {
        this.octo.body.setVelocityX(-speed);
      } else if (this.cursors.right.isDown) {
        this.octo.body.setVelocityX(speed);
      }
      // Vertical movement
      if (this.cursors.up.isDown) {
        this.octo.body.setVelocityY(-speed);
      } else if (this.cursors.down.isDown) {
        this.octo.body.setVelocityY(speed);
      }
      // Normalize and scale the velocity so that octo can't move faster along a diagonal
      this.octo.body.velocity.normalize().scale(speed);

      // emit player movement
      var x = this.octo.x;
      var y = this.octo.y;
      if (
        this.octo.oldPosition &&
        (x !== this.octo.oldPosition.x || y !== this.octo.oldPosition.y)
      ) {
        this.moving = true;
        this.socket.emit('playerMovement', {
          x: this.octo.x,
          y: this.octo.y,
          roomKey: scene.state.roomKey,
        });
      }
      // save old position data
      this.octo.oldPosition = {
        x: this.octo.x,
        y: this.octo.y,
        rotation: this.octo.rotation,
      };
    }
  }

  addPlayer(scene, playerInfo) {
    scene.joined = true;
    scene.octo = scene.physics.add
      .sprite(playerInfo.x, playerInfo.y, 'octo')
      .setOrigin(0.5, 0.5)
      .setSize(30, 40)
      .setOffset(0, 24);
  }

  addOtherPlayers(scene, playerInfo) {
    const otherPlayer = scene.add.sprite(
      playerInfo.x + 40,
      playerInfo.y + 40,
      'octo'
    );
    otherPlayer.playerId = playerInfo.playerId;
    scene.otherPlayers.add(otherPlayer);
  }
}
