import Phaser from "phaser";

class Player extends Phaser.Physics.Arcade.Sprite {
  private gamepad: Phaser.Input.Gamepad.Gamepad | null = null;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    playerNumber: number
  ) {
    super(scene, x, y, texture);

    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setBounce(0.2);
    this.setGravityY(300);
  }

  public setGamepad(gamepad: Phaser.Input.Gamepad.Gamepad) {
    this.gamepad = gamepad;
  }

  public update() {
    if (!this.gamepad) {
      return;
    }

    const leftStickX = this.gamepad.leftStick.x;
    const leftStickY = this.gamepad.leftStick.y;

    if (leftStickX < 0) {
      this.setVelocityX(-160);
    } else if (leftStickX > 0) {
      this.setVelocityX(160);
    } else {
      this.setVelocityX(0);
    }

    if (this.gamepad.A) {
      this.setVelocityY(-330);
    }
  }
}

export default Player;
