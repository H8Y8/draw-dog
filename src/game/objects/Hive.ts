import Phaser from 'phaser';
import { AssetKeys } from '../config/assetKeys';

export class Hive {
  private readonly image: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.image = scene.add.image(x, y, AssetKeys.Hive).setDisplaySize(96, 96).setDepth(3);
  }

  destroy(): void {
    this.image.destroy();
  }
}
