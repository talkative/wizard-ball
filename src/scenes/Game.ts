// src/scenes/Game.ts
import Phaser from "phaser";
import { Player } from "../entities/Player";
import { Ball, BallSide } from "../entities/Ball";
import { AnimationManager } from "../managers/AnimationManager";
import { AssetManager } from "../managers/AssetManager";
import { CountdownManager } from "../managers/CountdownManager";
import { ScoreManager } from "../managers/ScoreManager";

export class MainScene extends Phaser.Scene {
  private playerOne!: Player;
  private playerTwo!: Player;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private gamepadOne: Phaser.Input.Gamepad.Gamepad | null = null;
  private gamepadTwo: Phaser.Input.Gamepad.Gamepad | null = null;
  private ball!: Ball;
  private net!: Phaser.Physics.Arcade.Sprite;
  private scoreManager!: ScoreManager;
  private countdownManager!: CountdownManager;
  private assetManager!: AssetManager;
  private animationManager!: AnimationManager;
  private winningScore: number = 3;

  constructor() {
    super("MainScene");
  }

  preload() {
    this.assetManager = new AssetManager(this);
    this.assetManager.preloadAssets();
  }

  create() {
    this.setupBackground();
    this.setupMusic();

    this.platforms = this.physics.add.staticGroup();

    this.animationManager = new AnimationManager(this);
    this.animationManager.createAnimations();

    this.setupPlayers();
    this.setupNet();
    this.setupBall();
    this.setupCollisions();
    this.setupGravityEffects();
    this.setupGamepadListeners();
    this.scoreManager = new ScoreManager(this);
    this.startMainGameTimer();
  }

  private startMainGameTimer() {
    this.countdownManager = new CountdownManager(this, 30, () => {
      this.handleScoreAndRestart();
    });
  }

  private handleScoreAndRestart() {
    const ballSide = this.ball.getBallSide();

    if (ballSide === BallSide.LEFT) {
      this.scoreManager.updateLeftScore();
    } else if (ballSide === BallSide.RIGHT) {
      this.scoreManager.updateRightScore();
    }

    if (
      this.scoreManager.getLeftScore() >= this.winningScore ||
      this.scoreManager.getRightScore() >= this.winningScore
    ) {
      this.endGame();
    } else {
      this.freezeGameWhenPlayerScores();
    }
  }

  private endGame() {
    this.physics.pause();

    if (this.countdownManager) {
      this.countdownManager.destroy();
    }

    let winningText = "";
    if (this.scoreManager.getLeftScore() >= this.winningScore) {
      winningText = "Player One Wins!";
    } else {
      winningText = "Player Two Wins!";
    }

    const gameOverText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      "Game Over\n" + winningText,
      {
        font: "64px Arial",
        color: "#ffffff",
        align: "center",
      }
    );
    gameOverText.setOrigin(0.5);

