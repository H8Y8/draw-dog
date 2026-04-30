import Phaser from 'phaser';
import { LineBuilder } from '../systems/LineBuilder';
import type { DrawPoint } from '../types/level';

export class DrawBarrier {
  private readonly bodies: MatterJS.BodyType[] = [];
  private readonly graphics: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, points: DrawPoint[], thickness = 22) {
    const simplified = LineBuilder.simplify(points);
    const segments = LineBuilder.toSegments(simplified, thickness);

    this.graphics = scene.add.graphics().setDepth(6);
    this.graphics.lineStyle(thickness, 0x4d3428, 1);
    this.graphics.beginPath();
    this.graphics.moveTo(simplified[0].x, simplified[0].y);
    for (const point of simplified.slice(1)) {
      this.graphics.lineTo(point.x, point.y);
    }
    this.graphics.strokePath();

    for (const segment of segments) {
      const body = scene.matter.add.rectangle(segment.x, segment.y, segment.length, segment.thickness, {
        isStatic: true,
        label: 'barrier',
        restitution: 0.75,
        friction: 0,
        angle: segment.angle
      });
      this.bodies.push(body);
    }
  }

  destroy(scene: Phaser.Scene): void {
    for (const body of this.bodies) {
      scene.matter.world.remove(body);
    }
    this.graphics.destroy();
  }
}
