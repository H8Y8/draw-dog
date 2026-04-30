import Phaser from 'phaser';
import { AssetKeys } from '../config/assetKeys';
import type { PlatformData } from '../types/level';

export class Platform {
  readonly body: MatterJS.BodyType;

  private readonly visual: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, data: PlatformData) {
    this.body = scene.matter.add.rectangle(data.x, data.y, data.w, data.h, {
      isStatic: true,
      label: 'platform',
      restitution: 0.55
    });

    const key = data.w >= 200 ? AssetKeys.PlatformLong : AssetKeys.PlatformShort;
    this.visual = scene.add.image(data.x, data.y, key).setDisplaySize(data.w, Math.max(data.h * 2.4, 72)).setDepth(2);
  }

  destroy(): void {
    this.visual.destroy();
  }
}