    // Add a restart button
    const restartButton = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 150,
      "Restart Game",
      {
        font: "32px Arial",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 20, y: 10 },
      }
    );
    restartButton.setOrigin(0.5);
    restartButton.setInteractive({ useHandCursor: true });
    restartButton.on("pointerdown", () => {
      this.scene.restart();
    });
  }

  private freezeGameWhenPlayerScores() {
    this.physics.pause();

    if (this.countdownManager) {
      this.countdownManager.destroy();
    }

    // Show who scored
    const scoredText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      this.ball.getBallSide() === BallSide.LEFT
        ? "Player Two Scored!"
        : "Player One Scored!",
      {
        font: "48px Arial",
        color: "#ffffff",
      }
    );
    scoredText.setOrigin(0.5);

    // After 3 seconds, restart the round
    this.time.delayedCall(3000, () => {
      scoredText.destroy();
      this.startRoundCountdown();
      // after 3 seconds do     this.physics.resume();

      this.time.delayedCall(3000, () => {
        this.physics.resume();
      });

      // Set ball on a random position side of the net
      const randomX = Phaser.Math.Between(100, 1100);
      const randomY = Phaser.Math.Between(100, 600);
      this.ball.setPosition(randomX, randomY);

      // Start countdown for the next round
    });
  }

  private startRoundCountdown() {
    // Create a 3-second countdown before next round starts
    const countdownText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      "3",
      {
        font: "72px Arial",
        color: "#ffffff",
      }
    );
    countdownText.setOrigin(0.5);

    let count = 3;
    const countdown = this.time.addEvent({
      delay: 1000,
      callback: () => {
        count--;
        if (count > 0) {
          countdownText.setText(count.toString());
        } else {
          countdownText.setText("Go!");
          this.time.delayedCall(500, () => {
            countdownText.destroy();
            this.startMainGameTimer();
          });
        }
      },
      repeat: 2,
    });
  }

  private setupBackground() {
    const bg = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      "background"
    );

    // Scale the image to fill the screen
    bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    // Optionally set a lower depth to ensure it stays in the background
    bg.setDepth(-1);
  }

  private setupMusic() {
    const bgm = this.sound.add("bgm", { loop: true, volume: 0.2 });
    bgm.play();
  }

  private setupPlayers() {
    this.playerOne = new Player(this, 400, 1300, "player-idle");
    this.playerTwo = new Player(this, 800, 1300, "player2-idle");

    this.playerOne.useArrowControls();
    this.playerTwo.useWASDControls();
  }

  private setupNet() {
    this.net = this.physics.add.sprite(
      this.cameras.main.width / 2,
      1000,
      "net"
    );
    this.net.setImmovable(true);
    this.net.setCollideWorldBounds(true);

    const netHitboxWidth = 70;
    const netHitboxHeight = 470;
    this.net.body?.setSize(netHitboxWidth, netHitboxHeight);
  }

  private setupBall() {
    this.ball = new Ball(this, 600, 600, this.net.x);
  }

  private setupCollisions() {
    this.physics.add.collider(this.playerOne, this.platforms);
    this.physics.add.collider(this.playerTwo, this.platforms);
    this.physics.add.collider(this.net, this.playerOne);
    this.physics.add.collider(this.net, this.playerTwo);
    this.physics.add.collider(this.ball, this.platforms);

    this.physics.add.collider(
      this.ball,
      this.playerOne,
      this.handleBallPlayerCollision,
      undefined,
      this
    );

    this.physics.add.collider(
      this.ball,
      this.playerTwo,
      this.handleBallPlayerCollision,
      undefined,
      this
    );

    this.physics.add.collider(this.ball, this.net);
  }

  private handleBallPlayerCollision(ball: any, player: any) {
    const ballObj = ball as Ball;
    const playerObj = player as Player;
    if (!ballObj || !playerObj.body) return;

    const playerVelocity = playerObj?.body.velocity;

    // The force is based on player's velocity and a force multiplier
    const forceMultiplier = 1.2;
    let forceX = playerVelocity.x * forceMultiplier;
    let forceY = playerVelocity.y * forceMultiplier;

    // Apply a minimum force if player is not moving much
    const minForce = 200;
    if (Math.abs(forceX) < minForce) {
      // Apply force in the direction the player is facing
      forceX = playerObj.flipX ? -minForce : minForce;
    }

    // If player is on the ground and not moving vertically, add some upward force
    if (playerObj.body.blocked.down && Math.abs(forceY) < 100) {
      forceY = -300; // Add some upward force
    }

    // Apply the force to the ball
    ballObj.applyForce(forceX, forceY);

    // Optionally play a hit sound
    this.sound.play("ballhit");
  }

  private setupGravityEffects() {
    this.physics.world.on("worldstep", () => {
      if (!this.playerOne.body || !this.playerTwo.body) return;
      if (this.playerOne.body.velocity.y > 0) {
        this.playerOne.setGravityY(2000);
      }
      if (this.playerTwo.body.velocity.y > 0) {
        this.playerTwo.setGravityY(2000);
      }
    });
  }

  private setupGamepadListeners() {
    this.input.gamepad?.on("connected", (pad: Phaser.Input.Gamepad.Gamepad) => {
      if (!this.gamepadOne) {
        this.gamepadOne = pad;
        this.playerOne.setGamepad(pad);
        console.log("player one connected", pad.index);
      } else if (!this.gamepadTwo) {
        this.gamepadTwo = pad;
        this.playerTwo.setGamepad(pad);
        console.log("player two connected", pad.index);
      }
    });
  }

  update(delta: number) {
    this.playerOne.update();
    this.playerTwo.update();
    this.ball.update(delta);
  }
}
