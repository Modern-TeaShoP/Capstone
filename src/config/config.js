export default {
  type: Phaser.AUTO, // Specify the underlying browser rendering engine (AUTO, CANVAS, WEBGL)
  // AUTO will attempt to use WEBGL, but if not available it'll default to CANVAS
  width: 1600, // Game width in pixels
  height: 900, // Game height in pixels
  parent: "mygame", //This is the id of the div (in index.html) where the canvas is being rendered. Important to know so we can work with/around it if we need to.
  render: {
    pixelArt: true,
  },
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  //  We will be expanding physics later
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }, // Game objects will be pulled down along the y-axis
      // The number 1500 is arbitrary. The higher, the stronger the pull.
      // A negative value will pull game objects up along the y-axis
      debug: true, // Whether physics engine should run in debug mode
    },
  },
  dom: {
    createContainer: true,
  },
  scene: [],
};
