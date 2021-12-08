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
        scene.title = scene.add.text(100, 75, "Login", {
            fill: "#add8e6",
            fontSize: "66px",
            fontStyle: "bold",
        });

        //right popup
        scene.boxes.strokeRect(250, 200, 275, 100);
        scene.boxes.fillRect(250, 200, 275, 100);
        scene.inputElement = scene.add
            .dom(400, 250)
            .createFromCache("loginform");
        scene.inputElement.addListener("click");
        scene.inputElement.on("click", async function (event) {
            if (event.target.name === "submitLogin") {
                const email = scene.inputElement.getChildByName("email").value;

                const password =
                    scene.inputElement.getChildByName("password").value;

                const foundUser = await axios.post(
                    "http://localhost:8080/login",
                    {
                        email,
                        password,
                    }
                );

                if (foundUser !== null) {
                    scene.scene.stop("LoginScene");
                    scene.scene.launch("RoomKey", { socket: scene.socket });
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
