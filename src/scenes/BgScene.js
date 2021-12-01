import "phaser";

export default class BgScene extends Phaser.Scene {
  constructor() {
    super("BgScene");
  }

  preload() {
    // Preload Sprites
    // << LOAD SPRITE HERE >>
    this.load.tilemapTiledJSON("octoMap", "assets/backgrounds/octoMap.json");
    this.load.image("walls", "assets/tilesets/NewWalls.png");
    this.load.image("floors", "assets/tilesets/Inside_A2.png");
  }

  create() {
    // Create Sprites
    // << CREATE SPRITE HERE >>
    const map = this.make.tilemap({ key: "octoMap" });
    const floorTiles = map.addTilesetImage("Inside_A2", "floors");
    const wallTiles = map.addTilesetImage("NewWalls", "walls");
    const floors = map.createLayer("Floors", floorTiles, 0, 0).setOrigin(0.5);
    const walls = map.createLayer("Walls", wallTiles, 0, 0).setOrigin(0.5);
  }
}
