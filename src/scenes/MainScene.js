import "phaser";
import OctoGuy from "../entity/OctoGuy";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
        this.state = {};
    }

    preload() {}

    create() {
        const scene = this;

        //CREATE SOCKET
        this.socket = io();

        //LAUNCH LOGIN PAGE
        scene.scene.launch("WaitingRoom", { socket: scene.socket });
    }

    update() {}
}
