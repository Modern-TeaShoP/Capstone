import Phaser from 'phaser';
import axios from 'axios';

const bcrypt = require('bcrypt');

export default class LoginScene extends Phaser.Scene {
  constructor() {
    super('LoginScene');
    this.state = {};
    this.hasBeenSet = false;
  }

  init(data) {
    this.socket = data.socket;
  }

  preload() {
    this.load.html('loginform', 'assets/text/loginform.html');
  }

  create() {
    const scene = this;

    scene.popUp = scene.add.graphics();
    scene.boxes = scene.add.graphics();

    // for popup window
    scene.popUp.lineStyle(1, 0xffffff);
    scene.popUp.fillStyle(0xffffff, 0.5);

    // for boxes
    scene.boxes.lineStyle(1, 0xffffff);
    scene.boxes.fillStyle(0xa9a9a9, 1);

    // popup window
    scene.popUp.strokeRect(25, 25, 750, 500);
    scene.popUp.fillRect(25, 25, 750, 500);

    //title
    scene.title = scene.add.text(100, 75, 'Login', {
      fill: '#add8e6',
      fontSize: '66px',
      fontStyle: 'bold',
    });

    //left popup
    // scene.boxes.strokeRect(100, 200, 275, 100);
    // scene.boxes.fillRect(100, 200, 275, 100);
    // scene.requestButton = scene.add.text(140, 215, 'Request Room Key', {
    //   fill: '#000000',
    //   fontSize: '20px',
    //   fontStyle: 'bold',
    // });

    //right popup
    scene.boxes.strokeRect(425, 200, 275, 100);
    scene.boxes.fillRect(425, 200, 275, 100);
    scene.inputElement = scene.add.dom(562.5, 250).createFromCache('loginform');
    scene.inputElement.addListener('click');
    scene.inputElement.on('click', function (event) {
      if (event.target.name === 'submitLogin') {
        async () => {
          const email = scene.inputElement.getChildByName('email');

          // contact the api to get the record associated with email
          const res = await axios.get(`/${email}`);

          //check hashed password to hashed password in database
          let hashedPassword = await bcrypt.hash(
            scene.inputElement.getChildByName('password'),
            10
          );

          //run is authenticated, if true - store all user information somewhere where we can access it

          //launch waitingroom scene

          //if false flash error
        };

        scene.socket.emit('isKeyValid', input.value);
      }
    });

    // scene.requestButton.setInteractive();
    // scene.requestButton.on('pointerdown', () => {
    //   scene.socket.emit('getRoomCode');
    // });

    // scene.notValidText = scene.add.text(670, 295, '', {
    //   fill: '#ff0000',
    //   fontSize: '15px',
    // });

    // scene.roomKeyText = scene.add.text(210, 250, '', {
    //   fill: '#00ff00',
    //   fontSize: '20px',
    //   fontStyle: 'bold',
    // });

    // scene.socket.on('roomCreated', function (roomKey) {
    //   scene.roomKey = roomKey;
    //   scene.roomKeyText.setText(scene.roomKey);
    // });

    // scene.socket.on('keyNotValid', function () {
    //   scene.notValidText.setText('Invalid Room Key');
    // });

    // scene.socket.on('keyIsValid', function (input) {
    //   scene.socket.emit('joinRoom', input);
    //   scene.scene.stop('LoginScene');
    // });
  }
  update() {}
}
