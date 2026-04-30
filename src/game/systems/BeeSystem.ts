import Phaser from 'phaser';
import { Bee } from '../objects/Bee';
import { Hive } from '../objects/Hive';
import type { HiveData } from '../types/level';

export class BeeSystem {
  private readonly bees: Bee[] = [];
  private readonly hives: Hive[] = [];
  private active = false;

  constructor(
    private readonly scene: Phaser.Scene,
    hives: HiveData[]
  ) {
    let beeIndex = 0;
    for (const hiveData of hives) {
      this.hives.push(new Hive(scene, hiveData.x, hiveData.y));

      for (let i = 0; i < hiveData.beeCount; i += 1) {
        const angle = (i / hiveData.beeCount) * Math.PI * 2;
        const x = hiveData.x + Math.cos(angle) * 42;
        const y = hiveData.y + Math.sin(angle) * 34;
        this.bees.push(new Bee(scene, x, y, beeIndex));
        beeIndex += 1;
      }
    }
  }

  start(): void {
    this.active = true;
  }

  stop(): void {
    this.active = false;
    for (const bee of this.bees) {
      this.scene.matter.body.setVelocity(bee.body, { x: 0, y: 0 });
    }
  }

  update(time: number, target: { x: number; y: number }): void {
    for (const bee of this.bees) {
      if (this.active) {
        bee.steerToward(target.x, target.y, time);
      }
      bee.syncVisual();
    }
  }

  destroy(): void {
    for (const bee of this.bees) {
      this.scene.matter.world.remove(bee.body);
      bee.destroy();
    }
    for (const hive of this.hives) {
      hive.destroy();
    }
  }
}
