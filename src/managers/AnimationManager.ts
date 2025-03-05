// src/managers/AnimationManager.ts
import Phaser from "phaser";

export class AnimationManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public createAnimations() {
    this.scene.anims.create({
      key: "walk",
      frames: this.scene.anims.generateFrameNumbers("player-walk", {
        start: 0,
        end: 9,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "run",
      frames: this.scene.anims.generateFrameNumbers("player-run", {
        start: 0,
        end: 9,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "idle",
      frames: this.scene.anims.generateFrameNumbers("player-idle", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "attack",
      frames: this.scene.anims.generateFrameNumbers("player-attack", {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }
}
