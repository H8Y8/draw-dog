import Phaser from 'phaser';

export class Hive {
  private readonly container: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    const shadow = scene.add.ellipse(0, 28, 84, 26, 0x000000, 0.12);
    const shell = scene.add.ellipse(0, 0, 88, 74, 0xd7952c).setStrokeStyle(5, 0x7b4f1b);
    const hole = scene.add.ellipse(0, 14, 32, 24, 0x3b2413);
    const bandA = scene.add.rectangle(0, -18, 72, 8, 0xf0b546);
    const bandB = scene.add.rectangle(0, 2, 82, 8, 0xf0b546);

    this.container = scene.add.container(x, y, [shadow, shell, bandA, bandB, hole]).setDepth(3);
  }

  destroy(): void {
    this.container.destroy();
  }
}
