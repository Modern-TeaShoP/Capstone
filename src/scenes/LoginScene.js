import Phaser from "phaser";
import axios from "axios";

export default class LoginScene extends Phaser.Scene {
  constructor() {
    super("LoginScene");
    this.state = {};
    this.hasBeenSet = false;
  }

  init(data) {
    this.socket = data.socket;
  }

  preload() {
    this.load.html("loginform", "assets/text/loginform.html");
    this.load.image("octopus", "assets/sprites/octopus.png");
  }

  create() {
    const scene = this;

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
    scene.popUp.strokeRect(screenCenterX, screenCenterY, 750, 500);
    scene.popUp.fillRect(screenCenterX, screenCenterY, 750, 500);
    scene.logo = scene.add.image(screenCenterX, screenCenterY, "octopus");

    //title
    scene.title = scene.add
      .text(screenCenterX + 250, screenCenterY + 70, "Login", {
        fill: "#ff30e9",
        fontSize: "66px",
        fontStyle: "bold",
      })
      .setShadow(0, 0, "#000000", 10, false, true);

    //right popup
    scene.boxes.strokeRect(screenCenterX + 225, screenCenterY + 200, 275, 100);
    scene.boxes.fillRect(screenCenterX + 225, screenCenterY + 200, 275, 100);
    scene.inputElement = scene.add
      .dom(screenCenterX + 360, screenCenterY + 250)
      .createFromCache("loginform");
    scene.inputElement.addListener("click");
    scene.inputElement.on("click", async function (event) {
      if (event.target.name === "submitLogin") {
        const email = scene.inputElement.getChildByName("email").value;

        const password = scene.inputElement.getChildByName("password").value;

        const foundUser = await axios.post("http://localhost:8080/login", {
          email,
          password,
        });

        if (foundUser !== null) {
          scene.scene.stop("LoginScene");
          scene.scene.launch("WaitingRoom", { socket: scene.socket });
          // scene.scene.start('WaitingRoom');
        }

        //axios calls go here
        //this will need to be async
      }
      if (event.target.name === "launchRegister") {
        scene.scene.stop("LoginScene");
        scene.scene.launch("RegisterScene", { socket: scene.socket });
      }
    });
  }
  update() {}
}
