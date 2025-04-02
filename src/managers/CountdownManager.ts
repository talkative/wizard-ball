// src/managers/CountdownManager.ts
import Phaser from "phaser";

export class CountdownManager {
  private scene: Phaser.Scene;
  private timerEvent: Phaser.Time.TimerEvent;
  private timeLeft: number;
  private countdownText: Phaser.GameObjects.Text;
  private onCompleteCallback: () => void;

  constructor(scene: Phaser.Scene, duration: number, onComplete: () => void) {
    this.scene = scene;
    this.timeLeft = duration;
    this.onCompleteCallback = onComplete;

    this.countdownText = scene.add.text(
      scene.scale.width / 2,
      50,
      this.formatTime(this.timeLeft),
      {
        font: "42px Arial",
        color: "#ffffff",
        align: "center",
      }
    );
    this.countdownText.setOrigin(0.5);

    this.timerEvent = this.scene.time.addEvent({
      delay: 1000,
      callback: this.tick,
      callbackScope: this,
      loop: true,
    });
  }

  private tick() {
    this.timeLeft -= 1;
    this.countdownText.setText(this.formatTime(this.timeLeft));

    if (this.timeLeft <= 0) {
      this.timerEvent.remove();
      this.onCompleteCallback();
    }
  }

  private formatTime(seconds: number): string {
    const partInSeconds = seconds % 60;
    const partInSecondsString = partInSeconds.toString().padStart(2, "0");
    return `${partInSecondsString}`;
  }

  public destroy() {
    this.timerEvent.remove();
    this.countdownText.destroy();
  }

  public resetTimer(duration: number, onComplete: () => void) {
    this.timerEvent.remove();
    this.timeLeft = duration;
    this.onCompleteCallback = onComplete;
    this.countdownText.setText(this.formatTime(this.timeLeft));

    this.timerEvent = this.scene.time.addEvent({
      delay: 1000,
      callback: this.tick,
      callbackScope: this,
      loop: true,
    });
  }

  public getTimeLeft(): number {
    return this.timeLeft;
  }
}
