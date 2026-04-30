import Phaser from 'phaser';
import type { BarrierSegment, DrawPoint } from '../types/level';

const MIN_POINT_DISTANCE = 14;
const MAX_SEGMENTS = 28;

export class LineBuilder {
  static getLength(points: DrawPoint[]): number {
    return points.reduce((total, point, index) => {
      const previous = points[index - 1];
      return previous ? total + Phaser.Math.Distance.Between(previous.x, previous.y, point.x, point.y) : total;
    }, 0);
  }

  static simplify(points: DrawPoint[]): DrawPoint[] {
    if (points.length <= 2) {
      return points;
    }

    const sampled = [points[0]];
    for (const point of points.slice(1)) {
      const previous = sampled[sampled.length - 1];
      if (Phaser.Math.Distance.Between(previous.x, previous.y, point.x, point.y) >= MIN_POINT_DISTANCE) {
        sampled.push(point);
      }
    }

    if (sampled[sampled.length - 1] !== points[points.length - 1]) {
      sampled.push(points[points.length - 1]);
    }

    if (sampled.length <= MAX_SEGMENTS + 1) {
      return sampled;
    }

    const stride = (sampled.length - 1) / MAX_SEGMENTS;
    const reduced: DrawPoint[] = [];
    for (let i = 0; i <= MAX_SEGMENTS; i += 1) {
      reduced.push(sampled[Math.round(i * stride)]);
    }
    return reduced;
  }

  static toSegments(points: DrawPoint[], thickness: number): BarrierSegment[] {
    return points.slice(1).map((point, index) => {
      const previous = points[index];
      const length = Phaser.Math.Distance.Between(previous.x, previous.y, point.x, point.y);
      return {
        x: (previous.x + point.x) / 2,
        y: (previous.y + point.y) / 2,
        length,
        angle: Phaser.Math.Angle.Between(previous.x, previous.y, point.x, point.y),
        thickness
      };
    });
  }
}
