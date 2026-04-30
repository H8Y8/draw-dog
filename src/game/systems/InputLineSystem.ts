import Phaser from 'phaser';
import type { Dog } from '../objects/Dog';
import { GameEvents } from '../types/game';
import type { DrawPoint } from '../types/level';
import { LineBuilder } from './LineBuilder';

interface InputLineSystemConfig {
  dog: Dog;
  maxLineLength: number;
  onComplete: (points: DrawPoint[]) => void;
  onStart?: () => void;
}

const MIN_LINE_LENGTH = 42;
const DOG_PADDING = 12;

export class InputLineSystem {
  private readonly graphics: Phaser.GameObjects.Graphics;
  private readonly points: DrawPoint[] = [];
  private isDrawing = false;
  private isComplete = false;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly config: InputLineSystemConfig
  ) {
    this.graphics = scene.add.graphics().setDepth(7);
    scene.input.on('pointerdown', this.handlePointerDown, this);
    scene.input.on('pointermove', this.handlePointerMove, this);
    scene.input.on('pointerup', this.handlePointerUp, this);
    scene.input.on('pointerupoutside', this.handlePointerUp, this);
  }

  destroy(): void {
    this.scene.input.off('pointerdown', this.handlePointerDown, this);
    this.scene.input.off('pointermove', this.handlePointerMove, this);
    this.scene.input.off('pointerup', this.handlePointerUp, this);
    this.scene.input.off('pointerupoutside', this.handlePointerUp, this);
    this.graphics.destroy();
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer): void {
    if (this.isComplete) {
      return;
    }

    const point = this.pointerToPoint(pointer);
    if (this.isInsideDog(point)) {
      this.scene.game.events.emit(GameEvents.LevelMessage, 'Do not draw through the dog.');
      this.drawInvalid([point]);
      return;
    }

    this.points.length = 0;
    this.points.push(point);
    this.isDrawing = true;
    this.config.onStart?.();
    this.scene.game.events.emit(GameEvents.LineLength, this.config.maxLineLength);
    this.redrawPreview(false);
  }

  private handlePointerMove(pointer: Phaser.Input.Pointer): void {
    if (!this.isDrawing || this.isComplete) {
      return;
    }

    const point = this.pointerToPoint(pointer);
    const previous = this.points[this.points.length - 1];
    if (Phaser.Math.Distance.Between(previous.x, previous.y, point.x, point.y) < 6) {
      return;
    }

    this.points.push(point);
    const length = LineBuilder.getLength(this.points);
    const invalid = length > this.config.maxLineLength || this.pathTouchesDog(this.points);
    this.scene.game.events.emit(GameEvents.LineLength, Math.max(0, this.config.maxLineLength - length));
    this.redrawPreview(invalid);
  }

  private handlePointerUp(): void {
    if (!this.isDrawing || this.isComplete) {
      return;
    }

    this.isDrawing = false;
    const length = LineBuilder.getLength(this.points);
    const invalidReason = this.getInvalidReason(length);
    if (invalidReason) {
      this.scene.game.events.emit(GameEvents.LevelMessage, invalidReason);
      this.drawInvalid(this.points);
      this.points.length = 0;
      return;
    }

    this.isComplete = true;
    this.graphics.clear();
    this.config.onComplete([...this.points]);
  }

  private getInvalidReason(length: number): string | undefined {
    if (length < MIN_LINE_LENGTH) {
      return 'Draw a longer barrier.';
    }

    if (length > this.config.maxLineLength) {
      return 'Line is too long.';
    }

    if (this.pathTouchesDog(this.points)) {
      return 'Do not draw through the dog.';
    }

    return undefined;
  }

  private redrawPreview(invalid: boolean): void {
    this.graphics.clear();
    this.graphics.lineStyle(18, invalid ? 0xd94c3d : 0x3c2a21, 0.86);
    this.graphics.beginPath();
    this.graphics.moveTo(this.points[0].x, this.points[0].y);
    for (const point of this.points.slice(1)) {
      this.graphics.lineTo(point.x, point.y);
    }
    this.graphics.strokePath();
  }

  private drawInvalid(points: DrawPoint[]): void {
    this.graphics.clear();
    this.graphics.lineStyle(18, 0xd94c3d, 0.9);
    this.graphics.beginPath();
    this.graphics.moveTo(points[0].x, points[0].y);
    for (const point of points.slice(1)) {
      this.graphics.lineTo(point.x, point.y);
    }
    this.graphics.strokePath();
    this.scene.time.delayedCall(350, () => this.graphics.clear());
  }

  private pointerToPoint(pointer: Phaser.Input.Pointer): DrawPoint {
    return { x: pointer.worldX, y: pointer.worldY };
  }

  private pathTouchesDog(points: DrawPoint[]): boolean {
    return points.some((point, index) => {
      const previous = points[index - 1];
      if (!previous) {
        return this.isInsideDog(point);
      }
      return this.segmentTouchesDog(previous, point);
    });
  }

  private isInsideDog(point: DrawPoint): boolean {
    return Phaser.Math.Distance.Between(point.x, point.y, this.config.dog.x, this.config.dog.y) <=
      this.config.dog.radius + DOG_PADDING;
  }

  private segmentTouchesDog(a: DrawPoint, b: DrawPoint): boolean {
    const abx = b.x - a.x;
    const aby = b.y - a.y;
    const acx = this.config.dog.x - a.x;
    const acy = this.config.dog.y - a.y;
    const denominator = abx * abx + aby * aby;
    const t = denominator === 0 ? 0 : Phaser.Math.Clamp((acx * abx + acy * aby) / denominator, 0, 1);
    const closest = { x: a.x + abx * t, y: a.y + aby * t };
    return this.isInsideDog(closest);
  }
}
