import Phaser from "phaser";

export default class WaitingRoom extends Phaser.Scene {
    constructor() {
        super("WaitingRoom");
        this.state = {};
        this.hasBeenSet = false;
    }

    init(data) {
        this.socket = data.socket;
    }

    preload() {
        this.load.html("codeform", "assets/text/codeform.html");
        this.load.image("storybg1", "assets/backgrounds/storybg1.png");
        this.load.image("octo-logo1", "assets/backgrounds/octo-logo1.png");
        // this.load.image('octopus', 'assets/sprites/octopus.png');
    }

    create() {
        const scene = this;

        this.add.image(450, 100, "storybg1").setOrigin(0).setScale(2);

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
            .image(570, screenCenterY - 65, "octo-logo1")
            .setScale(0.1);

        //title
        scene.title = scene.add
            .text(screenCenterX + 240, screenCenterY - 40, "Octo Game", {
                fill: "#ff30e9",
                fontSize: "66px",
                fontStyle: "bold",
            })
            .setShadow(0, 0, "#000000", 10, false, true)
            .setScale(0.8);

        //left popup
        scene.boxes.strokeRect(
            screenCenterX + 50,
            screenCenterY + 70,
            275,
            100
        );
        scene.boxes.fillRect(screenCenterX + 50, screenCenterY + 70, 275, 100);
        scene.requestButton = scene.add
            .text(screenCenterX + 85, screenCenterY + 70, "Request Room Key", {
                fill: "#000000",
                fontSize: "20px",
                fontStyle: "bold",
            })
            .setShadow(0, 0, "#878787", 5, false, true);

        //right popup
        scene.boxes.strokeRect(
            screenCenterX + 420,
            screenCenterY + 70,
            275,
            100
        );
        scene.boxes.fillRect(screenCenterX + 420, screenCenterY + 70, 275, 100);
        scene.inputElement = scene.add
            .dom(screenCenterX + 560, screenCenterY + 130)
            .createFromCache("codeform");
        scene.inputElement.addListener("click");
        scene.inputElement.on("click", function (event) {
            if (event.target.name === "enterRoom") {
                const input = scene.inputElement.getChildByName("code-form");

                scene.socket.emit("isKeyValid", input.value);
            }
        });

        scene.requestButton.setInteractive();
        scene.requestButton.on("pointerdown", () => {
            scene.socket.emit("getRoomCode");
        });

        scene.notValidText = scene.add.text(
            screenCenterX + 478,
            screenCenterY + 100,
            "",
            {
                fill: "#ff0000",
                fontSize: "17.5px",
                fontStyle: "bold",
            }
        );
        // .setShadow(0, 0, "#000000", 10, false, true);

        scene.roomKeyText = scene.add
            .text(screenCenterX + 120, screenCenterY + 100, "", {
                fill: "#ff30e9",
                fontSize: "40px",
                fontStyle: "bold",
            })
            .setShadow(0, 0, "#000000", 10, false, true);

        scene.socket.on("roomCreated", function (roomKey) {
            scene.roomKey = roomKey;
            console.log(roomKey, scene.inputElement);
            scene.inputElement.getChildByName("code-form").value = roomKey;
            scene.roomKeyText.setText(scene.roomKey);
        });

        scene.socket.on("keyNotValid", function () {
            scene.notValidText.setText("Invalid Room Key");
        });
        scene.socket.on("keyIsValid", function (input) {
            scene.socket.emit("joinRoom", input);
        });

        this.socket.on("roomInfo", ({ roomInfo, roomKey }) => {
            this.socket.removeAllListeners();
            this.scene.stop("WaitingRoom");
            this.scene.start("IntermissionRoom", {
                socket: this.socket,
                roomInfo,
                roomKey,
            });
        });
    }
    update() {}
}
