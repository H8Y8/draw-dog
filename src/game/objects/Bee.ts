import Phaser from 'phaser';

export class Bee {
  readonly body: MatterJS.BodyType;

  private readonly container: Phaser.GameObjects.Container;
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

    const leftWing = scene.add.ellipse(-13, -12, 18, 26, 0xd9f7ff, 0.75);
    const rightWing = scene.add.ellipse(13, -12, 18, 26, 0xd9f7ff, 0.75);
    const body = scene.add.ellipse(0, 0, 34, 26, 0xffd54a).setStrokeStyle(3, 0x2d2515);
    const stripeA = scene.add.rectangle(-7, 0, 5, 22, 0x2d2515);
    const stripeB = scene.add.rectangle(7, 0, 5, 22, 0x2d2515);

    this.container = scene.add.container(x, y, [leftWing, rightWing, body, stripeA, stripeB]).setDepth(4);
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
    this.container.setPosition(this.body.position.x, this.body.position.y);
    this.container.rotation = this.body.velocity.x * 0.006;
  }

  destroy(): void {
    this.container.destroy();
  }
}
