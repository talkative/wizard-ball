// src/managers/AssetManager.ts
import Phaser from "phaser";

export class AssetManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public preloadAssets() {
    this.preloadImages();
    this.preloadSpritesheets();
    this.preloadAudio();
  }

  private preloadImages() {
    this.scene.load.image("ball", "/assets/Ball/Volleyboll_Default.png");
    this.scene.load.image("net", "/assets/Net/Stolpe.png");
    this.scene.load.image("background", "/assets/Background.png");
  }

  private preloadSpritesheets() {
    this.scene.load.spritesheet("player-walk", "/assets/Liam/Liam_Run.png", {
      frameWidth: 76,
      frameHeight: 103,
    });
    this.scene.load.spritesheet("player-run", "/assets/Liam/Liam_Run.png", {
      frameWidth: 76,
      frameHeight: 103,
    });

    this.scene.load.spritesheet("player-idle", "/assets/Liam/Liam_Idle.png", {
      frameWidth: 43.5,
      frameHeight: 103,
    });

    this.scene.load.spritesheet("player-jump", "/assets/Liam/Liam_Jump.png", {
      frameWidth: 44,
      frameHeight: 96,
    });

    // Player 2 spritesheets (add your second character here)
    this.scene.load.spritesheet(
      "player2-walk",
      "/assets/Simon/Simon_Run.png", // Replace with your second character path
      {
        frameWidth: 76,
        frameHeight: 103,
      }
    );
    this.scene.load.spritesheet(
      "player2-run",
      "/assets/Simon/Simon_Run.png", // Replace with your second character path
      {
        frameWidth: 76,
        frameHeight: 103,
      }
    );

    this.scene.load.spritesheet(
      "player2-idle",
      "/assets/Simon/Simon_Idle.png", // Replace with your second character path
      {
        frameWidth: 27,
        frameHeight: 64,
      }
    );

    this.scene.load.spritesheet(
      "player2-jump",
      "/assets/Simon/Simon_Jump.png", // Replace with your second character path
      {
        frameWidth: 44,
        frameHeight: 96,
      }
    );
  }

  private preloadAudio() {
    this.scene.load.audio("bgm", "/assets/dnb.wav");
    this.scene.load.audio("ballhit", "/assets/balleffect.wav");
  }
}
