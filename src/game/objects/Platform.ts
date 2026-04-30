import Phaser from 'phaser';
import type { PlatformData } from '../types/level';

export class Platform {
  readonly body: MatterJS.BodyType;

  private readonly visual: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, data: PlatformData) {
    this.body = scene.matter.add.rectangle(data.x, data.y, data.w, data.h, {
      isStatic: true,
      label: 'platform',
      restitution: 0.55
    });
    this.visual = scene.add
      .rectangle(data.x, data.y, data.w, data.h, 0x7fc47f)
      .setStrokeStyle(5, 0x47764b)
      .setDepth(2);
  }

  destroy(): void {
    this.visual.destroy();
  }
}
