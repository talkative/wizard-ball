// src/managers/ScoreManager.ts
import Phaser from "phaser";

export class ScoreManager {
  private leftPoints: number = 0;
  private rightPoints: number = 0;
  private pointsText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.pointsText = scene.add.text(10, 10, "Left: 0 | Right: 0", {
      font: "24px Arial",
      color: "#ffffff",
    });
  }

  public updateLeftScore(points: number = 1) {
    this.leftPoints += points;
    this.updateText();
  }

  public updateRightScore(points: number = 1) {
    this.rightPoints += points;
    this.updateText();
  }

  public getLeftScore(): number {
    return this.leftPoints;
  }
  public getRightScore(): number {
    return this.rightPoints;
  }
  public resetScores() {
    this.leftPoints = 0;
    this.rightPoints = 0;
    this.updateText();
  }
  public destroy() {
    this.pointsText.destroy();
  }
  private updateText() {
    this.pointsText.setText(
      `Left: ${this.leftPoints} | Right: ${this.rightPoints}`
    );
  }
}
