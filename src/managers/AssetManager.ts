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
    this.scene.load.image("background", "/assets/beach.png");
  }

  private preloadSpritesheets() {
    this.scene.load.spritesheet(
      "player-walk",
      "/assets/Lightning Mage/Walk.png",
      {
        frameWidth: 128,
        frameHeight: 128,
      }
    );

    this.scene.load.spritesheet(
      "player-idle",
      "/assets/Lightning Mage/Idle.png",
      {
        frameWidth: 128,
        frameHeight: 128,
      }
    );

    this.scene.load.spritesheet(
      "player-run",
      "/assets/Lightning Mage/Run.png",
      {
        frameWidth: 128,
        frameHeight: 128,
      }
    );

    this.scene.load.spritesheet(
      "player-attack",
      "/assets/Lightning Mage/Attack_2.png",
      {
        frameWidth: 128,
        frameHeight: 128,
      }
    );
  }

  private preloadAudio() {
    this.scene.load.audio("bgm", "/assets/dnb.wav");
    this.scene.load.audio("ballhit", "/assets/balleffect.wav");
  }
}
