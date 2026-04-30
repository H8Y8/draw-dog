import Phaser from 'phaser';

export class Dog {
  readonly radius = 50;
  readonly body: MatterJS.BodyType;

  private readonly container: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.body = scene.matter.add.circle(x, y, this.radius, {
      isStatic: true,
      isSensor: true,
      label: 'dog'
    });

    const face = scene.add.circle(0, 0, 50, 0xf2c879).setStrokeStyle(6, 0x7a4a20);
    const leftEar = scene.add.ellipse(-42, -28, 34, 58, 0x7a4a20);
    const rightEar = scene.add.ellipse(42, -28, 34, 58, 0x7a4a20);
    const leftEye = scene.add.circle(-18, -10, 6, 0x1d1d1d);
    const rightEye = scene.add.circle(18, -10, 6, 0x1d1d1d);
    const nose = scene.add.ellipse(0, 12, 22, 16, 0x1d1d1d);
    const mouth = scene.add.arc(0, 16, 16, 0, 180, false).setStrokeStyle(4, 0x1d1d1d);

    this.container = scene.add
      .container(x, y, [leftEar, rightEar, face, leftEye, rightEye, nose, mouth])
      .setDepth(5);
  }

  get x(): number {
    return this.body.position.x;
  }

  get y(): number {
    return this.body.position.y;
  }

  setScared(scared: boolean): void {
    this.container.setScale(scared ? 1.08 : 1);
  }

  destroy(): void {
    this.container.destroy();
  }
}
