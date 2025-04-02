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

    // Player 2 spritesheets (add your second character here)
    this.scene.load.spritesheet(
      "player2-walk",
      "/assets/Fire vizard/Walk.png", // Replace with your second character path
      {
        frameWidth: 128,
        frameHeight: 128,
      }
    );

    this.scene.load.spritesheet(
      "player2-idle",
      "/assets/Fire vizard/Idle.png", // Replace with your second character path
      {
        frameWidth: 128,
        frameHeight: 128,
      }
    );

    this.scene.load.spritesheet(
      "player2-run",
      "/assets/Fire vizard/Run.png", // Replace with your second character path
      {
        frameWidth: 128,
        frameHeight: 128,
      }
    );

    this.scene.load.spritesheet(
      "player2-attack",
      "/assets/Fire vizard/Attack_2.png", // Replace with your second character path
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
