import Phaser from 'phaser';
import axios from 'axios';

export default class RegisterScene extends Phaser.Scene {
  constructor() {
    super('RegisterScene');
    this.state = {};
    this.hasBeenSet = false;
  }

  init(data) {
    this.socket = data.socket;
  }

  preload() {
    this.load.html('registerform', 'assets/text/registerform.html');
    this.load.image('storybg1', 'assets/backgrounds/storybg1.png');
    this.load.image('octo-logo1', 'assets/backgrounds/octo-logo1.png');
    // this.load.image("octopus", "assets/sprites/octopus.png");
  }

  create() {
    const scene = this;

    this.add.image(450, 100, 'storybg1').setOrigin(0).setScale(2);

    scene.popUp = scene.add.graphics();
    scene.boxes = scene.add.graphics();

    // for popup window
    scene.popUp.lineStyle(1, 0x60ceff);
    scene.popUp.fillStyle(0xffffff, 0.5);

    // for boxes
    scene.boxes.lineStyle(1, 0x60ceff);
    scene.boxes.fillStyle(0xa9a9a9, 1);

    // popup window
    const screenCenterX = this.cameras.main.width / 4;
    const screenCenterY = this.cameras.main.height / 4;
    // scene.popUp.strokeRect(screenCenterX, screenCenterY, 750, 500);
    // scene.popUp.fillRect(screenCenterX, screenCenterY, 750, 500);
    scene.logo = scene.add
      .image(560, screenCenterY - 70, 'octo-logo1')
      .setScale(0.1);

    //title
    scene.title = scene.add
      .text(screenCenterX + 100, screenCenterY - 40, 'Register New User', {
        fill: '#ff30e9',
        fontSize: '66px',
        fontStyle: 'bold',
      })
      .setShadow(0, 0, '#000000', 10, false, true)
      .setScale(0.8);

    //right popup
    scene.boxes.strokeRect(screenCenterX + 250, screenCenterY + 60, 275, 100);
    scene.boxes.fillRect(screenCenterX + 250, screenCenterY + 60, 275, 100);
    scene.inputElement = scene.add
      .dom(screenCenterX + 360, screenCenterY + 110)
      .createFromCache('registerform');
    scene.inputElement.addListener('click');
    scene.inputElement.on('click', async function (event) {
      if (event.target.name === 'submitRegister') {
        const email = scene.inputElement.getChildByName('email').value;

        const password = scene.inputElement.getChildByName('password').value;

        const username = scene.inputElement.getChildByName('username').value;

        console.log(email, password);

        const createdUser = await axios.post('http://localhost:8080/register', {
          email,
          password,
          username,
        });

        if (createdUser !== null) {
          scene.scene.stop('RegisterScene');
          scene.scene.launch('LoginScene', { socket: scene.socket });
          // scene.scene.start('WaitingRoom');
        }

        //axios calls go here
        //this will need to be async
      }
    });
  }
  update() {}
}
