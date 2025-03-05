class HealthManager {
  private health: number;
  private invincible: boolean = false;
  private invincibilityDuration: number;
  private lastDamageTime: number = 0;
  private scene: Phaser.Scene;

  constructor(
    scene: Phaser.Scene,
    initialHealth: number,
    invincibilityDuration: number
  ) {
    this.scene = scene;
    this.health = initialHealth;
    this.invincibilityDuration = invincibilityDuration;
  }

  takeDamage(amount: number) {
    const currentTime = this.scene.time.now;
    if (currentTime - this.lastDamageTime > this.invincibilityDuration) {
      this.health = Math.max(0, this.health - amount);
      this.lastDamageTime = currentTime;
      this.invincible = true;

      // Set a timer to remove invincibility after the duration
      this.scene.time.delayedCall(this.invincibilityDuration, () => {
        this.invincible = false;
      });
    }
  }

  kill() {
    return (this.health = 0);
  }

  getHealth() {
    return this.health;
  }

  isInvincible() {
    return this.invincible;
  }
}

export default HealthManager;
