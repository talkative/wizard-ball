// src/entities/Ball.ts
import Phaser from 'phaser';

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
  private currentSide: BallSide = BallSide.NEUTRAL;
  private netX: number;

  constructor(scene: Phaser.Scene, x: number, y: number, netX: number) {
    super(scene, x, y, 'ball');

    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.netX = netX;
    this.setScale(0.6);
    this.setBounce(this.bounceEnergy); // Ball loses some energy on bounce
    this.setCollideWorldBounds(true);
    this.setVelocity(200, 200);
    this.setMaxVelocity(1000);

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
    }
  }

  public updateBallSide() {
    if (this.x < this.netX) {
      this.currentSide = BallSide.LEFT;
    } else if (this.x > this.netX) {
      this.currentSide = BallSide.RIGHT;
    } else {
      this.currentSide = BallSide.NEUTRAL;
    }
  }

  public update(delta: number) {
    if (!this.body) return;

    this.updateBallSide();

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

  public getBallSide() {
    return this.currentSide;
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
