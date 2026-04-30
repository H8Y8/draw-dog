import Phaser from 'phaser';
import { AssetKeys } from '../config/assetKeys';

export class Dog {
  readonly radius = 50;
  readonly body: MatterJS.BodyType;

  private readonly image: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.body = scene.matter.add.circle(x, y, this.radius, {
      isStatic: true,
      isSensor: true,
      label: 'dog'
    });

    this.image = scene.add
      .image(x, y - 8, AssetKeys.DogIdle)
      .setDisplaySize(136, 136)
      .setDepth(5);
  }

  get x(): number {
    return this.body.position.x;
  }

  get y(): number {
    return this.body.position.y;
  }

  setScared(scared: boolean): void {
    this.image.setTexture(scared ? AssetKeys.DogScared : AssetKeys.DogIdle);
    this.image.setScale(scared ? 1.04 : 1);
    this.image.setY(this.body.position.y - 8);
  }

  setHappy(): void {
    this.image.setTexture(AssetKeys.DogHappy);
    this.image.setScale(1.04);
    this.image.setY(this.body.position.y - 8);
  }

  destroy(): void {
    this.image.destroy();
  }
}
