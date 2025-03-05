// src/entities/Player.ts
import Phaser from "phaser";

export enum PlayerControls {
  UP = 12,
  DOWN = 13,
  LEFT = 14,
  RIGHT = 15,
  X_BUTTON = 0,
  CIRCLE_BUTTON = 1,
  SQUARE_BUTTON = 2,
}

export enum ControlScheme {
  GAMEPAD,
  KEYBOARD_ARROWS,
  KEYBOARD_WASD,
}

export class Player extends Phaser.Physics.Arcade.Sprite {
  private gamepad: Phaser.Input.Gamepad.Gamepad | null = null;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keyShift!: Phaser.Input.Keyboard.Key;
  private keySpace!: Phaser.Input.Keyboard.Key;

  private controlScheme: ControlScheme = ControlScheme.GAMEPAD;
  private jumpsAvailable: number = 2;
  private jumpSpeed: number = -1200;
  private walkSpeed: number = 160;
  private runSpeed: number = 600;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setBounce(0.2);
    this.setGravityY(1500);

    // Configure hitbox
    const hitboxWidth = 24; // Narrower for pill shape
    const hitboxHeight = 70; // Taller for pill shape
    const hitboxOffsetX = 50; // Adjust offset to center the hitbox
    const hitboxOffsetY = 58;

    // Set hitbox size and position
    this.body?.setSize(hitboxWidth, hitboxHeight);
    this.body?.setOffset(hitboxOffsetX, hitboxOffsetY);
    this.setScale(1.5);

    // Set up keyboard controls
    this.cursors = this.scene.input.keyboard!.createCursorKeys();
    this.keyW = this.scene.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.W
    );
    this.keyA = this.scene.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.A
    );
    this.keyS = this.scene.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    );
    this.keyD = this.scene.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.D
    );
    this.keyShift = this.scene.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT
    );
    this.keySpace = this.scene.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  public setGamepad(gamepad: Phaser.Input.Gamepad.Gamepad) {
    this.gamepad = gamepad;
    this.controlScheme = ControlScheme.GAMEPAD;
  }

  public useArrowControls() {
    this.controlScheme = ControlScheme.KEYBOARD_ARROWS;
  }

  public useWASDControls() {
    this.controlScheme = ControlScheme.KEYBOARD_WASD;
  }

  public update() {
    let controls;

    switch (this.controlScheme) {
      case ControlScheme.GAMEPAD:
        if (!this.gamepad) return;
        controls = {
          up: this.gamepad.buttons[PlayerControls.UP].value,
          down: this.gamepad.buttons[PlayerControls.DOWN].value,
          left: this.gamepad.buttons[PlayerControls.LEFT].value,
          right: this.gamepad.buttons[PlayerControls.RIGHT].value,
          xButton: this.gamepad.buttons[PlayerControls.X_BUTTON].value,
          circleButton:
            this.gamepad.buttons[PlayerControls.CIRCLE_BUTTON].value,
          squareButton:
            this.gamepad.buttons[PlayerControls.SQUARE_BUTTON].value,
        };
        break;

      case ControlScheme.KEYBOARD_ARROWS:
        controls = {
          up: this.cursors.up?.isDown ? 1 : 0,
          down: this.cursors.down?.isDown ? 1 : 0,
          left: this.cursors.left?.isDown ? 1 : 0,
          right: this.cursors.right?.isDown ? 1 : 0,
          xButton: this.keySpace?.isDown ? 1 : 0,
          circleButton: this.keyShift?.isDown ? 1 : 0,
          squareButton: this.cursors.shift?.isDown ? 1 : 0,
        };
        break;

      case ControlScheme.KEYBOARD_WASD:
        controls = {
          up: this.keyW?.isDown ? 1 : 0,
          down: this.keyS?.isDown ? 1 : 0,
          left: this.keyA?.isDown ? 1 : 0,
          right: this.keyD?.isDown ? 1 : 0,
          xButton: this.keyShift?.isDown ? 1 : 0,
          circleButton: this.keySpace?.isDown ? 1 : 0,
          squareButton: this.keyS?.isDown && this.keySpace?.isDown ? 1 : 0,
        };
        break;
    }

    if (controls) {
      this.handleMovement(controls);
      this.handleJump(controls);
      this.handleAttack(controls);
    }
  }

  private handleMovement(controls: any) {
    if (controls.left) {
      const speed = controls.circleButton ? -this.runSpeed : -this.walkSpeed;
      this.setVelocityX(speed);
      this.setFlipX(true);
      this.anims.play(`${controls.circleButton ? "run" : "walk"}`, true);
    } else if (controls.right) {
      const speed = controls.circleButton ? this.runSpeed : this.walkSpeed;
      this.setVelocityX(speed);
      this.setFlipX(false);
      this.anims.play(`${controls.circleButton ? "run" : "walk"}`, true);
    } else {
      this.setVelocityX(0);
      this.anims.play("idle", true);
    }
  }

  private handleJump(controls: any) {
    const canJump = this.body?.blocked.down;

    if (canJump) {
      this.jumpsAvailable = 2;
    }

    // Check for "just pressed" for keyboard to avoid continuous jumping
    let shouldJump = false;
    if (this.controlScheme === ControlScheme.GAMEPAD) {
      shouldJump = controls.xButton && this.jumpsAvailable > 0;
    } else if (this.controlScheme === ControlScheme.KEYBOARD_ARROWS) {
      shouldJump =
        Phaser.Input.Keyboard.JustDown(this.keySpace) &&
        this.jumpsAvailable > 0;
    } else if (this.controlScheme === ControlScheme.KEYBOARD_WASD) {
      shouldJump =
        Phaser.Input.Keyboard.JustDown(this.keyShift) &&
        this.jumpsAvailable > 0;
    }

    if (shouldJump) {
      if (!canJump) {
        this.jumpsAvailable--;
      }
      this.setVelocityY(this.jumpSpeed);
    }
  }

  private handleAttack(controls: any) {
    if (controls.squareButton) {
      this.anims.play("attack", true);
    }
  }
}
