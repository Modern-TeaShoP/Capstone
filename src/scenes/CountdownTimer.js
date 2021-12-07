import "phaser";

export default class CountdownTimer extends Phaser.Scene {
  constructor(scene, label) {
    super(scene, label);

    this.scene = scene;
    this.label = label;
    this.duration = 0;
  }

  start(duration = 45000, timerFinishedCallback) {
    this.stop();

    this.timerEvent = this.scene.time.addEvent({
      delay: duration,
    });
  }

  stop() {
    if (this.timerEvent) {
      this.timerEvent.destroy();
      this.timerEvent = undefined;
    }
  }

  update() {
    if (!this.timerEvent || this.duration <= 0) {
      return;
    }

    const elapsed = this.timerEvent.getElapsed();
    const remaining = this.duration - elapsed;
    const seconds = remaining / 1000;

    this.label.text = seconds.toFixed(2);
  }
}
