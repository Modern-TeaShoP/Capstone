import Phaser from 'phaser';
export default class StoryScene extends Phaser.Scene {
  constructor() {
    super('StoryScene');
    this.state = {};
  }
  init(data) {
    this.socket = data.socket;
  }
  preload() {
    //load images
    this.load.image('storybg1', 'assets/backgrounds/storybg1.png');
    this.load.image('octo-logo1', 'assets/backgrounds/octo-logo1.png');
    this.load.image(
      'play-buttonWhite',
      'assets/backgrounds/play-buttonWhite.png'
    );
    this.load.image('controlsWhite', 'assets/backgrounds/controlsWhite.png');
    this.load.audio('OctoGame', 'assets/audio/OctoGame.mp3');
    this.load.audio('Controls', 'assets/audio/controls.mp3');
  }

  create() {
    const scene = this;

    this.music = this.sound.add('OctoGame');

    this.music1 = this.sound.add('Controls');

    this.add
      .image(450, 100, 'storybg1')
      .setOrigin(0)
      .setScale(2)
      .setDepth(0)
      .setInteractive();

    let storyAudio = this.add
      .image(430, -20, 'octo-logo1')
      .setOrigin(0)
      .setScale(0.17)
      .setDepth(1)
      .setInteractive({ useHandCursor: true });
    storyAudio.on('pointerdown', function () {
      scene.music.play();
    });

    let playButton = this.add
      .image(
        scene.renderer.width / 2.01,
        scene.renderer.height / 2.35,
        'play-buttonWhite'
      )
      .setDepth(2)
      .setScale(0.7)
      .setInteractive({ useHandCursor: true });

    playButton.on('pointerdown', function () {
      scene.scene.stop('StoryScene');
      scene.scene.start('LoginScene', { socket: scene.socket });
    });
    let controlButton = this.add
      .image(
        scene.renderer.width / 2.01,
        scene.renderer.height / 2.17,

        'controlsWhite'
      )
      .setInteractive({ useHandCursor: true })
      .setScale(0.7);
    controlButton.on('pointerdown', function () {
      scene.music1.play();
    });
  }
}
