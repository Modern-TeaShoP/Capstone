import "phaser";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    create() {
        // << LOAD BACKGROUND AND FOREGROUND SCENES IN PARALLEL HERE >>
        this.scene.launch("BgScene");
        this.scene.launch("FgScene");

        //CREATE SOCKET
        this.socket = io();

        //LAUNCH WAITING ROOM
        this.scene.launch("WaitingRoom", {socket: this.scene.socket})
    }

    update(){}
}
