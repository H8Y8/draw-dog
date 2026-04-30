import Phaser from 'phaser';
import { AssetKeys } from '../config/assetKeys';

export class Bee {
  readonly body: MatterJS.BodyType;

  private readonly image: Phaser.GameObjects.Image;
  private readonly speed: number;

  constructor(
    private readonly scene: Phaser.Scene,
    x: number,
    y: number,
    index: number
  ) {
    this.speed = 92 + index * 4;
    this.body = scene.matter.add.circle(x, y, 18, {
      label: 'bee',
      restitution: 0.88,
      frictionAir: 0.05,
      friction: 0,
      frictionStatic: 0
    });

    this.image = scene.add.image(x, y, AssetKeys.Bee).setDisplaySize(60, 60).setDepth(4);
  }

  steerToward(targetX: number, targetY: number, time: number): void {
    const dx = targetX - this.body.position.x;
    const dy = targetY - this.body.position.y;
    const length = Math.max(1, Math.hypot(dx, dy));
    const wobble = Math.sin(time / 260 + this.body.id) * 0.4;
    const desired = {
      x: (dx / length) * this.speed + Math.cos(wobble) * 12,
      y: (dy / length) * this.speed + Math.sin(wobble) * 12
    };
    const velocity = this.body.velocity;

    this.scene.matter.body.setVelocity(this.body, {
      x: Phaser.Math.Linear(velocity.x, desired.x, 0.045),
      y: Phaser.Math.Linear(velocity.y, desired.y, 0.045)
    });
  }

  syncVisual(): void {
    this.image.setPosition(this.body.position.x, this.body.position.y);
    this.image.rotation = this.body.velocity.x * 0.006;
  }

  destroy(): void {
    this.image.destroy();
  }
}
