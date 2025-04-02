// src/managers/AnimationManager.ts
import Phaser from "phaser";

export class AnimationManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  private createCharacterAnimations(prefix: string) {
    this.scene.anims.create({
      key: `${prefix}-idle-anim`,
      frames: this.scene.anims.generateFrameNumbers(`${prefix}-idle`, {
        start: 0,
        end: 4,
      }),
      frameRate: 10,
      repeat: -1,
    });
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
        end: 5,
      }),
      frameRate: 60,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "idle",
      frames: this.scene.anims.generateFrameNumbers("player-idle", {
        start: 0,
        end: 4,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "jump",
      frames: this.scene.anims.generateFrameNumbers("player-jump", {
        start: 0,
        end: 1,
      }),
      frameRate: 1,
      repeat: -1,
    });
  }
}
