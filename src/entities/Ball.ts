// src/entities/Ball.ts
import Phaser from "phaser";

const OFFSET = 10;

export enum BallSide {
  LEFT,
  RIGHT,
  NEUTRAL,
}

export class Ball extends Phaser.Physics.Arcade.Sprite {
  private damping: number = 0.995; // Slightly reduce velocity each frame
  private minVelocity: number = 50; // Minimum velocity before the ball starts slowing down more
  private gravityFactor: number = 0.8; // Adjust gravity effect (lower = more floaty)
  private bounceEnergy: number = 0.9; // Energy preserved on bounce (0.9 = 90%)
  // Timer properties
  private timerDuration: number = 7000; // 7 seconds
  private timer: number = 60;
  private timerBar: Phaser.GameObjects.Sprite | null = null;
  private timerStarted: boolean = false;
  private tickingSound: Phaser.Sound.BaseSound | null = null;
  private currentSide: BallSide = BallSide.NEUTRAL;
  private netX: number;

  constructor(scene: Phaser.Scene, x: number, y: number, netX: number) {
    super(scene, x, y, "ball");

    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.netX = netX;
    this.setScale(0.6);
    this.setBounce(this.bounceEnergy); // Ball loses some energy on bounce
    this.setCollideWorldBounds(true);
    this.setVelocity(200, 200);

    // Set a lower gravity for more arcady feel
    this.setGravityY(300 * this.gravityFactor);

    // Configure circular hitbox
    if (this.body) {
      const diameter = Math.min(this.displayWidth, this.displayHeight);
      const radius = diameter / 2.4;

      this.body.setCircle(
        radius / this.scale,
        (this.width - radius * 2) / OFFSET,
        (this.height - radius * 2) / OFFSET
      );

      // Add some drag to gradually slow the ball
      this.body.setDrag(5, 0);
    }
  }

  private createTimerBar() {
    this.timerBar = this.scene.add.sprite(0, 0, "timer-bar");
    this.timerBar.setOrigin(0.5, 0);
    this.timerBar.setScale(0.5, 0.2);
    this.timerBar.setTint(0x00ff00); // Green initially
    this.updateTimerBarPosition();
  }

  private updateTimerBarPosition() {
    if (this.timerBar) {
      this.timerBar.x = this.x;
      this.timerBar.y = this.y - this.height - 10;

      // Scale the timer bar based on remaining time
      const timerRatio = this.timer / this.timerDuration;
      this.timerBar.scaleX = 0.5 * timerRatio;

      // Change color based on remaining time
      if (timerRatio < 0.3) {
        this.timerBar.setTint(0xff0000); // Red when low
      } else if (timerRatio < 0.6) {
        this.timerBar.setTint(0xffff00); // Yellow when medium
      }
    }
  }

  public updateBallSide() {
    if (this.x < this.netX) {
      console.log("LEFT");
      this.currentSide = BallSide.LEFT;
    } else if (this.x > this.netX) {
      console.log("RIGHT");
      this.currentSide = BallSide.RIGHT;
    } else {
      this.currentSide = BallSide.NEUTRAL;
    }
  }

  public update(delta: number) {
    if (!this.body) return;

    this.updateBallSide();

    if (this.timerStarted) {
      this.timer -= delta;
      this.updateTimerBarPosition();

      // If timer runs out, explode
      if (this.timer <= 0) {
        // this.explode();
      }
    }

    // Apply damping to velocity
    const velocityX = this.body.velocity.x * this.damping;
    const velocityY = this.body.velocity.y; // Don't dampen vertical movement as much (gravity effect)

    this.setVelocity(velocityX, velocityY);

    // If the ball hits something, make it spin for visual effect
    if (
      this.body.blocked.left ||
      this.body.blocked.right ||
      this.body.blocked.up ||
      this.body.blocked.down
    ) {
      // Spin faster when hitting at higher speeds
      const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
      this.setAngularVelocity(speed / 2);

      // Add a slight random factor to bounce for unpredictability
      if (Math.random() > 0.5) {
        this.setVelocityX(
          this.body.velocity.x * (1 + (Math.random() * 0.1 - 0.05))
        );
      }
    }

    // Slow down angular velocity over time
    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      this.setAngularVelocity(this.body.angularVelocity * 0.98);
    }

    // If ball is moving very slowly horizontally, gradually come to a stop
    if (
      Math.abs(this.body.velocity.x) < this.minVelocity &&
      this.body.blocked.down
    ) {
      this.setVelocityX(this.body.velocity.x * 0.9);

      // If nearly stopped, come to a complete stop
      if (Math.abs(this.body.velocity.x) < 10) {
        this.setVelocityX(0);
        this.setAngularVelocity(0);
      }
    }
  }

  // Add method to apply force (like when hit by players)
  public applyForce(forceX: number, forceY: number) {
    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      this.body.setVelocity(
        this.body.velocity.x + forceX,
        this.body.velocity.y + forceY
      );
    }
  }
}
